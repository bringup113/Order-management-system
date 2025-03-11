const jwt = require("jsonwebtoken");
const config = require("../../config");
const { User } = require("../models");

/**
 * 验证JWT令牌
 */
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(403).json({
      message: '未提供访问令牌'
    });
  }

  // 移除Bearer前缀（如果有）
  const tokenValue = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

  try {
    const decoded = jwt.verify(tokenValue, config.jwt.secret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      message: '无效的访问令牌'
    });
  }
};

/**
 * 检查是否为管理员
 */
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({
        message: '用户不存在'
      });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        message: '需要管理员权限'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      message: '验证管理员权限时出错'
    });
  }
};

/**
 * 检查是否为供应商
 */
const isSupplier = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({
        message: '用户不存在'
      });
    }
    
    if (user.role !== 'supplier' && user.role !== 'admin') {
      return res.status(403).json({
        message: '需要供应商权限'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      message: '验证供应商权限时出错'
    });
  }
};

/**
 * 检查用户状态是否启用
 */
const isEnabled = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({
        message: '用户不存在'
      });
    }
    
    if (user.status !== 'enabled') {
      return res.status(403).json({
        message: '用户已被禁用'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      message: '验证用户状态时出错'
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isSupplier,
  isEnabled
};

