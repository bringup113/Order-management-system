const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc 用户登录
 * @access Public
 */
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('password').notEmpty().withMessage('密码不能为空'),
    validate
  ],
  authController.login
);

/**
 * @route POST /api/auth/change-password
 * @desc 修改密码
 * @access Private
 */
router.post(
  '/change-password',
  [
    verifyToken,
    body('oldPassword').notEmpty().withMessage('旧密码不能为空'),
    body('newPassword').isLength({ min: 6 }).withMessage('新密码长度不能少于6个字符'),
    validate
  ],
  authController.changePassword
);

/**
 * @route GET /api/auth/me
 * @desc 获取当前用户信息
 * @access Private
 */
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router; 