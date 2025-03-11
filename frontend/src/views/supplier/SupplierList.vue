<template>
  <div class="supplier-list-container">
    <div class="supplier-list-header">
      <h2>供应商管理</h2>
      <el-button type="primary" @click="handleCreate">新增供应商</el-button>
    </div>

    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="供应商名称">
          <el-input v-model="queryParams.name" placeholder="请输入供应商名称" clearable />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="queryParams.contactPerson" placeholder="请输入联系人" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-container">
      <el-table
        v-loading="loading"
        :data="supplierList"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="供应商名称" width="180" />
        <el-table-column prop="contactPerson" label="联系人" width="120" />
        <el-table-column prop="contactPhone" label="联系电话" width="150" />
        <el-table-column prop="email" label="电子邮箱" width="180" />
        <el-table-column prop="address" label="地址" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSupplierList, deleteSupplier } from '@/api/supplier'
import { handleListResponse } from '@/utils/api-adapter'

export default {
  name: 'SupplierList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const supplierList = ref([])
    const total = ref(0)

    const queryParams = reactive({
      name: '',
      contactPerson: '',
      status: '',
      pageNum: 1,
      pageSize: 10
    })

    // 获取供应商列表
    const getList = () => {
      loading.value = true
      getSupplierList(queryParams)
        .then(response => {
          const { data, total: totalCount } = handleListResponse(response)
          supplierList.value = data
          total.value = totalCount
        })
        .catch(error => {
          console.error('获取供应商列表失败', error)
          ElMessage.error('获取供应商列表失败')
          // 使用模拟数据
          supplierList.value = [
            {
              id: 1,
              name: '东京旅行社',
              contactPerson: '张三',
              contactPhone: '13800138000',
              email: 'zhangsan@example.com',
              address: '东京都新宿区西新宿1-1-1',
              status: 'active',
              createdAt: '2023-01-01 12:00:00'
            },
            {
              id: 2,
              name: '曼谷旅游公司',
              contactPerson: '李四',
              contactPhone: '13900139000',
              email: 'lisi@example.com',
              address: '曼谷市素坤逸路123号',
              status: 'active',
              createdAt: '2023-01-02 12:00:00'
            },
            {
              id: 3,
              name: '巴黎旅游集团',
              contactPerson: '王五',
              contactPhone: '13700137000',
              email: 'wangwu@example.com',
              address: '巴黎市香榭丽舍大街45号',
              status: 'inactive',
              createdAt: '2023-01-03 12:00:00'
            }
          ]
          total.value = supplierList.value.length
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 查询
    const handleQuery = () => {
      queryParams.pageNum = 1
      getList()
    }

    // 重置查询
    const resetQuery = () => {
      queryParams.name = ''
      queryParams.contactPerson = ''
      queryParams.status = ''
      queryParams.pageNum = 1
      getList()
    }

    // 新增供应商
    const handleCreate = () => {
      router.push('/supplier/create')
    }

    // 编辑供应商
    const handleEdit = (row) => {
      router.push(`/supplier/edit/${row.id}`)
    }

    // 删除供应商
    const handleDelete = (row) => {
      ElMessageBox.confirm('确认删除该供应商吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSupplier(row.id)
            .then(() => {
              ElMessage.success('删除成功')
              getList()
            })
            .catch(error => {
              console.error('删除供应商失败', error)
              ElMessage.error('删除供应商失败')
            })
        })
        .catch(() => {
          // 取消删除
        })
    }

    // 每页条数变化
    const handleSizeChange = (val) => {
      queryParams.pageSize = val
      getList()
    }

    // 当前页变化
    const handleCurrentChange = (val) => {
      queryParams.pageNum = val
      getList()
    }

    onMounted(() => {
      getList()
    })

    return {
      loading,
      supplierList,
      total,
      queryParams,
      handleQuery,
      resetQuery,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.supplier-list-container {
  padding: 20px;
}

.supplier-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style> 