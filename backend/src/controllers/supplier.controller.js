const { Supplier, ProductQuote } = require('../models');
const { Op } = require('sequelize');

/**
 * 获取所有供应商
 */
exports.getSuppliers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { contact_person: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    // 查询供应商
    const { count, rows } = await Supplier.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    });
    
    return res.success({ count, rows });
  } catch (error) {
    console.error(error);
    return res.serverError('获取供应商列表时出错', error);
  }
};

/**
 * 获取单个供应商
 */
exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询供应商
    const supplier = await Supplier.findByPk(id);
    
    if (!supplier) {
      return res.notFound('供应商不存在');
    }
    
    return res.success(supplier);
  } catch (error) {
    console.error(error);
    return res.serverError('获取供应商信息时出错', error);
  }
};

/**
 * 创建供应商
 */
exports.createSupplier = async (req, res) => {
  try {
    const { name, contact_person, contact_phone, address, status, remarks } = req.body;
    
    // 创建供应商
    const supplier = await Supplier.create({
      name,
      contact_person,
      contact_phone,
      address,
      status,
      remarks
    });
    
    return res.created(supplier);
  } catch (error) {
    console.error(error);
    return res.serverError('创建供应商时出错', error);
  }
};

/**
 * 更新供应商
 */
exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_person, contact_phone, address, status, remarks } = req.body;
    
    // 查询供应商
    const supplier = await Supplier.findByPk(id);
    
    if (!supplier) {
      return res.notFound('供应商不存在');
    }
    
    // 更新供应商
    await supplier.update({
      name: name || supplier.name,
      contact_person: contact_person !== undefined ? contact_person : supplier.contact_person,
      contact_phone: contact_phone !== undefined ? contact_phone : supplier.contact_phone,
      address: address !== undefined ? address : supplier.address,
      status: status || supplier.status,
      remarks: remarks !== undefined ? remarks : supplier.remarks
    });
    
    return res.success(supplier);
  } catch (error) {
    console.error(error);
    return res.serverError('更新供应商时出错', error);
  }
};

/**
 * 删除供应商
 */
exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询供应商
    const supplier = await Supplier.findByPk(id);
    
    if (!supplier) {
      return res.notFound('供应商不存在');
    }
    
    // 检查是否有关联的产品报价
    const quoteCount = await ProductQuote.count({ where: { supplierId: id } });
    
    if (quoteCount > 0) {
      return res.error('无法删除供应商，存在关联的产品报价');
    }
    
    // 删除供应商
    await supplier.destroy();
    
    return res.success({ message: '供应商删除成功' });
  } catch (error) {
    console.error(error);
    return res.serverError('删除供应商时出错', error);
  }
}; 