/**
 * 错误日志服务
 * 用于收集和上报前端错误
 */
import { AppError, ErrorType, ErrorLevel } from './error-handler'
import store from '@/store'

/**
 * 错误日志类
 */
class ErrorLogger {
  constructor() {
    this.logs = []
    this.maxLogs = 100
    this.enabled = true
  }

  /**
   * 启用日志收集
   */
  enable() {
    this.enabled = true
  }

  /**
   * 禁用日志收集
   */
  disable() {
    this.enabled = false
  }

  /**
   * 添加错误日志
   * @param {Error} error - 错误对象
   * @param {Object} context - 上下文信息
   */
  addLog(error, context = {}) {
    if (!this.enabled) return

    // 构建日志对象
    const log = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      error: this.formatError(error),
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        userId: store.getters.userId || null,
        ...context
      }
    }

    // 添加到日志列表
    this.logs.unshift(log)

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // 保存到本地存储
    this.saveToStorage()

    // 上报错误
    this.reportError(log)

    return log
  }

  /**
   * 格式化错误对象
   * @param {Error} error - 错误对象
   * @returns {Object} - 格式化后的错误对象
   */
  formatError(error) {
    if (error instanceof AppError) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        type: error.type,
        level: error.level,
        code: error.code,
        details: error.details,
        data: error.data,
        timestamp: error.timestamp
      }
    } else if (error.isAxiosError) {
      return {
        name: 'AxiosError',
        message: error.message,
        stack: error.stack,
        type: ErrorType.API,
        level: ErrorLevel.ERROR,
        code: error.code || 'NETWORK_ERROR',
        details: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        },
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      }
    } else {
      return {
        name: error.name || 'Error',
        message: error.message || '未知错误',
        stack: error.stack,
        type: ErrorType.UNKNOWN,
        level: ErrorLevel.ERROR
      }
    }
  }

  /**
   * 生成唯一ID
   * @returns {String} - 唯一ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  }

  /**
   * 保存日志到本地存储
   */
  saveToStorage() {
    try {
      localStorage.setItem('error_logs', JSON.stringify(this.logs))
    } catch (e) {
      console.error('保存错误日志到本地存储失败:', e)
    }
  }

  /**
   * 从本地存储加载日志
   */
  loadFromStorage() {
    try {
      const logs = localStorage.getItem('error_logs')
      if (logs) {
        this.logs = JSON.parse(logs)
      }
    } catch (e) {
      console.error('从本地存储加载错误日志失败:', e)
    }
  }

  /**
   * 清空日志
   */
  clearLogs() {
    this.logs = []
    this.saveToStorage()
  }

  /**
   * 上报错误
   * @param {Object} log - 错误日志
   */
  reportError(log) {
    // 在生产环境中上报错误
    if (process.env.NODE_ENV === 'production') {
      // 这里可以实现上报逻辑，例如发送到后端API或第三方服务
      // 示例：发送到后端API
      this.sendToBackend(log)
    }
  }

  /**
   * 发送错误日志到后端
   * @param {Object} log - 错误日志
   */
  sendToBackend(log) {
    // 这里是一个示例，实际项目中可以根据需要实现
    // 可以使用fetch、axios等发送请求
    try {
      const url = '/api/system/error-logs'
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.getters.token}`
        },
        body: JSON.stringify(log)
      }).catch(e => {
        console.error('上报错误日志失败:', e)
      })
    } catch (e) {
      console.error('上报错误日志失败:', e)
    }
  }

  /**
   * 获取所有日志
   * @returns {Array} - 日志列表
   */
  getLogs() {
    return this.logs
  }

  /**
   * 获取指定类型的日志
   * @param {String} type - 错误类型
   * @returns {Array} - 日志列表
   */
  getLogsByType(type) {
    return this.logs.filter(log => log.error.type === type)
  }

  /**
   * 获取指定级别的日志
   * @param {String} level - 错误级别
   * @returns {Array} - 日志列表
   */
  getLogsByLevel(level) {
    return this.logs.filter(log => log.error.level === level)
  }
}

// 创建错误日志实例
const errorLogger = new ErrorLogger()

// 初始化时从本地存储加载日志
errorLogger.loadFromStorage()

export default errorLogger; 