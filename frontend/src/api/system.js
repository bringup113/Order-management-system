import request from '@/utils/request'

// 用户管理接口
export function getUserList(params) {
  return request({
    url: '/system/users',
    method: 'get',
    params
  })
}

export function getUserDetail(id) {
  return request({
    url: `/system/users/${id}`,
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: '/system/users',
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
  return request({
    url: `/system/users/${id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/system/users/${id}`,
    method: 'delete'
  })
}

export function resetUserPassword(id, data) {
  return request({
    url: `/system/users/${id}/reset-password`,
    method: 'post',
    data
  })
}

export function updateUserStatus(id, status) {
  return request({
    url: `/system/users/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 角色管理接口
export function getRoleList(params) {
  return request({
    url: '/system/roles',
    method: 'get',
    params
  })
}

export function getRoleDetail(id) {
  return request({
    url: `/system/roles/${id}`,
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/system/roles',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/system/roles/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/system/roles/${id}`,
    method: 'delete'
  })
}

export function getRolePermissions(id) {
  return request({
    url: `/system/roles/${id}/permissions`,
    method: 'get'
  })
}

export function updateRolePermissions(id, data) {
  return request({
    url: `/system/roles/${id}/permissions`,
    method: 'put',
    data
  })
}

// 权限管理接口
export function getPermissionList() {
  return request({
    url: '/system/permissions',
    method: 'get'
  })
}

// 个人信息接口
export function getUserProfile() {
  return request({
    url: '/system/profile',
    method: 'get'
  })
}

export function updateUserProfile(data) {
  return request({
    url: '/system/profile',
    method: 'put',
    data
  })
}

export function updateUserPassword(data) {
  return request({
    url: '/system/profile/password',
    method: 'put',
    data
  })
} 