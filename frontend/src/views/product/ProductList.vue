<template>
  <div class="product-list-container">
    <div class="product-list-header">
      <h2>产品管理</h2>
      <el-button type="primary" @click="handleCreate">新增产品</el-button>
    </div>

    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="产品名称">
          <el-input v-model="queryParams.name" placeholder="请输入产品名称" clearable />
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select v-model="queryParams.type" placeholder="请选择产品类型" clearable>
            <el-option label="旅游产品" value="tour" />
            <el-option label="酒店" value="hotel" />
            <el-option label="机票" value="flight" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="上架" value="active" />
            <el-option label="下架" value="inactive" />
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
        :data="list"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="产品名称" width="180" />
        <el-table-column prop="type" label="产品类型" width="120">
          <template #default="scope">
            {{ getProductTypeText(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="产品描述" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status === 'active' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="success"
              @click="handleDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              size="small"
              type="warning"
              @click="handleQuotes(scope.row)"
              >报价</el-button
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
          v-model:current-page="page"
          v-model:page-size="limit"
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
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { getProductList, deleteProduct } from '@/api/product'
import { useListApi, useSubmitApi } from '@/hooks/useApi'

export default {
  name: 'ProductList',
  setup() {
    const router = useRouter()

    // 查询参数
    const queryParams = reactive({
      name: '',
      type: '',
      status: '',
      page: 1,
      limit: 10
    })

    // 使用列表API钩子
    const { 
      loading, 
      list, 
      total, 
      page,
      limit,
      fetchList, 
      handlePageChange, 
      handleLimitChange 
    } = useListApi(getProductList, {
      immediate: true,
      params: queryParams,
      errorMessage: '获取产品列表失败'
    })

    // 使用提交API钩子处理删除
    const { submit: submitDelete, loading: deleteLoading } = useSubmitApi(deleteProduct, {
      successMessage: '删除成功',
      errorMessage: '删除失败',
      onSuccess: () => fetchList()
    })

    // 获取产品类型文本
    const getProductTypeText = (type) => {
      const typeMap = {
        tour: '旅游产品',
        hotel: '酒店',
        flight: '机票',
        other: '其他'
      }
      return typeMap[type] || '未知'
    }

    // 查询
    const handleQuery = () => {
      queryParams.page = 1
      fetchList(queryParams)
    }

    // 重置查询
    const resetQuery = () => {
      queryParams.name = ''
      queryParams.type = ''
      queryParams.status = ''
      queryParams.page = 1
      fetchList(queryParams)
    }

    // 处理页码变化
    const handleCurrentChange = (newPage) => {
      handlePageChange(newPage)
    }

    // 处理每页条数变化
    const handleSizeChange = (newLimit) => {
      handleLimitChange(newLimit)
    }

    // 新增产品
    const handleCreate = () => {
      router.push('/product/create')
    }

    // 编辑产品
    const handleEdit = (row) => {
      router.push(`/product/edit/${row.id}`)
    }

    // 查看详情
    const handleDetail = (row) => {
      router.push(`/product/detail/${row.id}`)
    }

    // 管理报价
    const handleQuotes = (row) => {
      router.push(`/product/quotes/${row.id}`)
    }

    // 删除产品
    const handleDelete = (row) => {
      ElMessageBox.confirm('确认删除该产品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submitDelete(row.id)
      }).catch(() => {})
    }

    return {
      queryParams,
      loading,
      list,
      total,
      page,
      limit,
      deleteLoading,
      getProductTypeText,
      handleQuery,
      resetQuery,
      handleCurrentChange,
      handleSizeChange,
      handleCreate,
      handleEdit,
      handleDetail,
      handleQuotes,
      handleDelete
    }
  }
}
</script>

<style scoped>
.product-list-container {
  padding: 20px;
}

.product-list-header {
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
  margin-top: 20px;
  text-align: right;
}
</style> 