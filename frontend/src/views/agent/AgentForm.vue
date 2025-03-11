<template>
  <div class="agent-form-container">
    <div class="agent-form-header">
      <h2>{{ isEdit ? '编辑代理' : '新增代理' }}</h2>
    </div>

    <el-card class="form-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="代理名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入代理名称" />
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

        <el-form-item label="佣金比例" prop="commissionRate">
          <el-input-number
            v-model="form.commissionRate"
            :precision="2"
            :step="0.1"
            :min="0"
            :max="100"
            style="width: 200px"
          />
          <span class="commission-unit">%</span>
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
import { getAgentDetail, createAgent, updateAgent } from '@/api/agent'

export default {
  name: 'AgentForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const loading = ref(false)

    // 判断是否为编辑模式
    const isEdit = computed(() => {
      return route.name === 'AgentEdit'
    })

    // 表单数据
    const form = reactive({
      id: null,
      name: '',
      contactPerson: '',
      contactPhone: '',
      email: '',
      address: '',
      commissionRate: 10, // 默认佣金比例10%
      status: 'active',
      remark: ''
    })

    // 表单验证规则
    const rules = {
      name: [{ required: true, message: '请输入代理名称', trigger: 'blur' }],
      contactPerson: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
      contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
      email: [
        { required: true, message: '请输入电子邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      commissionRate: [{ required: true, message: '请输入佣金比例', trigger: 'blur' }],
      status: [{ required: true, message: '请选择状态', trigger: 'change' }]
    }

    // 获取代理详情
    const getDetail = (id) => {
      loading.value = true
      getAgentDetail(id)
        .then(response => {
          Object.assign(form, response.data)
        })
        .catch(error => {
          console.error('获取代理详情失败', error)
          ElMessage.error('获取代理详情失败')
          // 使用模拟数据
          const agentDetail = {
            id: id,
            name: '北京旅行社',
            contactPerson: '赵六',
            contactPhone: '13600136000',
            email: 'zhaoliu@example.com',
            address: '北京市朝阳区建国路1号',
            commissionRate: 15,
            status: 'active',
            remark: '这是一个备注'
          }
          Object.assign(form, agentDetail)
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
            ? updateAgent(form.id, form)
            : createAgent(form)
          
          request
            .then(() => {
              ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
              router.push('/agent/list')
            })
            .catch(error => {
              console.error(isEdit.value ? '修改代理失败' : '添加代理失败', error)
              ElMessage.error(isEdit.value ? '修改代理失败' : '添加代理失败')
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
      router.push('/agent/list')
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
.agent-form-container {
  padding: 20px;
}

.agent-form-header {
  margin-bottom: 20px;
}

.form-container {
  max-width: 800px;
}

.commission-unit {
  margin-left: 10px;
}
</style> 