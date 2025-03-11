const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @route GET /api/orders
 * @desc 获取所有订单
 * @access Private
 */
router.get('/', verifyToken, orderController.getOrders);

/**
 * @route GET /api/orders/:id
 * @desc 获取单个订单
 * @access Private
 */
router.get('/:id', verifyToken, orderController.getOrderById);

/**
 * @route POST /api/orders
 * @desc 创建订单
 * @access Private
 */
router.post(
  '/',
  [
    verifyToken,
    body('passport_id').notEmpty().withMessage('客户ID不能为空').isInt().withMessage('客户ID必须是整数'),
    body('agent_id').notEmpty().withMessage('代理ID不能为空').isInt().withMessage('代理ID必须是整数'),
    body('items').isArray().withMessage('订单明细必须是数组'),
    body('items.*.product_id').notEmpty().withMessage('产品ID不能为空').isInt().withMessage('产品ID必须是整数'),
    body('items.*.product_quote_id').notEmpty().withMessage('产品报价ID不能为空').isInt().withMessage('产品报价ID必须是整数'),
    body('items.*.agent_product_price_id').notEmpty().withMessage('代理产品价格ID不能为空').isInt().withMessage('代理产品价格ID必须是整数'),
    body('items.*.quantity').notEmpty().withMessage('数量不能为空').isInt({ min: 1 }).withMessage('数量必须是大于0的整数'),
    body('items.*.unit_price').notEmpty().withMessage('单价不能为空').isFloat({ min: 0 }).withMessage('单价必须是非负数'),
    validate
  ],
  orderController.createOrder
);

/**
 * @route PUT /api/orders/:id
 * @desc 更新订单
 * @access Private
 */
router.put(
  '/:id',
  [
    verifyToken,
    body('order_status').optional().isIn(['pending', 'processing', 'cancelled', 'completed']).withMessage('订单状态无效'),
    body('payment_status').optional().isIn(['unpaid', 'partial', 'paid']).withMessage('支付状态无效'),
    validate
  ],
  orderController.updateOrder
);

/**
 * @route PUT /api/orders/:id/cancel
 * @desc 取消订单
 * @access Private
 */
router.put('/:id/cancel', verifyToken, orderController.cancelOrder);

module.exports = router; 