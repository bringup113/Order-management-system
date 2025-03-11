const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 账单管理路由
router.get('/', authMiddleware.verifyToken, invoiceController.getInvoices);
router.get('/:id', authMiddleware.verifyToken, invoiceController.getInvoiceById);
router.post('/', authMiddleware.verifyToken, invoiceController.createInvoice);
router.put('/:id', authMiddleware.verifyToken, invoiceController.updateInvoice);
router.delete('/:id', authMiddleware.verifyToken, invoiceController.deleteInvoice);
router.put('/:id/status', authMiddleware.verifyToken, invoiceController.updateInvoiceStatus);

// 账单订单关联路由
router.get('/:id/orders', authMiddleware.verifyToken, invoiceController.getInvoiceOrders);
router.post('/:id/orders', authMiddleware.verifyToken, invoiceController.addOrderToInvoice);
router.delete('/:id/orders/:orderId', authMiddleware.verifyToken, invoiceController.removeOrderFromInvoice);

// 支付记录路由
router.get('/:id/payments', authMiddleware.verifyToken, paymentController.getInvoicePayments);
router.post('/:id/payments', authMiddleware.verifyToken, paymentController.addPayment);

module.exports = router; 