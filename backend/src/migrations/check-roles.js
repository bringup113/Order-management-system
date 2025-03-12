/**
 * 检查数据库中是否已经存在必要的角色记录
 * 如果不存在，则创建默认角色
 */
const { sequelize, Role } = require('../models');

async function checkAndCreateRoles() {
  try {
    console.log('检查角色数据...');
    
    // 默认角色列表
    const defaultRoles = [
      { code: 'admin', name: '管理员', description: '系统管理员，拥有所有权限' },
      { code: 'user', name: '普通用户', description: '普通用户，拥有基本权限' },
      { code: 'supplier', name: '供应商', description: '供应商用户，拥有供应商相关权限' }
    ];
    
    // 开始事务
    const transaction = await sequelize.transaction();
    
    try {
      // 检查每个默认角色是否存在
      for (const role of defaultRoles) {
        const existingRole = await Role.findOne({
          where: { code: role.code },
          transaction
        });
        
        if (!existingRole) {
          // 如果角色不存在，则创建
          const newRole = await Role.create({
            ...role,
            status: 'active'
          }, { transaction });
          
          console.log(`创建角色: ${role.name} (${role.code}), ID: ${newRole.id}`);
        } else {
          console.log(`角色已存在: ${role.name} (${role.code}), ID: ${existingRole.id}`);
        }
      }
      
      // 提交事务
      await transaction.commit();
      console.log('角色数据检查完成!');
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      console.error('检查角色数据过程中发生错误，已回滚:', error);
      throw error;
    }
  } catch (error) {
    console.error('检查角色数据失败:', error);
    throw error;
  }
}

// 执行检查
checkAndCreateRoles()
  .then(() => {
    console.log('角色检查脚本执行完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('角色检查脚本执行失败:', error);
    process.exit(1);
  }); 