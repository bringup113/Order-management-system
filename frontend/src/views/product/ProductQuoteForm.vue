<template>
  <div class="product-quote-form-container">
    <div class="product-quote-form-header">
      <h2>{{ isEdit ? '编辑产品报价' : '新增产品报价' }}</h2>
    </div>

    <el-card class="form-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="产品信息" v-if="!productId">
          <el-select
            v-model="form.productId"
            placeholder="请选择产品"
            filterable
            remote
            :remote-method="searchProducts"
            :loading="productLoading"
          >
            <el-option
              v-for="item in productOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="供应商" prop="supplierId">
          <el-select
            v-model="form.supplierId"
            placeholder="请选择供应商"
            filterable
            @change="handleSupplierChange"
          >
            <el-option
              v-for="item in supplierOptions"
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

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注信息"
            :rows="3"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductDetail } from '@/api/product'
import { createProductQuote, updateProductQuote } from '@/api/product'

export default {
  name: 'ProductQuoteForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const loading = ref(false)
    const productLoading = ref(false)
    const productOptions = ref([])
    const supplierOptions = ref([])
    const productInfo = ref({})

    // 获取URL中的产品ID参数
    const productId = computed(() => {
      return route.query.productId
    })

    // 判断是否为编辑模式
    const isEdit = computed(() => {
      return route.name === 'ProductQuoteEdit'
    })

    // 表单数据
    const form = reactive({
      id: null,
      productId: productId.value || null,
      supplierId: null,
      supplierName: '',
      costPrice: 0,
      remark: ''
    })

    // 表单验证规则
    const rules = {
      productId: [{ required: true, message: '请选择产品', trigger: 'change' }],
      supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
      costPrice: [{ required: true, message: '请输入成本价格', trigger: 'blur' }]
    }

    // 搜索产品
    const searchProducts = (query) => {
      if (query) {
        productLoading.value = true
        // 模拟API请求，实际项目中应该调用后端API
        setTimeout(() => {
          productOptions.value = [
            { id: 1, name: '日本东京5日游' },
            { id: 2, name: '泰国曼谷7日游' },
            { id: 3, name: '法国巴黎8日游' }
          ].filter(item => item.name.includes(query))
          productLoading.value = false
        }, 500)
      } else {
        productOptions.value = []
      }
    }

    // 获取产品详情
    const getProductInfo = (id) => {
      loading.value = true
      getProductDetail(id)
        .then(response => {
          productInfo.value = response.data
        })
        .catch(error => {
          console.error('获取产品详情失败', error)
          ElMessage.error('获取产品详情失败')
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 获取供应商列表
    const getSupplierList = () => {
      // 模拟API请求，实际项目中应该调用后端API
      supplierOptions.value = [
        { id: 1, name: '供应商A' },
        { id: 2, name: '供应商B' },
        { id: 3, name: '供应商C' }
      ]
    }

    // 处理供应商变更
    const handleSupplierChange = (value) => {
      const supplier = supplierOptions.value.find(item => item.id === value)
      if (supplier) {
        form.supplierName = supplier.name
      }
    }

    // 获取报价详情
    const getQuoteDetail = (id) => {
      loading.value = true
      // 模拟API请求，实际项目中应该调用后端API
      setTimeout(() => {
        // 模拟数据
        const quoteDetail = {
          id: 1,
          productId: 1,
          supplierId: 2,
          supplierName: '供应商B',
          costPrice: 1999.99,
          remark: '这是一个备注'
        }
        Object.assign(form, quoteDetail)
        loading.value = false
      }, 500)
    }

    // 提交表单
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          loading.value = true
          const request = isEdit.value
            ? updateProductQuote(form.id, form)
            : createProductQuote(form.productId, form)
          
          request
            .then(() => {
              ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
              if (productId.value) {
                router.push(`/product/detail/${productId.value}`)
              } else {
                router.push('/product/list')
              }
            })
            .catch(error => {
              console.error(isEdit.value ? '修改报价失败' : '添加报价失败', error)
              ElMessage.error(isEdit.value ? '修改报价失败' : '添加报价失败')
            })
            .finally(() => {
              loading.value = false
            })
        } else {
          return false
        }
      })
    }

    // 取消
    const cancel = () => {
      if (productId.value) {
        router.push(`/product/detail/${productId.value}`)
      } else {
        router.push('/product/list')
      }
    }

    onMounted(() => {
      getSupplierList()

      if (productId.value) {
        getProductInfo(productId.value)
      }

      if (isEdit.value && route.params.id) {
        getQuoteDetail(route.params.id)
      }
    })

    return {
      formRef,
      form,
      rules,
      loading,
      productLoading,
      productOptions,
      supplierOptions,
      productId,
      isEdit,
      searchProducts,
      handleSupplierChange,
      submitForm,
      cancel
    }
  }
}
</script>

<style scoped>
.product-quote-form-container {
  padding: 20px;
}

.product-quote-form-header {
  margin-bottom: 20px;
}

.form-container {
  max-width: 800px;
}
</style> 