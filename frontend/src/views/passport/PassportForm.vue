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
import { ref, reactive, computed, onMounted, watch } from 'vue'
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

    // 重置表单数据
    const resetForm = () => {
      Object.assign(form, {
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
    }

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
      console.log('开始获取护照详情，ID:', id)
      
      // 重置表单数据，避免显示上一个护照的信息
      resetForm()
      
      loading.value = true
      getPassportDetail(id)
        .then(response => {
          console.log('获取到的护照详情:', response);
          if (response && response.id) {
            // 将响应数据赋值给表单，直接使用snake_case字段名
            form.id = response.id;
            form.name = response.name;
            form.passport_no = response.passport_no;
            form.nationality = response.nationality;
            form.gender = response.gender;
            form.birth_date = response.birth_date;
            form.issue_date = response.issue_date;
            form.expiry_date = response.expiry_date;
            form.remarks = response.remarks;
            console.log('表单数据已更新:', form);
          } else {
            console.error('获取护照详情失败: 响应数据为空');
            ElMessage.error('获取护照详情失败: 响应数据为空');
          }
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
         
         // 直接使用表单数据
         console.log('提交的表单数据:', form)
         
         // 检查是否为编辑模式且有有效的ID
         if (isEdit.value && !form.id) {
           console.error('编辑模式下护照ID为空，尝试从路由参数获取')
           form.id = route.params.id ? parseInt(route.params.id, 10) : null
         }
         
         const request = isEdit.value && form.id
           ? updatePassport(form.id, form)
           : createPassport(form);
         
         request
           .then((response) => {
             console.log('保存成功，响应数据:', response)
             ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
             
             // 添加短暂延迟，确保后端数据更新完成
             setTimeout(() => {
               // 获取护照ID，新增时从响应中获取，编辑时使用表单中的ID
               const passportId = isEdit.value ? form.id : (response.id || response.data?.id)
               
               // 清除可能存在的签证编辑标记
               sessionStorage.removeItem('fromVisaEdit');
               
               // 无论是新增还是编辑，都跳转到护照详情页
               router.push(`/customer/passport/detail/${passportId}`)
             }, 500)
           })
           .catch(error => {
             console.error(isEdit.value ? '修改护照失败' : '添加护照失败', error)
             // 添加更详细的错误日志
             if (error.response) {
               console.error('错误响应数据:', error.response.data)
               console.error('错误状态码:', error.response.status)
               
               // 显示验证错误的详细信息
               if (error.response.data && error.response.data.errors) {
                 console.error('验证错误详情:', error.response.data.errors)
                 // 显示每个字段的验证错误
                 error.response.data.errors.forEach(err => {
                   console.error(`字段 ${err.field || err.param}: ${err.message}`)
                 })
                 
                 // 显示第一个验证错误作为提示
                 if (error.response.data.errors.length > 0) {
                   const firstError = error.response.data.errors[0]
                   ElMessage.error(firstError.message || '表单数据验证失败')
                 } else {
                   ElMessage.error(error.response.data.message || '表单数据验证失败')
                 }
               } else if (error.response.data && error.response.data.message) {
                 ElMessage.error(error.response.data.message)
               } else {
                 ElMessage.error(isEdit.value ? '修改护照失败' : '添加护照失败')
               }
             } else {
               console.error('错误详情:', error.message)
               ElMessage.error(isEdit.value ? '修改护照失败' : '添加护照失败')
             }
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
      router.push('/customer/passport/list')
    }

    onMounted(() => {
      if (isEdit.value && route.params.id) {
        getDetail(route.params.id)
      } else {
        // 如果是新增模式，确保表单是空的
        resetForm()
      }
    })

    // 监听路由变化，当从编辑页面切换到新增页面时重置表单
    watch(() => route.name, (newRouteName) => {
      if (newRouteName === 'PassportCreate') {
        resetForm()
      }
    })

    // 监听路由参数ID变化，当编辑不同护照时重新获取数据
    watch(() => route.params.id, (newId, oldId) => {
      if (isEdit.value && newId && newId !== oldId) {
        console.log('护照ID变化，重新获取数据:', newId);
        getDetail(newId);
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