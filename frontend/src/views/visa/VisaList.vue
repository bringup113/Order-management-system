<template>
  <div class="visa-list-container">
    <div class="visa-list-header">
      <h2>签证管理</h2>
      <el-button type="primary" @click="handleCreate">新增签证</el-button>
    </div>

    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="客户姓名">
          <el-input v-model="queryParams.customerName" placeholder="请输入客户姓名" clearable />
        </el-form-item>
        <el-form-item label="护照号码">
          <el-input v-model="queryParams.passportNo" placeholder="请输入护照号码" clearable />
        </el-form-item>
        <el-form-item label="签证类型">
          <el-input v-model="queryParams.visaType" placeholder="请输入签证类型" clearable />
        </el-form-item>
        <el-form-item label="签发国家">
          <el-input v-model="queryParams.issueCountry" placeholder="请输入签发国家" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="有效" value="valid" />
            <el-option label="过期" value="expired" />
            <el-option label="即将过期" value="expiring" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-container">
      <el-table
        v-loading="loading"
        :data="visaList"
        border
        style="width: 100%"
      >
        <el-table-column prop="customerName" label="客户姓名" width="120" />
        <el-table-column prop="passportNo" label="护照号码" width="150" />
        <el-table-column prop="visaType" label="签证类型" width="120" />
        <el-table-column prop="issueCountry" label="签发国家/地区" width="150" />
        <el-table-column prop="issueDate" label="签发日期" width="120" />
        <el-table-column prop="expiryDate" label="有效期至" width="120" />
        <el-table-column prop="entryCount" label="入境次数" width="100">
          <template #default="scope">
            {{ scope.row.entryCount === 'single' ? '单次' : '多次' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="success"
              @click="handleViewPassport(scope.row)"
              >查看护照</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getVisaList, deleteVisa } from '@/api/visa'
import { handleListResponse } from '@/utils/api-adapter'

export default {
  name: 'VisaList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const visaList = ref([])
    const total = ref(0)

    const queryParams = reactive({
      customerName: '',
      passportNo: '',
      visaType: '',
      issueCountry: '',
      status: '',
      pageNum: 1,
      pageSize: 10
    })

    // 获取签证列表
    const getList = () => {
      loading.value = true
      getVisaList(queryParams)
        .then(response => {
          const { data, total: totalCount } = handleListResponse(response)
          visaList.value = data || []
          total.value = totalCount || 0
        })
        .catch(error => {
          console.error('获取签证列表失败', error)
          ElMessage.error('获取签证列表失败')
          // 如果API请求失败，设置空数据
          visaList.value = []
          total.value = 0
        })
        .finally(() => {
          loading.value = false
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

    // 查询
    const handleQuery = () => {
      queryParams.pageNum = 1
      getList()
    }

    // 重置查询
    const resetQuery = () => {
      queryParams.customerName = ''
      queryParams.passportNo = ''
      queryParams.visaType = ''
      queryParams.issueCountry = ''
      queryParams.status = ''
      queryParams.pageNum = 1
      getList()
    }

    // 新增签证
    const handleCreate = () => {
      router.push('/customer/visa/create')
    }

    // 编辑签证
    const handleEdit = (row) => {
      router.push(`/customer/visa/edit/${row.id}`)
    }

    // 查看护照
    const handleViewPassport = (row) => {
      router.push(`/customer/passport/detail/${row.passportId}`)
    }

    // 删除签证
    const handleDelete = (row) => {
      ElMessageBox.confirm('确认删除该签证信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteVisa(row.id)
            .then(() => {
              ElMessage.success('删除成功')
              getList()
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

    // 每页条数变化
    const handleSizeChange = (val) => {
      queryParams.pageSize = val
      getList()
    }

    // 当前页变化
    const handleCurrentChange = (val) => {
      queryParams.pageNum = val
      getList()
    }

    onMounted(() => {
      getList()
    })

    return {
      loading,
      visaList,
      total,
      queryParams,
      getStatusType,
      getStatusText,
      handleQuery,
      resetQuery,
      handleCreate,
      handleEdit,
      handleViewPassport,
      handleDelete,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.visa-list-container {
  padding: 20px;
}

.visa-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style> 