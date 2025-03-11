<template>
  <div class="error-logs-container">
    <div class="page-header">
      <h1>错误日志</h1>
      <div class="header-actions">
        <el-button type="danger" @click="clearLogs" :disabled="!logs.length">清空日志</el-button>
      </div>
    </div>

    <el-card class="filter-container">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="错误类型">
          <el-select v-model="filterForm.type" placeholder="选择错误类型" clearable>
            <el-option v-for="(value, key) in ErrorType" :key="key" :label="getErrorTypeLabel(value)" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="错误级别">
          <el-select v-model="filterForm.level" placeholder="选择错误级别" clearable>
            <el-option v-for="(value, key) in ErrorLevel" :key="key" :label="getErrorLevelLabel(value)" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="logs-container">
      <div v-if="!filteredLogs.length" class="empty-logs">
        <el-empty description="暂无错误日志" />
      </div>
      <div v-else>
        <el-table :data="filteredLogs" border style="width: 100%">
          <el-table-column prop="timestamp" label="时间" width="180" sortable>
            <template #default="scope">
              {{ formatDate(scope.row.timestamp) }}
            </template>
          </el-table-column>
          <el-table-column prop="error.type" label="类型" width="120">
            <template #default="scope">
              <el-tag :type="getErrorTypeTagType(scope.row.error.type)">
                {{ getErrorTypeLabel(scope.row.error.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="error.level" label="级别" width="100">
            <template #default="scope">
              <el-tag :type="getErrorLevelTagType(scope.row.error.level)">
                {{ getErrorLevelLabel(scope.row.error.level) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="error.message" label="错误信息" min-width="250" show-overflow-tooltip />
          <el-table-column prop="context.url" label="页面路径" min-width="200" show-overflow-tooltip />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="showErrorDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 错误详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="错误详情" width="70%">
      <div v-if="selectedError" class="error-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="时间">{{ formatDate(selectedError.timestamp) }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ getErrorTypeLabel(selectedError.error.type) }}</el-descriptions-item>
          <el-descriptions-item label="级别">{{ getErrorLevelLabel(selectedError.error.level) }}</el-descriptions-item>
          <el-descriptions-item label="错误名称">{{ selectedError.error.name }}</el-descriptions-item>
          <el-descriptions-item label="错误消息">{{ selectedError.error.message }}</el-descriptions-item>
          <el-descriptions-item label="错误代码" v-if="selectedError.error.code">{{ selectedError.error.code }}</el-descriptions-item>
          <el-descriptions-item label="页面路径">{{ selectedError.context.url }}</el-descriptions-item>
          <el-descriptions-item label="用户代理">{{ selectedError.context.userAgent }}</el-descriptions-item>
          <el-descriptions-item label="用户ID" v-if="selectedError.context.userId">{{ selectedError.context.userId }}</el-descriptions-item>
        </el-descriptions>

        <div class="error-stack" v-if="selectedError.error.stack">
          <h3>错误堆栈</h3>
          <pre>{{ selectedError.error.stack }}</pre>
        </div>

        <div class="error-details" v-if="selectedError.error.details">
          <h3>错误详情</h3>
          <pre>{{ formatDetails(selectedError.error.details) }}</pre>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import errorLogger from '@/utils/error-logger'
import { ErrorType, ErrorLevel } from '@/utils/error-handler'

export default {
  name: 'ErrorLogs',
  setup() {
    // 错误日志列表
    const logs = ref(errorLogger.getLogs())
    
    // 筛选表单
    const filterForm = reactive({
      type: '',
      level: ''
    })
    
    // 详情对话框
    const detailDialogVisible = ref(false)
    const selectedError = ref(null)
    
    // 筛选后的日志
    const filteredLogs = computed(() => {
      return logs.value.filter(log => {
        if (filterForm.type && log.error.type !== filterForm.type) {
          return false
        }
        if (filterForm.level && log.error.level !== filterForm.level) {
          return false
        }
        return true
      })
    })
    
    // 应用筛选
    const applyFilter = () => {
      // 筛选已经通过计算属性实现
    }
    
    // 重置筛选
    const resetFilter = () => {
      filterForm.type = ''
      filterForm.level = ''
    }
    
    // 清空日志
    const clearLogs = () => {
      ElMessageBox.confirm('确定要清空所有错误日志吗？此操作不可恢复！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        errorLogger.clearLogs()
        logs.value = []
      }).catch(() => {})
    }
    
    // 显示错误详情
    const showErrorDetail = (error) => {
      selectedError.value = error
      detailDialogVisible.value = true
    }
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString()
    }
    
    // 格式化详情
    const formatDetails = (details) => {
      if (typeof details === 'object') {
        return JSON.stringify(details, null, 2)
      }
      return details
    }
    
    // 获取错误类型标签
    const getErrorTypeLabel = (type) => {
      const typeLabels = {
        [ErrorType.API]: 'API错误',
        [ErrorType.VALIDATION]: '验证错误',
        [ErrorType.BUSINESS]: '业务错误',
        [ErrorType.NETWORK]: '网络错误',
        [ErrorType.AUTH]: '认证错误',
        [ErrorType.PERMISSION]: '权限错误',
        [ErrorType.SYSTEM]: '系统错误',
        [ErrorType.UNKNOWN]: '未知错误'
      }
      return typeLabels[type] || type
    }
    
    // 获取错误级别标签
    const getErrorLevelLabel = (level) => {
      const levelLabels = {
        [ErrorLevel.INFO]: '信息',
        [ErrorLevel.WARNING]: '警告',
        [ErrorLevel.ERROR]: '错误',
        [ErrorLevel.FATAL]: '致命错误'
      }
      return levelLabels[level] || level
    }
    
    // 获取错误类型标签样式
    const getErrorTypeTagType = (type) => {
      const typeTagTypes = {
        [ErrorType.API]: 'danger',
        [ErrorType.VALIDATION]: 'warning',
        [ErrorType.BUSINESS]: 'warning',
        [ErrorType.NETWORK]: 'danger',
        [ErrorType.AUTH]: 'danger',
        [ErrorType.PERMISSION]: 'warning',
        [ErrorType.SYSTEM]: 'danger',
        [ErrorType.UNKNOWN]: 'info'
      }
      return typeTagTypes[type] || 'info'
    }
    
    // 获取错误级别标签样式
    const getErrorLevelTagType = (level) => {
      const levelTagTypes = {
        [ErrorLevel.INFO]: 'info',
        [ErrorLevel.WARNING]: 'warning',
        [ErrorLevel.ERROR]: 'danger',
        [ErrorLevel.FATAL]: 'danger'
      }
      return levelTagTypes[level] || 'info'
    }
    
    return {
      logs,
      filteredLogs,
      filterForm,
      detailDialogVisible,
      selectedError,
      ErrorType,
      ErrorLevel,
      applyFilter,
      resetFilter,
      clearLogs,
      showErrorDetail,
      formatDate,
      formatDetails,
      getErrorTypeLabel,
      getErrorLevelLabel,
      getErrorTypeTagType,
      getErrorLevelTagType
    }
  }
}
</script>

<style scoped>
.error-logs-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.logs-container {
  margin-bottom: 20px;
}

.empty-logs {
  padding: 40px 0;
}

.error-detail {
  margin-bottom: 20px;
}

.error-stack,
.error-details {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  background-color: #f5f7fa;
}

.error-stack h3,
.error-details h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
}

.error-stack pre,
.error-details pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
}
</style> 