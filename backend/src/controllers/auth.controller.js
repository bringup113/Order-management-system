const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../../config');

/**
 * 用户登录
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({
        message: '用户名或密码错误'
      });
    }

    // 检查用户状态
    if (user.status !== 'enabled') {
      return res.status(403).json({
        message: '用户已被禁用'
      });
    }

    // 验证密码
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: '用户名或密码错误'
      });
    }

    // 生成JWT令牌
    const token = jwt.sign({ id: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });

    // 更新最后登录时间
    await user.update({ last_login_time: new Date() });

    // 返回用户信息和令牌
    return res.status(200).json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '登录时出错'
    });
  }
};

/**
 * 修改密码
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;

    // 查找用户
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: '用户不存在'
      });
    }

    // 验证旧密码
    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: '旧密码错误'
      });
    }

    // 加密新密码
    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    // 更新密码
    await user.update({ password: hashedPassword });

    return res.status(200).json({
      message: '密码修改成功'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '修改密码时出错'
    });
  }
};

/**
 * 获取当前用户信息
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    // 查找用户
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'name', 'role', 'status', 'last_login_time', 'created_at', 'updated_at']
    });

    if (!user) {
      return res.status(404).json({
        message: '用户不存在'
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '获取用户信息时出错'
    });
  }
};
