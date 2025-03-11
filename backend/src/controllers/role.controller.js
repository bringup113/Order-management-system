const db = require('../models');
const Role = db.Role;
const Permission = db.Permission;
const { Op } = require('sequelize');

// 获取角色列表
exports.getRoles = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, code, status } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const whereClause = {};
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (code) whereClause.code = { [Op.like]: `%${code}%` };
    if (status) whereClause.status = status;
    
    // 查询角色列表
    const { count, rows } = await Role.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows
    });
  } catch (error) {
    console.error('获取角色列表失败:', error);
    return res.status(500).json({
      message: '获取角色列表失败',
      error: error.message
    });
  }
};

// 获取角色详情
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询角色详情
    const role = await Role.findByPk(id);
    
    if (!role) {
      return res.status(404).json({
        code: 404,
        message: '角色不存在'
      });
    }
    
    return res.status(200).json({
      code: 200,
      message: '获取角色详情成功',
      data: role
    });
  } catch (error) {
    console.error('获取角色详情失败:', error);
    return res.status(500).json({
      code: 500,
      message: '获取角色详情失败',
      error: error.message
    });
  }
};

// 创建角色
exports.createRole = async (req, res) => {
  try {
    const { name, code, description, status = 'active' } = req.body;
    
    // 验证必填字段
    if (!name || !code) {
      return res.status(400).json({
        code: 400,
        message: '角色名称和角色编码不能为空'
      });
    }
    
    // 检查角色编码是否已存在
    const existingRole = await Role.findOne({ where: { code } });
    if (existingRole) {
      return res.status(400).json({
        code: 400,
        message: '角色编码已存在'
      });
    }
    
    // 创建角色
    const role = await Role.create({
      name,
      code,
      description,
      status
    });
    
    return res.status(201).json({
      code: 201,
      message: '创建角色成功',
      data: role
    });
  } catch (error) {
    console.error('创建角色失败:', error);
    return res.status(500).json({
      code: 500,
      message: '创建角色失败',
      error: error.message
    });
  }
};

// 更新角色
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    // 查询角色是否存在
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        code: 404,
        message: '角色不存在'
      });
    }
    
    // 更新角色信息
    await role.update({
      name: name || role.name,
      description: description !== undefined ? description : role.description,
      status: status || role.status
    });
    
    return res.status(200).json({
      code: 200,
      message: '更新角色成功',
      data: role
    });
  } catch (error) {
    console.error('更新角色失败:', error);
    return res.status(500).json({
      code: 500,
      message: '更新角色失败',
      error: error.message
    });
  }
};

// 删除角色
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询角色是否存在
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        code: 404,
        message: '角色不存在'
      });
    }
    
    // 检查是否是系统内置角色
    if (role.code === 'admin' || role.code === 'user') {
      return res.status(400).json({
        code: 400,
        message: '系统内置角色不能删除'
      });
    }
    
    // 删除角色
    await role.destroy();
    
    return res.status(200).json({
      code: 200,
      message: '删除角色成功'
    });
  } catch (error) {
    console.error('删除角色失败:', error);
    return res.status(500).json({
      code: 500,
      message: '删除角色失败',
      error: error.message
    });
  }
};

// 获取角色权限
exports.getRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询角色是否存在
    const role = await Role.findByPk(id, {
      include: [{ model: Permission, as: 'permissions' }]
    });
    
    if (!role) {
      return res.status(404).json({
        code: 404,
        message: '角色不存在'
      });
    }
    
    return res.status(200).json({
      code: 200,
      message: '获取角色权限成功',
      data: role.permissions || []
    });
  } catch (error) {
    console.error('获取角色权限失败:', error);
    return res.status(500).json({
      code: 500,
      message: '获取角色权限失败',
      error: error.message
    });
  }
};

// 更新角色权限
exports.updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;
    
    // 验证必填字段
    if (!permissionIds || !Array.isArray(permissionIds)) {
      return res.status(400).json({
        code: 400,
        message: '权限ID列表不能为空且必须是数组'
      });
    }
    
    // 查询角色是否存在
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        code: 404,
        message: '角色不存在'
      });
    }
    
    // 更新角色权限
    await role.setPermissions(permissionIds);
    
    // 重新查询角色权限
    const updatedRole = await Role.findByPk(id, {
      include: [{ model: Permission, as: 'permissions' }]
    });
    
    return res.status(200).json({
      code: 200,
      message: '更新角色权限成功',
      data: updatedRole.permissions || []
    });
  } catch (error) {
    console.error('更新角色权限失败:', error);
    return res.status(500).json({
      code: 500,
      message: '更新角色权限失败',
      error: error.message
    });
  }
};

// 获取所有权限
exports.getPermissions = async (req, res) => {
  try {
    // 查询所有权限
    const permissions = await Permission.findAll({
      order: [['id', 'ASC']]
    });
    
    return res.status(200).json({
      code: 200,
      message: '获取权限列表成功',
      data: permissions
    });
  } catch (error) {
    console.error('获取权限列表失败:', error);
    return res.status(500).json({
      code: 500,
      message: '获取权限列表失败',
      error: error.message
    });
  }
}; 