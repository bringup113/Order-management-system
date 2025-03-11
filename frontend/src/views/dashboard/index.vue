<template>
  <div class="dashboard-container">
    <div class="welcome-section">
      <h2>欢迎使用订单管理系统</h2>
      <p>当前用户：{{ userInfo.name }}</p>
    </div>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="data-card">
          <div class="data-card-content">
            <div class="data-card-value">{{ stats.orderCount }}</div>
            <div class="data-card-title">订单总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card">
          <div class="data-card-content">
            <div class="data-card-value">{{ stats.pendingOrderCount }}</div>
            <div class="data-card-title">待处理订单</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card">
          <div class="data-card-content">
            <div class="data-card-value">{{ stats.customerCount }}</div>
            <div class="data-card-title">客户总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card">
          <div class="data-card-content">
            <div class="data-card-value">{{ formatCurrency(stats.totalAmount) }}</div>
            <div class="data-card-title">订单总金额</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <div class="chart-title">订单状态分布</div>
          <div ref="orderStatusChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <div class="chart-title">最近7天订单趋势</div>
          <div ref="orderTrendChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="recent-orders-card">
      <div class="card-header">
        <div class="card-title">最近订单</div>
        <el-button type="text" @click="viewAllOrders">查看全部</el-button>
      </div>
      <el-table :data="recentOrders" style="width: 100%">
        <el-table-column prop="orderNo" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="passportName" label="客户姓名" width="120"></el-table-column>
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
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="text" @click="viewOrderDetail(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts/core'
import { PieChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import axios from 'axios'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PieChart,
  LineChart,
  CanvasRenderer
])

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore()
    const router = useRouter()
    const orderStatusChart = ref(null)
    const orderTrendChart = ref(null)
    const recentOrders = ref([])
    const stats = ref({
      orderCount: 0,
      pendingOrderCount: 0,
      customerCount: 0,
      totalAmount: 0
    })

    // 获取用户信息
    const userInfo = computed(() => store.getters.userInfo)

    // 获取统计数据
    const fetchStats = async () => {
      try {
        // 这里应该调用API获取统计数据，简化处理使用模拟数据
        stats.value = {
          orderCount: 128,
          pendingOrderCount: 23,
          customerCount: 56,
          totalAmount: 256800
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
      }
    }

    // 获取最近订单
    const fetchRecentOrders = async () => {
      try {
        // 这里应该调用API获取最近订单，简化处理使用模拟数据
        recentOrders.value = [
          {
            id: 1,
            orderNo: 'ORD20230001',
            passportName: '张三',
            totalAmount: 12800,
            orderDate: '2023-07-15',
            orderStatus: 'completed'
          },
          {
            id: 2,
            orderNo: 'ORD20230002',
            passportName: '李四',
            totalAmount: 9600,
            orderDate: '2023-07-16',
            orderStatus: 'processing'
          },
          {
            id: 3,
            orderNo: 'ORD20230003',
            passportName: '王五',
            totalAmount: 15200,
            orderDate: '2023-07-17',
            orderStatus: 'pending'
          },
          {
            id: 4,
            orderNo: 'ORD20230004',
            passportName: '赵六',
            totalAmount: 7800,
            orderDate: '2023-07-18',
            orderStatus: 'cancelled'
          },
          {
            id: 5,
            orderNo: 'ORD20230005',
            passportName: '钱七',
            totalAmount: 18500,
            orderDate: '2023-07-19',
            orderStatus: 'pending'
          }
        ]
      } catch (error) {
        console.error('获取最近订单失败:', error)
      }
    }

    // 初始化订单状态分布图表
    const initOrderStatusChart = () => {
      const chartDom = orderStatusChart.value
      const myChart = echarts.init(chartDom)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['待处理', '处理中', '已完成', '已取消']
        },
        series: [
          {
            name: '订单状态',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 23, name: '待处理' },
              { value: 35, name: '处理中' },
              { value: 58, name: '已完成' },
              { value: 12, name: '已取消' }
            ]
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }

    // 初始化订单趋势图表
    const initOrderTrendChart = () => {
      const chartDom = orderTrendChart.value
      const myChart = echarts.init(chartDom)
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['订单数量', '订单金额']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: [
          {
            type: 'value',
            name: '订单数量',
            position: 'left'
          },
          {
            type: 'value',
            name: '订单金额',
            position: 'right',
            axisLabel: {
              formatter: '{value} 元'
            }
          }
        ],
        series: [
          {
            name: '订单数量',
            type: 'line',
            data: [5, 8, 12, 6, 9, 15, 10]
          },
          {
            name: '订单金额',
            type: 'line',
            yAxisIndex: 1,
            data: [15000, 24000, 36000, 18000, 27000, 45000, 30000]
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }

    // 查看所有订单
    const viewAllOrders = () => {
      router.push('/order/list')
    }

    // 查看订单详情
    const viewOrderDetail = (id) => {
      router.push(`/order/detail/${id}`)
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

    // 格式化货币
    const formatCurrency = (value) => {
      return `¥ ${parseFloat(value).toFixed(2)}`
    }

    onMounted(() => {
      fetchStats()
      fetchRecentOrders()
      initOrderStatusChart()
      initOrderTrendChart()
    })

    return {
      userInfo,
      stats,
      recentOrders,
      orderStatusChart,
      orderTrendChart,
      viewAllOrders,
      viewOrderDetail,
      getOrderStatusText,
      getOrderStatusType,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 20px;
}

.welcome-section h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.welcome-section p {
  margin: 0;
  color: #606266;
}

.data-card {
  height: 120px;
  margin-bottom: 20px;
}

.data-card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.data-card-value {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
}

.data-card-title {
  font-size: 14px;
  color: #606266;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 350px;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}

.chart {
  height: 300px;
}

.recent-orders-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}
</style> 