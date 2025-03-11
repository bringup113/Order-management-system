const { OrderItem, Order, Product, ProductQuote, AgentProductPrice, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * 获取订单明细
 */
exports.getOrderItems = async (req, res) => {
  try {
    const { order_id } = req.query;
    
    // 构建查询条件
    const where = {};
    
    if (order_id) {
      where.order_id = order_id;
    }
    
    // 查询订单明细
    const orderItems = await OrderItem.findAll({
      where,
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'type']
        },
        {
          model: ProductQuote,
          attributes: ['id', 'cost_price']
        },
        {
          model: AgentProductPrice,
          attributes: ['id', 'cost_price', 'selling_price']
        }
      ],
      order: [['id', 'ASC']]
    });
    
    return res.status(200).json(orderItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '获取订单明细时出错'
    });
  }
};

/**
 * 获取单个订单明细
 */
exports.getOrderItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询订单明细
    const orderItem = await OrderItem.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'type']
        },
        {
          model: ProductQuote,
          attributes: ['id', 'cost_price']
        },
        {
          model: AgentProductPrice,
          attributes: ['id', 'cost_price', 'selling_price']
        }
      ]
    });
    
    if (!orderItem) {
      return res.status(404).json({
        message: '订单明细不存在'
      });
    }
    
    return res.status(200).json(orderItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '获取订单明细信息时出错'
    });
  }
};

/**
 * 添加订单明细
 */
exports.addOrderItem = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { order_id, product_id, product_quote_id, agent_product_price_id, quantity, unit_price, remarks } = req.body;
    
    // 检查订单是否存在
    const order = await Order.findByPk(order_id);
    
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
        message: '已取消的订单不能添加明细'
      });
    }
    
    if (order.order_status === 'completed') {
      await transaction.rollback();
      return res.status(400).json({
        message: '已完成的订单不能添加明细'
      });
    }
    
    // 检查产品是否存在
    const product = await Product.findByPk(product_id);
    
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        message: '产品不存在'
      });
    }
    
    // 检查产品报价是否存在
    const productQuote = await ProductQuote.findByPk(product_quote_id);
    
    if (!productQuote) {
      await transaction.rollback();
      return res.status(404).json({
        message: '产品报价不存在'
      });
    }
    
    // 检查代理产品价格是否存在
    const agentProductPrice = await AgentProductPrice.findByPk(agent_product_price_id);
    
    if (!agentProductPrice) {
      await transaction.rollback();
      return res.status(404).json({
        message: '代理产品价格不存在'
      });
    }
    
    // 计算小计金额
    const subtotal = quantity * unit_price;
    
    // 创建订单明细
    const orderItem = await OrderItem.create({
      order_id,
      product_id,
      product_quote_id,
      agent_product_price_id,
      quantity,
      unit_price,
      subtotal,
      remarks
    }, { transaction });
    
    // 更新订单总金额
    const newTotalAmount = parseFloat(order.total_amount) + subtotal;
    await order.update({
      total_amount: newTotalAmount
    }, { transaction });
    
    await transaction.commit();
    
    return res.status(201).json({
      id: orderItem.id,
      message: '订单明细添加成功'
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({
      message: '添加订单明细时出错'
    });
  }
};

/**
 * 更新订单明细
 */
exports.updateOrderItem = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { quantity, unit_price, remarks } = req.body;
    
    // 查询订单明细
    const orderItem = await OrderItem.findByPk(id);
    
    if (!orderItem) {
      await transaction.rollback();
      return res.status(404).json({
        message: '订单明细不存在'
      });
    }
    
    // 查询订单
    const order = await Order.findByPk(orderItem.order_id);
    
    // 检查订单状态
    if (order.order_status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        message: '已取消的订单不能修改明细'
      });
    }
    
    if (order.order_status === 'completed') {
      await transaction.rollback();
      return res.status(400).json({
        message: '已完成的订单不能修改明细'
      });
    }
    
    // 计算原小计金额
    const oldSubtotal = orderItem.subtotal;
    
    // 计算新小计金额
    const newQuantity = quantity || orderItem.quantity;
    const newUnitPrice = unit_price || orderItem.unit_price;
    const newSubtotal = newQuantity * newUnitPrice;
    
    // 更新订单明细
    await orderItem.update({
      quantity: newQuantity,
      unit_price: newUnitPrice,
      subtotal: newSubtotal,
      remarks: remarks !== undefined ? remarks : orderItem.remarks
    }, { transaction });
    
    // 更新订单总金额
    const newTotalAmount = parseFloat(order.total_amount) - oldSubtotal + newSubtotal;
    await order.update({
      total_amount: newTotalAmount
    }, { transaction });
    
    await transaction.commit();
    
    return res.status(200).json({
      message: '订单明细更新成功'
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({
      message: '更新订单明细时出错'
    });
  }
};

/**
 * 删除订单明细
 */
exports.deleteOrderItem = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // 查询订单明细
    const orderItem = await OrderItem.findByPk(id);
    
    if (!orderItem) {
      await transaction.rollback();
      return res.status(404).json({
        message: '订单明细不存在'
      });
    }
    
    // 查询订单
    const order = await Order.findByPk(orderItem.order_id);
    
    // 检查订单状态
    if (order.order_status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        message: '已取消的订单不能删除明细'
      });
    }
    
    if (order.order_status === 'completed') {
      await transaction.rollback();
      return res.status(400).json({
        message: '已完成的订单不能删除明细'
      });
    }
    
    // 获取订单明细小计金额
    const subtotal = orderItem.subtotal;
    
    // 删除订单明细
    await orderItem.destroy({ transaction });
    
    // 更新订单总金额
    const newTotalAmount = parseFloat(order.total_amount) - subtotal;
    await order.update({
      total_amount: newTotalAmount
    }, { transaction });
    
    await transaction.commit();
    
    return res.status(200).json({
      message: '订单明细删除成功'
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({
      message: '删除订单明细时出错'
    });
  }
}; 