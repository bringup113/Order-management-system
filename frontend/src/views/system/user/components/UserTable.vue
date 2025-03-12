<template>
  <el-card class="list-card">
    <el-table
      v-loading="loading"
      :data="userList"
      border
      style="width: 100%"
    >
      <el-table-column prop="username" label="用户名" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column label="角色" width="120">
        <template #default="scope">
          {{ getRoleName(scope.row.role) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'danger'">
            {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" width="180">
        <template #default="scope">
          {{ formatDateTime(scope.row.last_login_time) }}
        </template>
      </el-table-column>
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
            :type="scope.row.status === 'enabled' ? 'danger' : 'success'" 
            @click="handleStatusChange(scope.row)"
          >
            {{ scope.row.status === 'enabled' ? '禁用' : '启用' }}
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
</template>

<script setup>

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  userList: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 10
  },
  currentPage: {
    type: Number,
    default: 1
  },
  roleOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'edit', 
  'status-change', 
  'delete', 
  'size-change', 
  'current-change'
])

// 获取角色名称
const getRoleName = (role) => {
  if (!role) return '未知';
  
  // 如果role是对象，直接使用name
  if (typeof role === 'object' && role.name) {
    return role.name;
  }
  
  // 如果roleId是数字，尝试从角色列表中查找
  if (typeof role === 'number' || (typeof role === 'string' && !isNaN(Number(role)))) {
    const roleId = Number(role);
    const foundRole = props.roleOptions.find(r => r.id === roleId);
    if (foundRole) {
      return foundRole.name;
    }
  }
  
  return '未知';
}

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '未登录';
  
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return '无效日期';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 编辑用户
const handleEdit = (row) => {
  emit('edit', row)
}

// 更改用户状态
const handleStatusChange = (row) => {
  emit('status-change', row)
}

// 删除用户
const handleDelete = (row) => {
  if (row.username === 'admin') {
    return
  }
  emit('delete', row)
}

// 处理页码变化
const handleCurrentChange = (page) => {
  emit('current-change', page)
}

// 处理每页条数变化
const handleSizeChange = (size) => {
  emit('size-change', size)
}
</script>

<style scoped>
.list-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 