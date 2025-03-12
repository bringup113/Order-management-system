/**
 * 用户角色迁移脚本
 * 将用户表中的role字段（ENUM类型）迁移到roleId字段（INTEGER类型）
 */
const { sequelize, User, Role } = require('../models');

async function migrateUserRoles() {
  try {
    console.log('开始迁移用户角色数据...');
    
    // 获取所有角色
    const roles = await Role.findAll();
    console.log('获取到角色列表:', roles.map(r => ({ id: r.id, name: r.name, code: r.code })));
    
    // 角色映射表
    const roleMapping = {
      'admin': roles.find(r => r.code === 'admin')?.id || 1,
      'user': roles.find(r => r.code === 'user')?.id || 2,
      'supplier': roles.find(r => r.code === 'supplier')?.id || 3
    };
    
    console.log('角色映射表:', roleMapping);
    
    // 获取所有用户
    const users = await sequelize.query(
      'SELECT id, username, role FROM user',
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log(`获取到 ${users.length} 个用户需要迁移`);
    
    // 开始事务
    const transaction = await sequelize.transaction();
    
    try {
      // 更新每个用户的roleId
      for (const user of users) {
        const roleId = roleMapping[user.role] || roleMapping['user']; // 默认为普通用户
        
        await sequelize.query(
          'UPDATE user SET roleId = ? WHERE id = ?',
          {
            replacements: [roleId, user.id],
            type: sequelize.QueryTypes.UPDATE,
            transaction
          }
        );
        
        console.log(`用户 ${user.username} (ID: ${user.id}) 的角色从 ${user.role} 迁移到 roleId: ${roleId}`);
      }
      
      // 提交事务
      await transaction.commit();
      console.log('用户角色数据迁移成功!');
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      console.error('迁移过程中发生错误，已回滚:', error);
      throw error;
    }
  } catch (error) {
    console.error('迁移用户角色数据失败:', error);
    throw error;
  }
}

// 执行迁移
migrateUserRoles()
  .then(() => {
    console.log('迁移脚本执行完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('迁移脚本执行失败:', error);
    process.exit(1);
  }); 