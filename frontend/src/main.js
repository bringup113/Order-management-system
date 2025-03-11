import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './styles/index.scss'
import { globalErrorHandler, globalPromiseErrorHandler } from './utils/error-handler'

// 创建Vue应用实例
const app = createApp(App)

// 注册全局错误处理器
app.config.errorHandler = globalErrorHandler

// 注册全局Promise错误处理器
window.addEventListener('unhandledrejection', globalPromiseErrorHandler)

// 使用插件
app.use(router)
app.use(store)
app.use(ElementPlus, {
  locale: zhCn
})

// 挂载应用
app.mount('#app') 