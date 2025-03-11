const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

async function resetAdmin() {
  try {
    console.log('开始重置管理员密码...');
    
    // 查找管理员用户
    const admin = await User.findOne({ where: { username: 'admin' } });
    
    if (!admin) {
      console.log('管理员用户不存在，请先创建管理员用户');
      return;
    }
    
    // 重置密码
    const hashedPassword = bcrypt.hashSync('admin123', 8);
    
    await admin.update({
      password: hashedPassword
    });
    
    console.log('管理员密码重置成功');
  } catch (error) {
    console.error('重置管理员密码失败:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 执行重置
resetAdmin(); 