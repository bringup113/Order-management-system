<template>
  <div class="supplier-form-container">
    <div class="supplier-form-header">
      <h2>{{ isEdit ? '编辑供应商' : '新增供应商' }}</h2>
    </div>

    <el-card class="form-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入供应商名称" />
        </el-form-item>

        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人姓名" />
        </el-form-item>

        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮箱" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
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
import { getSupplierDetail, createSupplier, updateSupplier } from '@/api/supplier'

export default {
  name: 'SupplierForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const loading = ref(false)

    // 判断是否为编辑模式
    const isEdit = computed(() => {
      return route.name === 'SupplierEdit'
    })

    // 表单数据
    const form = reactive({
      id: null,
      name: '',
      contactPerson: '',
      contactPhone: '',
      email: '',
      address: '',
      status: 'active',
      remark: ''
    })

    // 表单验证规则
    const rules = {
      name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
      contactPerson: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
      contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
      email: [
        { required: true, message: '请输入电子邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      status: [{ required: true, message: '请选择状态', trigger: 'change' }]
    }

    // 获取供应商详情
    const getDetail = (id) => {
      loading.value = true
      getSupplierDetail(id)
        .then(response => {
          Object.assign(form, response.data)
        })
        .catch(error => {
          console.error('获取供应商详情失败', error)
          ElMessage.error('获取供应商详情失败')
          // 使用模拟数据
          const supplierDetail = {
            id: id,
            name: '东京旅行社',
            contactPerson: '张三',
            contactPhone: '13800138000',
            email: 'zhangsan@example.com',
            address: '东京都新宿区西新宿1-1-1',
            status: 'active',
            remark: '这是一个备注'
          }
          Object.assign(form, supplierDetail)
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
            ? updateSupplier(form.id, form)
            : createSupplier(form)
          
          request
            .then(() => {
              ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
              router.push('/supplier/list')
            })
            .catch(error => {
              console.error(isEdit.value ? '修改供应商失败' : '添加供应商失败', error)
              ElMessage.error(isEdit.value ? '修改供应商失败' : '添加供应商失败')
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
      router.push('/supplier/list')
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
.supplier-form-container {
  padding: 20px;
}

.supplier-form-header {
  margin-bottom: 20px;
}

.form-container {
  max-width: 800px;
}
</style> 