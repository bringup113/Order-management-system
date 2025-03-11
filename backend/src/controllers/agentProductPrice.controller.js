const { AgentProductPrice, ProductQuote, Product, Supplier, Agent } = require('../models');
const { Op } = require('sequelize');

/**
 * 获取所有代理产品价格
 */
exports.getAgentProductPrices = async (req, res) => {
  try {
    const { page = 1, limit = 10, agent_id, product_quote_id } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {};
    
    if (agent_id) {
      where.agent_id = agent_id;
    }
    
    if (product_quote_id) {
      where.product_quote_id = product_quote_id;
    }
    
    // 查询代理产品价格
    const { count, rows } = await AgentProductPrice.findAndCountAll({
      where,
      include: [
        {
          model: ProductQuote,
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'type']
            },
            {
              model: Supplier,
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: Agent,
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']],
      offset,
      limit: parseInt(limit)
    });
    
    return res.status(200).json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '获取代理产品价格列表时出错'
    });
  }
};

/**
 * 获取单个代理产品价格
 */
exports.getAgentProductPriceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询代理产品价格
    const agentProductPrice = await AgentProductPrice.findByPk(id, {
      include: [
        {
          model: ProductQuote,
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'type']
            },
            {
              model: Supplier,
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: Agent,
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!agentProductPrice) {
      return res.status(404).json({
        message: '代理产品价格不存在'
      });
    }
    
    return res.status(200).json(agentProductPrice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '获取代理产品价格信息时出错'
    });
  }
};

/**
 * 创建代理产品价格
 */
exports.createAgentProductPrice = async (req, res) => {
  try {
    const { product_quote_id, agent_id, cost_price, selling_price, remarks } = req.body;
    
    // 检查产品报价是否存在
    const productQuote = await ProductQuote.findByPk(product_quote_id);
    
    if (!productQuote) {
      return res.status(404).json({
        message: '产品报价不存在'
      });
    }
    
    // 检查代理是否存在
    const agent = await Agent.findByPk(agent_id);
    
    if (!agent) {
      return res.status(404).json({
        message: '代理不存在'
      });
    }
    
    // 检查是否已存在相同的产品报价和代理组合
    const existingPrice = await AgentProductPrice.findOne({
      where: {
        product_quote_id,
        agent_id
      }
    });
    
    if (existingPrice) {
      return res.status(400).json({
        message: '该产品报价和代理的价格已存在'
      });
    }
    
    // 创建代理产品价格
    const agentProductPrice = await AgentProductPrice.create({
      product_quote_id,
      agent_id,
      cost_price,
      selling_price,
      remarks
    });
    
    return res.status(201).json(agentProductPrice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '创建代理产品价格时出错'
    });
  }
};

/**
 * 更新代理产品价格
 */
exports.updateAgentProductPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { cost_price, selling_price, remarks } = req.body;
    
    // 查询代理产品价格
    const agentProductPrice = await AgentProductPrice.findByPk(id);
    
    if (!agentProductPrice) {
      return res.status(404).json({
        message: '代理产品价格不存在'
      });
    }
    
    // 更新代理产品价格
    await agentProductPrice.update({
      cost_price: cost_price || agentProductPrice.cost_price,
      selling_price: selling_price || agentProductPrice.selling_price,
      remarks: remarks !== undefined ? remarks : agentProductPrice.remarks
    });
    
    return res.status(200).json(agentProductPrice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '更新代理产品价格时出错'
    });
  }
};

/**
 * 删除代理产品价格
 */
exports.deleteAgentProductPrice = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询代理产品价格
    const agentProductPrice = await AgentProductPrice.findByPk(id);
    
    if (!agentProductPrice) {
      return res.status(404).json({
        message: '代理产品价格不存在'
      });
    }
    
    // 删除代理产品价格
    await agentProductPrice.destroy();
    
    return res.status(200).json({
      message: '代理产品价格删除成功'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '删除代理产品价格时出错'
    });
  }
}; 