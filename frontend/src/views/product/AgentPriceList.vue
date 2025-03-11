<template>
  <div class="agent-price-list-container">
    <div class="agent-price-list-header">
      <h2>代理产品价格管理</h2>
      <el-button type="primary" @click="handleAddAgentPrice">新增代理价格</el-button>
    </div>

    <el-card class="info-container">
      <el-descriptions title="产品报价信息" :column="2" border>
        <el-descriptions-item label="产品名称">{{ quoteInfo.productName }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ quoteInfo.supplierName }}</el-descriptions-item>
        <el-descriptions-item label="成本价格">{{ quoteInfo.costPrice ? `${quoteInfo.costPrice.toFixed(2)} 元` : '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ quoteInfo.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="table-container">
      <el-table
        v-loading="loading"
        :data="agentPriceList"
        border
        style="width: 100%"
      >
        <el-table-column prop="agentName" label="代理名称" width="150" />
        <el-table-column prop="costPrice" label="成本价格" width="120">
          <template #default="scope">
            {{ scope.row.costPrice.toFixed(2) }} 元
          </template>
        </el-table-column>
        <el-table-column prop="salePrice" label="销售价格" width="120">
          <template #default="scope">
            {{ scope.row.salePrice.toFixed(2) }} 元
          </template>
        </el-table-column>
        <el-table-column prop="profit" label="利润" width="120">
          <template #default="scope">
            {{ (scope.row.salePrice - scope.row.costPrice).toFixed(2) }} 元
          </template>
        </el-table-column>
        <el-table-column prop="profitRate" label="利润率" width="120">
          <template #default="scope">
            {{ ((scope.row.salePrice - scope.row.costPrice) / scope.row.costPrice * 100).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEditAgentPrice(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDeleteAgentPrice(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div v-if="agentPriceList.length === 0" class="empty-data">
        <el-empty description="暂无代理价格信息" />
      </div>
    </el-card>

    <!-- 代理价格表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="代理" prop="agentId">
          <el-select
            v-model="form.agentId"
            placeholder="请选择代理"
            filterable
            @change="handleAgentChange"
          >
            <el-option
              v-for="item in agentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="成本价格" prop="costPrice">
          <el-input-number
            v-model="form.costPrice"
            :precision="2"
            :step="0.1"
            :min="0"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="销售价格" prop="salePrice">
          <el-input-number
            v-model="form.salePrice"
            :precision="2"
            :step="0.1"
            :min="0"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注信息"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProductDetail } from '@/api/product'
import { getAgentProductPrices, createAgentProductPrice, updateAgentProductPrice, deleteAgentProductPrice } from '@/api/product'

export default {
  name: 'AgentPriceList',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const loading = ref(false)
    const submitLoading = ref(false)
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const quoteInfo = reactive({
      id: null,
      productId: null,
      productName: '',
      supplierId: null,
      supplierName: '',
      costPrice: 0,
      remark: ''
    })
    const agentPriceList = ref([])
    const agentOptions = ref([])

    // 对话框标题
    const dialogTitle = computed(() => {
      return isEdit.value ? '编辑代理价格' : '新增代理价格'
    })

    // 表单数据
    const form = reactive({
      id: null,
      quoteId: null,
      agentId: null,
      agentName: '',
      costPrice: 0,
      salePrice: 0,
      remark: ''
    })

    // 表单验证规则
    const rules = {
      agentId: [{ required: true, message: '请选择代理', trigger: 'change' }],
      costPrice: [{ required: true, message: '请输入成本价格', trigger: 'blur' }],
      salePrice: [{ required: true, message: '请输入销售价格', trigger: 'blur' }]
    }

    // 获取报价详情
    const getQuoteDetail = (id) => {
      loading.value = true
      // 模拟API请求，实际项目中应该调用后端API
      setTimeout(() => {
        // 模拟数据
        Object.assign(quoteInfo, {
          id: id,
          productId: 1,
          productName: '日本东京5日游',
          supplierId: 2,
          supplierName: '供应商B',
          costPrice: 1999.99,
          remark: '这是一个备注'
        })
        loading.value = false
      }, 500)
    }

    // 获取代理价格列表
    const getAgentPrices = (quoteId) => {
      loading.value = true
      getAgentProductPrices(quoteId)
        .then(response => {
          agentPriceList.value = response.data || []
        })
        .catch(error => {
          console.error('获取代理价格列表失败', error)
          ElMessage.error('获取代理价格列表失败')
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 获取代理列表
    const getAgentList = () => {
      // 模拟API请求，实际项目中应该调用后端API
      agentOptions.value = [
        { id: 1, name: '代理A' },
        { id: 2, name: '代理B' },
        { id: 3, name: '代理C' }
      ]
    }

    // 处理代理变更
    const handleAgentChange = (value) => {
      const agent = agentOptions.value.find(item => item.id === value)
      if (agent) {
        form.agentName = agent.name
      }
    }

    // 新增代理价格
    const handleAddAgentPrice = () => {
      isEdit.value = false
      resetForm()
      form.quoteId = quoteInfo.id
      form.costPrice = quoteInfo.costPrice
      form.salePrice = quoteInfo.costPrice * 1.2 // 默认加价20%
      dialogVisible.value = true
    }

    // 编辑代理价格
    const handleEditAgentPrice = (row) => {
      isEdit.value = true
      resetForm()
      Object.assign(form, row)
      dialogVisible.value = true
    }

    // 删除代理价格
    const handleDeleteAgentPrice = (row) => {
      ElMessageBox.confirm('确认删除该代理价格吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAgentProductPrice(row.id)
            .then(() => {
              ElMessage.success('删除成功')
              getAgentPrices(quoteInfo.id)
            })
            .catch(error => {
              console.error('删除代理价格失败', error)
              ElMessage.error('删除代理价格失败')
            })
        })
        .catch(() => {
          // 取消删除
        })
    }

    // 重置表单
    const resetForm = () => {
      form.id = null
      form.quoteId = null
      form.agentId = null
      form.agentName = ''
      form.costPrice = 0
      form.salePrice = 0
      form.remark = ''
    }

    // 提交表单
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          submitLoading.value = true
          const request = isEdit.value
            ? updateAgentProductPrice(form.id, form)
            : createAgentProductPrice(form.quoteId, form)
          
          request
            .then(() => {
              ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
              dialogVisible.value = false
              getAgentPrices(quoteInfo.id)
            })
            .catch(error => {
              console.error(isEdit.value ? '修改代理价格失败' : '添加代理价格失败', error)
              ElMessage.error(isEdit.value ? '修改代理价格失败' : '添加代理价格失败')
            })
            .finally(() => {
              submitLoading.value = false
            })
        } else {
          return false
        }
      })
    }

    // 返回
    const goBack = () => {
      router.push(`/product/detail/${quoteInfo.productId}`)
    }

    onMounted(() => {
      getAgentList()

      if (route.params.id) {
        const quoteId = route.params.id
        getQuoteDetail(quoteId)
        getAgentPrices(quoteId)
      }
    })

    return {
      formRef,
      loading,
      submitLoading,
      dialogVisible,
      dialogTitle,
      isEdit,
      quoteInfo,
      agentPriceList,
      agentOptions,
      form,
      rules,
      handleAgentChange,
      handleAddAgentPrice,
      handleEditAgentPrice,
      handleDeleteAgentPrice,
      submitForm,
      goBack
    }
  }
}
</script>

<style scoped>
.agent-price-list-container {
  padding: 20px;
}

.agent-price-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.info-container {
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 20px;
}

.empty-data {
  padding: 30px 0;
}
</style> 