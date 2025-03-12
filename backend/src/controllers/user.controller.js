const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { Op } = require('sequelize');

/**
 * 获取所有用户
 */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, username, name, roleId, status } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {};
    
    if (username) {
      where.username = { [Op.like]: `%${username}%` };
    }
    
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    
    if (roleId) {
      where.roleId = roleId;
    }
    
    if (status) {
      where.status = status;
    }
    
    // 查询用户
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      offset: parseInt(offset),
      limit: parseInt(limit)
    });
    
    return res.status(200).json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return res.status(500).json({
      message: '获取用户列表失败',
      error: error.message
    });
  }
};

/**
 * 获取单个用户
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询用户
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }
    
    return res.status(200).json({
      code: 200,
      message: '获取用户详情成功',
      data: user
    });
  } catch (error) {
    console.error('获取用户详情失败:', error);
    return res.status(500).json({
      code: 500,
      message: '获取用户详情失败',
      error: error.message
    });
  }
};

/**
 * 创建用户
 */
exports.createUser = async (req, res) => {
  try {
    const { username, password, name, email, phone, roleId } = req.body;
    
    // 验证必填字段
    if (!username || !password || !name) {
      return res.status(400).json({
        code: 400,
        message: '用户名、密码和姓名不能为空'
      });
    }
    
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: '用户名已存在'
      });
    }
    
    // 加密密码
    const hashedPassword = bcrypt.hashSync(password, 8);
    
    // 创建用户
    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      email,
      phone,
      roleId,
      status: 'active'
    });
    
    return res.status(201).json({
      code: 201,
      message: '创建用户成功',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roleId: user.roleId,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('创建用户失败:', error);
    return res.status(500).json({
      code: 500,
      message: '创建用户失败',
      error: error.message
    });
  }
};

/**
 * 更新用户
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, roleId } = req.body;
    
    // 查询用户
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }
    
    // 更新用户
    await user.update({
      name: name || user.name,
      email: email !== undefined ? email : user.email,
      phone: phone !== undefined ? phone : user.phone,
      roleId: roleId || user.roleId
    });
    
    return res.status(200).json({
      code: 200,
      message: '更新用户成功',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roleId: user.roleId,
        status: user.status,
        lastLoginTime: user.lastLoginTime,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('更新用户失败:', error);
    return res.status(500).json({
      code: 500,
      message: '更新用户失败',
      error: error.message
    });
  }
};

/**
 * 删除用户
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询用户
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }
    
    // 检查是否是管理员账号
    if (user.username === 'admin') {
      return res.status(400).json({
        code: 400,
        message: '不能删除管理员账号'
      });
    }
    
    // 删除用户
    await user.destroy();
    
    return res.status(200).json({
      code: 200,
      message: '删除用户成功'
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    return res.status(500).json({
      code: 500,
      message: '删除用户失败',
      error: error.message
    });
  }
};

/**
 * 重置用户密码
 */
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    // 验证必填字段
    if (!password) {
      return res.status(400).json({
        code: 400,
        message: '密码不能为空'
      });
    }
    
    // 查询用户
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }
    
    // 加密密码
    const hashedPassword = bcrypt.hashSync(password, 8);
    
    // 更新密码
    await user.update({
      password: hashedPassword
    });
    
    return res.status(200).json({
      code: 200,
      message: '重置密码成功'
    });
  } catch (error) {
    console.error('重置密码失败:', error);
    return res.status(500).json({
      code: 500,
      message: '重置密码失败',
      error: error.message
    });
  }
};

/**
 * 更新用户状态
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // 验证必填字段
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: '状态值无效，必须是 active 或 inactive'
      });
    }
    
    // 查询用户
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }
    
    // 检查是否是管理员账号
    if (user.username === 'admin' && status === 'inactive') {
      return res.status(400).json({
        code: 400,
        message: '不能禁用管理员账号'
      });
    }
    
    // 更新状态
    await user.update({
      status
    });
    
    return res.status(200).json({
      code: 200,
      message: '更新用户状态成功',
      data: {
        id: user.id,
        username: user.username,
        status: user.status
      }
    });
  } catch (error) {
    console.error('更新用户状态失败:', error);
    return res.status(500).json({
      code: 500,
      message: '更新用户状态失败',
      error: error.message
    });
  }
};

/**
 * 获取用户个人信息
 */
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    // 查询用户
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }
    
    return res.status(200).json({
      code: 200,
      message: '获取个人信息成功',
      data: user
    });
  } catch (error) {
    console.error('获取个人信息失败:', error);
    return res.status(500).json({
      code: 500,
      message: '获取个人信息失败',
      error: error.message
    });
  }
};

/**
 * 更新用户个人信息
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, phone } = req.body;
    
    // 查询用户
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }
    
    // 更新用户
    await user.update({
      name: name || user.name,
      email: email !== undefined ? email : user.email,
      phone: phone !== undefined ? phone : user.phone
    });
    
    return res.status(200).json({
      code: 200,
      message: '更新个人信息成功',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roleId: user.roleId,
        status: user.status,
        lastLoginTime: user.lastLoginTime,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('更新个人信息失败:', error);
    return res.status(500).json({
      code: 500,
      message: '更新个人信息失败',
      error: error.message
    });
  }
};

/**
 * 更新用户密码
 */
exports.updateUserPassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;
    
    // 验证必填字段
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        code: 400,
        message: '旧密码和新密码不能为空'
      });
    }
    
    // 查询用户
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }
    
    // 验证旧密码
    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        code: 400,
        message: '旧密码不正确'
      });
    }
    
    // 加密新密码
    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    
    // 更新密码
    await user.update({
      password: hashedPassword
    });
    
    return res.status(200).json({
      code: 200,
      message: '修改密码成功'
    });
  } catch (error) {
    console.error('修改密码失败:', error);
    return res.status(500).json({
      code: 500,
      message: '修改密码失败',
      error: error.message
    });
  }
}; 