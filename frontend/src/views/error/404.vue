<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <div class="actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  setup() {
    const router = useRouter()

    const goHome = () => {
      router.push('/')
    }

    const goBack = () => {
      router.go(-1)
    }

    return {
      goHome,
      goBack
    }
  }
}
</script>

<style scoped>
.not-found {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
}

.not-found-content {
  text-align: center;
}

.not-found-content h1 {
  font-size: 120px;
  color: #409EFF;
  margin: 0;
}

.not-found-content h2 {
  font-size: 24px;
  color: #606266;
  margin: 20px 0 40px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style> 