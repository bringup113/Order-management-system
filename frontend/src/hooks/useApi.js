import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { handleListResponse, handleDetailResponse, handleErrorResponse, handleSuccessResponse } from '@/utils/api-adapter'

/**
 * 通用API请求钩子
 * @param {Function} apiFunc - API请求函数
 * @param {Object} options - 配置选项
 * @returns {Object} - 包含loading状态、数据和方法的对象
 */
export function useApi(apiFunc, options = {}) {
  const {
    immediate = false,
    params = null,
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = '操作成功',
    errorMessage = '操作失败',
    onSuccess = null,
    onError = null,
    transform = null
  } = options

  const loading = ref(false)
  const data = ref(null)
  const error = ref(null)

  /**
   * 执行API请求
   * @param {Object} requestParams - 请求参数
   * @returns {Promise} - 请求Promise
   */
  const execute = async (requestParams = null) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiFunc(requestParams || params)
      
      // 转换响应数据
      if (transform) {
        data.value = transform(response)
      } else {
        data.value = response
      }
      
      // 显示成功消息
      if (showSuccessMessage) {
        const successResult = handleSuccessResponse(response)
        ElMessage.success(successResult.message || successMessage)
      }
      
      // 执行成功回调
      if (onSuccess) {
        onSuccess(data.value)
      }
      
      return data.value
    } catch (err) {
      // 处理错误
      const errorResult = handleErrorResponse(err)
      error.value = errorResult
      
      // 显示错误消息
      if (showErrorMessage) {
        ElMessage.error(errorResult.message || errorMessage)
      }
      
      // 执行错误回调
      if (onError) {
        onError(errorResult)
      }
      
      return Promise.reject(errorResult)
    } finally {
      loading.value = false
    }
  }

  // 如果设置了立即执行，则立即调用API
  if (immediate) {
    execute()
  }

  return {
    loading,
    data,
    error,
    execute
  }
}

/**
 * 列表数据API请求钩子
 * @param {Function} apiFunc - API请求函数
 * @param {Object} options - 配置选项
 * @returns {Object} - 包含列表数据、分页信息和方法的对象
 */
export function useListApi(apiFunc, options = {}) {
  const {
    immediate = false,
    params = { page: 1, limit: 10 },
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = '获取列表成功',
    errorMessage = '获取列表失败',
    onSuccess = null,
    onError = null
  } = options

  const loading = ref(false)
  const list = ref([])
  const total = ref(0)
  const page = ref(params.page || 1)
  const limit = ref(params.limit || 10)
  const error = ref(null)

  /**
   * 执行列表API请求
   * @param {Object} requestParams - 请求参数
   * @returns {Promise} - 请求Promise
   */
  const fetchList = async (requestParams = null) => {
    loading.value = true
    error.value = null
    
    try {
      const mergedParams = { ...params, ...requestParams }
      const response = await apiFunc(mergedParams)
      
      // 处理列表响应
      const listResult = handleListResponse(response)
      list.value = listResult.data
      total.value = listResult.total
      page.value = listResult.page
      limit.value = listResult.limit
      
      // 显示成功消息
      if (showSuccessMessage) {
        ElMessage.success(successMessage)
      }
      
      // 执行成功回调
      if (onSuccess) {
        onSuccess(listResult)
      }
      
      return listResult
    } catch (err) {
      // 处理错误
      const errorResult = handleErrorResponse(err)
      error.value = errorResult
      
      // 显示错误消息
      if (showErrorMessage) {
        ElMessage.error(errorResult.message || errorMessage)
      }
      
      // 执行错误回调
      if (onError) {
        onError(errorResult)
      }
      
      return Promise.reject(errorResult)
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理页码变化
   * @param {Number} newPage - 新页码
   */
  const handlePageChange = (newPage) => {
    page.value = newPage
    fetchList({ page: newPage, limit: limit.value })
  }

  /**
   * 处理每页条数变化
   * @param {Number} newLimit - 新的每页条数
   */
  const handleLimitChange = (newLimit) => {
    limit.value = newLimit
    page.value = 1
    fetchList({ page: 1, limit: newLimit })
  }

  /**
   * 刷新列表
   */
  const refresh = () => {
    fetchList({ page: page.value, limit: limit.value })
  }

  // 如果设置了立即执行，则立即调用API
  if (immediate) {
    fetchList()
  }

  return {
    loading,
    list,
    total,
    page,
    limit,
    error,
    fetchList,
    handlePageChange,
    handleLimitChange,
    refresh
  }
}

/**
 * 详情数据API请求钩子
 * @param {Function} apiFunc - API请求函数
 * @param {Object} options - 配置选项
 * @returns {Object} - 包含详情数据和方法的对象
 */
export function useDetailApi(apiFunc, options = {}) {
  const {
    immediate = false,
    id = null,
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = '获取详情成功',
    errorMessage = '获取详情失败',
    onSuccess = null,
    onError = null
  } = options

  const loading = ref(false)
  const detail = ref(null)
  const error = ref(null)

  /**
   * 执行详情API请求
   * @param {Number|String} detailId - 详情ID
   * @returns {Promise} - 请求Promise
   */
  const fetchDetail = async (detailId = null) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiFunc(detailId || id)
      
      // 处理详情响应
      const detailResult = handleDetailResponse(response)
      detail.value = detailResult
      
      // 显示成功消息
      if (showSuccessMessage) {
        ElMessage.success(successMessage)
      }
      
      // 执行成功回调
      if (onSuccess) {
        onSuccess(detailResult)
      }
      
      return detailResult
    } catch (err) {
      // 处理错误
      const errorResult = handleErrorResponse(err)
      error.value = errorResult
      
      // 显示错误消息
      if (showErrorMessage) {
        ElMessage.error(errorResult.message || errorMessage)
      }
      
      // 执行错误回调
      if (onError) {
        onError(errorResult)
      }
      
      return Promise.reject(errorResult)
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新详情
   */
  const refresh = () => {
    fetchDetail(id)
  }

  // 如果设置了立即执行，则立即调用API
  if (immediate && id) {
    fetchDetail()
  }

  return {
    loading,
    detail,
    error,
    fetchDetail,
    refresh
  }
}

/**
 * 提交数据API请求钩子
 * @param {Function} apiFunc - API请求函数
 * @param {Object} options - 配置选项
 * @returns {Object} - 包含提交状态和方法的对象
 */
export function useSubmitApi(apiFunc, options = {}) {
  const {
    showSuccessMessage = true,
    showErrorMessage = true,
    successMessage = '操作成功',
    errorMessage = '操作失败',
    onSuccess = null,
    onError = null
  } = options

  const loading = ref(false)
  const error = ref(null)

  /**
   * 执行提交API请求
   * @param {Object} data - 提交数据
   * @returns {Promise} - 请求Promise
   */
  const submit = async (data) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiFunc(data)
      
      // 显示成功消息
      if (showSuccessMessage) {
        const successResult = handleSuccessResponse(response)
        ElMessage.success(successResult.message || successMessage)
      }
      
      // 执行成功回调
      if (onSuccess) {
        onSuccess(response)
      }
      
      return response
    } catch (err) {
      // 处理错误
      const errorResult = handleErrorResponse(err)
      error.value = errorResult
      
      // 显示错误消息
      if (showErrorMessage) {
        ElMessage.error(errorResult.message || errorMessage)
      }
      
      // 执行错误回调
      if (onError) {
        onError(errorResult)
      }
      
      return Promise.reject(errorResult)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    submit
  }
} 