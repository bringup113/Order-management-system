<template>
  <div class="visa-form-container">
    <div class="visa-form-header">
      <h2>{{ isEdit ? '编辑签证' : '新增签证' }}</h2>
    </div>

    <el-card class="form-container">
      <!-- 护照信息显示区域 -->
      <div class="passport-info" v-if="passportInfo.id">
        <h3>护照信息</h3>
        <div class="info-row">
          <span class="info-label">客户姓名:</span>
          <span class="info-value">{{ passportInfo.name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">护照号码:</span>
          <span class="info-value">{{ passportInfo.passport_no }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">国籍:</span>
          <span class="info-value">{{ passportInfo.nationality }}</span>
        </div>
        <el-divider />
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="签证类型" prop="visa_type">
          <el-input v-model="form.visa_type" placeholder="请输入签证类型" />
        </el-form-item>

        <el-form-item label="签发国家/地区" prop="issue_country">
          <el-input v-model="form.issue_country" placeholder="请输入签发国家/地区" />
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

        <el-form-item label="入境次数" prop="entry_count">
          <el-radio-group v-model="form.entry_count">
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

        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="form.remarks"
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
import { ref, reactive, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getVisaDetail, createVisa, updateVisa } from '@/api/visa'
import { getPassportDetail } from '@/api/passport'

export default {
  name: 'VisaForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const submitLoading = ref(false)
    
    // 添加一个标志变量，用于控制是否允许重置表单
    const allowResetForm = ref(true)
    
    // 护照信息对象
    const passportInfo = reactive({
      id: null,
      name: '',
      passport_no: '',
      nationality: ''
    })

    // 获取URL中的护照ID参数
    const passportId = computed(() => route.query.passportId)
    
    // 获取URL中的护照信息参数（从护照详情页传递过来的）
    const passportData = computed(() => {
      // 尝试解析URL中的护照数据
      if (route.query.passportData) {
        try {
          return JSON.parse(decodeURIComponent(route.query.passportData))
        } catch (e) {
          console.log('解析护照数据失败')
          return null
        }
      }
      return null
    })

    // 判断是否为编辑模式
    const isEdit = computed(() => route.name === 'VisaEdit')

    // 表单数据
    const form = reactive({
      id: null,
      passport_id: passportId.value ? parseInt(passportId.value, 10) : null,
      visa_type: '',
      issue_country: '',
      issue_date: '',
      expiry_date: '',
      entry_count: 'single',
      status: 'valid',
      remarks: ''
    })

    // 表单验证规则
    const rules = {
      visa_type: [{ required: true, message: '请输入签证类型', trigger: 'blur' }],
      issue_country: [{ required: true, message: '请输入签发国家/地区', trigger: 'blur' }],
      issue_date: [{ required: true, message: '请选择签发日期', trigger: 'change' }],
      expiry_date: [{ required: true, message: '请选择有效期', trigger: 'change' }],
      entry_count: [{ required: true, message: '请选择入境次数', trigger: 'change' }],
      status: [{ required: true, message: '请选择状态', trigger: 'change' }]
    }

    // 设置默认的护照信息（当护照不存在时）
    const setDefaultPassportInfo = (id) => {
      if (!id) {
        console.error('设置默认护照信息失败: ID为空')
        return
      }
      
      // 确保护照ID是数字类型
      const passportId = parseInt(id, 10)
      
      Object.assign(passportInfo, {
        id: passportId,
        name: '(未能获取客户姓名)',
        passport_no: '(未能获取护照号码)',
        nationality: '(未能获取国籍)'
      })
      
      console.log('设置默认护照信息:', passportInfo)
    }

    // 使用URL传递的护照数据填充护照信息
    const fillPassportInfoFromUrl = () => {
      console.log('尝试从URL获取护照数据:', passportData.value)
      if (passportData.value) {
        console.log('从URL获取到护照数据:', passportData.value)
        
        // 确保护照ID是数字类型
        const passportId = passportData.value.id ? parseInt(passportData.value.id, 10) : null
        
        if (!passportId) {
          console.error('护照数据中的ID无效:', passportData.value.id)
          return false
        }
        
        // 填充护照信息
        Object.assign(passportInfo, {
          id: passportId,
          name: passportData.value.name || '(未能获取客户姓名)',
          passport_no: passportData.value.passport_no || '(未能获取护照号码)',
          nationality: passportData.value.nationality || '(未能获取国籍)'
        })
        
        console.log('护照信息已从URL填充:', passportInfo)
        
        // 同时确保表单中的护照ID也被设置
        form.passport_id = passportId
        console.log('表单中的护照ID已设置:', form.passport_id)
        
        return true
      }
      
      console.log('URL中没有护照数据')
      return false
    }

    // 获取护照详情
    const fetchPassportInfo = async (id) => {
      if (!id) {
        console.error('获取护照信息失败: 护照ID为空')
        return
      }
      
      console.log('开始获取护照信息，ID:', id)
      
      // 先设置默认值，避免显示错误
      setDefaultPassportInfo(id)
      
      try {
        const response = await getPassportDetail(id)
        console.log('获取到的护照信息:', response)
        if (response && response.id) {
          Object.assign(passportInfo, {
            id: response.id,
            name: response.name || '未知',
            passport_no: response.passport_no || '未知',
            nationality: response.nationality || '未知'
          })
          console.log('护照信息已更新:', passportInfo)
        } else {
          console.error('获取护照信息失败: 响应数据无效')
        }
      } catch (error) {
        // 不显示错误提示，只在控制台记录
        console.error('获取护照信息失败，ID:', id, '错误:', error)
        if (error.response) {
          console.error('错误状态码:', error.response.status)
          console.error('错误数据:', error.response.data)
        }
      }
    }

    // 获取签证详情
    const fetchVisaDetail = async (id) => {
      if (!id) {
        console.error('获取签证详情失败: 签证ID为空')
        return
      }
      
      console.log('开始获取签证详情，ID:', id)
      submitLoading.value = true
      
      // 重置表单，但不重置护照信息
      resetForm(false)
      console.log('表单已重置，但保留护照信息')
      
      // 如果URL中已经包含了护照信息，先填充它，避免闪烁
      const hasPassportDataInUrl = fillPassportInfoFromUrl()
      console.log('URL中是否包含护照数据:', hasPassportDataInUrl)
      
      try {
        const response = await getVisaDetail(id)
        console.log('获取到的签证详情:', response)
        
        if (response) {
          // 更新表单数据
          updateFormData(response)
          console.log('表单数据已更新:', form)
          
          // 获取关联的护照信息
          if (form.passport_id) {
            console.log('签证关联的护照ID:', form.passport_id)
            
            // 如果URL中已经包含了护照信息，直接使用，不再请求
            if (!hasPassportDataInUrl) {
              console.log('URL中没有护照数据，尝试从签证详情中获取护照信息')
              
              // 如果签证数据中包含护照信息，直接使用
              if (response.passport && response.passport.id) {
                console.log('签证详情中包含护照信息:', response.passport)
                updatePassportInfo(response.passport)
              } else {
                // 否则尝试获取护照信息
                console.log('签证详情中不包含护照信息，尝试获取护照信息')
                await fetchPassportInfo(form.passport_id)
              }
            } else {
              console.log('使用URL中的护照数据，不再请求护照信息')
            }
          } else if (passportId.value) {
            // 如果表单中没有护照ID，但URL中有，则使用URL中的
            console.log('表单中没有护照ID，使用URL中的护照ID:', passportId.value)
            form.passport_id = parseInt(passportId.value, 10)
            
            if (!hasPassportDataInUrl) {
              console.log('URL中没有护照数据，尝试获取护照信息')
              await fetchPassportInfo(form.passport_id)
            }
          } else {
            console.warn('没有找到关联的护照ID')
          }
        } else {
          console.error('获取签证详情失败: 响应数据无效')
          ElMessage.error('获取签证详情失败: 响应数据无效')
        }
      } catch (error) {
        console.error('获取签证详情失败', error)
        if (error.response) {
          console.error('错误状态码:', error.response.status)
          console.error('错误数据:', error.response.data)
        }
        ElMessage.error('获取签证详情失败')
      } finally {
        submitLoading.value = false
      }
    }
    
    // 重置表单和护照信息
    const resetForm = (resetPassportInfo = true) => {
      // 如果不允许重置表单，则直接返回
      if (!allowResetForm.value) {
        console.log('表单重置被禁止，跳过重置操作')
        return
      }
      
      console.log('执行表单重置操作，resetPassportInfo:', resetPassportInfo)
      
      // 重置表单数据
      Object.assign(form, {
        id: null,
        passport_id: null,
        visa_type: '',
        issue_country: '',
        issue_date: '',
        expiry_date: '',
        entry_count: 'single',
        status: 'valid',
        remarks: ''
      })
      
      // 如果需要重置护照信息，则重置
      if (resetPassportInfo) {
        Object.assign(passportInfo, {
          id: null,
          name: '',
          passport_no: '',
          nationality: ''
        })
      }
    }
    
    // 更新表单数据
    const updateFormData = (data) => {
      form.id = data.id
      form.passport_id = data.passport_id
      form.visa_type = data.visa_type
      form.issue_country = data.issue_country
      form.issue_date = data.issue_date
      form.expiry_date = data.expiry_date
      form.entry_count = data.entry_count
      form.status = data.status
      form.remarks = data.remarks
    }
    
    // 更新护照信息
    const updatePassportInfo = (data) => {
      if (!data || !data.id) {
        console.error('更新护照信息失败: 数据无效', data)
        return
      }
      
      console.log('更新护照信息，原始数据:', data)
      
      // 确保护照ID是数字类型
      const passportId = parseInt(data.id, 10)
      
      passportInfo.id = passportId
      passportInfo.name = data.name || '(未能获取客户姓名)'
      passportInfo.passport_no = data.passport_no || '(未能获取护照号码)'
      passportInfo.nationality = data.nationality || '(未能获取国籍)'
      
      console.log('护照信息已更新:', passportInfo)
    }

    // 提交表单
    const submitForm = () => {
      formRef.value.validate(async (valid) => {
        if (valid) {
          submitLoading.value = true
          
          // 确保护照ID是数字类型
          const formData = { ...form }
          if (formData.passport_id) {
            formData.passport_id = parseInt(formData.passport_id, 10)
          }
          
          try {
            const request = isEdit.value
              ? updateVisa(formData.id, formData)
              : createVisa(formData)
            
            await request
            ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
            
            // 保存成功后立即导航，不执行任何可能导致表单重置的操作
            // 保存护照ID用于导航
            const passportIdForNavigation = formData.passport_id
            navigateBack(passportIdForNavigation)
          } catch (error) {
            ElMessage.error(isEdit.value ? '修改签证失败' : '添加签证失败')
          } finally {
            submitLoading.value = false
          }
        }
      })
    }

    // 取消
    const cancel = () => {
      // 立即导航，不执行任何可能导致表单重置的操作
      const passportIdForNavigation = form.passport_id || passportId.value
      navigateBack(passportIdForNavigation)
    }
    
    // 导航回上一页
    const navigateBack = (passportId) => {
      // 禁止表单重置，避免在导航过程中看到表单被清空
      allowResetForm.value = false
      console.log('禁止表单重置，准备导航')
      
      if (passportId) {
        // 设置标记，表示是从签证编辑页面返回
        // 使用sessionStorage存储标记，避免刷新页面后丢失
        sessionStorage.setItem('fromVisaEdit', 'true');
        
        // 立即跳转到护照详情页，不要在导航前执行任何可能导致表单重置的操作
        router.push({
          path: `/customer/passport/detail/${passportId}`,
          // 使用replace而不是push，避免在历史记录中创建多余的条目
          replace: true,
          // 添加元数据，标记来源
          meta: {
            fromVisaEdit: true
          }
        })
      } else {
        router.push('/customer/visa/list')
      }
    }

    // 组件挂载时初始化数据
    onMounted(() => {
      console.log('签证表单组件挂载，路由参数:', route.params, route.query)
      console.log('路由名称:', route.name, '路由路径:', route.path)
      console.log('是否为编辑模式:', isEdit.value)
      console.log('URL中的护照ID:', passportId.value)
      console.log('URL中的护照数据:', passportData.value)
      
      // 首先重置表单，但不重置护照信息
      resetForm(false)
      console.log('表单已重置，但保留护照信息')
      
      // 检查URL中是否有护照数据
      const hasPassportDataInUrl = fillPassportInfoFromUrl()
      console.log('URL中是否包含护照数据:', hasPassportDataInUrl)
      console.log('填充后的护照信息:', JSON.stringify(passportInfo))
      
      // 如果是编辑模式，获取签证详情
      if (isEdit.value && route.params.id) {
        console.log('编辑模式，获取签证详情，ID:', route.params.id)
        fetchVisaDetail(route.params.id)
      } else {
        // 如果是新增模式，检查是否有护照ID
        if (passportId.value) {
          console.log('新增模式，设置护照ID:', passportId.value)
          form.passport_id = parseInt(passportId.value, 10)
          
          // 如果URL中没有护照数据，则尝试获取护照信息
          if (!hasPassportDataInUrl) {
            console.log('URL中没有护照数据，尝试获取护照信息')
            fetchPassportInfo(form.passport_id)
          }
        } else {
          console.warn('未提供护照ID，无法关联护照')
          ElMessage.warning('未提供护照ID，请返回并重试')
        }
      }
    })
    
    // 监听路由参数变化，重新获取数据
    watch(() => route.params.id, (newId, oldId) => {
      console.log('签证ID变化，从', oldId, '变为', newId)
      
      // 如果是编辑模式，且ID变化了，重新获取签证详情
      if (isEdit.value && newId && newId !== oldId) {
        console.log('重新获取签证详情，ID:', newId)
        fetchVisaDetail(newId)
      }
    })
    
    // 监听时间戳参数变化，确保每次编辑都是新的
    watch(() => route.query.t, (newT, oldT) => {
      console.log('时间戳变化，从', oldT, '变为', newT)
      
      // 如果时间戳变化了，且是编辑模式，重新获取签证详情
      if (isEdit.value && newT && newT !== oldT && route.params.id) {
        console.log('时间戳变化，重新获取签证详情，ID:', route.params.id)
        fetchVisaDetail(route.params.id)
      }
    })
    
    // 监听整个查询参数对象，确保当任何查询参数变化时都能重新加载数据
    watch(() => route.query, (newQuery, oldQuery) => {
      console.log('查询参数变化:', newQuery, oldQuery)
      
      // 检查是否是编辑模式，且有签证ID
      if (isEdit.value && route.params.id) {
        // 检查是否是时间戳变化，如果是则跳过（因为已经在上面的watch中处理了）
        if (newQuery.t !== oldQuery.t) {
          console.log('时间戳变化，已在其他watch中处理，跳过')
          return
        }
        
        // 检查护照ID是否变化
        if (newQuery.passportId !== oldQuery.passportId) {
          console.log('护照ID变化，重新获取签证详情，ID:', route.params.id)
          fetchVisaDetail(route.params.id)
          return
        }
        
        // 检查护照数据是否变化
        if (newQuery.passportData !== oldQuery.passportData) {
          console.log('护照数据变化，重新获取签证详情，ID:', route.params.id)
          fetchVisaDetail(route.params.id)
          return
        }
      } else if (!isEdit.value) {
        // 如果是新增模式，检查时间戳是否变化
        if (newQuery.t !== oldQuery.t) {
          console.log('新增模式，时间戳变化，重置表单')
          // 重置表单，但不重置护照信息
          resetForm(false)
          
          // 检查URL中是否有护照数据
          const hasPassportDataInUrl = fillPassportInfoFromUrl()
          console.log('URL中是否包含护照数据:', hasPassportDataInUrl)
          
          // 如果有护照ID，设置表单中的护照ID
          if (passportId.value) {
            console.log('设置护照ID:', passportId.value)
            form.passport_id = parseInt(passportId.value, 10)
            
            // 如果URL中没有护照数据，则尝试获取护照信息
            if (!hasPassportDataInUrl) {
              console.log('URL中没有护照数据，尝试获取护照信息')
              fetchPassportInfo(form.passport_id)
            }
          }
        }
      }
    }, { deep: true })
    
    // 监听路由名称变化，确保在从编辑模式切换到新增模式时重置表单
    watch(() => route.name, (newName, oldName) => {
      console.log('路由名称变化，从', oldName, '变为', newName)
      
      // 如果从编辑模式切换到新增模式，重置表单
      if (oldName === 'VisaEdit' && newName === 'VisaCreate') {
        console.log('从编辑模式切换到新增模式，重置表单')
        // 重置表单，但不重置护照信息
        resetForm(false)
        
        // 检查URL中是否有护照数据
        const hasPassportDataInUrl = fillPassportInfoFromUrl()
        console.log('URL中是否包含护照数据:', hasPassportDataInUrl)
        
        // 如果有护照ID，设置表单中的护照ID
        if (passportId.value) {
          console.log('设置护照ID:', passportId.value)
          form.passport_id = parseInt(passportId.value, 10)
          
          // 如果URL中没有护照数据，则尝试获取护照信息
          if (!hasPassportDataInUrl) {
            console.log('URL中没有护照数据，尝试获取护照信息')
            fetchPassportInfo(form.passport_id)
          }
        }
      }
    })

    // 组件卸载前的处理
    onBeforeUnmount(() => {
      console.log('签证表单组件即将卸载')
      // 禁止表单重置，确保在导航过程中不会看到表单被清空
      allowResetForm.value = false
    })

    return {
      formRef,
      form,
      rules,
      submitLoading,
      passportId,
      passportInfo,
      isEdit,
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

.passport-info {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.passport-info h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #303133;
}

.info-row {
  margin-bottom: 8px;
  display: flex;
}

.info-label {
  font-weight: bold;
  width: 100px;
  color: #606266;
}

.info-value {
  color: #303133;
}
</style>