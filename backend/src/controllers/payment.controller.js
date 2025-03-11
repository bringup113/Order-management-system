const db = require('../models');
const Payment = db.Payment;
const Invoice = db.Invoice;
const User = db.User;
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

/**
 * 获取账单支付记录
 */
exports.getInvoicePayments = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询账单是否存在
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({
        code: 404,
        message: '账单不存在'
      });
    }
    
    // 查询支付记录
    const payments = await Payment.findAll({
      where: { invoiceId: id },
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'username', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({
      code: 200,
      message: '获取支付记录成功',
      data: payments
    });
  } catch (error) {
    console.error('获取支付记录失败:', error);
    return res.status(500).json({
      code: 500,
      message: '获取支付记录失败',
      error: error.message
    });
  }
};

/**
 * 添加支付记录
 */
exports.addPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, paymentDate, remark } = req.body;
    
    // 验证必填字段
    if (!amount || amount <= 0) {
      return res.status(400).json({
        code: 400,
        message: '支付金额必须大于0'
      });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({
        code: 400,
        message: '支付方式不能为空'
      });
    }
    
    // 查询账单是否存在
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({
        code: 404,
        message: '账单不存在'
      });
    }
    
    // 检查支付金额是否超过未支付金额
    if (amount > invoice.unpaidAmount) {
      return res.status(400).json({
        code: 400,
        message: '支付金额不能超过未支付金额'
      });
    }
    
    // 处理上传的凭证图片
    let voucherImage = null;
    if (req.file) {
      voucherImage = `/uploads/${req.file.filename}`;
    }
    
    // 创建支付记录
    const payment = await Payment.create({
      invoiceId: id,
      amount,
      paymentMethod,
      paymentDate: paymentDate || new Date(),
      status: 'pending',
      voucherImage,
      remark,
      createdBy: req.userId
    });
    
    return res.status(201).json({
      code: 201,
      message: '添加支付记录成功',
      data: payment
    });
  } catch (error) {
    console.error('添加支付记录失败:', error);
    return res.status(500).json({
      code: 500,
      message: '添加支付记录失败',
      error: error.message
    });
  }
};

/**
 * 更新支付记录
 */
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, paymentDate, remark } = req.body;
    
    // 查询支付记录是否存在
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        code: 404,
        message: '支付记录不存在'
      });
    }
    
    // 检查支付记录状态
    if (payment.status !== 'pending') {
      return res.status(400).json({
        code: 400,
        message: '只能修改待审核的支付记录'
      });
    }
    
    // 查询账单
    const invoice = await Invoice.findByPk(payment.invoiceId);
    if (!invoice) {
      return res.status(404).json({
        code: 404,
        message: '关联的账单不存在'
      });
    }
    
    // 检查支付金额是否超过未支付金额
    const newAmount = amount || payment.amount;
    if (newAmount > invoice.unpaidAmount + payment.amount) {
      return res.status(400).json({
        code: 400,
        message: '支付金额不能超过未支付金额'
      });
    }
    
    // 处理上传的凭证图片
    let voucherImage = payment.voucherImage;
    if (req.file) {
      // 删除旧图片
      if (payment.voucherImage) {
        const oldImagePath = path.join(__dirname, '../../', payment.voucherImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      voucherImage = `/uploads/${req.file.filename}`;
    }
    
    // 更新支付记录
    await payment.update({
      amount: newAmount,
      paymentMethod: paymentMethod || payment.paymentMethod,
      paymentDate: paymentDate || payment.paymentDate,
      voucherImage,
      remark: remark !== undefined ? remark : payment.remark
    });
    
    return res.status(200).json({
      code: 200,
      message: '更新支付记录成功',
      data: payment
    });
  } catch (error) {
    console.error('更新支付记录失败:', error);
    return res.status(500).json({
      code: 500,
      message: '更新支付记录失败',
      error: error.message
    });
  }
};

/**
 * 删除支付记录
 */
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询支付记录是否存在
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        code: 404,
        message: '支付记录不存在'
      });
    }
    
    // 检查支付记录状态
    if (payment.status !== 'pending') {
      return res.status(400).json({
        code: 400,
        message: '只能删除待审核的支付记录'
      });
    }
    
    // 删除凭证图片
    if (payment.voucherImage) {
      const imagePath = path.join(__dirname, '../../', payment.voucherImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // 删除支付记录
    await payment.destroy();
    
    return res.status(200).json({
      code: 200,
      message: '删除支付记录成功'
    });
  } catch (error) {
    console.error('删除支付记录失败:', error);
    return res.status(500).json({
      code: 500,
      message: '删除支付记录失败',
      error: error.message
    });
  }
};

/**
 * 审核支付记录
 */
exports.reviewPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;
    
    // 验证必填字段
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: '状态值无效，必须是 approved 或 rejected'
      });
    }
    
    // 查询支付记录是否存在
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        code: 404,
        message: '支付记录不存在'
      });
    }
    
    // 检查支付记录状态
    if (payment.status !== 'pending') {
      return res.status(400).json({
        code: 400,
        message: '只能审核待审核的支付记录'
      });
    }
    
    // 查询账单
    const invoice = await Invoice.findByPk(payment.invoiceId);
    if (!invoice) {
      return res.status(404).json({
        code: 404,
        message: '关联的账单不存在'
      });
    }
    
    // 更新支付记录
    await payment.update({
      status,
      reviewRemark: remark,
      reviewerId: req.userId,
      reviewTime: new Date()
    });
    
    // 如果审核通过，更新账单金额和状态
    if (status === 'approved') {
      const newPaidAmount = invoice.paidAmount + payment.amount;
      const newUnpaidAmount = invoice.totalAmount - newPaidAmount;
      
      let newStatus = invoice.status;
      if (newUnpaidAmount <= 0) {
        newStatus = 'paid';
      } else if (newPaidAmount > 0) {
        newStatus = 'partial_paid';
      }
      
      await invoice.update({
        paidAmount: newPaidAmount,
        unpaidAmount: newUnpaidAmount,
        status: newStatus
      });
    }
    
    return res.status(200).json({
      code: 200,
      message: '审核支付记录成功',
      data: {
        payment,
        invoice: {
          id: invoice.id,
          invoiceNo: invoice.invoiceNo,
          paidAmount: invoice.paidAmount,
          unpaidAmount: invoice.unpaidAmount,
          status: invoice.status
        }
      }
    });
  } catch (error) {
    console.error('审核支付记录失败:', error);
    return res.status(500).json({
      code: 500,
      message: '审核支付记录失败',
      error: error.message
    });
  }
}; 