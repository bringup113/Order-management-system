const { Passport, Visa } = require('../models');
const { Op } = require('sequelize');

/**
 * 获取所有护照
 */
exports.getPassports = async (req, res) => {
  try {
    const { page_num = 1, page_size = 10, name, passport_no, nationality } = req.query;
    const offset = (page_num - 1) * page_size;
    
    // 构建查询条件
    const where = {};
    
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    
    if (passport_no) {
      where.passport_no = { [Op.like]: `%${passport_no}%` };
    }
    
    if (nationality) {
      where.nationality = { [Op.like]: `%${nationality}%` };
    }
    
    // 查询护照
    const { count, rows } = await Passport.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      offset,
      limit: parseInt(page_size)
    });
    
    return res.status(200).json({
      total: count,
      page: parseInt(page_num),
      limit: parseInt(page_size),
      data: rows
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '获取护照列表时出错'
    });
  }
};

/**
 * 获取单个护照
 */
exports.getPassportById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`获取护照详情，ID: ${id}`);
    
    // 查询护照
    const passport = await Passport.findByPk(id, {
      include: [
        {
          model: Visa,
          as: 'visas',
          required: false
        }
      ]
    });
    
    if (!passport) {
      return res.status(404).json({
        message: '护照不存在'
      });
    }
    
    return res.status(200).json(passport);
  } catch (error) {
    console.error('获取护照详情时出错:', error);
    return res.status(500).json({
      message: '获取护照信息时出错',
      error: error.message
    });
  }
};

/**
 * 创建护照
 */
exports.createPassport = async (req, res) => {
  try {
    const { name, passport_no, nationality, birth_date, gender, issue_date, expiry_date, remarks } = req.body;
    
    // 检查护照号码是否已存在
    const existingPassport = await Passport.findOne({ where: { passport_no } });
    
    if (existingPassport) {
      return res.status(400).json({
        message: '护照号码已存在'
      });
    }
    
    // 创建护照
    const passport = await Passport.create({
      name,
      passport_no,
      nationality,
      birth_date,
      gender,
      issue_date,
      expiry_date,
      remarks
    });
    
    return res.status(201).json(passport);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '创建护照时出错'
    });
  }
};

/**
 * 更新护照
 */
exports.updatePassport = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nationality, birth_date, gender, issue_date, expiry_date, remarks } = req.body;
    
    // 查询护照
    const passport = await Passport.findByPk(id);
    
    if (!passport) {
      return res.status(404).json({
        message: '护照不存在'
      });
    }
    
    // 更新护照
    await passport.update({
      name: name || passport.name,
      nationality: nationality || passport.nationality,
      birth_date: birth_date || passport.birth_date,
      gender: gender || passport.gender,
      issue_date: issue_date || passport.issue_date,
      expiry_date: expiry_date || passport.expiry_date,
      remarks: remarks !== undefined ? remarks : passport.remarks
    });
    
    return res.status(200).json(passport);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '更新护照时出错'
    });
  }
};

/**
 * 删除护照
 */
exports.deletePassport = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询护照
    const passport = await Passport.findByPk(id);
    
    if (!passport) {
      return res.status(404).json({
        message: '护照不存在'
      });
    }
    
    // 检查是否有关联的签证
    const visaCount = await Visa.count({ where: { passport_id: id } });
    
    if (visaCount > 0) {
      return res.status(400).json({
        message: '无法删除护照，存在关联的签证记录'
      });
    }
    
    // 删除护照
    await passport.destroy();
    
    return res.status(200).json({
      message: '护照删除成功'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: '删除护照时出错'
    });
  }
}; 