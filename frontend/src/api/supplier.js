import request from '@/utils/request'

/**
 * 获取供应商列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getSupplierList(params) {
  return request({
    url: '/suppliers',
    method: 'get',
    params
  })
}

/**
 * 获取供应商详情
 * @param {Number} id 供应商ID
 * @returns {Promise}
 */
export function getSupplierDetail(id) {
  return request({
    url: `/suppliers/${id}`,
    method: 'get'
  })
}

/**
 * 新增供应商
 * @param {Object} data 供应商数据
 * @returns {Promise}
 */
export function createSupplier(data) {
  return request({
    url: '/suppliers',
    method: 'post',
    data
  })
}

/**
 * 更新供应商
 * @param {Number} id 供应商ID
 * @param {Object} data 供应商数据
 * @returns {Promise}
 */
export function updateSupplier(id, data) {
  return request({
    url: `/suppliers/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除供应商
 * @param {Number} id 供应商ID
 * @returns {Promise}
 */
export function deleteSupplier(id) {
  return request({
    url: `/suppliers/${id}`,
    method: 'delete'
  })
} 