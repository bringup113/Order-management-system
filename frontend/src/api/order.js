import request from '@/utils/request'

/**
 * 获取订单列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getOrderList(params) {
  return request({
    url: '/orders',
    method: 'get',
    params
  })
}

/**
 * 获取订单详情
 * @param {Number} id 订单ID
 * @returns {Promise}
 */
export function getOrderDetail(id) {
  return request({
    url: `/orders/${id}`,
    method: 'get'
  })
}

/**
 * 创建订单
 * @param {Object} data 订单数据
 * @returns {Promise}
 */
export function createOrder(data) {
  return request({
    url: '/orders',
    method: 'post',
    data
  })
}

/**
 * 更新订单
 * @param {Number} id 订单ID
 * @param {Object} data 订单数据
 * @returns {Promise}
 */
export function updateOrder(id, data) {
  return request({
    url: `/orders/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除订单
 * @param {Number} id 订单ID
 * @returns {Promise}
 */
export function deleteOrder(id) {
  return request({
    url: `/orders/${id}`,
    method: 'delete'
  })
}

/**
 * 获取订单项列表
 * @param {Number} orderId 订单ID
 * @returns {Promise}
 */
export function getOrderItems(orderId) {
  return request({
    url: `/orders/${orderId}/items`,
    method: 'get'
  })
}

/**
 * 添加订单项
 * @param {Number} orderId 订单ID
 * @param {Object} data 订单项数据
 * @returns {Promise}
 */
export function addOrderItem(orderId, data) {
  return request({
    url: `/orders/${orderId}/items`,
    method: 'post',
    data
  })
}

/**
 * 更新订单项
 * @param {Number} id 订单项ID
 * @param {Object} data 订单项数据
 * @returns {Promise}
 */
export function updateOrderItem(id, data) {
  return request({
    url: `/order-items/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除订单项
 * @param {Number} id 订单项ID
 * @returns {Promise}
 */
export function deleteOrderItem(id) {
  return request({
    url: `/order-items/${id}`,
    method: 'delete'
  })
}

/**
 * 更新订单状态
 * @param {Number} id 订单ID
 * @param {String} status 订单状态
 * @returns {Promise}
 */
export function updateOrderStatus(id, status) {
  return request({
    url: `/orders/${id}/status`,
    method: 'put',
    data: { status }
  })
}

/**
 * 更新订单支付状态
 * @param {Number} id 订单ID
 * @param {String} paymentStatus 支付状态
 * @returns {Promise}
 */
export function updatePaymentStatus(id, paymentStatus) {
  return request({
    url: `/orders/${id}/payment-status`,
    method: 'put',
    data: { paymentStatus }
  })
} 