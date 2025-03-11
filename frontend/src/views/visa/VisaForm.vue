<template>
  <div class="visa-form-container">
    <div class="visa-form-header">
      <h2>{{ isEdit ? '编辑签证' : '新增签证' }}</h2>
    </div>

    <el-card class="form-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="护照信息" v-if="!passportId">
          <el-select
            v-model="form.passportId"
            placeholder="请选择关联护照"
            filterable
            remote
            :remote-method="searchPassports"
            :loading="passportLoading"
          >
            <el-option
              v-for="item in passportOptions"
              :key="item.id"
              :label="`${item.name} (${item.passportNo})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="签证类型" prop="visaType">
          <el-input v-model="form.visaType" placeholder="请输入签证类型" />
        </el-form-item>

        <el-form-item label="签发国家/地区" prop="issueCountry">
          <el-input v-model="form.issueCountry" placeholder="请输入签发国家/地区" />
        </el-form-item>

        <el-form-item label="签发日期" prop="issueDate">
          <el-date-picker
            v-model="form.issueDate"
            type="date"
            placeholder="选择签发日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="有效期至" prop="expiryDate">
          <el-date-picker
            v-model="form.expiryDate"
            type="date"
            placeholder="选择有效期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="入境次数" prop="entryCount">
          <el-radio-group v-model="form.entryCount">
            <el-radio label="single">单次</el-radio>
            <el-radio label="multiple">多次</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="有效" value="valid" />
            <el-option label="过期" value="expired" />
            <el-option label="即将过期" value="expiring" />
          </el-select>
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
          <el-button type="primary" @click="submitForm" :loading="submitLoading">保存</el-button>
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
import { getVisaDetail, createVisa, updateVisa } from '@/api/visa'
import { searchPassports } from '@/api/passport'

export default {
  name: 'VisaForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const submitLoading = ref(false)
    const passportLoading = ref(false)
    const passportOptions = ref([])

    // 获取URL中的护照ID参数
    const passportId = computed(() => {
      return route.query.passportId
    })

    // 判断是否为编辑模式
    const isEdit = computed(() => {
      return route.name === 'VisaEdit'
    })

    // 表单数据
    const form = reactive({
      id: null,
      passportId: passportId.value || null,
      visaType: '',
      issueCountry: '',
      issueDate: '',
      expiryDate: '',
      entryCount: 'single',
      status: 'valid',
      remark: ''
    })

    // 表单验证规则
    const rules = {
      passportId: [{ required: true, message: '请选择关联护照', trigger: 'change' }],
      visaType: [{ required: true, message: '请输入签证类型', trigger: 'blur' }],
      issueCountry: [{ required: true, message: '请输入签发国家/地区', trigger: 'blur' }],
      issueDate: [{ required: true, message: '请选择签发日期', trigger: 'change' }],
      expiryDate: [{ required: true, message: '请选择有效期', trigger: 'change' }],
      entryCount: [{ required: true, message: '请选择入境次数', trigger: 'change' }],
      status: [{ required: true, message: '请选择状态', trigger: 'change' }]
    }

    // 搜索护照
    const searchPassports = (query) => {
      if (query) {
        passportLoading.value = true
        searchPassports({ keyword: query })
          .then(response => {
            passportOptions.value = response.data || []
          })
          .catch(error => {
            console.error('搜索护照失败', error)
            ElMessage.error('搜索护照失败')
          })
          .finally(() => {
            passportLoading.value = false
          })
      } else {
        passportOptions.value = []
      }
    }

    // 获取签证详情
    const getDetail = (id) => {
      submitLoading.value = true
      getVisaDetail(id)
        .then(response => {
          Object.assign(form, response.data)
        })
        .catch(error => {
          console.error('获取签证详情失败', error)
          ElMessage.error('获取签证详情失败')
        })
        .finally(() => {
          submitLoading.value = false
        })
    }

    // 提交表单
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          submitLoading.value = true
          const request = isEdit.value
            ? updateVisa(form.id, form)
            : createVisa(form)
          
          request
            .then(() => {
              ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
              if (passportId.value) {
                router.push(`/customer/passport/detail/${passportId.value}`)
              } else {
                router.push('/customer/visa/list')
              }
            })
            .catch(error => {
              console.error(isEdit.value ? '修改签证失败' : '添加签证失败', error)
              ElMessage.error(isEdit.value ? '修改签证失败' : '添加签证失败')
            })
            .finally(() => {
              submitLoading.value = false
            })
        } else {
          return false
        }
      })
    }

    // 取消
    const cancel = () => {
      if (passportId.value) {
        router.push(`/customer/passport/detail/${passportId.value}`)
      } else {
        router.push('/customer/visa/list')
      }
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
      submitLoading,
      passportLoading,
      passportOptions,
      passportId,
      isEdit,
      searchPassports,
      submitForm,
      cancel
    }
  }
}
</script>

<style scoped>
.visa-form-container {
  padding: 20px;
}

.visa-form-header {
  margin-bottom: 20px;
}

.form-container {
  max-width: 800px;
}
</style> 