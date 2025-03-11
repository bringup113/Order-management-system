const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 支付记录管理路由
router.put('/:id', authMiddleware.verifyToken, paymentController.updatePayment);
router.delete('/:id', authMiddleware.verifyToken, paymentController.deletePayment);
router.put('/:id/review', authMiddleware.verifyToken, paymentController.reviewPayment);

module.exports = router; 