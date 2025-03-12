/**
 * 格式化日期时间
 * @param {string} dateTimeStr - 日期时间字符串
 * @returns {string} - 格式化后的日期时间
 */
export const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '未登录';
  
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return '无效日期';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 获取角色名称
 * @param {object|string|number} role - 角色信息
 * @param {Array} roleOptions - 角色选项列表
 * @returns {string} - 角色名称
 */
export const getRoleName = (role, roleOptions = []) => {
  if (!role) return '未知';
  
  // 如果role是对象，直接使用name
  if (typeof role === 'object' && role.name) {
    return role.name;
  }
  
  // 如果roleId是数字，尝试从角色列表中查找
  if (typeof role === 'number' || (typeof role === 'string' && !isNaN(Number(role)))) {
    const roleId = Number(role);
    const foundRole = roleOptions.find(r => r.id === roleId);
    if (foundRole) {
      return foundRole.name;
    }
  }
  
  return '未知';
}; 