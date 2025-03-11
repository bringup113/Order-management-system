import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} - 返回登录结果
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @returns {Promise} - 返回用户信息
 */
export function getUserInfo() {
  return request({
    url: '/auth/profile',
    method: 'get'
  })
}

/**
 * 用户登出
 * @returns {Promise} - 返回登出结果
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
} 