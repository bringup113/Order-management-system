const express = require('express');
const { body } = require('express-validator');
const passportController = require('../controllers/passport.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @route GET /api/passports
 * @desc 获取所有护照
 * @access Private
 */
router.get('/', verifyToken, passportController.getPassports);

/**
 * @route GET /api/passports/:id
 * @desc 获取单个护照
 * @access Private
 */
router.get('/:id', verifyToken, passportController.getPassportById);

/**
 * @route POST /api/passports
 * @desc 创建护照
 * @access Private
 */
router.post(
  '/',
  [
    verifyToken,
    body('name').notEmpty().withMessage('姓名不能为空'),
    body('passport_no').notEmpty().withMessage('护照号码不能为空'),
    body('nationality').notEmpty().withMessage('国籍不能为空'),
    body('birth_date').notEmpty().withMessage('出生日期不能为空').isDate().withMessage('出生日期格式不正确'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('性别无效'),
    body('issue_date').notEmpty().withMessage('签发日期不能为空').isDate().withMessage('签发日期格式不正确'),
    body('expiry_date').notEmpty().withMessage('有效期不能为空').isDate().withMessage('有效期格式不正确'),
    validate
  ],
  passportController.createPassport
);

/**
 * @route PUT /api/passports/:id
 * @desc 更新护照
 * @access Private
 */
router.put(
  '/:id',
  [
    verifyToken,
    body('name').optional().notEmpty().withMessage('姓名不能为空'),
    body('nationality').optional().notEmpty().withMessage('国籍不能为空'),
    body('birth_date').optional().isDate().withMessage('出生日期格式不正确'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('性别无效'),
    body('issue_date').optional().isDate().withMessage('签发日期格式不正确'),
    body('expiry_date').optional().isDate().withMessage('有效期格式不正确'),
    validate
  ],
  passportController.updatePassport
);

/**
 * @route DELETE /api/passports/:id
 * @desc 删除护照
 * @access Private
 */
router.delete('/:id', verifyToken, passportController.deletePassport);

module.exports = router; 