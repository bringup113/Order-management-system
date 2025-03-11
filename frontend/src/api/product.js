import request from '@/utils/request'

/**
 * 获取产品列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getProductList(params) {
  return request({
    url: '/products',
    method: 'get',
    params
  })
}

/**
 * 获取产品详情
 * @param {Number} id 产品ID
 * @returns {Promise}
 */
export function getProductDetail(id) {
  return request({
    url: `/products/${id}`,
    method: 'get'
  })
}

/**
 * 创建产品
 * @param {Object} data 产品数据
 * @returns {Promise}
 */
export function createProduct(data) {
  return request({
    url: '/products',
    method: 'post',
    data
  })
}

/**
 * 更新产品
 * @param {Number} id 产品ID
 * @param {Object} data 产品数据
 * @returns {Promise}
 */
export function updateProduct(id, data) {
  return request({
    url: `/products/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除产品
 * @param {Number} id 产品ID
 * @returns {Promise}
 */
export function deleteProduct(id) {
  return request({
    url: `/products/${id}`,
    method: 'delete'
  })
}

/**
 * 获取产品报价列表
 * @param {Number} productId 产品ID
 * @returns {Promise}
 */
export function getProductQuotes(productId) {
  return request({
    url: `/products/${productId}/quotes`,
    method: 'get'
  })
}

/**
 * 创建产品报价
 * @param {Number} productId 产品ID
 * @param {Object} data 报价数据
 * @returns {Promise}
 */
export function createProductQuote(productId, data) {
  return request({
    url: `/products/${productId}/quotes`,
    method: 'post',
    data
  })
}

/**
 * 更新产品报价
 * @param {Number} id 报价ID
 * @param {Object} data 报价数据
 * @returns {Promise}
 */
export function updateProductQuote(id, data) {
  return request({
    url: `/product-quotes/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除产品报价
 * @param {Number} id 报价ID
 * @returns {Promise}
 */
export function deleteProductQuote(id) {
  return request({
    url: `/product-quotes/${id}`,
    method: 'delete'
  })
}

/**
 * 获取代理产品价格列表
 * @param {Number} quoteId 报价ID
 * @returns {Promise}
 */
export function getAgentProductPrices(quoteId) {
  return request({
    url: `/product-quotes/${quoteId}/agent-prices`,
    method: 'get'
  })
}

/**
 * 创建代理产品价格
 * @param {Number} quoteId 报价ID
 * @param {Object} data 代理价格数据
 * @returns {Promise}
 */
export function createAgentProductPrice(quoteId, data) {
  return request({
    url: `/product-quotes/${quoteId}/agent-prices`,
    method: 'post',
    data
  })
}

/**
 * 更新代理产品价格
 * @param {Number} id 代理价格ID
 * @param {Object} data 代理价格数据
 * @returns {Promise}
 */
export function updateAgentProductPrice(id, data) {
  return request({
    url: `/agent-product-prices/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除代理产品价格
 * @param {Number} id 代理价格ID
 * @returns {Promise}
 */
export function deleteAgentProductPrice(id) {
  return request({
    url: `/agent-product-prices/${id}`,
    method: 'delete'
  })
} 