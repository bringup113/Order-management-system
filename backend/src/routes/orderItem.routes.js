const express = require('express');
const { body } = require('express-validator');
const orderItemController = require('../controllers/orderItem.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @route GET /api/order-items
 * @desc 获取订单明细
 * @access Private
 */
router.get('/', verifyToken, orderItemController.getOrderItems);

/**
 * @route GET /api/order-items/:id
 * @desc 获取单个订单明细
 * @access Private
 */
router.get('/:id', verifyToken, orderItemController.getOrderItemById);

/**
 * @route POST /api/order-items
 * @desc 添加订单明细
 * @access Private
 */
router.post(
  '/',
  [
    verifyToken,
    body('order_id').notEmpty().withMessage('订单ID不能为空').isInt().withMessage('订单ID必须是整数'),
    body('product_id').notEmpty().withMessage('产品ID不能为空').isInt().withMessage('产品ID必须是整数'),
    body('product_quote_id').notEmpty().withMessage('产品报价ID不能为空').isInt().withMessage('产品报价ID必须是整数'),
    body('agent_product_price_id').notEmpty().withMessage('代理产品价格ID不能为空').isInt().withMessage('代理产品价格ID必须是整数'),
    body('quantity').notEmpty().withMessage('数量不能为空').isInt({ min: 1 }).withMessage('数量必须是大于0的整数'),
    body('unit_price').notEmpty().withMessage('单价不能为空').isFloat({ min: 0 }).withMessage('单价必须是非负数'),
    validate
  ],
  orderItemController.addOrderItem
);

/**
 * @route PUT /api/order-items/:id
 * @desc 更新订单明细
 * @access Private
 */
router.put(
  '/:id',
  [
    verifyToken,
    body('quantity').optional().isInt({ min: 1 }).withMessage('数量必须是大于0的整数'),
    body('unit_price').optional().isFloat({ min: 0 }).withMessage('单价必须是非负数'),
    validate
  ],
  orderItemController.updateOrderItem
);

/**
 * @route DELETE /api/order-items/:id
 * @desc 删除订单明细
 * @access Private
 */
router.delete('/:id', verifyToken, orderItemController.deleteOrderItem);

module.exports = router; 