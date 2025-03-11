<template>
  <div class="invoice-form-container">
    <div class="page-header">
      <h1>{{ isEdit ? '编辑账单' : '创建账单' }}</h1>
      <div class="header-actions">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">保存</el-button>
      </div>
    </div>

    <el-card v-loading="loading" class="form-card">
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="120px"
        label-position="right"
      >
        <!-- 基本信息 -->
        <div class="section-title">基本信息</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账单编号" prop="invoiceNo">
              <el-input v-model="form.invoiceNo" placeholder="系统自动生成" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生成日期" prop="generatedDate">
              <el-date-picker
                v-model="form.generatedDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账单状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择账单状态" style="width: 100%">
                <el-option label="未支付" value="unpaid"></el-option>
                <el-option label="部分支付" value="partial"></el-option>
                <el-option label="已支付" value="paid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总金额" prop="totalAmount">
              <el-input-number
                v-model="form.totalAmount"
                :precision="2"
                :step="100"
                :min="0"
                style="width: 100%"
                placeholder="根据订单自动计算"
                disabled
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 客户信息 -->
        <div class="section-title">客户信息</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择客户" prop="customerId">
              <el-select
                v-model="form.customerId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入客户姓名或护照号码"
                :remote-method="searchPassports"
                :loading="passportLoading"
                style="width: 100%"
              >
                <el-option
                  v-for="item in passportOptions"
                  :key="item.id"
                  :label="`${item.name} (${item.passportNo})`"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户信息">
              <div v-if="selectedPassport" class="selected-info">
                <p><strong>姓名：</strong>{{ selectedPassport.name }}</p>
                <p><strong>护照号：</strong>{{ selectedPassport.passportNo }}</p>
                <p><strong>国籍：</strong>{{ selectedPassport.nationality }}</p>
              </div>
              <div v-else class="no-selected">未选择客户</div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 代理商信息 -->
        <div class="section-title">代理商信息</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择代理商" prop="agentId">
              <el-select
                v-model="form.agentId"
                filterable
                placeholder="请选择代理商"
                style="width: 100%"
              >
                <el-option
                  v-for="item in agentOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代理商信息">
              <div v-if="selectedAgent" class="selected-info">
                <p><strong>名称：</strong>{{ selectedAgent.name }}</p>
                <p><strong>联系人：</strong>{{ selectedAgent.contactPerson }}</p>
                <p><strong>电话：</strong>{{ selectedAgent.contactPhone }}</p>
              </div>
              <div v-else class="no-selected">未选择代理商</div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 关联订单 -->
        <div class="section-title">关联订单</div>
        <div class="order-selection">
          <div class="order-selection-header">
            <el-button type="primary" @click="showOrderSelectionDialog">添加订单</el-button>
          </div>
          <el-table :data="selectedOrders" border style="width: 100%">
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
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="removeOrder(scope.$index)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="selectedOrders.length > 0" class="order-total">
            <span>订单总金额：{{ formatCurrency(calculateTotalAmount()) }}</span>
          </div>
        </div>

        <!-- 备注信息 -->
        <div class="section-title">备注信息</div>
        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.remarks"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 订单选择对话框 -->
    <el-dialog v-model="orderDialogVisible" title="选择订单" width="70%">
      <div class="order-dialog-content">
        <el-form :inline="true" class="order-search-form">
          <el-form-item label="订单编号">
            <el-input v-model="orderSearch.orderNo" placeholder="请输入订单编号"></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="orderSearch.status" placeholder="请选择状态" clearable>
              <el-option label="待处理" value="pending"></el-option>
              <el-option label="处理中" value="processing"></el-option>
              <el-option label="已完成" value="completed"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchOrders">查询</el-button>
            <el-button @click="resetOrderSearch">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table 
          :data="availableOrders" 
          border 
          style="width: 100%" 
          @selection-change="handleOrderSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
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
          <el-table-column prop="customerName" label="客户姓名" width="120"></el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="150"></el-table-column>
        </el-table>

        <div class="dialog-footer">
          <el-button @click="orderDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmOrderSelection">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createInvoice, updateInvoice, getInvoiceDetail } from '@/api/invoice'

export default {
  name: 'InvoiceForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const loading = ref(false)
    const passportLoading = ref(false)
    const orderDialogVisible = ref(false)
    
    // 判断是否为编辑模式
    const isEdit = computed(() => {
      return !!route.params.id
    })

    // 表单数据
    const form = reactive({
      invoiceNo: '',
      generatedDate: new Date().toISOString().split('T')[0],
      status: 'unpaid',
      totalAmount: 0,
      paidAmount: 0,
      unpaidAmount: 0,
      customerId: '',
      agentId: '',
      remarks: '',
      orderIds: []
    })

    // 表单验证规则
    const rules = reactive({
      generatedDate: [
        { required: true, message: '请选择生成日期', trigger: 'change' }
      ],
      status: [
        { required: true, message: '请选择账单状态', trigger: 'change' }
      ],
      customerId: [
        { required: true, message: '请选择客户', trigger: 'change' }
      ],
      agentId: [
        { required: true, message: '请选择代理商', trigger: 'change' }
      ]
    })

    // 客户选项
    const passportOptions = ref([])
    const selectedPassport = ref(null)

    // 代理商选项
    const agentOptions = ref([
      { id: 1, name: '北京旅行社', contactPerson: '赵六', contactPhone: '13600136000' },
      { id: 2, name: '上海旅行社', contactPerson: '王五', contactPhone: '13800138000' },
      { id: 3, name: '广州旅行社', contactPerson: '李四', contactPhone: '13900139000' }
    ])
    const selectedAgent = ref(null)

    // 订单相关
    const selectedOrders = ref([])
    const availableOrders = ref([])
    const tempSelectedOrders = ref([])
    const orderSearch = reactive({
      orderNo: '',
      status: ''
    })

    // 监听代理商选择变化
    watch(() => form.agentId, (newVal) => {
      if (newVal) {
        selectedAgent.value = agentOptions.value.find(item => item.id === newVal)
      } else {
        selectedAgent.value = null
      }
    })

    // 监听客户选择变化
    watch(() => form.customerId, (newVal) => {
      if (newVal) {
        selectedPassport.value = passportOptions.value.find(item => item.id === newVal)
      } else {
        selectedPassport.value = null
      }
    })

    // 搜索客户
    const searchPassports = async (query) => {
      if (query) {
        passportLoading.value = true
        try {
          // 模拟API调用
          setTimeout(() => {
            passportOptions.value = [
              { id: 1, name: '张三', passportNo: 'E12345678', nationality: '中国' },
              { id: 2, name: '李四', passportNo: 'E87654321', nationality: '中国' },
              { id: 3, name: 'John Smith', passportNo: 'P12345678', nationality: '美国' }
            ].filter(item => 
              item.name.toLowerCase().includes(query.toLowerCase()) || 
              item.passportNo.toLowerCase().includes(query.toLowerCase())
            )
            passportLoading.value = false
          }, 500)
        } catch (error) {
          console.error('搜索客户失败:', error)
          passportLoading.value = false
        }
      } else {
        passportOptions.value = []
      }
    }

    // 显示订单选择对话框
    const showOrderSelectionDialog = () => {
      if (!form.customerId) {
        ElMessage.warning('请先选择客户')
        return
      }
      
      orderDialogVisible.value = true
      tempSelectedOrders.value = [...selectedOrders.value]
      searchOrders()
    }

    // 搜索订单
    const searchOrders = () => {
      // 模拟API调用
      setTimeout(() => {
        availableOrders.value = [
          { 
            id: 1, 
            orderNo: 'ORD20230001', 
            orderDate: '2023-01-10', 
            orderStatus: 'completed', 
            amount: 3000, 
            customerName: '张三',
            productName: '日本旅游签证'
          },
          { 
            id: 2, 
            orderNo: 'ORD20230002', 
            orderDate: '2023-01-12', 
            orderStatus: 'processing', 
            amount: 2000,
            customerName: '张三',
            productName: '美国旅游签证'
          },
          { 
            id: 3, 
            orderNo: 'ORD20230003', 
            orderDate: '2023-01-15', 
            orderStatus: 'pending', 
            amount: 1500,
            customerName: '张三',
            productName: '欧洲申根签证'
          }
        ].filter(item => {
          let match = true
          if (orderSearch.orderNo && !item.orderNo.includes(orderSearch.orderNo)) {
            match = false
          }
          if (orderSearch.status && item.orderStatus !== orderSearch.status) {
            match = false
          }
          return match
        })
      }, 300)
    }

    // 重置订单搜索
    const resetOrderSearch = () => {
      orderSearch.orderNo = ''
      orderSearch.status = ''
      searchOrders()
    }

    // 处理订单选择变化
    const handleOrderSelectionChange = (selection) => {
      tempSelectedOrders.value = selection
    }

    // 确认订单选择
    const confirmOrderSelection = () => {
      selectedOrders.value = [...tempSelectedOrders.value]
      form.orderIds = selectedOrders.value.map(item => item.id)
      form.totalAmount = calculateTotalAmount()
      form.unpaidAmount = form.totalAmount - form.paidAmount
      orderDialogVisible.value = false
    }

    // 移除订单
    const removeOrder = (index) => {
      selectedOrders.value.splice(index, 1)
      form.orderIds = selectedOrders.value.map(item => item.id)
      form.totalAmount = calculateTotalAmount()
      form.unpaidAmount = form.totalAmount - form.paidAmount
    }

    // 计算订单总金额
    const calculateTotalAmount = () => {
      return selectedOrders.value.reduce((total, order) => total + order.amount, 0)
    }

    // 获取账单详情
    const fetchInvoiceDetail = async () => {
      const invoiceId = route.params.id
      if (!invoiceId) return

      loading.value = true
      try {
        const response = await getInvoiceDetail(invoiceId)
        const invoiceData = response.data

        // 填充表单数据
        Object.keys(form).forEach(key => {
          if (invoiceData[key] !== undefined) {
            form[key] = invoiceData[key]
          }
        })

        // 设置客户信息
        if (invoiceData.passport) {
          form.customerId = invoiceData.passport.id
          passportOptions.value = [invoiceData.passport]
          selectedPassport.value = invoiceData.passport
        }

        // 设置代理商信息
        if (invoiceData.agent) {
          form.agentId = invoiceData.agent.id
          selectedAgent.value = invoiceData.agent
        }

        // 设置订单信息
        if (invoiceData.orders && invoiceData.orders.length > 0) {
          selectedOrders.value = invoiceData.orders
          form.orderIds = selectedOrders.value.map(item => item.id)
        }
      } catch (error) {
        console.error('获取账单详情失败:', error)
        ElMessage.error('获取账单详情失败')
        
        // 使用模拟数据
        form.invoiceNo = 'INV20230001'
        form.generatedDate = '2023-01-15'
        form.status = 'partial'
        form.totalAmount = 5000
        form.paidAmount = 2000
        form.unpaidAmount = 3000
        form.remarks = '这是一个测试账单'
        
        // 模拟客户数据
        form.customerId = 1
        passportOptions.value = [
          { id: 1, name: '张三', passportNo: 'E12345678', nationality: '中国' }
        ]
        selectedPassport.value = passportOptions.value[0]
        
        // 模拟代理商数据
        form.agentId = 1
        selectedAgent.value = agentOptions.value[0]
        
        // 模拟订单数据
        selectedOrders.value = [
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
        form.orderIds = selectedOrders.value.map(item => item.id)
      } finally {
        loading.value = false
      }
    }

    // 提交表单
    const submitForm = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate(async (valid) => {
        if (valid) {
          if (selectedOrders.value.length === 0) {
            ElMessage.warning('请至少选择一个订单')
            return
          }

          loading.value = true
          try {
            const formData = { ...form }
            
            if (isEdit.value) {
              await updateInvoice(route.params.id, formData)
              ElMessage.success('账单更新成功')
            } else {
              await createInvoice(formData)
              ElMessage.success('账单创建成功')
            }
            
            goBack()
          } catch (error) {
            console.error('保存账单失败:', error)
            ElMessage.error('保存账单失败')
          } finally {
            loading.value = false
          }
        } else {
          ElMessage.warning('请填写必填项')
          return false
        }
      })
    }

    // 返回上一页
    const goBack = () => {
      router.back()
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

    // 格式化货币
    const formatCurrency = (value) => {
      return `¥ ${parseFloat(value).toFixed(2)}`
    }

    onMounted(() => {
      if (isEdit.value) {
        fetchInvoiceDetail()
      }
    })

    return {
      formRef,
      form,
      rules,
      loading,
      isEdit,
      passportLoading,
      passportOptions,
      selectedPassport,
      agentOptions,
      selectedAgent,
      orderDialogVisible,
      selectedOrders,
      availableOrders,
      tempSelectedOrders,
      orderSearch,
      searchPassports,
      showOrderSelectionDialog,
      searchOrders,
      resetOrderSearch,
      handleOrderSelectionChange,
      confirmOrderSelection,
      removeOrder,
      calculateTotalAmount,
      submitForm,
      goBack,
      getOrderStatusText,
      getOrderStatusType,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.invoice-form-container {
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

.form-card {
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

.selected-info {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.selected-info p {
  margin: 5px 0;
}

.no-selected {
  color: #909399;
  padding: 10px;
}

.order-selection {
  margin-bottom: 20px;
}

.order-selection-header {
  margin-bottom: 10px;
}

.order-total {
  margin-top: 10px;
  text-align: right;
  font-weight: bold;
}

.order-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-search-form {
  margin-bottom: 15px;
}

.dialog-footer {
  margin-top: 20px;
  text-align: right;
}
</style> 