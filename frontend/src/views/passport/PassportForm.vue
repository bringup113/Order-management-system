<template>
  <div class="passport-form-container">
    <div class="passport-form-header">
      <h2>{{ isEdit ? '编辑护照' : '新增护照' }}</h2>
    </div>

    <el-card class="form-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户姓名" />
        </el-form-item>

        <el-form-item label="护照号码" prop="passport_no">
          <el-input v-model="form.passport_no" placeholder="请输入护照号码" />
        </el-form-item>

        <el-form-item label="国籍" prop="nationality">
          <el-input v-model="form.nationality" placeholder="请输入国籍" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="出生日期" prop="birth_date">
          <el-date-picker
            v-model="form.birth_date"
            type="date"
            placeholder="选择出生日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="签发日期" prop="issue_date">
          <el-date-picker
            v-model="form.issue_date"
            type="date"
            placeholder="选择签发日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="有效期至" prop="expiry_date">
          <el-date-picker
            v-model="form.expiry_date"
            type="date"
            placeholder="选择有效期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="form.remarks"
            type="textarea"
            placeholder="请输入备注信息"
            :rows="3"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
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
import { getPassportDetail, createPassport, updatePassport } from '@/api/passport'

export default {
  name: 'PassportForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const loading = ref(false)

    // 判断是否为编辑模式
    const isEdit = computed(() => {
      return route.name === 'PassportEdit'
    })

    // 表单数据
    const form = reactive({
      id: null,
      name: '',
      passport_no: '',
      nationality: '',
      gender: 'male',
      birth_date: '',
      issue_date: '',
      expiry_date: '',
      remarks: ''
    })

    // 表单验证规则
    const rules = {
      name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
      passport_no: [{ required: true, message: '请输入护照号码', trigger: 'blur' }],
      nationality: [{ required: true, message: '请输入国籍', trigger: 'blur' }],
      gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
      birth_date: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
      issue_date: [{ required: true, message: '请选择签发日期', trigger: 'change' }],
      expiry_date: [{ required: true, message: '请选择有效期', trigger: 'change' }]
    }

    // 获取护照详情
    const getDetail = (id) => {
      loading.value = true
      getPassportDetail(id)
        .then(response => {
          Object.assign(form, response.data)
        })
        .catch(error => {
          console.error('获取护照详情失败', error)
          ElMessage.error('获取护照详情失败')
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
            ? updatePassport(form.id, form)
            : createPassport(form)
          
          request
            .then(() => {
              ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
              router.push('/passport/list')
            })
            .catch(error => {
              console.error(isEdit.value ? '修改护照失败' : '添加护照失败', error)
              ElMessage.error(isEdit.value ? '修改护照失败' : '添加护照失败')
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
      router.push('/passport/list')
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
.passport-form-container {
  padding: 20px;
}

.passport-form-header {
  margin-bottom: 20px;
}

.form-container {
  max-width: 800px;
}
</style> 