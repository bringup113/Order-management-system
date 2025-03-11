const express = require('express');
const { body } = require('express-validator');
const visaController = require('../controllers/visa.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @route GET /api/visas
 * @desc 获取所有签证
 * @access Private
 */
router.get('/', verifyToken, visaController.getVisas);

/**
 * @route GET /api/visas/:id
 * @desc 获取单个签证
 * @access Private
 */
router.get('/:id', verifyToken, visaController.getVisaById);

/**
 * @route POST /api/visas
 * @desc 创建签证
 * @access Private
 */
router.post(
  '/',
  [
    verifyToken,
    body('passport_id').notEmpty().withMessage('护照ID不能为空').isInt().withMessage('护照ID必须是整数'),
    body('visa_type').notEmpty().withMessage('签证类型不能为空'),
    body('issue_country').notEmpty().withMessage('签发国家/地区不能为空'),
    body('issue_date').notEmpty().withMessage('签发日期不能为空').isDate().withMessage('签发日期格式不正确'),
    body('expiry_date').notEmpty().withMessage('有效期不能为空').isDate().withMessage('有效期格式不正确'),
    body('entry_count').isIn(['single', 'multiple']).withMessage('入境次数无效'),
    body('status').optional().isIn(['valid', 'expired', 'expiring_soon']).withMessage('签证状态无效'),
    validate
  ],
  visaController.createVisa
);

/**
 * @route PUT /api/visas/:id
 * @desc 更新签证
 * @access Private
 */
router.put(
  '/:id',
  [
    verifyToken,
    body('visa_type').optional().notEmpty().withMessage('签证类型不能为空'),
    body('issue_country').optional().notEmpty().withMessage('签发国家/地区不能为空'),
    body('issue_date').optional().isDate().withMessage('签发日期格式不正确'),
    body('expiry_date').optional().isDate().withMessage('有效期格式不正确'),
    body('entry_count').optional().isIn(['single', 'multiple']).withMessage('入境次数无效'),
    body('status').optional().isIn(['valid', 'expired', 'expiring_soon']).withMessage('签证状态无效'),
    validate
  ],
  visaController.updateVisa
);

/**
 * @route DELETE /api/visas/:id
 * @desc 删除签证
 * @access Private
 */
router.delete('/:id', verifyToken, visaController.deleteVisa);

module.exports = router; 