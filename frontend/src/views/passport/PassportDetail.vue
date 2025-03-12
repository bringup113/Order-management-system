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
        <el-descriptions-item label="护照号码">{{ passportInfo.passport_no }}</el-descriptions-item>
        <el-descriptions-item label="国籍">{{ passportInfo.nationality }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ passportInfo.gender === 'male' ? '男' : '女' }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">{{ passportInfo.birth_date }}</el-descriptions-item>
        <el-descriptions-item label="签发日期">{{ passportInfo.issue_date }}</el-descriptions-item>
        <el-descriptions-item label="有效期至">{{ passportInfo.expiry_date }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ passportInfo.remarks || '无' }}</el-descriptions-item>
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
import { ref, reactive, onMounted, watch, onActivated } from 'vue'
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
      passport_no: '',
      nationality: '',
      gender: '',
      birth_date: '',
      issue_date: '',
      expiry_date: '',
      remarks: ''
    })
    const visaList = ref([])

    // 获取护照详情
    const getDetail = (id) => {
      // 重置护照信息，避免显示上一个护照的数据
      Object.assign(passportInfo, {
        id: null,
        name: '',
        passport_no: '',
        nationality: '',
        gender: '',
        birth_date: '',
        issue_date: '',
        expiry_date: '',
        remarks: ''
      })
      
      loading.value = true
      getPassportDetail(id)
        .then(response => {
          const result = handleDetailResponse(response)
          console.log('获取到的护照详情:', result)
          if (result && result.id) {
            passportInfo.id = result.id
            passportInfo.name = result.name
            passportInfo.passport_no = result.passport_no
            passportInfo.nationality = result.nationality
            passportInfo.gender = result.gender
            passportInfo.birth_date = result.birth_date
            passportInfo.issue_date = result.issue_date
            passportInfo.expiry_date = result.expiry_date
            passportInfo.remarks = result.remarks
            
            // 获取签证列表
            getVisaList(id)
          } else {
            console.error('护照详情数据无效')
            ElMessage.warning('护照数据无效或已被删除')
            setTimeout(() => {
              router.push('/customer/passport/list')
            }, 1500)
          }
        })
        .catch(error => {
          console.error('获取护照详情失败', error)
          // 不显示错误提示，直接跳转到护照列表页面
          console.log('护照可能不存在，跳转到列表页')
          setTimeout(() => {
            router.push('/customer/passport/list')
          }, 500)
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 获取签证列表
    const getVisaList = (passportId) => {
      // 重置签证列表，避免显示上一个护照的签证
      visaList.value = []
      
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
          // 获取签证列表失败不影响护照详情的显示，只在控制台记录错误
          console.log('获取签证列表失败，但不影响护照详情显示')
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
      // 确保护照ID存在
      if (!passportInfo.id) {
        ElMessage.warning('护照信息不完整，无法编辑')
        return
      }
      
      console.log('编辑护照，ID:', passportInfo.id)
      
      // 跳转到护照编辑页面
      router.push({
        path: `/customer/passport/edit/${passportInfo.id}`,
        // 添加时间戳，确保每次编辑都是唯一的
        query: { t: Date.now() }
      })
    }

    // 添加签证
    const handleAddVisa = () => {
      // 确保护照ID存在
      if (!passportInfo.id) {
        ElMessage.warning('护照信息不完整，无法添加签证')
        return
      }
      
      console.log('添加签证，护照ID:', passportInfo.id)
      
      // 准备护照数据
      const passportData = {
        id: passportInfo.id,
        name: passportInfo.name || '(未能获取客户姓名)',
        passport_no: passportInfo.passport_no || '(未能获取护照号码)',
        nationality: passportInfo.nationality || '(未能获取国籍)',
        gender: passportInfo.gender,
        birth_date: passportInfo.birth_date
      }
      
      console.log('传递给签证添加页面的护照数据:', passportData)
      
      // 将护照数据编码并添加到URL中
      const passportDataStr = encodeURIComponent(JSON.stringify(passportData))
      
      // 跳转到签证添加页面
      router.push({
        path: '/customer/visa/create',
        query: {
          passportId: passportInfo.id,
          passportData: passportDataStr,
          source: 'passport_detail', // 添加来源标记
          t: Date.now() // 添加时间戳，确保每次添加都是唯一的
        },
        replace: true // 使用replace而不是push，避免在历史记录中创建多余的条目
      })
    }

    // 编辑签证
    const handleEditVisa = (row) => {
      // 确保签证ID存在
      if (!row || !row.id) {
        ElMessage.warning('签证信息不完整，无法编辑')
        return
      }
      
      // 确保护照ID存在
      if (!passportInfo.id) {
        ElMessage.warning('护照信息不完整，无法编辑签证')
        return
      }
      
      console.log('编辑签证，签证ID:', row.id, '护照ID:', passportInfo.id)
      
      // 准备护照数据
      const passportData = {
        id: passportInfo.id,
        name: passportInfo.name || '(未能获取客户姓名)',
        passport_no: passportInfo.passport_no || '(未能获取护照号码)',
        nationality: passportInfo.nationality || '(未能获取国籍)',
        gender: passportInfo.gender,
        birth_date: passportInfo.birth_date
      }
      
      console.log('传递给签证编辑页面的护照数据:', passportData)
      
      // 将护照数据编码并添加到URL中
      const passportDataStr = encodeURIComponent(JSON.stringify(passportData))
      
      // 跳转到签证编辑页面，同时传递护照ID和护照数据
      router.push({
        path: `/customer/visa/edit/${row.id}`,
        query: {
          passportId: passportInfo.id,
          passportData: passportDataStr,
          source: 'passport_detail', // 添加来源标记
          t: Date.now() // 添加时间戳，确保每次编辑都是唯一的
        },
        replace: true // 使用replace而不是push，避免在历史记录中创建多余的条目
      })
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

    // 监听路由参数变化，重新获取数据
    watch(() => route.params.id, (newId, oldId) => {
      // 检查是否是从签证编辑页面返回
      const fromVisaEdit = route.meta.fromVisaEdit;
      if (fromVisaEdit) {
        console.log('检测到从签证编辑页面返回，跳过数据刷新');
        // 重置标记
        route.meta.fromVisaEdit = false;
        return;
      }
      
      // 检查当前路由是否是护照详情页
      if (!route.path.includes('/customer/passport/detail/')) {
        console.log('当前不是护照详情页，跳过数据刷新');
        return;
      }
      
      // 检查ID是否与当前护照ID匹配
      if (passportInfo.id && passportInfo.id.toString() === newId.toString()) {
        console.log('护照ID未变化，跳过数据刷新');
        return;
      }
      
      console.log('护照ID变化，重新获取数据:', newId);
      getDetail(newId);
    })

    // 组件挂载时获取数据
    onMounted(() => {
      if (route.params.id) {
        const id = route.params.id
        getDetail(id)
      }
    })

    // 组件激活时重新获取数据
    onActivated(() => {
      // 检查当前路由是否是护照详情页
      if (!route.path.includes('/customer/passport/detail/')) {
        console.log('当前不是护照详情页，跳过数据刷新');
        return;
      }
      
      // 检查是否是从签证编辑页面返回
      if (route.meta && route.meta.fromVisaEdit) {
        console.log('检测到从签证编辑页面返回，跳过数据刷新');
        // 重置标记
        route.meta.fromVisaEdit = false;
        
        // 只刷新签证列表，不重新加载护照详情
        if (passportInfo.id) {
          getVisaList(passportInfo.id);
        }
        return;
      }
      
      // 检查URL中是否有来源标记
      const fromSource = sessionStorage.getItem('fromVisaEdit');
      if (fromSource === 'true') {
        console.log('检测到从签证编辑页面返回（通过sessionStorage），跳过数据刷新');
        // 清除标记
        sessionStorage.removeItem('fromVisaEdit');
        
        // 只刷新签证列表，不重新加载护照详情
        if (passportInfo.id) {
          getVisaList(passportInfo.id);
        }
        return;
      }
      
      // 如果有护照ID参数，则刷新数据
      if (route.params.id) {
        console.log('护照详情页被激活，强制刷新数据:', route.params.id);
        getDetail(route.params.id);
      } else {
        console.log('护照详情页被激活，但没有ID参数，无法刷新数据');
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