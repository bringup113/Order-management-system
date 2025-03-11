<template>
  <div class="product-form-container">
    <div class="product-form-header">
      <h2>{{ isEdit ? '编辑产品' : '新增产品' }}</h2>
    </div>

    <el-card class="form-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入产品名称" />
        </el-form-item>

        <el-form-item label="产品类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择产品类型">
            <el-option label="旅游产品" value="tour" />
            <el-option label="酒店" value="hotel" />
            <el-option label="机票" value="flight" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="产品描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入产品描述" />
        </el-form-item>

        <el-form-item label="产品详情" prop="details">
          <el-input
            v-model="form.details"
            type="textarea"
            placeholder="请输入产品详情"
            :rows="5"
          />
        </el-form-item>

        <el-form-item label="产品状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">上架</el-radio>
            <el-radio label="inactive">下架</el-radio>
          </el-radio-group>
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
import { getProductDetail, createProduct, updateProduct } from '@/api/product'

export default {
  name: 'ProductForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const loading = ref(false)

    // 判断是否为编辑模式
    const isEdit = computed(() => {
      return route.name === 'ProductEdit'
    })

    // 表单数据
    const form = reactive({
      id: null,
      name: '',
      type: 'tour',
      description: '',
      details: '',
      status: 'active',
      remark: ''
    })

    // 表单验证规则
    const rules = {
      name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
      type: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
      description: [{ required: true, message: '请输入产品描述', trigger: 'blur' }],
      status: [{ required: true, message: '请选择产品状态', trigger: 'change' }]
    }

    // 获取产品详情
    const getDetail = (id) => {
      loading.value = true
      getProductDetail(id)
        .then(response => {
          Object.assign(form, response.data)
        })
        .catch(error => {
          console.error('获取产品详情失败', error)
          ElMessage.error('获取产品详情失败')
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 提交表单
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          loading.value = true
          const request = isEdit.value
            ? updateProduct(form.id, form)
            : createProduct(form)
          
          request
            .then(() => {
              ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
              router.push('/product/list')
            })
            .catch(error => {
              console.error(isEdit.value ? '修改产品失败' : '添加产品失败', error)
              ElMessage.error(isEdit.value ? '修改产品失败' : '添加产品失败')
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
      router.push('/product/list')
    }

    onMounted(() => {
      if (isEdit.value && route.params.id) {
        getDetail(route.params.id)
      }
    })

    return {
      formRef,
      form,
      rules,
      loading,
      isEdit,
      submitForm,
      cancel
    }
  }
}
</script>

<style scoped>
.product-form-container {
  padding: 20px;
}

.product-form-header {
  margin-bottom: 20px;
}

.form-container {
  max-width: 800px;
}
</style> 