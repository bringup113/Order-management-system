/**
 * 全局错误处理工具
 * 用于统一处理前端错误
 */
import { ElMessage, ElNotification } from 'element-plus'
import { handleErrorResponse } from './api-adapter'
import router from '@/router'
import store from '@/store'
import errorLogger from './error-logger'

/**
 * 错误级别枚举
 */
export const ErrorLevel = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  FATAL: 'fatal'
}

/**
 * 错误类型枚举
 */
export const ErrorType = {
  API: 'api',
  VALIDATION: 'validation',
  BUSINESS: 'business',
  NETWORK: 'network',
  AUTH: 'auth',
  PERMISSION: 'permission',
  SYSTEM: 'system',
  UNKNOWN: 'unknown'
}

/**
 * 自定义错误类
 */
export class AppError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = 'AppError'
    this.level = options.level || ErrorLevel.ERROR
    this.type = options.type || ErrorType.UNKNOWN
    this.code = options.code || 'UNKNOWN_ERROR'
    this.details = options.details || null
    this.data = options.data || null
    this.timestamp = new Date().toISOString()
  }
}

/**
 * 全局错误处理器
 */
export const errorHandler = {
  /**
   * 处理API错误
   * @param {Error} error - 错误对象
   * @param {Object} options - 配置选项
   */
  handleApiError(error, options = {}) {
    const {
      showMessage = true,
      showNotification = false,
      redirectTo = null,
      callback = null,
      logError = true
    } = options

    // 处理错误响应
    const errorInfo = handleErrorResponse(error)
    
    // 记录错误日志
    console.error('API错误:', errorInfo)
    
    // 添加到错误日志
    if (logError) {
      errorLogger.addLog(error, { 
        type: ErrorType.API,
        errorInfo
      })
    }
    
    // 处理特定状态码
    if (errorInfo.status === 401) {
      // 未授权，重定向到登录页
      store.dispatch('logout').then(() => {
        router.push('/login')
      })
      return
    }
    
    if (errorInfo.status === 403) {
      // 权限不足
      if (redirectTo) {
        router.push(redirectTo)
      }
    }
    
    // 显示错误消息
    if (showMessage) {
      ElMessage.error(errorInfo.message)
    }
    
    // 显示错误通知
    if (showNotification) {
      ElNotification({
        title: '错误',
        message: errorInfo.message,
        type: 'error',
        duration: 5000
      })
    }
    
    // 执行回调
    if (callback && typeof callback === 'function') {
      callback(errorInfo)
    }
    
    return errorInfo
  },
  
  /**
   * 处理验证错误
   * @param {Object} errors - 验证错误对象
   * @param {Object} options - 配置选项
   */
  handleValidationError(errors, options = {}) {
    const {
      showMessage = true,
      showNotification = false,
      callback = null,
      logError = true
    } = options
    
    // 构建错误消息
    let errorMessage = '表单验证失败'
    if (Array.isArray(errors)) {
      errorMessage = errors.map(err => err.message || err).join('; ')
    } else if (typeof errors === 'object') {
      errorMessage = Object.values(errors).flat().join('; ')
    } else if (typeof errors === 'string') {
      errorMessage = errors
    }
    
    // 记录错误日志
    console.warn('验证错误:', errors)
    
    // 添加到错误日志
    if (logError) {
      const validationError = new AppError(errorMessage, {
        type: ErrorType.VALIDATION,
        level: ErrorLevel.WARNING,
        details: errors
      })
      errorLogger.addLog(validationError)
    }
    
    // 显示错误消息
    if (showMessage) {
      ElMessage.warning(errorMessage)
    }
    
    // 显示错误通知
    if (showNotification) {
      ElNotification({
        title: '验证错误',
        message: errorMessage,
        type: 'warning',
        duration: 5000
      })
    }
    
    // 执行回调
    if (callback && typeof callback === 'function') {
      callback(errors)
    }
    
    return errors
  },
  
  /**
   * 处理业务错误
   * @param {String|Object} error - 错误消息或对象
   * @param {Object} options - 配置选项
   */
  handleBusinessError(error, options = {}) {
    const {
      showMessage = true,
      showNotification = false,
      level = ErrorLevel.WARNING,
      callback = null,
      logError = true
    } = options
    
    // 构建错误消息
    let errorMessage = '业务处理失败'
    let errorDetails = null
    
    if (typeof error === 'string') {
      errorMessage = error
    } else if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack
    } else if (typeof error === 'object') {
      errorMessage = error.message || '业务处理失败'
      errorDetails = error.details || null
    }
    
    // 记录错误日志
    console.warn('业务错误:', error)
    
    // 添加到错误日志
    if (logError) {
      const businessError = new AppError(errorMessage, {
        type: ErrorType.BUSINESS,
        level,
        details: errorDetails
      })
      errorLogger.addLog(businessError)
    }
    
    // 显示错误消息
    if (showMessage) {
      if (level === ErrorLevel.ERROR) {
        ElMessage.error(errorMessage)
      } else if (level === ErrorLevel.WARNING) {
        ElMessage.warning(errorMessage)
      } else {
        ElMessage.info(errorMessage)
      }
    }
    
    // 显示错误通知
    if (showNotification) {
      ElNotification({
        title: '业务错误',
        message: errorMessage,
        type: level === ErrorLevel.ERROR ? 'error' : 'warning',
        duration: 5000
      })
    }
    
    // 执行回调
    if (callback && typeof callback === 'function') {
      callback({ message: errorMessage, details: errorDetails })
    }
    
    return { message: errorMessage, details: errorDetails }
  },
  
  /**
   * 处理系统错误
   * @param {Error} error - 错误对象
   * @param {Object} options - 配置选项
   */
  handleSystemError(error, options = {}) {
    const {
      showMessage = true,
      showNotification = true,
      callback = null,
      logError = true
    } = options
    
    // 构建错误消息
    const errorMessage = error.message || '系统错误'
    
    // 记录错误日志
    console.error('系统错误:', error)
    
    // 添加到错误日志
    if (logError) {
      const systemError = new AppError(errorMessage, {
        type: ErrorType.SYSTEM,
        level: ErrorLevel.ERROR,
        details: error.stack
      })
      errorLogger.addLog(systemError)
    }
    
    // 显示错误消息
    if (showMessage) {
      ElMessage.error(errorMessage)
    }
    
    // 显示错误通知
    if (showNotification) {
      ElNotification({
        title: '系统错误',
        message: errorMessage,
        type: 'error',
        duration: 0 // 不自动关闭
      })
    }
    
    // 执行回调
    if (callback && typeof callback === 'function') {
      callback(error)
    }
    
    return error
  },
  
  /**
   * 全局错误处理函数
   * @param {Error} error - 错误对象
   * @param {Object} options - 配置选项
   */
  handle(error, options = {}) {
    // 根据错误类型分发到不同的处理函数
    if (error instanceof AppError) {
      switch (error.type) {
        case ErrorType.API:
          return this.handleApiError(error, options)
        case ErrorType.VALIDATION:
          return this.handleValidationError(error.details || error.message, options)
        case ErrorType.BUSINESS:
          return this.handleBusinessError(error, { ...options, level: error.level })
        case ErrorType.SYSTEM:
          return this.handleSystemError(error, options)
        default:
          return this.handleSystemError(error, options)
      }
    } else if (error.isAxiosError) {
      return this.handleApiError(error, options)
    } else if (error.name === 'ValidationError') {
      return this.handleValidationError(error.details || error.message, options)
    } else {
      return this.handleSystemError(error, options)
    }
  }
}

/**
 * 全局错误处理函数
 * @param {Error} error - 错误对象
 * @param {Object} vm - Vue实例
 * @param {String} info - 错误信息
 */
export function globalErrorHandler(error, vm, info) {
  console.error('全局错误:', error, vm, info)
  
  // 处理错误
  errorHandler.handle(error, {
    showNotification: true
  })
}

/**
 * 全局Promise错误处理函数
 * @param {Event} event - 错误事件
 */
export function globalPromiseErrorHandler(event) {
  console.error('未处理的Promise错误:', event.reason)
  
  // 处理错误
  errorHandler.handle(event.reason, {
    showNotification: true
  })
}

export default errorHandler; 