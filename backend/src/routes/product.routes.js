const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @route GET /api/products
 * @desc 获取所有产品
 * @access Private
 */
router.get('/', verifyToken, productController.getProducts);

/**
 * @route GET /api/products/:id
 * @desc 获取单个产品
 * @access Private
 */
router.get('/:id', verifyToken, productController.getProductById);

/**
 * @route POST /api/products
 * @desc 创建产品
 * @access Private/Admin
 */
router.post(
  '/',
  [
    verifyToken,
    isAdmin,
    body('name').notEmpty().withMessage('产品名称不能为空'),
    body('type').isIn(['tour', 'hotel', 'flight', 'other']).withMessage('产品类型无效'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('状态无效'),
    validate
  ],
  productController.createProduct
);

/**
 * @route PUT /api/products/:id
 * @desc 更新产品
 * @access Private/Admin
 */
router.put(
  '/:id',
  [
    verifyToken,
    isAdmin,
    body('name').optional().notEmpty().withMessage('产品名称不能为空'),
    body('type').optional().isIn(['tour', 'hotel', 'flight', 'other']).withMessage('产品类型无效'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('状态无效'),
    validate
  ],
  productController.updateProduct
);

/**
 * @route DELETE /api/products/:id
 * @desc 删除产品
 * @access Private/Admin
 */
router.delete('/:id', [verifyToken, isAdmin], productController.deleteProduct);

module.exports = router; 