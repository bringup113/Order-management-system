/**
 * API响应适配层
 * 统一处理不同格式的API响应
 */

/**
 * 处理列表响应
 * @param {Object} response - API响应对象
 * @returns {Object} 标准化的响应对象 { data, total }
 */
export function handleListResponse(response) {
  if (!response) return { data: [], total: 0 };

  // 处理标准格式响应：{ total, page, limit, data }
  if (response.data !== undefined && response.total !== undefined) {
    return {
      data: response.data || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10
    };
  }

  // 处理旧格式响应：{ code, message, data: { items, total } }
  if (response.code !== undefined && response.data && response.data.items) {
    return {
      data: response.data.items || [],
      total: response.data.total || 0,
      page: response.data.page || 1,
      limit: response.data.limit || 10
    };
  }

  // 处理其他可能的格式
  if (Array.isArray(response)) {
    return {
      data: response,
      total: response.length,
      page: 1,
      limit: response.length
    };
  }

  // 兜底处理
  console.warn('未知的API响应格式:', response);
  return {
    data: Array.isArray(response.data) ? response.data : [],
    total: response.total || 0,
    page: response.page || 1,
    limit: response.limit || 10
  };
}

/**
 * 处理详情响应
 * @param {Object} response - API响应对象
 * @returns {Object} 标准化的响应对象
 */
export function handleDetailResponse(response) {
  if (!response) return null;

  // 处理标准格式响应：{ data }
  if (response.data !== undefined) {
    return response.data;
  }

  // 处理旧格式响应：{ code, message, data }
  if (response.code !== undefined && response.data) {
    return response.data;
  }

  // 兜底处理
  return response;
}

/**
 * 处理错误响应
 * @param {Object} error - 错误对象
 * @returns {Object} 标准化的错误对象 { message, details, code, status }
 */
export function handleErrorResponse(error) {
  if (!error) return { message: '未知错误', code: 'UNKNOWN_ERROR', status: 500 };

  // 添加详细错误日志
  console.error('API错误详情:', {
    error,
    response: error.response,
    request: error.request,
    config: error.config
  });

  // 处理Axios错误
  if (error.response) {
    const { data, status } = error.response;
    
    // 处理标准格式错误：{ message, error }
    if (data && data.message) {
      return {
        message: data.message,
        details: data.error,
        code: data.code || `HTTP_${status}`,
        status
      };
    }
    
    // 处理旧格式错误：{ code, message }
    if (data && data.code && data.message) {
      return {
        message: data.message,
        details: null,
        code: data.code,
        status
      };
    }

    // 处理HTTP状态码错误
    return {
      message: getHttpStatusMessage(status),
      details: data,
      code: `HTTP_${status}`,
      status
    };
  }

  // 处理网络错误
  if (error.message && error.message.includes('Network Error')) {
    return {
      message: '网络错误，请检查您的网络连接',
      details: error.message,
      code: 'NETWORK_ERROR',
      status: 0
    };
  }

  // 处理超时错误
  if (error.message && error.message.includes('timeout')) {
    return {
      message: '请求超时，请稍后重试',
      details: error.message,
      code: 'TIMEOUT_ERROR',
      status: 408
    };
  }

  // 处理取消请求
  if (axios.isCancel(error)) {
    return {
      message: '请求已取消',
      details: error.message,
      code: 'REQUEST_CANCELLED',
      status: 499
    };
  }

  // 兜底处理
  return {
    message: error.message || '请求失败',
    details: error.stack,
    code: 'UNKNOWN_ERROR',
    status: 500
  };
}

/**
 * 处理成功响应
 * @param {Object} response - API响应对象
 * @returns {Object} 标准化的成功对象 { success, message, data }
 */
export function handleSuccessResponse(response) {
  if (!response) return { success: false, message: '响应为空', data: null };

  // 处理标准格式响应：{ code, message, data }
  if (response.code !== undefined) {
    return {
      success: response.code === 200 || response.code === 201,
      message: response.message || '操作成功',
      data: response.data
    };
  }

  // 兜底处理
  return {
    success: true,
    message: '操作成功',
    data: response
  };
}

/**
 * 根据HTTP状态码获取错误消息
 * @param {Number} status - HTTP状态码
 * @returns {String} 错误消息
 */
function getHttpStatusMessage(status) {
  const statusMessages = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求的资源不存在',
    405: '请求方法不允许',
    408: '请求超时',
    409: '资源冲突',
    410: '资源已删除',
    422: '请求参数验证失败',
    429: '请求过于频繁',
    500: '服务器内部错误',
    501: '服务未实现',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时'
  };
  
  return statusMessages[status] || `请求失败(${status})`;
}

/**
 * 导入axios用于类型检查
 */
import axios from 'axios'; 