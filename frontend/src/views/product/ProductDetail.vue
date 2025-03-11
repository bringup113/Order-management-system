<template>
  <div class="product-detail-container">
    <div class="product-detail-header">
      <h2>产品详情</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit">编辑</el-button>
        <el-button type="warning" @click="handleQuotes">管理报价</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>

    <el-card class="detail-container" v-loading="loading">
      <el-descriptions title="基本信息" :column="2" border>
        <el-descriptions-item label="产品名称">{{ productInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="产品类型">{{ getProductTypeText(productInfo.type) }}</el-descriptions-item>
        <el-descriptions-item label="产品描述">{{ productInfo.description }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="productInfo.status === 'active' ? 'success' : 'info'">
            {{ productInfo.status === 'active' ? '上架' : '下架' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ productInfo.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ productInfo.updatedAt }}</el-descriptions-item>
        <el-descriptions-item label="产品详情" :span="2">
          <div class="product-details">{{ productInfo.details || '无' }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ productInfo.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="quotes-container" v-loading="quotesLoading">
      <div class="quotes-header">
        <h3>产品报价信息</h3>
        <el-button type="primary" size="small" @click="handleAddQuote">添加报价</el-button>
      </div>

      <el-table v-if="quoteList.length > 0" :data="quoteList" border style="width: 100%">
        <el-table-column prop="supplierName" label="供应商" width="150" />
        <el-table-column prop="costPrice" label="成本价格" width="120">
          <template #default="scope">
            {{ scope.row.costPrice.toFixed(2) }} 元
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEditQuote(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="success"
              @click="handleAgentPrices(scope.row)"
              >代理价格</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDeleteQuote(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div v-else class="empty-quotes">
        <el-empty description="暂无报价信息" />
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProductDetail, deleteProductQuote } from '@/api/product'
import { getProductQuotes } from '@/api/product'
import { handleDetailResponse } from '@/utils/api-adapter'

export default {
  name: 'ProductDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const quotesLoading = ref(false)
    const productInfo = reactive({
      id: null,
      name: '',
      type: '',
      description: '',
      details: '',
      status: '',
      remark: '',
      createdAt: '',
      updatedAt: ''
    })
    const quoteList = ref([])

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

    // 获取产品详情
    const getDetail = (id) => {
      loading.value = true
      getProductDetail(id)
        .then(response => {
          const detailData = handleDetailResponse(response)
          Object.assign(productInfo, detailData)
        })
        .catch(error => {
          console.error('获取产品详情失败', error)
          ElMessage.error('获取产品详情失败')
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 获取产品报价列表
    const getQuotes = (productId) => {
      quotesLoading.value = true
      getProductQuotes(productId)
        .then(response => {
          quoteList.value = response.data || []
        })
        .catch(error => {
          console.error('获取产品报价失败', error)
          ElMessage.error('获取产品报价失败')
        })
        .finally(() => {
          quotesLoading.value = false
        })
    }

    // 编辑产品
    const handleEdit = () => {
      router.push(`/product/edit/${productInfo.id}`)
    }

    // 管理报价
    const handleQuotes = () => {
      router.push(`/product/quotes/${productInfo.id}`)
    }

    // 添加报价
    const handleAddQuote = () => {
      router.push(`/product/quote/create?productId=${productInfo.id}`)
    }

    // 编辑报价
    const handleEditQuote = (row) => {
      router.push(`/product/quote/edit/${row.id}`)
    }

    // 管理代理价格
    const handleAgentPrices = (row) => {
      router.push(`/product/quote/${row.id}/agent-prices`)
    }

    // 删除报价
    const handleDeleteQuote = (row) => {
      ElMessageBox.confirm('确认删除该报价吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteProductQuote(row.id)
            .then(() => {
              ElMessage.success('删除成功')
              getQuotes(productInfo.id)
            })
            .catch(error => {
              console.error('删除报价失败', error)
              ElMessage.error('删除报价失败')
            })
        })
        .catch(() => {
          // 取消删除
        })
    }

    // 返回
    const goBack = () => {
      router.push('/product/list')
    }

    onMounted(() => {
      if (route.params.id) {
        const id = route.params.id
        getDetail(id)
        getQuotes(id)
      }
    })

    return {
      loading,
      quotesLoading,
      productInfo,
      quoteList,
      getProductTypeText,
      handleEdit,
      handleQuotes,
      handleAddQuote,
      handleEditQuote,
      handleAgentPrices,
      handleDeleteQuote,
      goBack
    }
  }
}
</script>

<style scoped>
.product-detail-container {
  padding: 20px;
}

.product-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.detail-container {
  margin-bottom: 20px;
}

.product-details {
  white-space: pre-line;
  line-height: 1.5;
}

.quotes-container {
  margin-top: 20px;
}

.quotes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.empty-quotes {
  padding: 30px 0;
}
</style> 