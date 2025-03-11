const db = require('../models');
const Invoice = db.Invoice;
const InvoiceOrder = db.InvoiceOrder;
const Order = db.Order;
const User = db.User;
const { Op } = require('sequelize');

/**
 * 获取账单列表
 */
exports.getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, invoiceNo, customerName, status, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const whereClause = {};
    if (invoiceNo) whereClause.invoiceNo = { [Op.like]: `%${invoiceNo}%` };
    if (status) whereClause.status = status;
    
    // 日期范围查询
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.created_at = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.created_at = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    // 客户名称查询（关联查询）
    const includeOptions = [];
    if (customerName) {
      includeOptions.push({
        model: db.Passport,
        as: 'customer',
        where: {
          name: { [Op.like]: `%${customerName}%` }
        }
      });
    } else {
      includeOptions.push({
        model: db.Passport,
        as: 'customer'
      });
    }
    
    // 查询账单列表
    const { count, rows } = await Invoice.findAndCountAll({
      where: whereClause,
      include: includeOptions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      distinct: true
    });
    
    return res.status(200).json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows
    });
  } catch (error) {
    console.error('获取账单列表失败:', error);
    return res.status(500).json({
      message: '获取账单列表失败',
      error: error.message
    });
  }
};

/**
 * 获取账单详情
 */
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询账单详情
    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: db.Passport,
          as: 'customer'
        },
        {
          model: db.Agent,
          as: 'agent'
        }
      ]
    });
    
    if (!invoice) {
      return res.status(404).json({
        code: 404,
        message: '账单不存在'
      });
    }
    
    return res.status(200).json({
      code: 200,
      message: '获取账单详情成功',
      data: invoice
    });
  } catch (error) {
    console.error('获取账单详情失败:', error);
    return res.status(500).json({
      code: 500,
      message: '获取账单详情失败',
      error: error.message
    });
  }
};

/**
 * 创建账单
 */
exports.createInvoice = async (req, res) => {
  try {
    const { customerId, agentId, totalAmount, status = 'unpaid', remark } = req.body;
    
    // 验证必填字段
    if (!customerId) {
      return res.status(400).json({
        code: 400,
        message: '客户ID不能为空'
      });
    }
    
    // 生成账单编号
    const invoiceNo = 'INV' + new Date().getTime();
    
    // 创建账单
    const invoice = await Invoice.create({
      invoiceNo,
      customerId,
      agentId,
      totalAmount: totalAmount || 0,
      paidAmount: 0,
      unpaidAmount: totalAmount || 0,
      status,
      remark,
      createdBy: req.userId
    });
    
    return res.status(201).json({
      code: 201,
      message: '创建账单成功',
      data: invoice
    });
  } catch (error) {
    console.error('创建账单失败:', error);
    return res.status(500).json({
      code: 500,
      message: '创建账单失败',
      error: error.message
    });
  }
};

/**
 * 更新账单
 */
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId, agentId, remark } = req.body;
    
    // 查询账单是否存在
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({
        code: 404,
        message: '账单不存在'
      });
    }
    
    // 检查账单状态
    if (invoice.status === 'paid') {
      return res.status(400).json({
        code: 400,
        message: '已支付的账单不能修改'
      });
    }
    
    // 更新账单信息
    await invoice.update({
      customerId: customerId || invoice.customerId,
      agentId: agentId !== undefined ? agentId : invoice.agentId,
      remark: remark !== undefined ? remark : invoice.remark
    });
    
    return res.status(200).json({
      code: 200,
      message: '更新账单成功',
      data: invoice
    });
  } catch (error) {
    console.error('更新账单失败:', error);
    return res.status(500).json({
      code: 500,
      message: '更新账单失败',
      error: error.message
    });
  }
};

/**
 * 删除账单
 */
exports.deleteInvoice = async (req, res) => {
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
    
    // 检查账单状态
    if (invoice.status !== 'unpaid') {
      return res.status(400).json({
        code: 400,
        message: '只能删除未支付的账单'
      });
    }
    
    // 删除账单
    await invoice.destroy();
    
    return res.status(200).json({
      code: 200,
      message: '删除账单成功'
    });
  } catch (error) {
    console.error('删除账单失败:', error);
    return res.status(500).json({
      code: 500,
      message: '删除账单失败',
      error: error.message
    });
  }
};

/**
 * 更新账单状态
 */
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // 验证必填字段
    if (!status || !['unpaid', 'partial_paid', 'paid'].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: '状态值无效，必须是 unpaid、partial_paid 或 paid'
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
    
    // 更新状态
    await invoice.update({
      status
    });
    
    return res.status(200).json({
      code: 200,
      message: '更新账单状态成功',
      data: {
        id: invoice.id,
        invoiceNo: invoice.invoiceNo,
        status: invoice.status
      }
    });
  } catch (error) {
    console.error('更新账单状态失败:', error);
    return res.status(500).json({
      code: 500,
      message: '更新账单状态失败',
      error: error.message
    });
  }
};

/**
 * 获取账单关联的订单
 */
exports.getInvoiceOrders = async (req, res) => {
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
    
    // 查询关联的订单
    const invoiceOrders = await InvoiceOrder.findAll({
      where: { invoiceId: id, status: 'active' },
      include: [
        {
          model: Order,
          as: 'order'
        }
      ]
    });
    
    return res.status(200).json({
      code: 200,
      message: '获取账单关联订单成功',
      data: invoiceOrders
    });
  } catch (error) {
    console.error('获取账单关联订单失败:', error);
    return res.status(500).json({
      code: 500,
      message: '获取账单关联订单失败',
      error: error.message
    });
  }
};

/**
 * 添加订单到账单
 */
exports.addOrderToInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderIds, amount } = req.body;
    
    // 验证必填字段
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        code: 400,
        message: '订单ID列表不能为空且必须是数组'
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
    
    // 检查账单状态
    if (invoice.status === 'paid') {
      return res.status(400).json({
        code: 400,
        message: '已支付的账单不能添加订单'
      });
    }
    
    // 添加订单到账单
    const invoiceOrders = [];
    let totalAmount = 0;
    
    for (const orderId of orderIds) {
      // 检查订单是否存在
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({
          code: 404,
          message: `订单ID ${orderId} 不存在`
        });
      }
      
      // 检查订单是否已关联到其他账单
      const existingInvoiceOrder = await InvoiceOrder.findOne({
        where: { orderId, status: 'active' }
      });
      
      if (existingInvoiceOrder && existingInvoiceOrder.invoiceId !== parseInt(id)) {
        return res.status(400).json({
          code: 400,
          message: `订单ID ${orderId} 已关联到其他账单`
        });
      }
      
      // 创建或更新关联
      let invoiceOrder;
      if (existingInvoiceOrder) {
        invoiceOrder = existingInvoiceOrder;
      } else {
        invoiceOrder = await InvoiceOrder.create({
          invoiceId: id,
          orderId,
          amount: amount || order.totalAmount,
          status: 'active'
        });
        
        totalAmount += (amount || order.totalAmount);
      }
      
      invoiceOrders.push(invoiceOrder);
    }
    
    // 更新账单金额
    await invoice.update({
      totalAmount: invoice.totalAmount + totalAmount,
      unpaidAmount: invoice.unpaidAmount + totalAmount
    });
    
    return res.status(200).json({
      code: 200,
      message: '添加订单到账单成功',
      data: {
        invoiceOrders,
        invoice: {
          id: invoice.id,
          invoiceNo: invoice.invoiceNo,
          totalAmount: invoice.totalAmount,
          unpaidAmount: invoice.unpaidAmount
        }
      }
    });
  } catch (error) {
    console.error('添加订单到账单失败:', error);
    return res.status(500).json({
      code: 500,
      message: '添加订单到账单失败',
      error: error.message
    });
  }
};

/**
 * 从账单中移除订单
 */
exports.removeOrderFromInvoice = async (req, res) => {
  try {
    const { id, orderId } = req.params;
    
    // 查询账单是否存在
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({
        code: 404,
        message: '账单不存在'
      });
    }
    
    // 检查账单状态
    if (invoice.status === 'paid') {
      return res.status(400).json({
        code: 400,
        message: '已支付的账单不能移除订单'
      });
    }
    
    // 查询关联是否存在
    const invoiceOrder = await InvoiceOrder.findOne({
      where: { invoiceId: id, orderId, status: 'active' }
    });
    
    if (!invoiceOrder) {
      return res.status(404).json({
        code: 404,
        message: '订单未关联到此账单'
      });
    }
    
    // 更新关联状态
    await invoiceOrder.update({
      status: 'inactive'
    });
    
    // 更新账单金额
    await invoice.update({
      totalAmount: invoice.totalAmount - invoiceOrder.amount,
      unpaidAmount: invoice.unpaidAmount - invoiceOrder.amount
    });
    
    return res.status(200).json({
      code: 200,
      message: '从账单中移除订单成功',
      data: {
        invoice: {
          id: invoice.id,
          invoiceNo: invoice.invoiceNo,
          totalAmount: invoice.totalAmount,
          unpaidAmount: invoice.unpaidAmount
        }
      }
    });
  } catch (error) {
    console.error('从账单中移除订单失败:', error);
    return res.status(500).json({
      code: 500,
      message: '从账单中移除订单失败',
      error: error.message
    });
  }
}; 