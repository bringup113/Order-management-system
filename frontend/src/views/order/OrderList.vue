<template>
  <div class="order-list-container">
    <div class="page-header">
      <h1>订单管理</h1>
      <el-button type="primary" @click="handleCreateOrder">新建订单</el-button>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" label-width="100px" inline>
        <el-form-item label="订单编号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="searchForm.customerName" placeholder="请输入客户姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option label="待处理" value="pending"></el-option>
            <el-option label="处理中" value="processing"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已取消" value="cancelled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="searchForm.paymentStatus" placeholder="请选择支付状态" clearable>
            <el-option label="未支付" value="unpaid"></el-option>
            <el-option label="部分支付" value="partial"></el-option>
            <el-option label="已支付" value="paid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单日期">
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
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 订单列表 -->
    <el-card class="list-card">
      <el-table
        v-loading="loading"
        :data="orderList"
        border
        style="width: 100%"
      >
        <el-table-column prop="orderNo" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="passportName" label="客户姓名" width="120"></el-table-column>
        <el-table-column prop="agentName" label="代理商" width="150"></el-table-column>
        <el-table-column prop="totalAmount" label="订单金额" width="120">
          <template #default="scope">
            {{ formatCurrency(scope.row.totalAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="orderDate" label="下单日期" width="120"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="100">
          <template #default="scope">
            <el-tag :type="getOrderStatusType(scope.row.orderStatus)">
              {{ getOrderStatusText(scope.row.orderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentStatus" label="支付状态" width="100">
          <template #default="scope">
            <el-tag :type="getPaymentStatusType(scope.row.paymentStatus)">
              {{ getPaymentStatusText(scope.row.paymentStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleViewOrder(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEditOrder(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定要删除此订单吗？"
              @confirm="handleDeleteOrder(scope.row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { getOrderList, deleteOrder } from '@/api/order'
import { handleListResponse } from '@/utils/api-adapter'

export default {
  name: 'OrderList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const orderList = ref([])
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)

    const searchForm = reactive({
      orderNo: '',
      customerName: '',
      orderStatus: '',
      paymentStatus: '',
      dateRange: []
    })

    // 获取订单列表
    const fetchOrderList = async () => {
      loading.value = true
      try {
        const params = {
          page: currentPage.value,
          limit: pageSize.value,
          orderNo: searchForm.orderNo,
          customerName: searchForm.customerName,
          orderStatus: searchForm.orderStatus,
          paymentStatus: searchForm.paymentStatus
        }

        if (searchForm.dateRange && searchForm.dateRange.length === 2) {
          params.startDate = searchForm.dateRange[0]
          params.endDate = searchForm.dateRange[1]
        }

        const response = await getOrderList(params)
        const { data, total: totalCount } = handleListResponse(response)
        orderList.value = data
        total.value = totalCount
      } catch (error) {
        console.error('获取订单列表失败:', error)
        ElMessage.error('获取订单列表失败')
        
        // 使用模拟数据
        orderList.value = [
          {
            id: 1,
            orderNo: 'ORD20230001',
            passportName: '张三',
            agentName: '北京旅行社',
            totalAmount: 5000,
            orderDate: '2023-01-15',
            orderStatus: 'pending',
            paymentStatus: 'unpaid'
          },
          {
            id: 2,
            orderNo: 'ORD20230002',
            passportName: '李四',
            agentName: '上海旅游公司',
            totalAmount: 8000,
            orderDate: '2023-01-20',
            orderStatus: 'processing',
            paymentStatus: 'partial'
          },
          {
            id: 3,
            orderNo: 'ORD20230003',
            passportName: '王五',
            agentName: '广州旅游集团',
            totalAmount: 12000,
            orderDate: '2023-01-25',
            orderStatus: 'completed',
            paymentStatus: 'paid'
          }
        ]
        total.value = orderList.value.length
      } finally {
        loading.value = false
      }
    }

    // 搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchOrderList()
    }

    // 重置搜索
    const resetSearch = () => {
      Object.keys(searchForm).forEach(key => {
        if (key === 'dateRange') {
          searchForm[key] = []
        } else {
          searchForm[key] = ''
        }
      })
      currentPage.value = 1
      fetchOrderList()
    }

    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchOrderList()
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchOrderList()
    }

    // 订单状态显示
    const getOrderStatusText = (status) => {
      const statusMap = {
        pending: '待处理',
        processing: '处理中',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || status
    }

    const getOrderStatusType = (status) => {
      const typeMap = {
        pending: 'warning',
        processing: 'primary',
        completed: 'success',
        cancelled: 'danger'
      }
      return typeMap[status] || ''
    }

    // 支付状态显示
    const getPaymentStatusText = (status) => {
      const statusMap = {
        unpaid: '未支付',
        partial: '部分支付',
        paid: '已支付'
      }
      return statusMap[status] || status
    }

    const getPaymentStatusType = (status) => {
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

    // 查看订单
    const handleViewOrder = (order) => {
      router.push({
        name: 'OrderDetail',
        params: { id: order.id }
      })
    }

    // 编辑订单
    const handleEditOrder = (order) => {
      router.push({
        name: 'OrderEdit',
        params: { id: order.id }
      })
    }

    // 删除订单
    const handleDeleteOrder = async (id) => {
      try {
        await deleteOrder(id)
        ElMessage.success('订单删除成功')
        fetchOrderList()
      } catch (error) {
        console.error('删除订单失败:', error)
        ElMessage.error('删除订单失败')
      }
    }

    // 新建订单
    const handleCreateOrder = () => {
      router.push({ name: 'OrderCreate' })
    }

    onMounted(() => {
      fetchOrderList()
    })

    return {
      loading,
      orderList,
      total,
      currentPage,
      pageSize,
      searchForm,
      handleSearch,
      resetSearch,
      handleSizeChange,
      handleCurrentChange,
      getOrderStatusText,
      getOrderStatusType,
      getPaymentStatusText,
      getPaymentStatusType,
      formatCurrency,
      handleViewOrder,
      handleEditOrder,
      handleDeleteOrder,
      handleCreateOrder
    }
  }
}
</script>

<style scoped>
.order-list-container {
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

.list-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 