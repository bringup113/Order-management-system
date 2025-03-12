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
    body(['passportId', 'passport_id']).custom((value, { req }) => {
      const id = req.body.passportId || req.body.passport_id;
      if (!id) {
        throw new Error('护照ID不能为空');
      }
      if (!Number.isInteger(Number(id))) {
        throw new Error('护照ID必须是整数');
      }
      return true;
    }),
    body(['visaType', 'visa_type']).custom((value, { req }) => {
      const type = req.body.visaType || req.body.visa_type;
      if (!type) {
        throw new Error('签证类型不能为空');
      }
      return true;
    }),
    body(['issueCountry', 'issue_country']).custom((value, { req }) => {
      const country = req.body.issueCountry || req.body.issue_country;
      if (!country) {
        throw new Error('签发国家/地区不能为空');
      }
      return true;
    }),
    body(['issueDate', 'issue_date']).custom((value, { req }) => {
      const date = req.body.issueDate || req.body.issue_date;
      if (!date) {
        throw new Error('签发日期不能为空');
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        throw new Error('签发日期格式不正确');
      }
      return true;
    }),
    body(['expiryDate', 'expiry_date']).custom((value, { req }) => {
      const date = req.body.expiryDate || req.body.expiry_date;
      if (!date) {
        throw new Error('有效期不能为空');
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        throw new Error('有效期格式不正确');
      }
      return true;
    }),
    body(['entryCount', 'entry_count']).custom((value, { req }) => {
      const count = req.body.entryCount || req.body.entry_count;
      if (!['single', 'multiple'].includes(count)) {
        throw new Error('入境次数无效');
      }
      return true;
    }),
    body(['status']).optional().isIn(['valid', 'expired', 'expiring_soon']).withMessage('签证状态无效'),
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