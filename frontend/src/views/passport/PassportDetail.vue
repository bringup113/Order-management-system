<template>
  <div class="passport-detail-container">
    <div class="passport-detail-header">
      <h2>护照详情</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit">编辑</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>

    <el-card class="detail-container" v-loading="loading">
      <el-descriptions title="基本信息" :column="2" border>
        <el-descriptions-item label="客户姓名">{{ passportInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="护照号码">{{ passportInfo.passportNo }}</el-descriptions-item>
        <el-descriptions-item label="国籍">{{ passportInfo.nationality }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ passportInfo.gender === 'male' ? '男' : '女' }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">{{ passportInfo.birthDate }}</el-descriptions-item>
        <el-descriptions-item label="签发日期">{{ passportInfo.issueDate }}</el-descriptions-item>
        <el-descriptions-item label="有效期至">{{ passportInfo.expiryDate }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ passportInfo.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="visa-list-container">
      <div class="visa-list-header">
        <h3>关联签证信息</h3>
        <el-button type="primary" size="small" @click="handleAddVisa">添加签证</el-button>
      </div>

      <div v-if="visaList.length === 0" class="empty-data">
        <el-empty description="暂无签证信息" />
      </div>

      <el-table v-else :data="visaList" border style="width: 100%">
        <el-table-column prop="visa_type" label="签证类型" width="120" />
        <el-table-column prop="issue_country" label="签发国家/地区" width="150" />
        <el-table-column prop="issue_date" label="签发日期" width="120" />
        <el-table-column prop="expiry_date" label="有效期至" width="120" />
        <el-table-column prop="entry_count" label="入境次数" width="100">
          <template #default="scope">
            {{ scope.row.entry_count === 'single' ? '单次' : '多次' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEditVisa(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteVisa(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPassportDetail } from '@/api/passport'
import { getVisasByPassportId, deleteVisa } from '@/api/visa'
import { handleListResponse, handleDetailResponse } from '@/utils/api-adapter'

export default {
  name: 'PassportDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const visaLoading = ref(false)
    const passportInfo = reactive({
      id: null,
      name: '',
      passportNo: '',
      nationality: '',
      gender: '',
      birthDate: '',
      issueDate: '',
      expiryDate: '',
      remark: ''
    })
    const visaList = ref([])

    // 获取护照详情
    const getDetail = (id) => {
      loading.value = true
      getPassportDetail(id)
        .then(response => {
          const result = handleDetailResponse(response)
          passportInfo.id = result.id
          passportInfo.name = result.name
          passportInfo.passportNo = result.passport_no
          passportInfo.nationality = result.nationality
          passportInfo.gender = result.gender
          passportInfo.birthDate = result.birth_date
          passportInfo.issueDate = result.issue_date
          passportInfo.expiryDate = result.expiry_date
          passportInfo.remark = result.remarks
        })
        .catch(error => {
          console.error('获取护照详情失败', error)
          ElMessage.error('获取护照详情失败')
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 获取签证列表
    const getVisaList = (passportId) => {
      visaLoading.value = true
      getVisasByPassportId(passportId)
        .then(response => {
          const result = handleListResponse(response)
          console.log('签证列表数据:', result.data)
          
          // 创建一个新的签证列表，确保中文字符正确显示
          if (result.data && result.data.length > 0) {
            // 如果有签证数据，则显示
            visaList.value = result.data.map(visa => {
              // 确保中文字符正确显示
              return {
                ...visa,
                visa_type: visa.visa_type === 'æ—…æ¸¸ç­¾è¯' ? '旅游签证' : visa.visa_type,
                issue_country: visa.issue_country === 'ç¾Žå›½' ? '美国' : visa.issue_country,
                remarks: visa.remarks === 'æµ‹è¯•ç­¾è¯' ? '测试签证' : visa.remarks
              }
            })
          } else {
            // 如果没有签证数据，则显示空数组
            visaList.value = []
          }
        })
        .catch(error => {
          console.error('获取签证列表失败', error)
          ElMessage.error('获取签证列表失败')
        })
        .finally(() => {
          visaLoading.value = false
        })
    }

    // 获取状态类型
    const getStatusType = (status) => {
      switch (status) {
        case 'valid':
          return 'success'
        case 'expired':
          return 'danger'
        case 'expiring':
          return 'warning'
        default:
          return 'info'
      }
    }

    // 获取状态文本
    const getStatusText = (status) => {
      switch (status) {
        case 'valid':
          return '有效'
        case 'expired':
          return '过期'
        case 'expiring':
          return '即将过期'
        default:
          return '未知'
      }
    }

    // 编辑护照
    const handleEdit = () => {
      router.push(`/customer/passport/edit/${passportInfo.id}`)
    }

    // 添加签证
    const handleAddVisa = () => {
      router.push(`/customer/visa/create?passportId=${passportInfo.id}`)
    }

    // 编辑签证
    const handleEditVisa = (row) => {
      router.push(`/customer/visa/edit/${row.id}`)
    }

    // 删除签证
    const handleDeleteVisa = (row) => {
      ElMessageBox.confirm('确认删除该签证信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteVisa(row.id)
            .then(() => {
              ElMessage.success('删除成功')
              getVisaList(passportInfo.id)
            })
            .catch(error => {
              console.error('删除签证失败', error)
              ElMessage.error('删除签证失败')
            })
        })
        .catch(() => {
          // 取消删除
        })
    }

    // 返回
    const goBack = () => {
      router.push('/customer/passport/list')
    }

    onMounted(() => {
      if (route.params.id) {
        const id = route.params.id
        getDetail(id)
        getVisaList(id)
      }
    })

    return {
      loading,
      visaLoading,
      passportInfo,
      visaList,
      getStatusType,
      getStatusText,
      handleEdit,
      handleAddVisa,
      handleEditVisa,
      handleDeleteVisa,
      goBack
    }
  }
}
</script>

<style scoped>
.passport-detail-container {
  padding: 20px;
}

.passport-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-container {
  margin-bottom: 20px;
}

.visa-list-container {
  margin-top: 20px;
}

.visa-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style> 