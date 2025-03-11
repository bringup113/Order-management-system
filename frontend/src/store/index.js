import { createStore } from 'vuex'
import Cookies from 'js-cookie'
import { login, getUserInfo, logout } from '@/api/auth'

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      token: Cookies.get('token') || '',
      userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
      sidebar: {
        opened: localStorage.getItem('sidebarStatus') ? !!+localStorage.getItem('sidebarStatus') : true
      }
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      Cookies.set('token', token)
    },
    REMOVE_TOKEN(state) {
      state.token = ''
      Cookies.remove('token')
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    CLEAR_USER_INFO(state) {
      state.userInfo = {}
      localStorage.removeItem('userInfo')
    },
    TOGGLE_SIDEBAR(state) {
      state.sidebar.opened = !state.sidebar.opened
      localStorage.setItem('sidebarStatus', state.sidebar.opened ? '1' : '0')
    }
  },
  actions: {
    // 登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            const { token, ...userInfo } = response
            commit('SET_TOKEN', token)
            commit('SET_USER_INFO', userInfo)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 登出
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          // 先清除本地存储的token和用户信息
          commit('REMOVE_TOKEN')
          commit('CLEAR_USER_INFO')
          
          // 然后调用后端登出接口，即使失败也不影响前端登出
          logout().catch(error => console.error('登出请求失败', error))
          
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    // 切换侧边栏
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    }
  },
  getters: {
    token: state => state.token,
    userInfo: state => state.userInfo,
    sidebar: state => state.sidebar
  }
})

export default store 