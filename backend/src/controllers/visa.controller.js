const { Visa, Passport } = require('../models');
const { Op } = require('sequelize');

/**
 * 获取所有签证
 */
exports.getVisas = async (req, res) => {
  try {
    const { page = 1, limit = 10, passportId, passport_id, status, issueCountry, issue_country } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {};
    
    // 支持驼峰命名和下划线命名
    if (passportId || passport_id) {
      where.passport_id = passportId || passport_id;
    }
    
    if (status) {
      where.status = status;
    }
    
    // 支持驼峰命名和下划线命名
    if (issueCountry || issue_country) {
      where.issue_country = issueCountry || issue_country;
    }
    
    console.log('查询签证列表参数:', { where, offset, limit, passportId: passportId || passport_id });
    
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
    
    console.log(`找到 ${count} 条签证记录，护照ID: ${passportId || passport_id}`);
    
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
    
    console.log(`获取签证详情，ID: ${id}`);
    
    // 查询签证
    const visa = await Visa.findByPk(id, {
      include: [
        {
          model: Passport,
          attributes: ['id', 'name', 'passport_no', 'nationality'],
          as: 'passport'
        }
      ]
    });
    
    if (!visa) {
      console.log(`签证不存在，ID: ${id}`);
      return res.status(404).json({
        message: '签证不存在'
      });
    }
    
    console.log(`成功获取签证详情，ID: ${id}`);
    return res.status(200).json(visa);
  } catch (error) {
    console.error('获取签证信息时出错:', error);
    return res.status(500).json({
      message: '获取签证信息时出错',
      error: error.message
    });
  }
};

/**
 * 创建签证
 */
exports.createVisa = async (req, res) => {
  try {
    // 支持驼峰命名和下划线命名
    const passportId = req.body.passportId || req.body.passport_id;
    const visaType = req.body.visaType || req.body.visa_type;
    const issueCountry = req.body.issueCountry || req.body.issue_country;
    const issueDate = req.body.issueDate || req.body.issue_date;
    const expiryDate = req.body.expiryDate || req.body.expiry_date;
    const entryCount = req.body.entryCount || req.body.entry_count;
    const status = req.body.status;
    const remarks = req.body.remarks;
    
    console.log('创建签证请求数据:', {
      passportId,
      visaType,
      issueCountry,
      issueDate,
      expiryDate,
      entryCount,
      status,
      remarks
    });
    
    // 检查护照是否存在
    const passport = await Passport.findByPk(passportId);
    
    if (!passport) {
      return res.status(404).json({
        message: '护照不存在'
      });
    }
    
    // 创建签证
    const visa = await Visa.create({
      passport_id: passportId,
      visa_type: visaType,
      issue_country: issueCountry,
      issue_date: issueDate,
      expiry_date: expiryDate,
      entry_count: entryCount,
      status,
      remarks
    });
    
    return res.status(201).json(visa);
  } catch (error) {
    console.error('创建签证时出错:', error);
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
    // 支持驼峰命名和下划线命名
    const passportId = req.body.passportId || req.body.passport_id;
    const visaType = req.body.visaType || req.body.visa_type;
    const issueCountry = req.body.issueCountry || req.body.issue_country;
    const issueDate = req.body.issueDate || req.body.issue_date;
    const expiryDate = req.body.expiryDate || req.body.expiry_date;
    const entryCount = req.body.entryCount || req.body.entry_count;
    const status = req.body.status;
    const remarks = req.body.remarks;
    
    console.log('更新签证请求数据:', {
      id,
      passportId,
      visaType,
      issueCountry,
      issueDate,
      expiryDate,
      entryCount,
      status,
      remarks
    });
    
    // 查询签证
    const visa = await Visa.findByPk(id);
    
    if (!visa) {
      return res.status(404).json({
        message: '签证不存在'
      });
    }
    
    // 更新签证
    const updateData = {
      visa_type: visaType || visa.visa_type,
      issue_country: issueCountry || visa.issue_country,
      issue_date: issueDate || visa.issue_date,
      expiry_date: expiryDate || visa.expiry_date,
      entry_count: entryCount || visa.entry_count,
      status: status || visa.status,
      remarks: remarks !== undefined ? remarks : visa.remarks
    };
    
    // 如果更新了护照ID
    if (passportId) {
      // 检查护照是否存在
      const passport = await Passport.findByPk(passportId);
      
      if (!passport) {
        return res.status(404).json({
          message: '护照不存在'
        });
      }
      
      updateData.passport_id = passportId;
    }
    
    await visa.update(updateData);
    
    return res.status(200).json(visa);
  } catch (error) {
    console.error('更新签证时出错:', error);
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