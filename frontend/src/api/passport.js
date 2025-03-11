import request from '@/utils/request'

/**
 * 获取护照列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getPassportList(params) {
  return request({
    url: '/passports',
    method: 'get',
    params
  })
}

/**
 * 获取护照详情
 * @param {Number} id 护照ID
 * @returns {Promise}
 */
export function getPassportDetail(id) {
  return request({
    url: `/passports/${id}`,
    method: 'get'
  })
}

/**
 * 创建护照
 * @param {Object} data 护照数据
 * @returns {Promise}
 */
export function createPassport(data) {
  return request({
    url: '/passports',
    method: 'post',
    data
  })
}

/**
 * 更新护照
 * @param {Number} id 护照ID
 * @param {Object} data 护照数据
 * @returns {Promise}
 */
export function updatePassport(id, data) {
  return request({
    url: `/passports/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除护照
 * @param {Number} id 护照ID
 * @returns {Promise}
 */
export function deletePassport(id) {
  return request({
    url: `/passports/${id}`,
    method: 'delete'
  })
}

/**
 * 搜索护照
 * @param {Object} params 搜索参数
 * @returns {Promise}
 */
export function searchPassports(params) {
  return request({
    url: '/passports/search',
    method: 'get',
    params
  })
} 