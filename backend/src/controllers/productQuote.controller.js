const { ProductQuote, Product, Supplier, AgentProductPrice } = require('../models');
const { Op } = require('sequelize');

/**
 * 获取所有产品报价
 */
exports.getProductQuotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, product_id, supplier_id } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {};
    
    if (product_id) {
      where.product_id = product_id;
    }
    
    if (supplier_id) {
      where.supplier_id = supplier_id;
    }
    
    // 查询产品报价
    const { count, rows } = await ProductQuote.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'type']
        },
        {
          model: Supplier,
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
      message: '获取产品报价列表时出错'
    });
  }
};

/**
 * 获取单个产品报价
 */
exports.getProductQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询产品报价
    const productQuote = await ProductQuote.findByPk(id, {
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
    });
    
    if (!productQuote) {
      return res.status(404).json({
        message: '产品报价不存在'
      });
    }
    
    return res.status(200).json(productQuote);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '获取产品报价信息时出错'
    });
  }
};

/**
 * 创建产品报价
 */
exports.createProductQuote = async (req, res) => {
  try {
    const { product_id, supplier_id, cost_price, remarks } = req.body;
    
    // 检查产品是否存在
    const product = await Product.findByPk(product_id);
    
    if (!product) {
      return res.status(404).json({
        message: '产品不存在'
      });
    }
    
    // 检查供应商是否存在
    const supplier = await Supplier.findByPk(supplier_id);
    
    if (!supplier) {
      return res.status(404).json({
        message: '供应商不存在'
      });
    }
    
    // 检查是否已存在相同的产品和供应商组合
    const existingQuote = await ProductQuote.findOne({
      where: {
        product_id,
        supplier_id
      }
    });
    
    if (existingQuote) {
      return res.status(400).json({
        message: '该产品和供应商的报价已存在'
      });
    }
    
    // 创建产品报价
    const productQuote = await ProductQuote.create({
      product_id,
      supplier_id,
      cost_price,
      remarks
    });
    
    return res.status(201).json(productQuote);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '创建产品报价时出错'
    });
  }
};

/**
 * 更新产品报价
 */
exports.updateProductQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { cost_price, remarks } = req.body;
    
    // 查询产品报价
    const productQuote = await ProductQuote.findByPk(id);
    
    if (!productQuote) {
      return res.status(404).json({
        message: '产品报价不存在'
      });
    }
    
    // 更新产品报价
    await productQuote.update({
      cost_price: cost_price || productQuote.cost_price,
      remarks: remarks !== undefined ? remarks : productQuote.remarks
    });
    
    return res.status(200).json(productQuote);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '更新产品报价时出错'
    });
  }
};

/**
 * 删除产品报价
 */
exports.deleteProductQuote = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询产品报价
    const productQuote = await ProductQuote.findByPk(id);
    
    if (!productQuote) {
      return res.status(404).json({
        message: '产品报价不存在'
      });
    }
    
    // 检查是否有关联的代理产品价格
    const priceCount = await AgentProductPrice.count({ where: { product_quote_id: id } });
    
    if (priceCount > 0) {
      return res.status(400).json({
        message: '无法删除产品报价，存在关联的代理产品价格'
      });
    }
    
    // 删除产品报价
    await productQuote.destroy();
    
    return res.status(200).json({
      message: '产品报价删除成功'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '删除产品报价时出错'
    });
  }
}; 