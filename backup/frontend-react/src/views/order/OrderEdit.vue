<template>
  <div class="order-edit-container">
    <div class="page-header">
      <h1>编辑订单</h1>
      <div class="header-actions">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </div>
    </div>

    <el-card v-loading="loading" class="edit-card">
      <el-form
        v-if="orderForm"
        ref="formRef"
        :model="orderForm"
        :rules="rules"
        label-width="120px"
      >
        <!-- 订单基本信息 -->
        <div class="section-title">基本信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="订单编号" prop="orderNo">
              <el-input v-model="orderForm.orderNo" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下单日期" prop="orderDate">
              <el-date-picker
                v-model="orderForm.orderDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单状态" prop="orderStatus">
              <el-select v-model="orderForm.orderStatus" style="width: 100%">
                <el-option label="待处理" value="pending"></el-option>
                <el-option label="处理中" value="processing"></el-option>
                <el-option label="已完成" value="completed"></el-option>
                <el-option label="已取消" value="cancelled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="支付状态" prop="paymentStatus">
              <el-select v-model="orderForm.paymentStatus" style="width: 100%">
                <el-option label="未支付" value="unpaid"></el-option>
                <el-option label="部分支付" value="partial"></el-option>
                <el-option label="已支付" value="paid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单金额" prop="totalAmount">
              <el-input-number
                v-model="orderForm.totalAmount"
                :precision="2"
                :step="100"
                :min="0"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 客户信息 -->
        <div class="section-title">客户信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="选择客户" prop="passportId">
              <el-select
                v-model="orderForm.passportId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入客户姓名或护照号"
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
        </el-row>

        <!-- 代理商信息 -->
        <div class="section-title">代理商信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="选择代理商" prop="agentId">
              <el-select
                v-model="orderForm.agentId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入代理商名称"
                :remote-method="searchAgents"
                :loading="agentLoading"
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
        </el-row>

        <!-- 订单项目 -->
        <div class="section-title">
          订单项目
          <el-button type="primary" size="small" @click="addOrderItem" style="margin-left: 10px">
            添加项目
          </el-button>
        </div>
        
        <el-table :data="orderForm.orderItems" border style="width: 100%; margin-bottom: 20px">
          <el-table-column label="产品名称" min-width="180">
            <template #default="scope">
              <el-select
                v-model="scope.row.productId"
                filterable
                remote
                reserve-keyword
                placeholder="请选择产品"
                :remote-method="(query) => searchProducts(query)"
                :loading="productLoading"
                style="width: 100%"
                @change="handleProductChange(scope.row)"
              >
                <el-option
                  v-for="item in productOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="供应商报价" width="180">
            <template #default="scope">
              <el-select
                v-model="scope.row.productQuoteId"
                filterable
                placeholder="请选择供应商报价"
                style="width: 100%"
                :disabled="!scope.row.productId"
                @change="handleQuoteChange(scope.row)"
              >
                <el-option
                  v-for="item in getQuoteOptions(scope.row.productId)"
                  :key="item.id"
                  :label="`${item.supplier.name} - ¥${item.costPrice}`"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="代理商价格" width="180">
            <template #default="scope">
              <el-select
                v-model="scope.row.agentProductPriceId"
                filterable
                placeholder="请选择代理商价格"
                style="width: 100%"
                :disabled="!scope.row.productQuoteId || !orderForm.agentId"
                @change="handleAgentPriceChange(scope.row)"
              >
                <el-option
                  v-for="item in getAgentPriceOptions(scope.row.productQuoteId)"
                  :key="item.id"
                  :label="`¥${item.sellingPrice}`"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="120">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.unitPrice"
                :precision="2"
                :step="10"
                :min="0"
                style="width: 100%"
                @change="calculateSubtotal(scope.row)"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="100">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.quantity"
                :min="1"
                :step="1"
                style="width: 100%"
                @change="calculateSubtotal(scope.row)"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.subtotal"
                :precision="2"
                :step="100"
                :min="0"
                style="width: 100%"
                disabled
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="150">
            <template #default="scope">
              <el-input v-model="scope.row.remarks" placeholder="备注"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template #default="scope">
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                circle
                @click="removeOrderItem(scope.$index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 备注信息 -->
        <div class="section-title">备注信息</div>
        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            :rows="3"
            v-model="orderForm.remarks"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { debounce } from 'lodash-es'

export default {
  name: 'OrderEdit',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const loading = ref(false)
    const saving = ref(false)
    const orderForm = ref(null)
    
    // 选项数据
    const passportOptions = ref([])
    const passportLoading = ref(false)
    const agentOptions = ref([])
    const agentLoading = ref(false)
    const productOptions = ref([])
    const productLoading = ref(false)
    const productQuotes = ref([])
    const agentProductPrices = ref([])

    // 表单验证规则
    const rules = {
      orderDate: [{ required: true, message: '请选择下单日期', trigger: 'change' }],
      orderStatus: [{ required: true, message: '请选择订单状态', trigger: 'change' }],
      paymentStatus: [{ required: true, message: '请选择支付状态', trigger: 'change' }],
      passportId: [{ required: true, message: '请选择客户', trigger: 'change' }],
      agentId: [{ required: true, message: '请选择代理商', trigger: 'change' }]
    }

    // 获取订单详情
    const fetchOrderDetail = async () => {
      const orderId = route.params.id
      if (!orderId) {
        ElMessage.error('订单ID不能为空')
        router.push({ name: 'OrderList' })
        return
      }

      loading.value = true
      try {
        const response = await axios.get(`/api/orders/${orderId}`)
        const orderData = response.data
        
        // 转换订单项目数据
        const orderItems = orderData.orderItems.map(item => ({
          id: item.id,
          productId: item.productId,
          productQuoteId: item.productQuoteId,
          agentProductPriceId: item.agentProductPriceId,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
          remarks: item.remarks
        }))

        // 设置表单数据
        orderForm.value = {
          id: orderData.id,
          orderNo: orderData.orderNo,
          orderDate: orderData.orderDate,
          orderStatus: orderData.orderStatus,
          paymentStatus: orderData.paymentStatus,
          totalAmount: orderData.totalAmount,
          passportId: orderData.passportId,
          agentId: orderData.agentId,
          remarks: orderData.remarks,
          orderItems: orderItems
        }

        // 加载相关数据
        await Promise.all([
          loadPassport(orderData.passportId),
          loadAgent(orderData.agentId),
          loadProductData(orderItems)
        ])
      } catch (error) {
        console.error('获取订单详情失败:', error)
        ElMessage.error('获取订单详情失败')
        router.push({ name: 'OrderList' })
      } finally {
        loading.value = false
      }
    }

    // 加载客户数据
    const loadPassport = async (passportId) => {
      try {
        const response = await axios.get(`/api/passports/${passportId}`)
        passportOptions.value = [response.data]
      } catch (error) {
        console.error('加载客户数据失败:', error)
      }
    }

    // 加载代理商数据
    const loadAgent = async (agentId) => {
      try {
        const response = await axios.get(`/api/agents/${agentId}`)
        agentOptions.value = [response.data]
      } catch (error) {
        console.error('加载代理商数据失败:', error)
      }
    }

    // 加载产品相关数据
    const loadProductData = async (orderItems) => {
      try {
        // 获取所有产品ID
        const productIds = orderItems.map(item => item.productId).filter(Boolean)
        if (productIds.length === 0) return

        // 加载产品数据
        const productResponse = await axios.get('/api/products', {
          params: { ids: productIds.join(',') }
        })
        productOptions.value = productResponse.data.data

        // 加载产品报价数据
        const quoteIds = orderItems.map(item => item.productQuoteId).filter(Boolean)
        if (quoteIds.length > 0) {
          const quoteResponse = await axios.get('/api/product-quotes', {
            params: { ids: quoteIds.join(',') }
          })
          productQuotes.value = quoteResponse.data.data
        }

        // 加载代理商价格数据
        const agentPriceIds = orderItems.map(item => item.agentProductPriceId).filter(Boolean)
        if (agentPriceIds.length > 0) {
          const agentPriceResponse = await axios.get('/api/agent-product-prices', {
            params: { ids: agentPriceIds.join(',') }
          })
          agentProductPrices.value = agentPriceResponse.data.data
        }
      } catch (error) {
        console.error('加载产品数据失败:', error)
      }
    }

    // 搜索客户
    const searchPassports = debounce(async (query) => {
      if (query.length < 2) return
      passportLoading.value = true
      try {
        const response = await axios.get('/api/passports', {
          params: { search: query, limit: 10 }
        })
        passportOptions.value = response.data.data
      } catch (error) {
        console.error('搜索客户失败:', error)
      } finally {
        passportLoading.value = false
      }
    }, 500)

    // 搜索代理商
    const searchAgents = debounce(async (query) => {
      if (query.length < 2) return
      agentLoading.value = true
      try {
        const response = await axios.get('/api/agents', {
          params: { search: query, limit: 10 }
        })
        agentOptions.value = response.data.data
      } catch (error) {
        console.error('搜索代理商失败:', error)
      } finally {
        agentLoading.value = false
      }
    }, 500)

    // 搜索产品
    const searchProducts = debounce(async (query) => {
      if (query.length < 2) return
      productLoading.value = true
      try {
        const response = await axios.get('/api/products', {
          params: { search: query, limit: 10 }
        })
        productOptions.value = response.data.data
      } catch (error) {
        console.error('搜索产品失败:', error)
      } finally {
        productLoading.value = false
      }
    }, 500)

    // 获取产品报价选项
    const getQuoteOptions = (productId) => {
      if (!productId) return []
      return productQuotes.value.filter(quote => quote.productId === productId)
    }

    // 获取代理商价格选项
    const getAgentPriceOptions = (quoteId) => {
      if (!quoteId || !orderForm.value.agentId) return []
      return agentProductPrices.value.filter(
        price => price.productQuoteId === quoteId && price.agentId === orderForm.value.agentId
      )
    }

    // 处理产品变更
    const handleProductChange = async (item) => {
      item.productQuoteId = null
      item.agentProductPriceId = null
      item.unitPrice = 0
      item.subtotal = 0

      if (!item.productId) return

      try {
        // 加载产品报价
        const response = await axios.get('/api/product-quotes', {
          params: { productId: item.productId }
        })
        const quotes = response.data.data
        
        // 更新产品报价列表
        productQuotes.value = [
          ...productQuotes.value.filter(q => q.productId !== item.productId),
          ...quotes
        ]
      } catch (error) {
        console.error('加载产品报价失败:', error)
      }
    }

    // 处理报价变更
    const handleQuoteChange = async (item) => {
      item.agentProductPriceId = null
      item.unitPrice = 0
      item.subtotal = 0

      if (!item.productQuoteId || !orderForm.value.agentId) return

      try {
        // 加载代理商价格
        const response = await axios.get('/api/agent-product-prices', {
          params: {
            productQuoteId: item.productQuoteId,
            agentId: orderForm.value.agentId
          }
        })
        const prices = response.data.data
        
        // 更新代理商价格列表
        agentProductPrices.value = [
          ...agentProductPrices.value.filter(p => 
            p.productQuoteId !== item.productQuoteId || p.agentId !== orderForm.value.agentId
          ),
          ...prices
        ]
      } catch (error) {
        console.error('加载代理商价格失败:', error)
      }
    }

    // 处理代理商价格变更
    const handleAgentPriceChange = (item) => {
      if (!item.agentProductPriceId) return
      
      const agentPrice = agentProductPrices.value.find(p => p.id === item.agentProductPriceId)
      if (agentPrice) {
        item.unitPrice = agentPrice.sellingPrice
        calculateSubtotal(item)
      }
    }

    // 计算小计
    const calculateSubtotal = (item) => {
      item.subtotal = parseFloat((item.unitPrice * item.quantity).toFixed(2))
      calculateTotal()
    }

    // 计算总金额
    const calculateTotal = () => {
      if (!orderForm.value || !orderForm.value.orderItems) return
      
      const total = orderForm.value.orderItems.reduce(
        (sum, item) => sum + (item.subtotal || 0),
        0
      )
      orderForm.value.totalAmount = parseFloat(total.toFixed(2))
    }

    // 添加订单项目
    const addOrderItem = () => {
      if (!orderForm.value) return
      
      orderForm.value.orderItems.push({
        productId: null,
        productQuoteId: null,
        agentProductPriceId: null,
        unitPrice: 0,
        quantity: 1,
        subtotal: 0,
        remarks: ''
      })
    }

    // 移除订单项目
    const removeOrderItem = (index) => {
      orderForm.value.orderItems.splice(index, 1)
      calculateTotal()
    }

    // 返回上一页
    const goBack = () => {
      router.back()
    }

    // 保存订单
    const handleSave = async () => {
      if (!formRef.value) return
      
      try {
        await formRef.value.validate()
        
        // 验证订单项目
        if (orderForm.value.orderItems.length === 0) {
          ElMessage.warning('请至少添加一个订单项目')
          return
        }
        
        for (const item of orderForm.value.orderItems) {
          if (!item.productId || !item.unitPrice || item.unitPrice <= 0) {
            ElMessage.warning('请完善订单项目信息')
            return
          }
        }
        
        saving.value = true
        
        // 提交更新
        await axios.put(`/api/orders/${orderForm.value.id}`, orderForm.value)
        
        ElMessage.success('订单更新成功')
        router.push({ name: 'OrderDetail', params: { id: orderForm.value.id } })
      } catch (error) {
        console.error('保存订单失败:', error)
        ElMessage.error('保存订单失败: ' + (error.response?.data?.message || error.message))
      } finally {
        saving.value = false
      }
    }

    // 监听代理商变化
    watch(() => orderForm.value?.agentId, (newAgentId, oldAgentId) => {
      if (newAgentId !== oldAgentId && orderForm.value) {
        // 清空所有订单项的代理商价格
        orderForm.value.orderItems.forEach(item => {
          item.agentProductPriceId = null
          item.unitPrice = 0
          item.subtotal = 0
        })
        calculateTotal()
      }
    })

    onMounted(() => {
      fetchOrderDetail()
    })

    return {
      formRef,
      loading,
      saving,
      orderForm,
      rules,
      passportOptions,
      passportLoading,
      agentOptions,
      agentLoading,
      productOptions,
      productLoading,
      searchPassports,
      searchAgents,
      searchProducts,
      getQuoteOptions,
      getAgentPriceOptions,
      handleProductChange,
      handleQuoteChange,
      handleAgentPriceChange,
      calculateSubtotal,
      addOrderItem,
      removeOrderItem,
      goBack,
      handleSave
    }
  }
}
</script>

<style scoped>
.order-edit-container {
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

.edit-card {
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