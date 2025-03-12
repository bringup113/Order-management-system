<template>
  <div class="user-list-container">
    <div class="page-header">
      <h1>用户管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreate">创建用户</el-button>
      </div>
    </div>

    <!-- 搜索表单 -->
    <UserSearchForm 
      :role-options="roleOptions" 
      @search="handleSearch" 
      @reset="handleReset"
    />

    <!-- 用户列表 -->
    <UserTable 
      :loading="loading"
      :user-list="userList"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      :role-options="roleOptions"
      @edit="handleEdit"
      @status-change="handleStatusChange"
      @delete="handleDelete"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 用户表单 -->
    <UserForm
      v-model:visible="formVisible"
      :is-edit="isEdit"
      :submitting="submitting"
      :role-options="roleOptions"
      :user-data="currentUser"
      @submit="submitForm"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import UserSearchForm from './components/UserSearchForm.vue'
import UserTable from './components/UserTable.vue'
import UserForm from './components/UserForm.vue'
import useUserManagement from './hooks/useUserManagement.js'

// 使用用户管理Hook
const {
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
} = useUserManagement()

// 组件挂载时初始化
onMounted(() => {
  initialize()
})
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
</style> 