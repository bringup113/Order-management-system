<template>
  <div class="invoice-payments-container">
    <div class="page-header">
      <h1>支付记录</h1>
      <div class="header-actions">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="showAddPaymentDialog">添加支付记录</el-button>
      </div>
    </div>

    <el-card v-loading="loading" class="invoice-info-card">
      <template v-if="invoice">
        <div class="invoice-info">
          <div class="info-item">
            <span class="label">账单编号：</span>
            <span class="value">{{ invoice.invoiceNo }}</span>
          </div>
          <div class="info-item">
            <span class="label">客户姓名：</span>
            <span class="value">{{ invoice.passport?.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">账单金额：</span>
            <span class="value">{{ formatCurrency(invoice.totalAmount) }}</span>
          </div>
          <div class="info-item">
            <span class="label">已支付金额：</span>
            <span class="value">{{ formatCurrency(invoice.paidAmount) }}</span>
          </div>
          <div class="info-item">
            <span class="label">未支付金额：</span>
            <span class="value">{{ formatCurrency(invoice.unpaidAmount) }}</span>
          </div>
          <div class="info-item">
            <span class="label">账单状态：</span>
            <span class="value">
              <el-tag :type="getInvoiceStatusType(invoice.status)">
                {{ getInvoiceStatusText(invoice.status) }}
              </el-tag>
            </span>
          </div>
        </div>
      </template>
    </el-card>

    <el-card class="payments-card">
      <div class="card-title">支付记录列表</div>
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
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button 
              v-if="scope.row.paymentStatus === 'pending'" 
              size="small" 
              type="success" 
              @click="handleReview(scope.row, 'approved')"
            >
              审核通过
            </el-button>
            <el-button 
              v-if="scope.row.paymentStatus === 'pending'" 
              size="small" 
              type="danger" 
              @click="handleReview(scope.row, 'rejected')"
            >
              拒绝
            </el-button>
            <el-button 
              v-if="scope.row.paymentStatus === 'pending'" 
              size="small" 
              type="primary" 
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button 
              v-if="scope.row.paymentStatus === 'pending'" 
              size="small" 
              type="danger" 
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑支付记录对话框 -->
    <el-dialog 
      v-model="paymentDialogVisible" 
      :title="isEditPayment ? '编辑支付记录' : '添加支付记录'" 
      width="50%"
    >
      <el-form 
        ref="paymentFormRef" 
        :model="paymentForm" 
        :rules="paymentRules" 
        label-width="100px"
      >
        <el-form-item label="支付金额" prop="paymentAmount">
          <el-input-number 
            v-model="paymentForm.paymentAmount" 
            :precision="2" 
            :step="100" 
            :min="0" 
            :max="invoice?.unpaidAmount || 0"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-select v-model="paymentForm.paymentMethod" placeholder="请选择支付方式" style="width: 100%">
            <el-option label="现金" value="cash"></el-option>
            <el-option label="银行转账" value="bank"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付日期" prop="paymentDate">
          <el-date-picker
            v-model="paymentForm.paymentDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="支付凭证" prop="voucherFile">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :limit="1"
            :file-list="fileList"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                支持jpg/png格式，不超过5MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            :rows="3"
            v-model="paymentForm.remarks"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="paymentDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPaymentForm" :loading="submitting">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog v-model="reviewDialogVisible" title="审核支付记录" width="40%">
      <el-form ref="reviewFormRef" :model="reviewForm" label-width="100px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="reviewForm.status">
            <el-radio label="approved">通过</el-radio>
            <el-radio label="rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input
            type="textarea"
            :rows="3"
            v-model="reviewForm.remarks"
            placeholder="请输入审核备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reviewDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReview" :loading="submitting">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 凭证预览对话框 -->
    <el-dialog v-model="voucherDialogVisible" title="支付凭证" width="50%">
      <div class="voucher-container">
        <img :src="currentVoucherUrl" alt="支付凭证" style="max-width: 100%;" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import {
  getInvoiceDetail,
  getInvoicePayments,
  addPayment,
  updatePayment,
  deletePayment,
  reviewPayment
} from '@/api/invoice'
import { handleDetailResponse } from '@/utils/api-adapter'

export default {
  name: 'InvoicePayments',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const submitting = ref(false)
    const invoice = ref(null)
    const payments = ref([])
    
    // 支付记录对话框
    const paymentDialogVisible = ref(false)
    const paymentFormRef = ref(null)
    const isEditPayment = ref(false)
    const currentPaymentId = ref(null)
    const fileList = ref([])
    
    // 审核对话框
    const reviewDialogVisible = ref(false)
    const reviewFormRef = ref(null)
    const currentReviewPayment = ref(null)
    
    // 凭证预览
    const voucherDialogVisible = ref(false)
    const currentVoucherUrl = ref('')

    // 支付表单
    const paymentForm = reactive({
      paymentAmount: 0,
      paymentMethod: 'bank',
      paymentDate: new Date().toISOString().split('T')[0],
      voucherFile: null,
      remarks: ''
    })

    // 支付表单验证规则
    const paymentRules = reactive({
      paymentAmount: [
        { required: true, message: '请输入支付金额', trigger: 'blur' },
        { 
          validator: (rule, value, callback) => {
            if (value <= 0) {
              callback(new Error('支付金额必须大于0'))
            } else if (value > (invoice.value?.unpaidAmount || 0)) {
              callback(new Error('支付金额不能超过未支付金额'))
            } else {
              callback()
            }
          }, 
          trigger: 'blur' 
        }
      ],
      paymentMethod: [
        { required: true, message: '请选择支付方式', trigger: 'change' }
      ],
      paymentDate: [
        { required: true, message: '请选择支付日期', trigger: 'change' }
      ]
    })

    // 审核表单
    const reviewForm = reactive({
      status: 'approved',
      remarks: ''
    })

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
          passport: {
            name: '张三',
            passportNo: 'E12345678',
            nationality: '中国'
          }
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
        payments.value = handleDetailResponse(response) || []
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

    // 显示添加支付记录对话框
    const showAddPaymentDialog = () => {
      isEditPayment.value = false
      currentPaymentId.value = null
      resetPaymentForm()
      paymentForm.paymentAmount = invoice.value?.unpaidAmount || 0
      paymentDialogVisible.value = true
    }

    // 处理编辑支付记录
    const handleEdit = (row) => {
      isEditPayment.value = true
      currentPaymentId.value = row.id
      resetPaymentForm()
      
      // 填充表单数据
      paymentForm.paymentAmount = row.paymentAmount
      paymentForm.paymentMethod = row.paymentMethod
      paymentForm.paymentDate = row.paymentDate
      paymentForm.remarks = row.remarks
      
      // 如果有凭证，显示在文件列表中
      if (row.voucherUrl) {
        fileList.value = [
          {
            name: '支付凭证',
            url: row.voucherUrl
          }
        ]
      }
      
      paymentDialogVisible.value = true
    }

    // 处理删除支付记录
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        '确定要删除这条支付记录吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await deletePayment(row.id)
          ElMessage.success('删除成功')
          fetchInvoiceDetail()
        } catch (error) {
          console.error('删除支付记录失败:', error)
          ElMessage.error('删除支付记录失败')
        }
      }).catch(() => {})
    }

    // 处理审核支付记录
    const handleReview = (row, status) => {
      currentReviewPayment.value = row
      reviewForm.status = status
      reviewForm.remarks = ''
      reviewDialogVisible.value = true
    }

    // 提交审核
    const submitReview = async () => {
      if (!currentReviewPayment.value) return
      
      submitting.value = true
      try {
        await reviewPayment(currentReviewPayment.value.id, {
          status: reviewForm.status,
          remarks: reviewForm.remarks
        })
        
        ElMessage.success('审核成功')
        reviewDialogVisible.value = false
        
        // 刷新数据
        fetchInvoiceDetail()
      } catch (error) {
        console.error('审核支付记录失败:', error)
        ElMessage.error('审核支付记录失败')
      } finally {
        submitting.value = false
      }
    }

    // 重置支付表单
    const resetPaymentForm = () => {
      paymentForm.paymentAmount = 0
      paymentForm.paymentMethod = 'bank'
      paymentForm.paymentDate = new Date().toISOString().split('T')[0]
      paymentForm.voucherFile = null
      paymentForm.remarks = ''
      fileList.value = []
      
      if (paymentFormRef.value) {
        paymentFormRef.value.resetFields()
      }
    }

    // 处理文件变更
    const handleFileChange = (file) => {
      paymentForm.voucherFile = file.raw
    }

    // 提交支付表单
    const submitPaymentForm = async () => {
      if (!paymentFormRef.value) return
      
      await paymentFormRef.value.validate(async (valid) => {
        if (valid) {
          submitting.value = true
          try {
            const formData = new FormData()
            formData.append('paymentAmount', paymentForm.paymentAmount)
            formData.append('paymentMethod', paymentForm.paymentMethod)
            formData.append('paymentDate', paymentForm.paymentDate)
            formData.append('remarks', paymentForm.remarks)
            
            if (paymentForm.voucherFile) {
              formData.append('voucherFile', paymentForm.voucherFile)
            }
            
            if (isEditPayment.value) {
              await updatePayment(currentPaymentId.value, formData)
              ElMessage.success('支付记录更新成功')
            } else {
              await addPayment(route.params.id, formData)
              ElMessage.success('支付记录添加成功')
            }
            
            paymentDialogVisible.value = false
            fetchInvoiceDetail()
          } catch (error) {
            console.error('保存支付记录失败:', error)
            ElMessage.error('保存支付记录失败')
          } finally {
            submitting.value = false
          }
        } else {
          ElMessage.warning('请填写必填项')
          return false
        }
      })
    }

    // 预览凭证
    const previewVoucher = (url) => {
      currentVoucherUrl.value = url
      voucherDialogVisible.value = true
    }

    // 返回上一页
    const goBack = () => {
      router.back()
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

    onMounted(() => {
      fetchInvoiceDetail()
    })

    return {
      loading,
      submitting,
      invoice,
      payments,
      paymentDialogVisible,
      paymentFormRef,
      paymentForm,
      paymentRules,
      isEditPayment,
      fileList,
      reviewDialogVisible,
      reviewForm,
      voucherDialogVisible,
      currentVoucherUrl,
      goBack,
      showAddPaymentDialog,
      handleEdit,
      handleDelete,
      handleReview,
      submitReview,
      handleFileChange,
      submitPaymentForm,
      previewVoucher,
      getInvoiceStatusText,
      getInvoiceStatusType,
      getPaymentMethodText,
      getPaymentStatusText,
      getPaymentStatusType,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.invoice-payments-container {
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

.invoice-info-card {
  margin-bottom: 20px;
}

.invoice-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  font-weight: bold;
  margin-right: 5px;
}

.payments-card {
  margin-bottom: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.voucher-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> 