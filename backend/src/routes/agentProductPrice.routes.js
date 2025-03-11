const express = require('express');
const { body } = require('express-validator');
const agentProductPriceController = require('../controllers/agentProductPrice.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @route GET /api/agent-product-prices
 * @desc 获取所有代理产品价格
 * @access Private
 */
router.get('/', verifyToken, agentProductPriceController.getAgentProductPrices);

/**
 * @route GET /api/agent-product-prices/:id
 * @desc 获取单个代理产品价格
 * @access Private
 */
router.get('/:id', verifyToken, agentProductPriceController.getAgentProductPriceById);

/**
 * @route POST /api/agent-product-prices
 * @desc 创建代理产品价格
 * @access Private/Admin
 */
router.post(
  '/',
  [
    verifyToken,
    isAdmin,
    body('product_quote_id').notEmpty().withMessage('产品报价ID不能为空').isInt().withMessage('产品报价ID必须是整数'),
    body('agent_id').notEmpty().withMessage('代理ID不能为空').isInt().withMessage('代理ID必须是整数'),
    body('cost_price').notEmpty().withMessage('成本价格不能为空').isFloat({ min: 0 }).withMessage('成本价格必须是非负数'),
    body('selling_price').notEmpty().withMessage('销售价格不能为空').isFloat({ min: 0 }).withMessage('销售价格必须是非负数'),
    validate
  ],
  agentProductPriceController.createAgentProductPrice
);

/**
 * @route PUT /api/agent-product-prices/:id
 * @desc 更新代理产品价格
 * @access Private/Admin
 */
router.put(
  '/:id',
  [
    verifyToken,
    isAdmin,
    body('cost_price').optional().isFloat({ min: 0 }).withMessage('成本价格必须是非负数'),
    body('selling_price').optional().isFloat({ min: 0 }).withMessage('销售价格必须是非负数'),
    validate
  ],
  agentProductPriceController.updateAgentProductPrice
);

/**
 * @route DELETE /api/agent-product-prices/:id
 * @desc 删除代理产品价格
 * @access Private/Admin
 */
router.delete('/:id', [verifyToken, isAdmin], agentProductPriceController.deleteAgentProductPrice);

module.exports = router; 