const { Agent, AgentProductPrice } = require('../models');
const { Op } = require('sequelize');

/**
 * 获取所有代理
 */
exports.getAgents = async (req, res) => {
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
    
    // 查询代理
    const { count, rows } = await Agent.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      offset,
      limit: parseInt(limit)
    });
    
    return res.success({ count, rows });
  } catch (error) {
    console.error(error);
    return res.serverError('获取代理列表时出错', error);
  }
};

/**
 * 获取单个代理
 */
exports.getAgentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询代理
    const agent = await Agent.findByPk(id);
    
    if (!agent) {
      return res.notFound('代理不存在');
    }
    
    return res.success(agent);
  } catch (error) {
    console.error(error);
    return res.serverError('获取代理信息时出错', error);
  }
};

/**
 * 创建代理
 */
exports.createAgent = async (req, res) => {
  try {
    const { name, contact_person, contact_phone, address, status, remarks } = req.body;
    
    // 创建代理
    const agent = await Agent.create({
      name,
      contact_person,
      contact_phone,
      address,
      status,
      remarks
    });
    
    return res.created(agent);
  } catch (error) {
    console.error(error);
    return res.serverError('创建代理时出错', error);
  }
};

/**
 * 更新代理
 */
exports.updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_person, contact_phone, address, status, remarks } = req.body;
    
    // 查询代理
    const agent = await Agent.findByPk(id);
    
    if (!agent) {
      return res.notFound('代理不存在');
    }
    
    // 更新代理
    await agent.update({
      name: name || agent.name,
      contact_person: contact_person !== undefined ? contact_person : agent.contact_person,
      contact_phone: contact_phone !== undefined ? contact_phone : agent.contact_phone,
      address: address !== undefined ? address : agent.address,
      status: status || agent.status,
      remarks: remarks !== undefined ? remarks : agent.remarks
    });
    
    return res.success(agent);
  } catch (error) {
    console.error(error);
    return res.serverError('更新代理时出错', error);
  }
};

/**
 * 删除代理
 */
exports.deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询代理
    const agent = await Agent.findByPk(id);
    
    if (!agent) {
      return res.notFound('代理不存在');
    }
    
    // 检查是否有关联的代理产品价格
    const priceCount = await AgentProductPrice.count({ where: { agent_id: id } });
    
    if (priceCount > 0) {
      return res.error('无法删除代理，存在关联的代理产品价格');
    }
    
    // 删除代理
    await agent.destroy();
    
    return res.success({ message: '代理删除成功' });
  } catch (error) {
    console.error(error);
    return res.serverError('删除代理时出错', error);
  }
}; 