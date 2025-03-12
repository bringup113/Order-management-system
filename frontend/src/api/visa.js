import request from '@/utils/request'

/**
 * 获取签证列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getVisaList(params) {
  return request({
    url: '/visas',
    method: 'get',
    params
  })
}

/**
 * 获取签证详情
 * @param {Number} id 签证ID
 * @returns {Promise}
 */
export function getVisaDetail(id) {
  return request({
    url: `/visas/${id}`,
    method: 'get'
  })
}

/**
 * 创建签证
 * @param {Object} data 签证数据
 * @returns {Promise}
 */
export function createVisa(data) {
  return request({
    url: '/visas',
    method: 'post',
    data
  })
}

/**
 * 更新签证
 * @param {Number} id 签证ID
 * @param {Object} data 签证数据
 * @returns {Promise}
 */
export function updateVisa(id, data) {
  return request({
    url: `/visas/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除签证
 * @param {Number} id 签证ID
 * @returns {Promise}
 */
export function deleteVisa(id) {
  return request({
    url: `/visas/${id}`,
    method: 'delete'
  })
}

/**
 * 根据护照ID获取签证列表
 * @param {Number} passportId 护照ID
 * @returns {Promise}
 */
export function getVisasByPassportId(passportId) {
  return request({
    url: '/visas',
    method: 'get',
    params: { passportId }
  })
} 