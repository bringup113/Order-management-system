const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @route GET /api/users
 * @desc 获取所有用户
 * @access Private/Admin
 */
router.get('/', [verifyToken, isAdmin], userController.getUsers);

/**
 * @route GET /api/users/:id
 * @desc 获取单个用户
 * @access Private/Admin
 */
router.get('/:id', [verifyToken, isAdmin], userController.getUserById);

/**
 * @route POST /api/users
 * @desc 创建用户
 * @access Private/Admin
 */
router.post(
  '/',
  [
    verifyToken,
    isAdmin,
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('password').isLength({ min: 6 }).withMessage('密码长度不能少于6个字符'),
    body('name').notEmpty().withMessage('姓名不能为空'),
    body('role').isIn(['admin', 'user', 'supplier']).withMessage('角色无效'),
    validate
  ],
  userController.createUser
);

/**
 * @route PUT /api/users/:id
 * @desc 更新用户
 * @access Private/Admin
 */
router.put(
  '/:id',
  [
    verifyToken,
    isAdmin,
    body('name').optional().notEmpty().withMessage('姓名不能为空'),
    body('role').optional().isIn(['admin', 'user', 'supplier']).withMessage('角色无效'),
    body('status').optional().isIn(['enabled', 'disabled']).withMessage('状态无效'),
    validate
  ],
  userController.updateUser
);

/**
 * @route DELETE /api/users/:id
 * @desc 删除用户
 * @access Private/Admin
 */
router.delete('/:id', [verifyToken, isAdmin], userController.deleteUser);

module.exports = router; 