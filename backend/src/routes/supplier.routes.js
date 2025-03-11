const express = require('express');
const { body } = require('express-validator');
const supplierController = require('../controllers/supplier.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @route GET /api/suppliers
 * @desc 获取所有供应商
 * @access Private
 */
router.get('/', verifyToken, supplierController.getSuppliers);

/**
 * @route GET /api/suppliers/:id
 * @desc 获取单个供应商
 * @access Private
 */
router.get('/:id', verifyToken, supplierController.getSupplierById);

/**
 * @route POST /api/suppliers
 * @desc 创建供应商
 * @access Private/Admin
 */
router.post(
  '/',
  [
    verifyToken,
    isAdmin,
    body('name').notEmpty().withMessage('供应商名称不能为空'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('状态无效'),
    validate
  ],
  supplierController.createSupplier
);

/**
 * @route PUT /api/suppliers/:id
 * @desc 更新供应商
 * @access Private/Admin
 */
router.put(
  '/:id',
  [
    verifyToken,
    isAdmin,
    body('name').optional().notEmpty().withMessage('供应商名称不能为空'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('状态无效'),
    validate
  ],
  supplierController.updateSupplier
);

/**
 * @route DELETE /api/suppliers/:id
 * @desc 删除供应商
 * @access Private/Admin
 */
router.delete('/:id', [verifyToken, isAdmin], supplierController.deleteSupplier);

module.exports = router; 