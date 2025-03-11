import request from '@/utils/request'

/**
 * 获取账单列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getInvoiceList(params) {
  return request({
    url: '/invoices',
    method: 'get',
    params
  })
}

/**
 * 获取账单详情
 * @param {Number} id 账单ID
 * @returns {Promise}
 */
export function getInvoiceDetail(id) {
  return request({
    url: `/invoices/${id}`,
    method: 'get'
  })
}

/**
 * 创建账单
 * @param {Object} data 账单数据
 * @returns {Promise}
 */
export function createInvoice(data) {
  return request({
    url: '/invoices',
    method: 'post',
    data
  })
}

/**
 * 更新账单
 * @param {Number} id 账单ID
 * @param {Object} data 账单数据
 * @returns {Promise}
 */
export function updateInvoice(id, data) {
  return request({
    url: `/invoices/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除账单
 * @param {Number} id 账单ID
 * @returns {Promise}
 */
export function deleteInvoice(id) {
  return request({
    url: `/invoices/${id}`,
    method: 'delete'
  })
}

/**
 * 获取账单关联的订单列表
 * @param {Number} id 账单ID
 * @returns {Promise}
 */
export function getInvoiceOrders(id) {
  return request({
    url: `/invoices/${id}/orders`,
    method: 'get'
  })
}

/**
 * 添加订单到账单
 * @param {Number} id 账单ID
 * @param {Object} data 订单数据
 * @returns {Promise}
 */
export function addOrderToInvoice(id, data) {
  return request({
    url: `/invoices/${id}/orders`,
    method: 'post',
    data
  })
}

/**
 * 从账单中移除订单
 * @param {Number} invoiceId 账单ID
 * @param {Number} orderId 订单ID
 * @returns {Promise}
 */
export function removeOrderFromInvoice(invoiceId, orderId) {
  return request({
    url: `/invoices/${invoiceId}/orders/${orderId}`,
    method: 'delete'
  })
}

/**
 * 获取账单支付记录
 * @param {Number} id 账单ID
 * @returns {Promise}
 */
export function getInvoicePayments(id) {
  return request({
    url: `/invoices/${id}/payments`,
    method: 'get'
  })
}

/**
 * 添加支付记录
 * @param {Number} id 账单ID
 * @param {Object} data 支付记录数据
 * @returns {Promise}
 */
export function addPayment(id, data) {
  return request({
    url: `/invoices/${id}/payments`,
    method: 'post',
    data
  })
}

/**
 * 更新支付记录
 * @param {Number} id 支付记录ID
 * @param {Object} data 支付记录数据
 * @returns {Promise}
 */
export function updatePayment(id, data) {
  return request({
    url: `/payments/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除支付记录
 * @param {Number} id 支付记录ID
 * @returns {Promise}
 */
export function deletePayment(id) {
  return request({
    url: `/payments/${id}`,
    method: 'delete'
  })
}

/**
 * 审核支付记录
 * @param {Number} id 支付记录ID
 * @param {Object} data 审核数据
 * @returns {Promise}
 */
export function reviewPayment(id, data) {
  return request({
    url: `/payments/${id}/review`,
    method: 'put',
    data
  })
}

/**
 * 更新账单状态
 * @param {Number} id 账单ID
 * @param {String} status 账单状态
 * @returns {Promise}
 */
export function updateInvoiceStatus(id, status) {
  return request({
    url: `/invoices/${id}/status`,
    method: 'put',
    data: { status }
  })
} 