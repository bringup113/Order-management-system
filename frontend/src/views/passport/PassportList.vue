<template>
  <div class="passport-list-container">
    <div class="passport-list-header">
      <h2>护照管理</h2>
      <el-button type="primary" @click="handleCreate">新增护照</el-button>
    </div>

    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="客户姓名">
          <el-input v-model="queryParams.name" placeholder="请输入客户姓名" clearable />
        </el-form-item>
        <el-form-item label="护照号码">
          <el-input v-model="queryParams.passportNo" placeholder="请输入护照号码" clearable />
        </el-form-item>
        <el-form-item label="国籍">
          <el-input v-model="queryParams.nationality" placeholder="请输入国籍" clearable />
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
        :data="passportList"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="客户姓名" width="120" />
        <el-table-column prop="passportNo" label="护照号码" width="150" />
        <el-table-column prop="nationality" label="国籍" width="120" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="scope">
            {{ scope.row.gender === 'male' ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="birthDate" label="出生日期" width="120" />
        <el-table-column prop="issueDate" label="签发日期" width="120" />
        <el-table-column prop="expiryDate" label="有效期至" width="120" />
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
              @click="handleDetail(scope.row)"
              >详情</el-button
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
import { getPassportList, deletePassport } from '@/api/passport'
import { handleListResponse } from '@/utils/api-adapter'

export default {
  name: 'PassportList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const passportList = ref([])
    const total = ref(0)

    const queryParams = reactive({
      name: '',
      passportNo: '',
      nationality: '',
      pageNum: 1,
      pageSize: 10
    })

    // 获取护照列表
    const getList = () => {
      loading.value = true
      getPassportList(queryParams)
        .then(response => {
          const { data, total: totalCount } = handleListResponse(response)
          passportList.value = data
          total.value = totalCount
        })
        .catch(error => {
          console.error('获取护照列表失败', error)
          ElMessage.error('获取护照列表失败')
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 查询
    const handleQuery = () => {
      queryParams.pageNum = 1
      getList()
    }

    // 重置查询
    const resetQuery = () => {
      queryParams.name = ''
      queryParams.passportNo = ''
      queryParams.nationality = ''
      queryParams.pageNum = 1
      getList()
    }

    // 新增护照
    const handleCreate = () => {
      router.push('/customer/passport/create')
    }

    // 编辑护照
    const handleEdit = (row) => {
      router.push(`/customer/passport/edit/${row.id}`)
    }

    // 查看详情
    const handleDetail = (row) => {
      router.push(`/customer/passport/detail/${row.id}`)
    }

    // 删除护照
    const handleDelete = (row) => {
      ElMessageBox.confirm('确认删除该护照信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletePassport(row.id)
            .then(() => {
              ElMessage.success('删除成功')
              getList()
            })
            .catch(error => {
              console.error('删除护照失败', error)
              ElMessage.error('删除护照失败')
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
      passportList,
      total,
      queryParams,
      handleQuery,
      resetQuery,
      handleCreate,
      handleEdit,
      handleDetail,
      handleDelete,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.passport-list-container {
  padding: 20px;
}

.passport-list-header {
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