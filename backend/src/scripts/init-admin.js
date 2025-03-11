const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

async function initAdmin() {
  try {
    console.log('开始初始化管理员用户...');
    
    // 检查是否已存在管理员用户
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    
    if (adminExists) {
      console.log('管理员用户已存在，跳过初始化');
      return;
    }
    
    // 创建管理员用户
    const hashedPassword = bcrypt.hashSync('admin123', 8);
    
    await User.create({
      username: 'admin',
      password: hashedPassword,
      name: '系统管理员',
      role: 'admin',
      status: 'enabled'
    });
    
    console.log('管理员用户创建成功');
  } catch (error) {
    console.error('初始化管理员用户失败:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 执行初始化
initAdmin(); 