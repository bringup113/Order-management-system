<template>
  <div class="role-list-container">
    <div class="page-header">
      <h1>角色管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreate">创建角色</el-button>
      </div>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="search-form">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="searchForm.code" placeholder="请输入角色编码" clearable></el-input>
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
        :data="roleList"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="角色名称" width="150"></el-table-column>
        <el-table-column prop="code" label="角色编码" width="150"></el-table-column>
        <el-table-column prop="description" label="角色描述" min-width="200"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button 
              size="small" 
              @click="handleEdit(scope.row)"
              :disabled="scope.row.code === 'admin'"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="primary" 
              @click="handlePermission(scope.row)"
            >
              权限设置
            </el-button>
            <el-button 
              size="small" 
              :type="scope.row.status === 'active' ? 'danger' : 'success'" 
              @click="handleStatusChange(scope.row)"
              :disabled="scope.row.code === 'admin'"
            >
              {{ scope.row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(scope.row)"
              :disabled="scope.row.code === 'admin'"
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

    <!-- 角色表单对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑角色' : '创建角色'" 
      width="500px"
    >
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色编码" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.description"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
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

    <!-- 权限设置对话框 -->
    <el-dialog 
      v-model="permissionDialogVisible" 
      title="权限设置" 
      width="600px"
    >
      <div v-loading="permissionLoading">
        <div class="permission-header">
          <h3>{{ currentRole?.name }} 权限配置</h3>
        </div>
        <el-tree
          ref="permissionTreeRef"
          :data="permissionTree"
          show-checkbox
          node-key="id"
          :props="{ label: 'name', children: 'children' }"
          :default-checked-keys="checkedPermissions"
        ></el-tree>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPermissions" :loading="submitting">
            保存
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
  getRoleList, 
  createRole, 
  updateRole, 
  deleteRole, 
  getRolePermissions, 
  updateRolePermissions 
} from '@/api/system'
import { getPermissionList } from '@/api/system'
import { handleListResponse } from '@/utils/api-adapter'

export default {
  name: 'RoleList',
  setup() {
    const loading = ref(false)
    const submitting = ref(false)
    const permissionLoading = ref(false)
    const roleList = ref([])
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const searchFormRef = ref(null)
    const formRef = ref(null)
    const permissionTreeRef = ref(null)
    const dialogVisible = ref(false)
    const permissionDialogVisible = ref(false)
    const isEdit = ref(false)
    const currentRoleId = ref(null)
    const currentRole = ref(null)
    const permissionTree = ref([])
    const checkedPermissions = ref([])

    // 搜索表单
    const searchForm = reactive({
      name: '',
      code: '',
      status: ''
    })

    // 角色表单
    const form = reactive({
      name: '',
      code: '',
      description: '',
      status: 'active'
    })

    // 表单验证规则
    const rules = reactive({
      name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '请输入角色编码', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '角色编码只能包含字母、数字和下划线', trigger: 'blur' }
      ],
      status: [
        { required: true, message: '请选择状态', trigger: 'change' }
      ]
    })

    // 获取角色列表
    const fetchRoleList = async () => {
      loading.value = true
      try {
        const params = {
          page: currentPage.value,
          limit: pageSize.value,
          name: searchForm.name,
          code: searchForm.code,
          status: searchForm.status
        }

        const response = await getRoleList(params)
        const { data, total: totalCount } = handleListResponse(response)
        roleList.value = data
        total.value = totalCount
      } catch (error) {
        console.error('获取角色列表失败:', error)
        ElMessage.error('获取角色列表失败')
        
        // 使用模拟数据
        roleList.value = [
          {
            id: 1,
            name: '管理员',
            code: 'admin',
            description: '系统管理员，拥有所有权限',
            status: 'active',
            createdAt: '2023-01-01 00:00:00'
          },
          {
            id: 2,
            name: '操作员',
            code: 'operator',
            description: '系统操作员，拥有部分操作权限',
            status: 'active',
            createdAt: '2023-01-02 00:00:00'
          },
          {
            id: 3,
            name: '访客',
            code: 'guest',
            description: '系统访客，只有查看权限',
            status: 'active',
            createdAt: '2023-01-03 00:00:00'
          }
        ]
        total.value = roleList.value.length
      } finally {
        loading.value = false
      }
    }

    // 获取权限树
    const fetchPermissionTree = async () => {
      try {
        const response = await getPermissionList()
        permissionTree.value = response.data || []
      } catch (error) {
        console.error('获取权限列表失败:', error)
        
        // 使用模拟数据
        permissionTree.value = [
          {
            id: 1,
            name: '系统管理',
            code: 'system',
            children: [
              {
                id: 11,
                name: '用户管理',
                code: 'system:user',
                children: [
                  { id: 111, name: '用户查询', code: 'system:user:list' },
                  { id: 112, name: '用户创建', code: 'system:user:create' },
                  { id: 113, name: '用户编辑', code: 'system:user:update' },
                  { id: 114, name: '用户删除', code: 'system:user:delete' }
                ]
              },
              {
                id: 12,
                name: '角色管理',
                code: 'system:role',
                children: [
                  { id: 121, name: '角色查询', code: 'system:role:list' },
                  { id: 122, name: '角色创建', code: 'system:role:create' },
                  { id: 123, name: '角色编辑', code: 'system:role:update' },
                  { id: 124, name: '角色删除', code: 'system:role:delete' },
                  { id: 125, name: '权限设置', code: 'system:role:permission' }
                ]
              }
            ]
          },
          {
            id: 2,
            name: '订单管理',
            code: 'order',
            children: [
              { id: 21, name: '订单查询', code: 'order:list' },
              { id: 22, name: '订单创建', code: 'order:create' },
              { id: 23, name: '订单编辑', code: 'order:update' },
              { id: 24, name: '订单删除', code: 'order:delete' }
            ]
          },
          {
            id: 3,
            name: '产品管理',
            code: 'product',
            children: [
              { id: 31, name: '产品查询', code: 'product:list' },
              { id: 32, name: '产品创建', code: 'product:create' },
              { id: 33, name: '产品编辑', code: 'product:update' },
              { id: 34, name: '产品删除', code: 'product:delete' }
            ]
          }
        ]
      }
    }

    // 获取角色权限
    const fetchRolePermissions = async (roleId) => {
      permissionLoading.value = true
      try {
        const response = await getRolePermissions(roleId)
        checkedPermissions.value = response.data || []
      } catch (error) {
        console.error('获取角色权限失败:', error)
        
        // 使用模拟数据
        if (roleId === 1) { // 管理员
          checkedPermissions.value = [1, 11, 12, 111, 112, 113, 114, 121, 122, 123, 124, 125, 2, 21, 22, 23, 24, 3, 31, 32, 33, 34]
        } else if (roleId === 2) { // 操作员
          checkedPermissions.value = [1, 11, 111, 2, 21, 22, 23, 3, 31, 32, 33]
        } else if (roleId === 3) { // 访客
          checkedPermissions.value = [1, 11, 111, 2, 21, 3, 31]
        }
      } finally {
        permissionLoading.value = false
      }
    }

    // 处理搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchRoleList()
    }

    // 重置搜索
    const resetSearch = () => {
      if (searchFormRef.value) {
        searchFormRef.value.resetFields()
      }
      currentPage.value = 1
      fetchRoleList()
    }

    // 处理页码变化
    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchRoleList()
    }

    // 处理每页条数变化
    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      fetchRoleList()
    }

    // 创建角色
    const handleCreate = () => {
      isEdit.value = false
      currentRoleId.value = null
      resetForm()
      dialogVisible.value = true
    }

    // 编辑角色
    const handleEdit = (row) => {
      if (row.code === 'admin') {
        ElMessage.warning('不能编辑管理员角色')
        return
      }
      
      isEdit.value = true
      currentRoleId.value = row.id
      resetForm()
      
      // 填充表单数据
      form.name = row.name
      form.code = row.code
      form.description = row.description
      form.status = row.status
      
      dialogVisible.value = true
    }

    // 权限设置
    const handlePermission = async (row) => {
      currentRoleId.value = row.id
      currentRole.value = row
      
      // 获取权限树
      if (permissionTree.value.length === 0) {
        await fetchPermissionTree()
      }
      
      // 获取角色权限
      await fetchRolePermissions(row.id)
      
      permissionDialogVisible.value = true
    }

    // 提交权限设置
    const submitPermissions = async () => {
      if (!permissionTreeRef.value) return
      
      submitting.value = true
      try {
        // 获取选中的权限ID
        const checkedKeys = permissionTreeRef.value.getCheckedKeys()
        const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys()
        const permissionIds = [...checkedKeys, ...halfCheckedKeys]
        
        await updateRolePermissions(currentRoleId.value, { permissionIds })
        ElMessage.success('权限设置成功')
        permissionDialogVisible.value = false
      } catch (error) {
        console.error('保存权限设置失败:', error)
        ElMessage.error('保存权限设置失败')
      } finally {
        submitting.value = false
      }
    }

    // 更改角色状态
    const handleStatusChange = (row) => {
      if (row.code === 'admin') {
        ElMessage.warning('不能修改管理员角色状态')
        return
      }
      
      const newStatus = row.status === 'active' ? 'inactive' : 'active'
      const statusText = newStatus === 'active' ? '启用' : '禁用'
      
      ElMessageBox.confirm(
        `确定要${statusText}角色 "${row.name}" 吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await updateRole(row.id, { status: newStatus })
          ElMessage.success(`${statusText}成功`)
          fetchRoleList()
        } catch (error) {
          console.error(`${statusText}角色失败:`, error)
          ElMessage.error(`${statusText}角色失败`)
        }
      }).catch(() => {})
    }

    // 删除角色
    const handleDelete = (row) => {
      if (row.code === 'admin') {
        ElMessage.warning('不能删除管理员角色')
        return
      }
      
      ElMessageBox.confirm(
        `确定要删除角色 "${row.name}" 吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await deleteRole(row.id)
          ElMessage.success('删除成功')
          fetchRoleList()
        } catch (error) {
          console.error('删除角色失败:', error)
          ElMessage.error('删除角色失败')
        }
      }).catch(() => {})
    }

    // 重置表单
    const resetForm = () => {
      form.name = ''
      form.code = ''
      form.description = ''
      form.status = 'active'
      
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
            
            if (isEdit.value) {
              await updateRole(currentRoleId.value, formData)
              ElMessage.success('角色更新成功')
            } else {
              await createRole(formData)
              ElMessage.success('角色创建成功')
            }
            
            dialogVisible.value = false
            fetchRoleList()
          } catch (error) {
            console.error('保存角色失败:', error)
            ElMessage.error('保存角色失败')
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
      fetchRoleList()
    })

    return {
      loading,
      submitting,
      permissionLoading,
      roleList,
      total,
      currentPage,
      pageSize,
      searchForm,
      searchFormRef,
      form,
      formRef,
      rules,
      dialogVisible,
      permissionDialogVisible,
      isEdit,
      currentRole,
      permissionTree,
      permissionTreeRef,
      checkedPermissions,
      handleSearch,
      resetSearch,
      handleCurrentChange,
      handleSizeChange,
      handleCreate,
      handleEdit,
      handlePermission,
      submitPermissions,
      handleStatusChange,
      handleDelete,
      submitForm
    }
  }
}
</script>

<style scoped>
.role-list-container {
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

.permission-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}
</style> 