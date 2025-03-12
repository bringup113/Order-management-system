/**
 * 数据库迁移主脚本
 * 执行此脚本将完成数据库结构和数据的迁移
 */
console.log('开始执行数据库迁移...');

// 执行迁移脚本
require('./src/migrations/run-migration'); 