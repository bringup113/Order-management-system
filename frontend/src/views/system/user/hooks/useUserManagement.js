import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getUserList, 
  createUser, 
  updateUser, 
  deleteUser, 
  updateUserStatus 
} from '@/api/system'
import { getRoleList } from '@/api/system'
import { handleListResponse } from '@/utils/api-adapter'
import eventBus, { EVENTS } from '@/utils/eventBus'

export default function useUserManagement() {
  // 状态
  const loading = ref(false)
  const submitting = ref(false)
  const userList = ref([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const roleOptions = ref([])
  const formVisible = ref(false)
  const isEdit = ref(false)
  const currentUser = ref(null)

  // 获取用户列表
  const fetchUserList = async (params = {}) => {
    loading.value = true
    try {
      const queryParams = {
        page: currentPage.value,
        limit: pageSize.value,
        ...params
      }

      const response = await getUserList(queryParams)
      const { data, total: totalCount } = handleListResponse(response)
      
      userList.value = data
      total.value = totalCount
      console.log('从API获取的用户列表:', userList.value)
    } catch (error) {
      console.error('获取用户列表失败:', error)
      ElMessage.error('获取用户列表失败')
      userList.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  // 获取角色列表
  const fetchRoleList = async () => {
    try {
      const response = await getRoleList()
      roleOptions.value = response.data || []
      console.log('从API获取的角色列表:', roleOptions.value)
    } catch (error) {
      console.error('获取角色列表失败:', error)
      roleOptions.value = []
      ElMessage.error('获取角色列表失败')
    }
  }

  // 处理搜索
  const handleSearch = (searchParams) => {
    currentPage.value = 1
    fetchUserList(searchParams)
  }

  // 重置搜索
  const handleReset = () => {
    currentPage.value = 1
    fetchUserList()
  }

  // 处理页码变化
  const handleCurrentChange = (page) => {
    currentPage.value = page
    fetchUserList()
  }

  // 处理每页条数变化
  const handleSizeChange = (size) => {
    pageSize.value = size
    currentPage.value = 1
    fetchUserList()
  }

  // 创建用户
  const handleCreate = () => {
    // 先关闭对话框
    formVisible.value = false
    
    // 重置状态
    setTimeout(() => {
      isEdit.value = false
      currentUser.value = null
      formVisible.value = true
    }, 50)
  }

  // 编辑用户
  const handleEdit = (row) => {
    isEdit.value = true
    currentUser.value = row
    formVisible.value = true
  }

  // 更改用户状态
  const handleStatusChange = (row) => {
    const newStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
    const statusText = newStatus === 'enabled' ? '启用' : '禁用'
    
    ElMessageBox.confirm(
      `确定要${statusText}用户 "${row.username}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      try {
        await updateUserStatus(row.id, newStatus)
        ElMessage.success(`${statusText}成功`)
        fetchUserList()
      } catch (error) {
        console.error(`${statusText}用户失败:`, error)
        ElMessage.error(`${statusText}用户失败`)
      }
    }).catch(() => {})
  }

  // 删除用户
  const handleDelete = (row) => {
    if (row.username === 'admin') {
      ElMessage.warning('不能删除管理员账号')
      return
    }
    
    ElMessageBox.confirm(
      `确定要删除用户 "${row.username}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      try {
        await deleteUser(row.id)
        ElMessage.success('删除成功')
        fetchUserList()
      } catch (error) {
        console.error('删除用户失败:', error)
        ElMessage.error('删除用户失败')
      }
    }).catch(() => {})
  }

  // 提交表单
  const submitForm = async (formData) => {
    submitting.value = true
    try {
      if (isEdit.value) {
        console.log('提交更新用户数据:', formData)
        await updateUser(currentUser.value.id, formData)
        ElMessage.success('用户更新成功')
      } else {
        console.log('提交创建用户数据:', formData)
        await createUser(formData)
        ElMessage.success('用户创建成功')
      }
      
      formVisible.value = false
      fetchUserList()
    } catch (error) {
      console.error('保存用户失败:', error)
      ElMessage.error('保存用户失败: ' + (error.response?.data?.message || error.message))
    } finally {
      submitting.value = false
    }
  }

  // 初始化
  const initialize = () => {
    fetchUserList()
    fetchRoleList()

    // 监听角色列表更新事件
    eventBus.on(EVENTS.ROLE_LIST_UPDATED, () => {
      console.log('角色列表已更新，重新获取角色列表')
      fetchRoleList()
    })
  }

  // 组件卸载时清理事件监听
  onUnmounted(() => {
    eventBus.off(EVENTS.ROLE_LIST_UPDATED)
  })

  return {
    // 状态
    loading,
    submitting,
    userList,
    total,
    currentPage,
    pageSize,
    roleOptions,
    formVisible,
    isEdit,
    currentUser,

    // 方法
    fetchUserList,
    fetchRoleList,
    handleSearch,
    handleReset,
    handleCurrentChange,
    handleSizeChange,
    handleCreate,
    handleEdit,
    handleStatusChange,
    handleDelete,
    submitForm,
    initialize
  }
} 