<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
        </div>
      </template>
      <div v-loading="loading">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ userInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ userInfo.role?.name }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="userInfo.status === 'active' ? 'success' : 'danger'">
              {{ userInfo.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最后登录时间">{{ userInfo.lastLoginTime }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ userInfo.createdAt }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-card class="password-card">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>
      <el-form 
        ref="passwordFormRef" 
        :model="passwordForm" 
        :rules="passwordRules" 
        label-width="120px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input 
            v-model="passwordForm.oldPassword" 
            type="password" 
            placeholder="请输入原密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password" 
            placeholder="请输入新密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            placeholder="请确认新密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpdatePassword" :loading="submitting">保存</el-button>
          <el-button @click="resetPasswordForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 编辑个人信息对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      title="编辑个人信息" 
      width="500px"
    >
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserProfile, updateUserProfile, updateUserPassword } from '@/api/system'

export default {
  name: 'UserProfile',
  setup() {
    const loading = ref(false)
    const submitting = ref(false)
    const dialogVisible = ref(false)
    const formRef = ref(null)
    const passwordFormRef = ref(null)
    const userInfo = ref({})

    // 个人信息表单
    const form = reactive({
      name: '',
      email: '',
      phone: ''
    })

    // 表单验证规则
    const rules = reactive({
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      ],
      phone: [
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
      ]
    })

    // 密码表单
    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    // 密码表单验证规则
    const passwordRules = reactive({
      oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        { 
          validator: (rule, value, callback) => {
            if (value !== passwordForm.newPassword) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          }, 
          trigger: 'blur' 
        }
      ]
    })

    // 获取用户信息
    const fetchUserProfile = async () => {
      loading.value = true
      try {
        const response = await getUserProfile()
        userInfo.value = response.data || {}
      } catch (error) {
        console.error('获取用户信息失败:', error)
        ElMessage.error('获取用户信息失败')
        
        // 使用模拟数据
        userInfo.value = {
          id: 1,
          username: 'admin',
          name: '系统管理员',
          role: { id: 1, name: '管理员' },
          email: 'admin@example.com',
          phone: '13800138000',
          status: 'active',
          lastLoginTime: '2023-01-15 10:30:00',
          createdAt: '2023-01-01 00:00:00'
        }
      } finally {
        loading.value = false
      }
    }

    // 编辑个人信息
    const handleEdit = () => {
      // 填充表单数据
      form.name = userInfo.value.name
      form.email = userInfo.value.email
      form.phone = userInfo.value.phone
      
      dialogVisible.value = true
    }

    // 提交表单
    const submitForm = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate(async (valid) => {
        if (valid) {
          submitting.value = true
          try {
            await updateUserProfile(form)
            ElMessage.success('个人信息更新成功')
            dialogVisible.value = false
            fetchUserProfile()
          } catch (error) {
            console.error('更新个人信息失败:', error)
            ElMessage.error('更新个人信息失败')
          } finally {
            submitting.value = false
          }
        } else {
          ElMessage.warning('请填写必填项')
          return false
        }
      })
    }

    // 更新密码
    const handleUpdatePassword = async () => {
      if (!passwordFormRef.value) return
      
      await passwordFormRef.value.validate(async (valid) => {
        if (valid) {
          submitting.value = true
          try {
            await updateUserPassword(passwordForm)
            ElMessage.success('密码修改成功')
            resetPasswordForm()
          } catch (error) {
            console.error('修改密码失败:', error)
            ElMessage.error('修改密码失败')
          } finally {
            submitting.value = false
          }
        } else {
          ElMessage.warning('请填写必填项')
          return false
        }
      })
    }

    // 重置密码表单
    const resetPasswordForm = () => {
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
      
      if (passwordFormRef.value) {
        passwordFormRef.value.resetFields()
      }
    }

    onMounted(() => {
      fetchUserProfile()
    })

    return {
      loading,
      submitting,
      userInfo,
      dialogVisible,
      form,
      formRef,
      rules,
      passwordForm,
      passwordFormRef,
      passwordRules,
      handleEdit,
      submitForm,
      handleUpdatePassword,
      resetPasswordForm
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card, .password-card {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (min-width: 992px) {
  .profile-container {
    flex-direction: row;
    align-items: flex-start;
  }

  .profile-card {
    flex: 3;
  }

  .password-card {
    flex: 2;
  }
}
</style> 