<template>
  <div class="invoice-detail-container">
    <div class="page-header">
      <h1>账单详情</h1>
      <div class="header-actions">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="handleEdit">编辑账单</el-button>
        <el-button type="success" @click="handlePayments">支付记录</el-button>
      </div>
    </div>

    <el-card v-loading="loading" class="detail-card">
      <template v-if="invoice">
        <!-- 账单基本信息 -->
        <div class="section-title">基本信息</div>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="账单编号">{{ invoice.invoiceNo }}</el-descriptions-item>
          <el-descriptions-item label="生成日期">{{ invoice.generatedDate }}</el-descriptions-item>
          <el-descriptions-item label="账单状态">
            <el-tag :type="getInvoiceStatusType(invoice.status)">
              {{ getInvoiceStatusText(invoice.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="账单金额">{{ formatCurrency(invoice.totalAmount) }}</el-descriptions-item>
          <el-descriptions-item label="已支付金额">{{ formatCurrency(invoice.paidAmount) }}</el-descriptions-item>
          <el-descriptions-item label="未支付金额">{{ formatCurrency(invoice.unpaidAmount) }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ invoice.createdBy }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDateTime(invoice.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDateTime(invoice.updatedAt) }}</el-descriptions-item>
        </el-descriptions>

        <!-- 客户信息 -->
        <div class="section-title">客户信息</div>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="客户姓名">{{ invoice.passport?.name }}</el-descriptions-item>
          <el-descriptions-item label="护照号码">{{ invoice.passport?.passportNo }}</el-descriptions-item>
          <el-descriptions-item label="国籍">{{ invoice.passport?.nationality }}</el-descriptions-item>
        </el-descriptions>

        <!-- 代理商信息 -->
        <div class="section-title">代理商信息</div>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="代理商名称">{{ invoice.agent?.name }}</el-descriptions-item>
          <el-descriptions-item label="联系人">{{ invoice.agent?.contactPerson }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ invoice.agent?.contactPhone }}</el-descriptions-item>
        </el-descriptions>

        <!-- 关联订单 -->
        <div class="section-title">关联订单</div>
        <el-table :data="invoice.orders" border style="width: 100%">
          <el-table-column prop="orderNo" label="订单编号" width="180"></el-table-column>
          <el-table-column prop="orderDate" label="下单日期" width="120"></el-table-column>
          <el-table-column prop="orderStatus" label="订单状态" width="100">
            <template #default="scope">
              <el-tag :type="getOrderStatusType(scope.row.orderStatus)">
                {{ getOrderStatusText(scope.row.orderStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" width="120">
            <template #default="scope">
              {{ formatCurrency(scope.row.amount) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
                {{ scope.row.status === 'active' ? '有效' : '取消' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!-- 支付记录 -->
        <div class="section-title">支付记录</div>
        <el-table :data="payments" border style="width: 100%">
          <el-table-column prop="paymentAmount" label="支付金额" width="120">
            <template #default="scope">
              {{ formatCurrency(scope.row.paymentAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="paymentMethod" label="支付方式" width="120">
            <template #default="scope">
              {{ getPaymentMethodText(scope.row.paymentMethod) }}
            </template>
          </el-table-column>
          <el-table-column prop="paymentDate" label="支付日期" width="120"></el-table-column>
          <el-table-column prop="paymentStatus" label="支付状态" width="100">
            <template #default="scope">
              <el-tag :type="getPaymentStatusType(scope.row.paymentStatus)">
                {{ getPaymentStatusText(scope.row.paymentStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reviewedBy" label="审核人" width="120"></el-table-column>
          <el-table-column prop="reviewedAt" label="审核时间" width="180"></el-table-column>
          <el-table-column prop="reviewRemarks" label="审核备注" min-width="150"></el-table-column>
          <el-table-column label="凭证" width="100">
            <template #default="scope">
              <el-button 
                v-if="scope.row.voucherUrl" 
                size="small" 
                type="primary" 
                @click="previewVoucher(scope.row.voucherUrl)"
              >
                查看
              </el-button>
              <span v-else>无</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 备注信息 -->
        <div class="section-title">备注信息</div>
        <el-input
          type="textarea"
          :rows="3"
          v-model="invoice.remarks"
          readonly
          placeholder="暂无备注"
        ></el-input>
      </template>
    </el-card>

    <!-- 凭证预览对话框 -->
    <el-dialog v-model="voucherDialogVisible" title="支付凭证" width="50%">
      <div class="voucher-container">
        <img :src="currentVoucherUrl" alt="支付凭证" style="max-width: 100%;" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getInvoiceDetail, getInvoicePayments } from '@/api/invoice'
import { handleDetailResponse } from '@/utils/api-adapter'

export default {
  name: 'InvoiceDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const invoice = ref(null)
    const payments = ref([])
    const voucherDialogVisible = ref(false)
    const currentVoucherUrl = ref('')

    // 获取账单详情
    const fetchInvoiceDetail = async () => {
      const invoiceId = route.params.id
      if (!invoiceId) {
        ElMessage.error('账单ID不能为空')
        return
      }

      loading.value = true
      try {
        const response = await getInvoiceDetail(invoiceId)
        invoice.value = handleDetailResponse(response)
        fetchPayments(invoiceId)
      } catch (error) {
        console.error('获取账单详情失败:', error)
        ElMessage.error('获取账单详情失败')
        
        // 使用模拟数据
        invoice.value = {
          id: invoiceId,
          invoiceNo: 'INV20230001',
          generatedDate: '2023-01-15',
          status: 'partial',
          totalAmount: 5000,
          paidAmount: 2000,
          unpaidAmount: 3000,
          createdBy: '管理员',
          createdAt: '2023-01-15 10:30:00',
          updatedAt: '2023-01-16 14:20:00',
          remarks: '这是一个测试账单',
          passport: {
            name: '张三',
            passportNo: 'E12345678',
            nationality: '中国'
          },
          agent: {
            name: '北京旅行社',
            contactPerson: '赵六',
            contactPhone: '13600136000'
          },
          orders: [
            {
              id: 1,
              orderNo: 'ORD20230001',
              orderDate: '2023-01-10',
              orderStatus: 'completed',
              amount: 3000,
              status: 'active'
            },
            {
              id: 2,
              orderNo: 'ORD20230002',
              orderDate: '2023-01-12',
              orderStatus: 'processing',
              amount: 2000,
              status: 'active'
            }
          ]
        }
        
        // 模拟支付记录数据
        payments.value = [
          {
            id: 1,
            paymentAmount: 2000,
            paymentMethod: 'bank',
            paymentDate: '2023-01-16',
            paymentStatus: 'approved',
            reviewedBy: '管理员',
            reviewedAt: '2023-01-16 14:20:00',
            reviewRemarks: '支付凭证已确认',
            voucherUrl: 'https://example.com/voucher1.jpg'
          }
        ]
      } finally {
        loading.value = false
      }
    }

    // 获取支付记录
    const fetchPayments = async (invoiceId) => {
      try {
        const response = await getInvoicePayments(invoiceId)
        payments.value = response.data || []
      } catch (error) {
        console.error('获取支付记录失败:', error)
        // 使用模拟数据
        payments.value = [
          {
            id: 1,
            paymentAmount: 2000,
            paymentMethod: 'bank',
            paymentDate: '2023-01-16',
            paymentStatus: 'approved',
            reviewedBy: '管理员',
            reviewedAt: '2023-01-16 14:20:00',
            reviewRemarks: '支付凭证已确认',
            voucherUrl: 'https://example.com/voucher1.jpg'
          }
        ]
      }
    }

    // 返回上一页
    const goBack = () => {
      router.back()
    }

    // 编辑账单
    const handleEdit = () => {
      router.push({
        name: 'InvoiceEdit',
        params: { id: invoice.value.id }
      })
    }

    // 支付记录
    const handlePayments = () => {
      router.push({
        name: 'InvoicePayments',
        params: { id: invoice.value.id }
      })
    }

    // 预览凭证
    const previewVoucher = (url) => {
      currentVoucherUrl.value = url
      voucherDialogVisible.value = true
    }

    // 账单状态显示
    const getInvoiceStatusText = (status) => {
      const statusMap = {
        unpaid: '未支付',
        partial: '部分支付',
        paid: '已支付'
      }
      return statusMap[status] || status
    }

    const getInvoiceStatusType = (status) => {
      const typeMap = {
        unpaid: 'danger',
        partial: 'warning',
        paid: 'success'
      }
      return typeMap[status] || ''
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

    // 支付方式显示
    const getPaymentMethodText = (method) => {
      const methodMap = {
        cash: '现金',
        bank: '银行转账',
        other: '其他'
      }
      return methodMap[method] || method
    }

    // 支付状态显示
    const getPaymentStatusText = (status) => {
      const statusMap = {
        pending: '待审核',
        approved: '已审核',
        rejected: '已拒绝'
      }
      return statusMap[status] || status
    }

    const getPaymentStatusType = (status) => {
      const typeMap = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger'
      }
      return typeMap[status] || ''
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
      fetchInvoiceDetail()
    })

    return {
      loading,
      invoice,
      payments,
      voucherDialogVisible,
      currentVoucherUrl,
      goBack,
      handleEdit,
      handlePayments,
      previewVoucher,
      getInvoiceStatusText,
      getInvoiceStatusType,
      getOrderStatusText,
      getOrderStatusType,
      getPaymentMethodText,
      getPaymentStatusText,
      getPaymentStatusType,
      formatCurrency,
      formatDateTime
    }
  }
}
</script>

<style scoped>
.invoice-detail-container {
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

.voucher-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> 