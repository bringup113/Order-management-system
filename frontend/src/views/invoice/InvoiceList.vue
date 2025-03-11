<template>
  <div class="invoice-list-container">
    <div class="page-header">
      <h1>账单管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreate">创建账单</el-button>
      </div>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="search-form">
        <el-form-item label="账单编号" prop="invoiceNo">
          <el-input v-model="searchForm.invoiceNo" placeholder="请输入账单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="searchForm.customerName" placeholder="请输入客户姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="账单状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="未支付" value="unpaid"></el-option>
            <el-option label="部分支付" value="partial"></el-option>
            <el-option label="已支付" value="paid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成日期" prop="dateRange">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="list-card">
      <el-table
        v-loading="loading"
        :data="invoiceList"
        border
        style="width: 100%"
      >
        <el-table-column prop="invoiceNo" label="账单编号" width="150"></el-table-column>
        <el-table-column prop="passport.name" label="客户姓名" width="120"></el-table-column>
        <el-table-column prop="agent.name" label="代理商" width="150"></el-table-column>
        <el-table-column prop="totalAmount" label="账单金额" width="120">
          <template #default="scope">
            {{ formatCurrency(scope.row.totalAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="paidAmount" label="已支付金额" width="120">
          <template #default="scope">
            {{ formatCurrency(scope.row.paidAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="unpaidAmount" label="未支付金额" width="120">
          <template #default="scope">
            {{ formatCurrency(scope.row.unpaidAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="generatedDate" label="生成日期" width="120"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getInvoiceStatusType(scope.row.status)">
              {{ getInvoiceStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              @click="handleView(scope.row)"
            >
              查看
            </el-button>
            <el-button 
              size="small" 
              type="success" 
              @click="handlePayments(scope.row)"
            >
              支付记录
            </el-button>
            <el-button 
              size="small" 
              @click="handleEdit(scope.row)"
              :disabled="scope.row.status === 'paid'"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(scope.row)"
              :disabled="scope.row.status === 'paid'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getInvoiceList, deleteInvoice } from '@/api/invoice'
import { handleListResponse } from '@/utils/api-adapter'

export default {
  name: 'InvoiceList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const invoiceList = ref([])
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const searchFormRef = ref(null)

    // 搜索表单
    const searchForm = reactive({
      invoiceNo: '',
      customerName: '',
      status: '',
      dateRange: []
    })

    // 获取账单列表
    const fetchInvoiceList = async () => {
      loading.value = true
      try {
        // 构建查询参数
        const params = {
          page: currentPage.value,
          limit: pageSize.value,
          invoiceNo: searchForm.invoiceNo,
          customerName: searchForm.customerName,
          status: searchForm.status
        }

        // 添加日期范围
        if (searchForm.dateRange && searchForm.dateRange.length === 2) {
          params.startDate = searchForm.dateRange[0]
          params.endDate = searchForm.dateRange[1]
        }

        const response = await getInvoiceList(params)
        const { data, total: totalCount } = handleListResponse(response)
        invoiceList.value = data
        total.value = totalCount
      } catch (error) {
        console.error('获取账单列表失败:', error)
        ElMessage.error('获取账单列表失败')
        
        // 使用模拟数据
        invoiceList.value = [
          {
            id: 1,
            invoiceNo: 'INV20230001',
            generatedDate: '2023-01-15',
            status: 'partial',
            totalAmount: 5000,
            paidAmount: 2000,
            unpaidAmount: 3000,
            passport: {
              name: '张三'
            },
            agent: {
              name: '北京旅行社'
            }
          },
          {
            id: 2,
            invoiceNo: 'INV20230002',
            generatedDate: '2023-01-20',
            status: 'unpaid',
            totalAmount: 3000,
            paidAmount: 0,
            unpaidAmount: 3000,
            passport: {
              name: '李四'
            },
            agent: {
              name: '上海旅行社'
            }
          },
          {
            id: 3,
            invoiceNo: 'INV20230003',
            generatedDate: '2023-01-25',
            status: 'paid',
            totalAmount: 2000,
            paidAmount: 2000,
            unpaidAmount: 0,
            passport: {
              name: 'John Smith'
            },
            agent: {
              name: '广州旅行社'
            }
          }
        ]
        total.value = invoiceList.value.length
      } finally {
        loading.value = false
      }
    }

    // 处理搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchInvoiceList()
    }

    // 重置搜索
    const resetSearch = () => {
      if (searchFormRef.value) {
        searchFormRef.value.resetFields()
      }
      currentPage.value = 1
      fetchInvoiceList()
    }

    // 处理页码变化
    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchInvoiceList()
    }

    // 处理每页条数变化
    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      fetchInvoiceList()
    }

    // 创建账单
    const handleCreate = () => {
      router.push({ name: 'InvoiceCreate' })
    }

    // 查看账单详情
    const handleView = (row) => {
      router.push({
        name: 'InvoiceDetail',
        params: { id: row.id }
      })
    }

    // 编辑账单
    const handleEdit = (row) => {
      router.push({
        name: 'InvoiceEdit',
        params: { id: row.id }
      })
    }

    // 查看支付记录
    const handlePayments = (row) => {
      router.push({
        name: 'InvoicePayments',
        params: { id: row.id }
      })
    }

    // 删除账单
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        '确定要删除这个账单吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await deleteInvoice(row.id)
          ElMessage.success('删除成功')
          fetchInvoiceList()
        } catch (error) {
          console.error('删除账单失败:', error)
          ElMessage.error('删除账单失败')
        }
      }).catch(() => {})
    }

    // 账单状态显示
    const getInvoiceStatusText = (status) => {
      const statusMap = {
        unpaid: '未支付',
        partial: '部分支付',
        paid: '已支付'
      }
      return statusMap[status] || status
    }

    const getInvoiceStatusType = (status) => {
      const typeMap = {
        unpaid: 'danger',
        partial: 'warning',
        paid: 'success'
      }
      return typeMap[status] || ''
    }

    // 格式化货币
    const formatCurrency = (value) => {
      return `¥ ${parseFloat(value).toFixed(2)}`
    }

    onMounted(() => {
      fetchInvoiceList()
    })

    return {
      loading,
      invoiceList,
      total,
      currentPage,
      pageSize,
      searchForm,
      searchFormRef,
      handleSearch,
      resetSearch,
      handleCurrentChange,
      handleSizeChange,
      handleCreate,
      handleView,
      handleEdit,
      handlePayments,
      handleDelete,
      getInvoiceStatusText,
      getInvoiceStatusType,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.invoice-list-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
}

.list-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 