<template>
  <el-dialog 
    v-model="dialogVisible" 
    :title="isEdit ? '编辑用户' : '创建用户'" 
    width="500px"
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="rules" 
      label-width="100px"
    >
      <el-form-item label="用户名" prop="username" class="user-form-username">
        <el-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit" @input="validateUsername"></el-input>
        <div v-if="usernameMessage" :class="['username-message', usernameStatus]">
          {{ usernameMessage }}
        </div>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="form.roleId" placeholder="请选择角色" style="width: 100%">
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="编辑时留空表示不修改密码" @input="validatePasswordMatch"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请确认密码" @input="validatePasswordMatch"></el-input>
        <div v-if="passwordMatchMessage" :class="['password-match-message', passwordMatchStatus]">
          {{ passwordMatchMessage }}
        </div>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :value="'enabled'">启用</el-radio>
          <el-radio :value="'disabled'">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          type="textarea"
          :rows="3"
          v-model="form.remarks"
          placeholder="请输入备注信息"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  submitting: {
    type: Boolean,
    default: false
  },
  roleOptions: {
    type: Array,
    default: () => []
  },
  userData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'submit', 'cancel'])

const formRef = ref(null)
const dialogVisible = ref(props.visible)
const passwordMatchMessage = ref('')
const passwordMatchStatus = ref('')
const usernameMessage = ref('')
const usernameStatus = ref('')

// 用户表单
const form = reactive({
  username: '',
  name: '',
  roleId: '',
  password: '',
  confirmPassword: '',
  status: 'enabled',
  remarks: ''
})

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含英文字母、数字和下划线', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  roleId: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  password: [
    { required: !props.isEdit, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { 
      validator: (rule, value, callback) => {
        if (!form.password) {
          // 如果密码为空，则确认密码也可以为空
          callback()
        } else if (value !== form.password) {
          // 如果密码不为空，则确认密码必须匹配
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
})

// 验证密码匹配
const validatePasswordMatch = () => {
  if (!form.password && !form.confirmPassword) {
    passwordMatchMessage.value = ''
    passwordMatchStatus.value = ''
    return
  }
  
  if (form.confirmPassword) {
    if (form.password === form.confirmPassword) {
      passwordMatchMessage.value = '密码匹配'
      passwordMatchStatus.value = 'success'
    } else {
      passwordMatchMessage.value = '两次输入密码不一致'
      passwordMatchStatus.value = 'error'
    }
  } else {
    passwordMatchMessage.value = ''
    passwordMatchStatus.value = ''
  }
}

// 验证用户名格式
const validateUsername = () => {
  if (!form.username) {
    usernameMessage.value = ''
    usernameStatus.value = ''
    return
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (form.username.length < 3) {
    usernameMessage.value = '用户名长度不能小于3个字符'
    usernameStatus.value = 'error'
  } else if (form.username.length > 20) {
    usernameMessage.value = '用户名长度不能超过20个字符'
    usernameStatus.value = 'error'
  } else if (!usernameRegex.test(form.username)) {
    usernameMessage.value = '用户名只能包含英文字母、数字和下划线'
    usernameStatus.value = 'error'
  } else {
    usernameMessage.value = '用户名格式正确'
    usernameStatus.value = 'success'
  }
}

// 监听密码变化
watch(() => form.password, () => {
  if (form.confirmPassword) {
    validatePasswordMatch()
  }
})

// 监听用户名变化
watch(() => form.username, () => {
  validateUsername()
})

// 监听isEdit属性变化，动态更新密码验证规则
watch(() => props.isEdit, (val) => {
  // 更新密码字段的验证规则
  rules.password[0].required = !val
  
  // 如果表单已经存在，重新验证
  if (formRef.value) {
    formRef.value.clearValidate('password')
    formRef.value.clearValidate('confirmPassword')
  }
})

// 监听对话框可见性
watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val) {
    if (props.isEdit && props.userData) {
      fillFormData()
    } else {
      resetForm()
    }
  }
})

// 监听对话框内部可见性变化
watch(() => dialogVisible.value, (val) => {
  emit('update:visible', val)
})

// 填充表单数据
const fillFormData = () => {
  const { username, name, role, roleId, status, remarks } = props.userData
  
  form.username = username || ''
  form.name = name || ''
  form.status = status || 'enabled'
  form.remarks = remarks || ''
  form.password = ''
  form.confirmPassword = ''
  
  // 设置角色ID
  if (role && typeof role === 'object' && role.id) {
    form.roleId = Number(role.id)
  } else if (roleId) {
    form.roleId = Number(roleId)
  } else {
    form.roleId = ''
  }
}

// 重置表单
const resetForm = () => {
  // 重置表单数据到初始状态
  form.username = ''
  form.name = ''
  form.roleId = ''
  form.password = ''
  form.confirmPassword = ''
  form.status = 'enabled'
  form.remarks = ''
  
  // 重置验证消息
  passwordMatchMessage.value = ''
  passwordMatchStatus.value = ''
  usernameMessage.value = ''
  usernameStatus.value = ''
  
  // 清除表单验证状态
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
}

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false
  emit('cancel')
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const formData = { ...form }
      
      // 如果密码为空，则不提交密码字段
      if (!formData.password) {
        delete formData.password
        delete formData.confirmPassword
      }
      
      emit('submit', formData)
    }
  })
}

// 暴露方法给父组件
defineExpose({
  formRef,
  form,
  resetForm
})
</script>

<style scoped>
.password-match-message,
.username-message {
  font-size: 12px;
  margin-top: 5px;
}
.success {
  color: #67c23a;
}
.error {
  color: #f56c6c;
}
</style> 