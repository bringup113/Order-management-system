/**
 * 删除用户表中的role字段
 * 由于我们已经将角色信息迁移到roleId字段，role字段现在是冗余的
 */
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

async function dropRoleColumn() {
  try {
    console.log('开始删除用户表中的role字段...');
    
    // 读取SQL脚本文件
    const sqlFilePath = path.join(__dirname, 'drop-role-column.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // 开始事务
    const transaction = await sequelize.transaction();
    
    try {
      // 执行SQL语句
      console.log('执行SQL语句:', sqlScript);
      await sequelize.query(sqlScript, { transaction });
      
      // 提交事务
      await transaction.commit();
      console.log('删除role字段成功!');
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      console.error('删除role字段过程中发生错误，已回滚:', error);
      throw error;
    }
  } catch (error) {
    console.error('删除role字段失败:', error);
    throw error;
  }
}

// 执行删除
dropRoleColumn()
  .then(() => {
    console.log('删除role字段脚本执行完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('删除role字段脚本执行失败:', error);
    process.exit(1);
  }); 