const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const roleController = require('../controllers/role.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 用户管理路由
router.get('/users', authMiddleware.verifyToken, userController.getUsers);
router.get('/users/:id', authMiddleware.verifyToken, userController.getUserById);
router.post('/users', authMiddleware.verifyToken, userController.createUser);
router.put('/users/:id', authMiddleware.verifyToken, userController.updateUser);
router.delete('/users/:id', authMiddleware.verifyToken, userController.deleteUser);
router.post('/users/:id/reset-password', authMiddleware.verifyToken, userController.resetPassword);
router.put('/users/:id/status', authMiddleware.verifyToken, userController.updateUserStatus);

// 角色管理路由
router.get('/roles', authMiddleware.verifyToken, roleController.getRoles);
router.get('/roles/:id', authMiddleware.verifyToken, roleController.getRoleById);
router.post('/roles', authMiddleware.verifyToken, roleController.createRole);
router.put('/roles/:id', authMiddleware.verifyToken, roleController.updateRole);
router.delete('/roles/:id', authMiddleware.verifyToken, roleController.deleteRole);
router.get('/roles/:id/permissions', authMiddleware.verifyToken, roleController.getRolePermissions);
router.put('/roles/:id/permissions', authMiddleware.verifyToken, roleController.updateRolePermissions);

// 权限管理路由
router.get('/permissions', authMiddleware.verifyToken, roleController.getPermissions);

// 个人信息路由
router.get('/profile', authMiddleware.verifyToken, userController.getUserProfile);
router.put('/profile', authMiddleware.verifyToken, userController.updateUserProfile);
router.put('/profile/password', authMiddleware.verifyToken, userController.updateUserPassword);

module.exports = router; 