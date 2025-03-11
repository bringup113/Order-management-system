<template>
  <div class="order-detail-container">
    <div class="page-header">
      <h1>订单详情</h1>
      <div class="header-actions">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="handleEdit">编辑订单</el-button>
      </div>
    </div>

    <el-card v-loading="loading" class="detail-card">
      <template v-if="order">
        <!-- 订单基本信息 -->
        <div class="section-title">基本信息</div>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="订单编号">{{ order.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="下单日期">{{ order.orderDate }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getOrderStatusType(order.orderStatus)">
              {{ getOrderStatusText(order.orderStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付状态">
            <el-tag :type="getPaymentStatusType(order.paymentStatus)">
              {{ getPaymentStatusText(order.paymentStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="订单金额">{{ formatCurrency(order.totalAmount) }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDateTime(order.createdAt) }}</el-descriptions-item>
        </el-descriptions>

        <!-- 客户信息 -->
        <div class="section-title">客户信息</div>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="客户姓名">{{ order.passport?.name }}</el-descriptions-item>
          <el-descriptions-item label="护照号码">{{ order.passport?.passportNo }}</el-descriptions-item>
          <el-descriptions-item label="国籍">{{ order.passport?.nationality }}</el-descriptions-item>
        </el-descriptions>

        <!-- 代理商信息 -->
        <div class="section-title">代理商信息</div>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="代理商名称">{{ order.agent?.name }}</el-descriptions-item>
          <el-descriptions-item label="联系人">{{ order.agent?.contactPerson }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ order.agent?.contactPhone }}</el-descriptions-item>
        </el-descriptions>

        <!-- 订单项目 -->
        <div class="section-title">订单项目</div>
        <el-table :data="order.orderItems" border style="width: 100%">
          <el-table-column prop="product.name" label="产品名称" min-width="180"></el-table-column>
          <el-table-column prop="product.type" label="产品类型" width="120">
            <template #default="scope">
              {{ getProductTypeText(scope.row.product.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="unitPrice" label="单价" width="120">
            <template #default="scope">
              {{ formatCurrency(scope.row.unitPrice) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
          <el-table-column prop="subtotal" label="小计" width="120">
            <template #default="scope">
              {{ formatCurrency(scope.row.subtotal) }}
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" min-width="150"></el-table-column>
        </el-table>

        <!-- 备注信息 -->
        <div class="section-title">备注信息</div>
        <el-input
          type="textarea"
          :rows="3"
          v-model="order.remarks"
          readonly
          placeholder="暂无备注"
        ></el-input>
      </template>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
  name: 'OrderDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const order = ref(null)

    // 获取订单详情
    const fetchOrderDetail = async () => {
      const orderId = route.params.id
      if (!orderId) {
        ElMessage.error('订单ID不能为空')
        return
      }

      loading.value = true
      try {
        const response = await axios.get(`/api/orders/${orderId}`)
        order.value = response.data
      } catch (error) {
        console.error('获取订单详情失败:', error)
        ElMessage.error('获取订单详情失败')
      } finally {
        loading.value = false
      }
    }

    // 返回上一页
    const goBack = () => {
      router.back()
    }

    // 编辑订单
    const handleEdit = () => {
      router.push({
        name: 'OrderEdit',
        params: { id: order.value.id }
      })
    }

    // 订单状态显示
    const getOrderStatusText = (status) => {
      const statusMap = {
        pending: '待处理',
        processing: '处理中',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || status
    }

    const getOrderStatusType = (status) => {
      const typeMap = {
        pending: 'warning',
        processing: 'primary',
        completed: 'success',
        cancelled: 'danger'
      }
      return typeMap[status] || ''
    }

    // 支付状态显示
    const getPaymentStatusText = (status) => {
      const statusMap = {
        unpaid: '未支付',
        partial: '部分支付',
        paid: '已支付'
      }
      return statusMap[status] || status
    }

    const getPaymentStatusType = (status) => {
      const typeMap = {
        unpaid: 'danger',
        partial: 'warning',
        paid: 'success'
      }
      return typeMap[status] || ''
    }

    // 产品类型显示
    const getProductTypeText = (type) => {
      const typeMap = {
        tour: '旅游产品',
        hotel: '酒店',
        flight: '机票',
        other: '其他'
      }
      return typeMap[type] || type
    }

    // 格式化货币
    const formatCurrency = (value) => {
      return `¥ ${parseFloat(value).toFixed(2)}`
    }

    // 格式化日期时间
    const formatDateTime = (dateTime) => {
      if (!dateTime) return ''
      const date = new Date(dateTime)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    onMounted(() => {
      fetchOrderDetail()
    })

    return {
      loading,
      order,
      goBack,
      handleEdit,
      getOrderStatusText,
      getOrderStatusType,
      getPaymentStatusText,
      getPaymentStatusType,
      getProductTypeText,
      formatCurrency,
      formatDateTime
    }
  }
}
</script>

<style scoped>
.order-detail-container {
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

.detail-card {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.section-title:first-child {
  margin-top: 0;
}
</style> 