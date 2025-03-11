<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { compile } from 'path-to-regexp'

export default {
  name: 'Breadcrumb',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const levelList = ref([])

    // 获取面包屑导航列表
    const getBreadcrumb = () => {
      // 只显示有meta.title的路由
      let matched = route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      // 如果不是首页，则添加首页
      if (first && first.path !== '/') {
        matched = [{ path: '/', meta: { title: '首页' } }].concat(matched)
      }

      levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    }

    // 处理链接点击
    const handleLink = (item) => {
      const { redirect, path } = item
      if (redirect) {
        router.push(redirect)
        return
      }
      router.push(pathCompile(path))
    }

    // 编译路径
    const pathCompile = (path) => {
      const { params } = route
      const toPath = compile(path)
      return toPath(params)
    }

    // 监听路由变化
    watch(
      () => route.path,
      () => {
        getBreadcrumb()
      },
      { immediate: true }
    )

    return {
      levelList,
      handleLink
    }
  }
}
</script>

<style scoped>
.app-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
}

.app-breadcrumb .no-redirect {
  color: #97a8be;
  cursor: text;
}

/* 过渡动画 */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-leave-active {
  position: absolute;
}
</style> 