<template>
  <div class="app-wrapper" :class="{ 'sidebar-collapsed': !sidebar.opened }">
    <!-- 侧边栏 -->
    <div class="sidebar-container">
      <div class="logo-container">
        <h1 class="logo-title">订单管理系统</h1>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          :collapse="!sidebar.opened"
          :unique-opened="true"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          router
        >
          <sidebar-item
            v-for="route in routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </el-scrollbar>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="navbar">
        <div class="left-menu">
          <div class="hamburger-container" @click="toggleSidebar">
            <el-icon :size="20">
              <component :is="sidebar.opened ? 'Fold' : 'Expand'" />
            </el-icon>
          </div>
          <breadcrumb />
        </div>
        <div class="right-menu">
          <el-dropdown trigger="click">
            <div class="avatar-wrapper">
              <span>{{ userInfo.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import SidebarItem from './components/SidebarItem.vue'
import Breadcrumb from './components/Breadcrumb.vue'

export default {
  name: 'Layout',
  components: {
    SidebarItem,
    Breadcrumb,
    ArrowDown
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    // 获取路由
    const routes = computed(() => {
      return router.options.routes.filter(route => {
        return route.path !== '/login' && route.path !== '/404'
      })
    })

    // 获取侧边栏状态
    const sidebar = computed(() => store.getters.sidebar)

    // 获取用户信息
    const userInfo = computed(() => store.getters.userInfo)

    // 获取当前激活的菜单
    const activeMenu = computed(() => {
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })

    // 切换侧边栏
    const toggleSidebar = () => {
      store.dispatch('toggleSidebar')
    }

    // 退出登录
    const handleLogout = () => {
      store.dispatch('logout').then(() => {
        router.push('/login')
      }).catch(error => {
        console.error('退出登录失败:', error)
        // 即使退出失败，也强制跳转到登录页面
        router.push('/login')
      })
    }

    return {
      routes,
      sidebar,
      userInfo,
      activeMenu,
      toggleSidebar,
      handleLogout
    }
  }
}
</script>

<style scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
}

.sidebar-container {
  width: 210px;
  height: 100%;
  background-color: #304156;
  transition: width 0.28s;
  overflow: hidden;
}

.sidebar-collapsed .sidebar-container {
  width: 64px;
}

.logo-container {
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #2b2f3a;
}

.logo-title {
  margin: 0;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.navbar {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background-color: #fff;
}

.left-menu {
  display: flex;
  align-items: center;
}

.hamburger-container {
  padding: 0 15px;
  cursor: pointer;
}

.right-menu {
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.app-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5;
}

/* 过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 