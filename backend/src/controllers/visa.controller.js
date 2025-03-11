const { Visa, Passport } = require('../models');
const { Op } = require('sequelize');

/**
 * 获取所有签证
 */
exports.getVisas = async (req, res) => {
  try {
    const { page = 1, limit = 10, passport_id, status, issue_country } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {};
    
    if (passport_id) {
      where.passport_id = passport_id;
      // 同时设置关联字段，确保查询正确
      where.passportId = passport_id;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (issue_country) {
      where.issue_country = issue_country;
    }
    
    console.log('查询签证列表参数:', { where, offset, limit, passport_id });
    
    // 查询签证
    const { count, rows } = await Visa.findAndCountAll({
      where,
      include: [
        {
          model: Passport,
          attributes: ['id', 'name', 'passport_no'],
          as: 'passport'
        }
      ],
      order: [['created_at', 'DESC']],
      offset,
      limit: parseInt(limit)
    });
    
    console.log(`找到 ${count} 条签证记录，护照ID: ${passport_id}`);
    
    // 处理返回数据，确保中文字符正确
    const processedRows = rows.map(row => {
      const plainRow = row.get({ plain: true });
      return plainRow;
    });
    
    return res.status(200).json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: processedRows
    });
  } catch (error) {
    console.error('获取签证列表时出错:', error);
    return res.status(500).json({
      message: '获取签证列表时出错',
      error: error.message
    });
  }
};

/**
 * 获取单个签证
 */
exports.getVisaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询签证
    const visa = await Visa.findByPk(id, {
      include: [
        {
          model: Passport,
          attributes: ['id', 'name', 'passport_no', 'nationality']
        }
      ]
    });
    
    if (!visa) {
      return res.status(404).json({
        message: '签证不存在'
      });
    }
    
    return res.status(200).json(visa);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '获取签证信息时出错'
    });
  }
};

/**
 * 创建签证
 */
exports.createVisa = async (req, res) => {
  try {
    const { passport_id, visa_type, issue_country, issue_date, expiry_date, entry_count, status, remarks } = req.body;
    
    // 检查护照是否存在
    const passport = await Passport.findByPk(passport_id);
    
    if (!passport) {
      return res.status(404).json({
        message: '护照不存在'
      });
    }
    
    // 创建签证
    const visa = await Visa.create({
      passport_id,
      passportId: passport_id, // 确保两个字段值一致
      visa_type,
      issue_country,
      issue_date,
      expiry_date,
      entry_count,
      status,
      remarks
    });
    
    return res.status(201).json(visa);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '创建签证时出错'
    });
  }
};

/**
 * 更新签证
 */
exports.updateVisa = async (req, res) => {
  try {
    const { id } = req.params;
    const { passport_id, visa_type, issue_country, issue_date, expiry_date, entry_count, status, remarks } = req.body;
    
    // 查询签证
    const visa = await Visa.findByPk(id);
    
    if (!visa) {
      return res.status(404).json({
        message: '签证不存在'
      });
    }
    
    // 更新签证
    const updateData = {
      visa_type: visa_type || visa.visa_type,
      issue_country: issue_country || visa.issue_country,
      issue_date: issue_date || visa.issue_date,
      expiry_date: expiry_date || visa.expiry_date,
      entry_count: entry_count || visa.entry_count,
      status: status || visa.status,
      remarks: remarks !== undefined ? remarks : visa.remarks
    };
    
    // 如果更新了护照ID，确保两个字段保持一致
    if (passport_id) {
      updateData.passport_id = passport_id;
      updateData.passportId = passport_id;
    }
    
    await visa.update(updateData);
    
    return res.status(200).json(visa);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '更新签证时出错'
    });
  }
};

/**
 * 删除签证
 */
exports.deleteVisa = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询签证
    const visa = await Visa.findByPk(id);
    
    if (!visa) {
      return res.status(404).json({
        message: '签证不存在'
      });
    }
    
    // 删除签证
    await visa.destroy();
    
    return res.status(200).json({
      message: '签证删除成功'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '删除签证时出错'
    });
  }
}; 