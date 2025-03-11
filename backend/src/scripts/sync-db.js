const { sequelize } = require('../models');

async function syncDatabase() {
  try {
    console.log('开始同步数据库...');
    
    // 同步所有模型到数据库
    // force: true 会先删除表再创建（危险操作，生产环境慎用）
    // alter: true 会尝试修改表结构，保留数据
    await sequelize.sync({ alter: true });
    
    console.log('数据库同步成功');
  } catch (error) {
    console.error('数据库同步失败:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 执行同步
syncDatabase(); 