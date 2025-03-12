/**
 * 执行数据库迁移脚本
 */
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

async function runMigration() {
  try {
    console.log('开始执行数据库迁移...');
    
    // 先检查并创建角色
    console.log('先检查并创建角色...');
    await require('./check-roles');
    
    // 读取SQL脚本文件
    const sqlFilePath = path.join(__dirname, 'user-role-migration.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // 将SQL脚本按分号分割成多个语句
    const statements = sqlScript
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // 开始事务
    const transaction = await sequelize.transaction();
    
    try {
      // 执行每个SQL语句
      for (const statement of statements) {
        console.log('执行SQL语句:', statement);
        await sequelize.query(statement, { transaction });
      }
      
      // 提交事务
      await transaction.commit();
      console.log('SQL脚本执行成功!');
      
      // 执行JavaScript迁移脚本
      console.log('开始执行JavaScript迁移脚本...');
      await require('./user-role-migration');
      
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      console.error('迁移过程中发生错误，已回滚:', error);
      throw error;
    }
  } catch (error) {
    console.error('执行数据库迁移失败:', error);
    throw error;
  }
}

// 执行迁移
runMigration()
  .then(() => {
    console.log('数据库迁移执行完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('数据库迁移执行失败:', error);
    process.exit(1);
  }); 