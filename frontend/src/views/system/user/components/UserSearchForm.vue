<template>
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
          <el-option label="启用" value="enabled"></el-option>
          <el-option label="禁用" value="disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  roleOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['search', 'reset'])

const searchFormRef = ref(null)

// 搜索表单
const searchForm = reactive({
  username: '',
  name: '',
  roleId: '',
  status: ''
})

// 处理搜索
const handleSearch = () => {
  emit('search', { ...searchForm })
}

// 重置搜索
const resetSearch = () => {
  if (searchFormRef.value) {
    searchFormRef.value.resetFields()
  }
  emit('reset')
}

// 暴露方法给父组件
defineExpose({
  searchFormRef,
  searchForm,
  resetSearch
})
</script>

<style scoped>
.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
}
</style> 