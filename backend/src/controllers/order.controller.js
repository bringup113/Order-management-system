const { Order, OrderItem, Passport, Agent, Product, ProductQuote, AgentProductPrice, User, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * 生成订单编号
 */
const generateOrderNo = async () => {
  // 生成格式为 ORD + 年月日 + 4位随机数，例如：ORD2023010100001
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // 获取当天最大订单号
  const latestOrder = await Order.findOne({
    where: {
      order_no: {
        [Op.like]: `ORD${dateStr}%`
      }
    },
    order: [['order_no', 'DESC']]
  });
  
  let serialNumber = '0001';
  if (latestOrder) {
    const latestSerialNumber = latestOrder.order_no.substring(11);
    serialNumber = String(parseInt(latestSerialNumber) + 1).padStart(4, '0');
  }
  
  return `ORD${dateStr}${serialNumber}`;
};

/**
 * 获取所有订单
 */
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, passportId, agentId, order_status, payment_status, start_date, end_date, search } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {};
    
    if (passportId) {
      where.customerId = passportId;
    }
    
    if (agentId) {
      where.agentId = agentId;
    }
    
    if (order_status) {
      where.order_status = order_status;
    }
    
    if (payment_status) {
      where.payment_status = payment_status;
    }
    
    if (start_date && end_date) {
      where.order_date = {
        [Op.between]: [start_date, end_date]
      };
    } else if (start_date) {
      where.order_date = {
        [Op.gte]: start_date
      };
    } else if (end_date) {
      where.order_date = {
        [Op.lte]: end_date
      };
    }
    
    if (search) {
      where[Op.or] = [
        { order_no: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // 查询订单
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: Passport,
          as: 'customer',
          attributes: ['id', 'name', 'passportNo']
        },
        {
          model: Agent,
          as: 'agent',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    });
    
    return res.success({ count, rows });
  } catch (error) {
    console.error(error);
    return res.serverError('获取订单列表时出错', error);
  }
};

/**
 * 获取单个订单
 */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询订单
    const order = await Order.findByPk(id, {
      include: [
        {
          model: Passport,
          as: 'customer',
          attributes: ['id', 'name', 'passportNo', 'nationality']
        },
        {
          model: Agent,
          as: 'agent',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'type']
            },
            {
              model: ProductQuote,
              as: 'quote',
              attributes: ['id', 'cost_price']
            }
          ]
        }
      ]
    });
    
    if (!order) {
      return res.notFound('订单不存在');
    }
    
    return res.success(order);
  } catch (error) {
    console.error(error);
    return res.serverError('获取订单详情时出错', error);
  }
};

/**
 * 创建订单
 */
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { passportId, agentId, order_date, remarks, items } = req.body;
    const userId = req.userId;
    
    // 检查护照是否存在
    const passport = await Passport.findByPk(passportId);
    
    if (!passport) {
      await transaction.rollback();
      return res.notFound('护照不存在');
    }
    
    // 检查代理是否存在
    const agent = await Agent.findByPk(agentId);
    
    if (!agent) {
      await transaction.rollback();
      return res.notFound('代理不存在');
    }
    
    // 检查订单明细
    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.error('订单明细不能为空');
    }
    
    // 生成订单编号
    const orderNo = await generateOrderNo();
    
    // 计算订单总金额
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.quantity * item.unit_price;
    }
    
    // 创建订单
    const order = await Order.create({
      order_no: orderNo,
      customerId: passportId,
      agentId: agentId,
      total_amount: totalAmount,
      order_status: 'pending',
      payment_status: 'unpaid',
      order_date: order_date || new Date(),
      remarks,
      createdBy: userId
    }, { transaction });
    
    // 创建订单明细
    for (const item of items) {
      // 检查产品是否存在
      const product = await Product.findByPk(item.productId);
      
      if (!product) {
        await transaction.rollback();
        return res.notFound(`产品ID ${item.productId} 不存在`);
      }
      
      // 检查产品报价是否存在
      const productQuote = await ProductQuote.findByPk(item.product_quote_id);
      
      if (!productQuote) {
        await transaction.rollback();
        return res.notFound(`产品报价ID ${item.product_quote_id} 不存在`);
      }
      
      // 检查代理产品价格是否存在
      const agentProductPrice = await AgentProductPrice.findByPk(item.agent_product_price_id);
      
      if (!agentProductPrice) {
        await transaction.rollback();
        return res.notFound(`代理产品价格ID ${item.agent_product_price_id} 不存在`);
      }
      
      // 创建订单明细
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        product_quote_id: item.product_quote_id,
        agent_product_price_id: item.agent_product_price_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price,
        remarks: item.remarks
      }, { transaction });
    }
    
    await transaction.commit();
    
    return res.created({
      id: order.id,
      order_no: order.order_no,
      message: '订单创建成功'
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.serverError('创建订单时出错', error);
  }
};

/**
 * 更新订单
 */
exports.updateOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { order_status, payment_status, remarks } = req.body;
    
    // 查询订单
    const order = await Order.findByPk(id);
    
    if (!order) {
      await transaction.rollback();
      return res.notFound('订单不存在');
    }
    
    // 更新订单
    await order.update({
      order_status: order_status || order.order_status,
      payment_status: payment_status || order.payment_status,
      remarks: remarks !== undefined ? remarks : order.remarks
    }, { transaction });
    
    await transaction.commit();
    
    return res.success({
      message: '订单更新成功'
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.serverError('更新订单时出错', error);
  }
};

/**
 * 取消订单
 */
exports.cancelOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // 查询订单
    const order = await Order.findByPk(id);
    
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        message: '订单不存在'
      });
    }
    
    // 检查订单状态
    if (order.order_status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        message: '订单已经取消'
      });
    }
    
    if (order.order_status === 'completed') {
      await transaction.rollback();
      return res.status(400).json({
        message: '已完成的订单不能取消'
      });
    }
    
    // 更新订单状态
    await order.update({
      order_status: 'cancelled'
    }, { transaction });
    
    await transaction.commit();
    
    return res.status(200).json({
      message: '订单取消成功'
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({
      message: '取消订单时出错'
    });
  }
}; 