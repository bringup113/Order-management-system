const { Product, ProductQuote, Supplier } = require('../models');
const { Op } = require('sequelize');

/**
 * 获取所有产品
 */
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, type, status } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    }
    
    // 查询产品
    const { count, rows } = await Product.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    });
    
    return res.success({ count, rows });
  } catch (error) {
    console.error(error);
    return res.serverError('获取产品列表时出错', error);
  }
};

/**
 * 获取单个产品
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询产品
    const product = await Product.findByPk(id, {
      include: [
        {
          model: ProductQuote,
          include: [
            {
              model: Supplier,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });
    
    if (!product) {
      return res.notFound('产品不存在');
    }
    
    return res.success(product);
  } catch (error) {
    console.error(error);
    return res.serverError('获取产品信息时出错', error);
  }
};

/**
 * 创建产品
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, type, description, details, status, remarks } = req.body;
    
    // 创建产品
    const product = await Product.create({
      name,
      type,
      description,
      details,
      status,
      remarks
    });
    
    return res.created(product);
  } catch (error) {
    console.error(error);
    return res.serverError('创建产品时出错', error);
  }
};

/**
 * 更新产品
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description, details, status, remarks } = req.body;
    
    // 查询产品
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.notFound('产品不存在');
    }
    
    // 更新产品
    await product.update({
      name: name || product.name,
      type: type || product.type,
      description: description !== undefined ? description : product.description,
      details: details !== undefined ? details : product.details,
      status: status || product.status,
      remarks: remarks !== undefined ? remarks : product.remarks
    });
    
    return res.success(product);
  } catch (error) {
    console.error(error);
    return res.serverError('更新产品时出错', error);
  }
};

/**
 * 删除产品
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询产品
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.notFound('产品不存在');
    }
    
    // 检查是否有关联的产品报价
    const quoteCount = await ProductQuote.count({ where: { productId: id } });
    
    if (quoteCount > 0) {
      return res.error('无法删除产品，存在关联的产品报价');
    }
    
    // 删除产品
    await product.destroy();
    
    return res.success({ message: '产品删除成功' });
  } catch (error) {
    console.error(error);
    return res.serverError('删除产品时出错', error);
  }
}; 