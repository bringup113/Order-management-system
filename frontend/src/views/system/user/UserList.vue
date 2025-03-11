<template>
  <div class="user-list-container">
    <div class="page-header">
      <h1>用户管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreate">创建用户</el-button>
      </div>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="search-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="searchForm.roleId" placeholder="请选择角色" clearable>
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="active"></el-option>
            <el-option label="禁用" value="inactive"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="list-card">
      <el-table
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%"
      >
        <el-table-column prop="username" label="用户名" width="150"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="role.name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" width="180"></el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button 
              size="small" 
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="warning" 
              @click="handleResetPassword(scope.row)"
            >
              重置密码
            </el-button>
            <el-button 
              size="small" 
              :type="scope.row.status === 'active' ? 'danger' : 'success'" 
              @click="handleStatusChange(scope.row)"
            >
              {{ scope.row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(scope.row)"
              :disabled="scope.row.username === 'admin'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑用户' : '创建用户'" 
      width="500px"
    >
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择角色" style="width: 100%">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" v-if="!isEdit">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.remarks"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog 
      v-model="resetPasswordDialogVisible" 
      title="重置密码" 
      width="400px"
    >
      <el-form 
        ref="resetPasswordFormRef" 
        :model="resetPasswordForm" 
        :rules="resetPasswordRules" 
        label-width="100px"
      >
        <el-form-item label="新密码" prop="password">
          <el-input v-model="resetPasswordForm.password" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="resetPasswordForm.confirmPassword" type="password" placeholder="请确认新密码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitResetPassword" :loading="submitting">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getUserList, 
  createUser, 
  updateUser, 
  deleteUser, 
  resetUserPassword, 
  updateUserStatus 
} from '@/api/system'
import { getRoleList } from '@/api/system'
import { handleListResponse } from '@/utils/api-adapter'

export default {
  name: 'UserList',
  setup() {
    const loading = ref(false)
    const submitting = ref(false)
    const userList = ref([])
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const searchFormRef = ref(null)
    const formRef = ref(null)
    const resetPasswordFormRef = ref(null)
    const dialogVisible = ref(false)
    const resetPasswordDialogVisible = ref(false)
    const isEdit = ref(false)
    const currentUserId = ref(null)
    const roleOptions = ref([])

    // 搜索表单
    const searchForm = reactive({
      username: '',
      name: '',
      roleId: '',
      status: ''
    })

    // 用户表单
    const form = reactive({
      username: '',
      name: '',
      roleId: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      status: 'active',
      remarks: ''
    })

    // 表单验证规则
    const rules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
      ],
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      roleId: [
        { required: true, message: '请选择角色', trigger: 'change' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      ],
      phone: [
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        { 
          validator: (rule, value, callback) => {
            if (value !== form.password) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          }, 
          trigger: 'blur' 
        }
      ],
      status: [
        { required: true, message: '请选择状态', trigger: 'change' }
      ]
    })

    // 重置密码表单
    const resetPasswordForm = reactive({
      password: '',
      confirmPassword: ''
    })

    // 重置密码表单验证规则
    const resetPasswordRules = reactive({
      password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        { 
          validator: (rule, value, callback) => {
            if (value !== resetPasswordForm.password) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          }, 
          trigger: 'blur' 
        }
      ]
    })

    // 获取用户列表
    const fetchUserList = async () => {
      loading.value = true
      try {
        const params = {
          page: currentPage.value,
          limit: pageSize.value,
          username: searchForm.username,
          name: searchForm.name,
          roleId: searchForm.roleId,
          status: searchForm.status
        }

        const response = await getUserList(params)
        const { data, total: totalCount } = handleListResponse(response)
        userList.value = data
        total.value = totalCount
      } catch (error) {
        console.error('获取用户列表失败:', error)
        ElMessage.error('获取用户列表失败')
        
        // 使用模拟数据
        userList.value = [
          {
            id: 1,
            username: 'admin',
            name: '系统管理员',
            role: { id: 1, name: '管理员' },
            email: 'admin@example.com',
            phone: '13800138000',
            status: 'active',
            lastLoginTime: '2023-01-15 10:30:00',
            remarks: '系统超级管理员'
          },
          {
            id: 2,
            username: 'operator',
            name: '操作员',
            role: { id: 2, name: '操作员' },
            email: 'operator@example.com',
            phone: '13900139000',
            status: 'active',
            lastLoginTime: '2023-01-16 14:20:00',
            remarks: '系统操作员'
          },
          {
            id: 3,
            username: 'guest',
            name: '访客',
            role: { id: 3, name: '访客' },
            email: 'guest@example.com',
            phone: '13700137000',
            status: 'inactive',
            lastLoginTime: '2023-01-10 09:15:00',
            remarks: '系统访客'
          }
        ]
        total.value = userList.value.length
      } finally {
        loading.value = false
      }
    }

    // 获取角色列表
    const fetchRoleList = async () => {
      try {
        const response = await getRoleList()
        roleOptions.value = response.data || []
      } catch (error) {
        console.error('获取角色列表失败:', error)
        
        // 使用模拟数据
        roleOptions.value = [
          { id: 1, name: '管理员' },
          { id: 2, name: '操作员' },
          { id: 3, name: '访客' }
        ]
      }
    }

    // 处理搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchUserList()
    }

    // 重置搜索
    const resetSearch = () => {
      if (searchFormRef.value) {
        searchFormRef.value.resetFields()
      }
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
      isEdit.value = false
      currentUserId.value = null
      resetForm()
      dialogVisible.value = true
    }

    // 编辑用户
    const handleEdit = (row) => {
      isEdit.value = true
      currentUserId.value = row.id
      resetForm()
      
      // 填充表单数据
      form.username = row.username
      form.name = row.name
      form.roleId = row.role.id
      form.email = row.email
      form.phone = row.phone
      form.status = row.status
      form.remarks = row.remarks
      
      dialogVisible.value = true
    }

    // 重置密码
    const handleResetPassword = (row) => {
      currentUserId.value = row.id
      resetPasswordForm.password = ''
      resetPasswordForm.confirmPassword = ''
      resetPasswordDialogVisible.value = true
    }

    // 提交重置密码
    const submitResetPassword = async () => {
      if (!resetPasswordFormRef.value) return
      
      await resetPasswordFormRef.value.validate(async (valid) => {
        if (valid) {
          submitting.value = true
          try {
            await resetUserPassword(currentUserId.value, {
              password: resetPasswordForm.password
            })
            ElMessage.success('密码重置成功')
            resetPasswordDialogVisible.value = false
          } catch (error) {
            console.error('重置密码失败:', error)
            ElMessage.error('重置密码失败')
          } finally {
            submitting.value = false
          }
        } else {
          ElMessage.warning('请填写必填项')
          return false
        }
      })
    }

    // 更改用户状态
    const handleStatusChange = (row) => {
      const newStatus = row.status === 'active' ? 'inactive' : 'active'
      const statusText = newStatus === 'active' ? '启用' : '禁用'
      
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

    // 重置表单
    const resetForm = () => {
      form.username = ''
      form.name = ''
      form.roleId = ''
      form.email = ''
      form.phone = ''
      form.password = ''
      form.confirmPassword = ''
      form.status = 'active'
      form.remarks = ''
      
      if (formRef.value) {
        formRef.value.resetFields()
      }
    }

    // 提交表单
    const submitForm = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate(async (valid) => {
        if (valid) {
          submitting.value = true
          try {
            const formData = { ...form }
            
            // 编辑模式下不需要提交密码字段
            if (isEdit.value) {
              delete formData.password
              delete formData.confirmPassword
              
              await updateUser(currentUserId.value, formData)
              ElMessage.success('用户更新成功')
            } else {
              await createUser(formData)
              ElMessage.success('用户创建成功')
            }
            
            dialogVisible.value = false
            fetchUserList()
          } catch (error) {
            console.error('保存用户失败:', error)
            ElMessage.error('保存用户失败')
          } finally {
            submitting.value = false
          }
        } else {
          ElMessage.warning('请填写必填项')
          return false
        }
      })
    }

    onMounted(() => {
      fetchUserList()
      fetchRoleList()
    })

    return {
      loading,
      submitting,
      userList,
      total,
      currentPage,
      pageSize,
      searchForm,
      searchFormRef,
      form,
      formRef,
      rules,
      resetPasswordForm,
      resetPasswordFormRef,
      resetPasswordRules,
      dialogVisible,
      resetPasswordDialogVisible,
      isEdit,
      roleOptions,
      handleSearch,
      resetSearch,
      handleCurrentChange,
      handleSizeChange,
      handleCreate,
      handleEdit,
      handleResetPassword,
      submitResetPassword,
      handleStatusChange,
      handleDelete,
      submitForm
    }
  }
}
</script>

<style scoped>
.user-list-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
}

.list-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 