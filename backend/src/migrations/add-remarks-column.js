const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

// 读取SQL文件
const sqlPath = path.join(__dirname, 'add-remarks-column.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

async function runMigration() {
  try {
    console.log('开始执行迁移：添加remarks字段...');
    
    // 执行SQL语句
    await sequelize.query(sql);
    
    console.log('迁移成功完成！');
    process.exit(0);
  } catch (error) {
    console.error('迁移失败:', error);
    process.exit(1);
  }
}

runMigration(); 