import request from '@/utils/request'

/**
 * 获取代理列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getAgentList(params) {
  return request({
    url: '/agents',
    method: 'get',
    params
  })
}

/**
 * 获取代理详情
 * @param {Number} id 代理ID
 * @returns {Promise}
 */
export function getAgentDetail(id) {
  return request({
    url: `/agents/${id}`,
    method: 'get'
  })
}

/**
 * 新增代理
 * @param {Object} data 代理数据
 * @returns {Promise}
 */
export function createAgent(data) {
  return request({
    url: '/agents',
    method: 'post',
    data
  })
}

/**
 * 更新代理
 * @param {Number} id 代理ID
 * @param {Object} data 代理数据
 * @returns {Promise}
 */
export function updateAgent(id, data) {
  return request({
    url: `/agents/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除代理
 * @param {Number} id 代理ID
 * @returns {Promise}
 */
export function deleteAgent(id) {
  return request({
    url: `/agents/${id}`,
    method: 'delete'
  })
} 