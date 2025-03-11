import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import store from '@/store'
import router from '@/router'
import { handleErrorResponse } from './api-adapter'
import { namingConvention } from './naming'

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // url = base url + request url
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    if (store.getters.token) {
      // 让每个请求携带token
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    
    // 转换请求数据的命名规范（驼峰转下划线）
    if (config.data && typeof config.data === 'object') {
      config.data = namingConvention.toBackend(config.data)
    }
    
    // 转换查询参数的命名规范
    if (config.params && typeof config.params === 'object') {
      config.params = namingConvention.toBackend(config.params)
    }
    
    // 添加调试日志
    console.log('请求配置:', config)
    
    return config
  },
  error => {
    // 对请求错误做些什么
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 转换响应数据的命名规范（下划线转驼峰）
    const transformedData = namingConvention.fromBackend(res)

    // 如果自定义代码不是200，则判断为错误
    if (transformedData.code !== 200 && transformedData.code !== undefined) {
      ElMessage({
        message: transformedData.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })

      // 401: 未登录或token过期
      if (transformedData.code === 401) {
        // 直接清除用户信息并重定向到登录页面
        store.dispatch('logout').then(() => {
          // 重新加载页面以避免路由守卫问题
          router.push('/login')
        })
      }
      return Promise.reject(new Error(transformedData.message || '请求失败'))
    } else {
      return transformedData
    }
  },
  error => {
    console.log('err' + error) // for debug
    
    // 使用API适配层处理错误响应
    const errorInfo = handleErrorResponse(error)
    
    ElMessage({
      message: errorInfo.message,
      type: 'error',
      duration: 5 * 1000
    })
    
    // 401: 未登录或token过期
    if (error.response && error.response.status === 401) {
      // 直接清除用户信息并重定向到登录页面
      store.dispatch('logout').then(() => {
        // 重新加载页面以避免路由守卫问题
        router.push('/login')
      })
    }
    
    return Promise.reject(error)
  }
)

export default service 