/**
 * 完成用户角色迁移
 * 设置roleId字段为非空
 */
const { sequelize } = require('../models');

async function completeMigration() {
  try {
    console.log('开始完成用户角色迁移...');
    
    // 开始事务
    const transaction = await sequelize.transaction();
    
    try {
      // 设置roleId字段为非空
      console.log('设置roleId字段为非空...');
      await sequelize.query(
        'ALTER TABLE `user` MODIFY COLUMN `roleId` INT NOT NULL COMMENT \'角色ID（关联角色表）\'',
        { transaction }
      );
      
      // 提交事务
      await transaction.commit();
      console.log('用户角色迁移完成!');
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      console.error('完成迁移过程中发生错误，已回滚:', error);
      throw error;
    }
  } catch (error) {
    console.error('完成用户角色迁移失败:', error);
    throw error;
  }
}

// 执行完成迁移
completeMigration()
  .then(() => {
    console.log('完成迁移脚本执行完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('完成迁移脚本执行失败:', error);
    process.exit(1);
  }); 