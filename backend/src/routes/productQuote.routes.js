const express = require('express');
const { body } = require('express-validator');
const productQuoteController = require('../controllers/productQuote.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @route GET /api/product-quotes
 * @desc 获取所有产品报价
 * @access Private
 */
router.get('/', verifyToken, productQuoteController.getProductQuotes);

/**
 * @route GET /api/product-quotes/:id
 * @desc 获取单个产品报价
 * @access Private
 */
router.get('/:id', verifyToken, productQuoteController.getProductQuoteById);

/**
 * @route POST /api/product-quotes
 * @desc 创建产品报价
 * @access Private/Admin
 */
router.post(
  '/',
  [
    verifyToken,
    isAdmin,
    body('product_id').notEmpty().withMessage('产品ID不能为空').isInt().withMessage('产品ID必须是整数'),
    body('supplier_id').notEmpty().withMessage('供应商ID不能为空').isInt().withMessage('供应商ID必须是整数'),
    body('cost_price').notEmpty().withMessage('成本价格不能为空').isFloat({ min: 0 }).withMessage('成本价格必须是非负数'),
    validate
  ],
  productQuoteController.createProductQuote
);

/**
 * @route PUT /api/product-quotes/:id
 * @desc 更新产品报价
 * @access Private/Admin
 */
router.put(
  '/:id',
  [
    verifyToken,
    isAdmin,
    body('cost_price').optional().isFloat({ min: 0 }).withMessage('成本价格必须是非负数'),
    validate
  ],
  productQuoteController.updateProductQuote
);

/**
 * @route DELETE /api/product-quotes/:id
 * @desc 删除产品报价
 * @access Private/Admin
 */
router.delete('/:id', [verifyToken, isAdmin], productQuoteController.deleteProductQuote);

module.exports = router; 