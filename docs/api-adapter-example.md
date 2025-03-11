# API适配层使用示例

## 1. 列表组件示例

```vue
<template>
  <div class="list-container">
    <!-- 列表内容 -->
    <el-table
      v-loading="loading"
      :data="dataList"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="status" label="状态" />
      <!-- 其他列... -->
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.limit"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDataList } from '@/api/data'
import { handleListResponse } from '@/utils/api-adapter'

export default {
  name: 'DataList',
  setup() {
    const loading = ref(false)
    const dataList = ref([])
    const total = ref(0)

    const queryParams = reactive({
      name: '',
      status: '',
      page: 1,
      limit: 10
    })

    // 获取数据列表
    const fetchData = () => {
      loading.value = true
      getDataList(queryParams)
        .then(response => {
          // 使用API适配层处理响应
          const { data, total: totalCount } = handleListResponse(response)
          dataList.value = data
          total.value = totalCount
        })
        .catch(error => {
          console.error('获取数据列表失败', error)
          ElMessage.error('获取数据列表失败')
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 处理查询
    const handleQuery = () => {
      queryParams.page = 1
      fetchData()
    }

    // 重置查询
    const resetQuery = () => {
      queryParams.name = ''
      queryParams.status = ''
      queryParams.page = 1
      fetchData()
    }

    // 处理页码变化
    const handleCurrentChange = (page) => {
      queryParams.page = page
      fetchData()
    }

    // 处理每页条数变化
    const handleSizeChange = (limit) => {
      queryParams.limit = limit
      queryParams.page = 1
      fetchData()
    }

    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      dataList,
      total,
      queryParams,
      handleQuery,
      resetQuery,
      handleCurrentChange,
      handleSizeChange
    }
  }
}
</script>
```

## 2. 详情组件示例

```vue
<template>
  <div class="detail-container" v-loading="loading">
    <div v-if="detailData">
      <h2>{{ detailData.name }}</h2>
      <p>ID: {{ detailData.id }}</p>
      <p>状态: {{ detailData.status }}</p>
      <!-- 其他字段... -->
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getDataDetail } from '@/api/data'
import { handleDetailResponse } from '@/utils/api-adapter'

export default {
  name: 'DataDetail',
  setup() {
    const route = useRoute()
    const loading = ref(false)
    const detailData = ref(null)
    const id = route.params.id

    // 获取详情数据
    const fetchDetail = async () => {
      loading.value = true
      try {
        const response = await getDataDetail(id)
        // 使用API适配层处理响应
        detailData.value = handleDetailResponse(response)
      } catch (error) {
        console.error('获取详情失败', error)
        ElMessage.error('获取详情失败')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchDetail()
    })

    return {
      loading,
      detailData
    }
  }
}
</script>
```

## 3. 表单提交示例

```vue
<template>
  <div class="form-container">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status">
          <el-option label="启用" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>
      </el-form-item>
      <!-- 其他表单项... -->
      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="submitting">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createData } from '@/api/data'
import { handleErrorResponse } from '@/utils/api-adapter'

export default {
  name: 'DataForm',
  setup() {
    const router = useRouter()
    const formRef = ref(null)
    const submitting = ref(false)

    const form = reactive({
      name: '',
      status: 'active'
    })

    const rules = {
      name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
      ],
      status: [
        { required: true, message: '请选择状态', trigger: 'change' }
      ]
    }

    // 提交表单
    const submitForm = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate(async (valid) => {
        if (valid) {
          submitting.value = true
          try {
            await createData(form)
            ElMessage.success('创建成功')
            router.push('/data/list')
          } catch (error) {
            // 使用API适配层处理错误
            const errorInfo = handleErrorResponse(error)
            ElMessage.error(errorInfo.message)
          } finally {
            submitting.value = false
          }
        }
      })
    }

    // 重置表单
    const resetForm = () => {
      if (formRef.value) {
        formRef.value.resetFields()
      }
    }

    return {
      formRef,
      form,
      rules,
      submitting,
      submitForm,
      resetForm
    }
  }
}
</script> 