/**
 * 修复模型定义中的时间戳字段
 * 将 createdAt: 'createdAt' 改为 createdAt: 'created_at'
 * 将 updatedAt: 'updatedAt' 改为 updatedAt: 'updated_at'
 */

const fs = require('fs');
const path = require('path');

// 模型目录
const modelsDir = './backend/src/models';

// 处理文件内容
function processFileContent(content) {
  // 替换时间戳字段
  let modifiedContent = content
    .replace(/createdAt: ['"]createdAt['"]/g, "createdAt: 'created_at'")
    .replace(/updatedAt: ['"]updatedAt['"]/g, "updatedAt: 'updated_at'");
  
  return modifiedContent;
}

// 处理目录中的所有文件
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile() && filePath.endsWith('.js')) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const modifiedContent = processFileContent(content);
        
        if (content !== modifiedContent) {
          fs.writeFileSync(filePath, modifiedContent, 'utf8');
          console.log(`已修改: ${filePath}`);
        }
      } catch (error) {
        console.error(`处理文件 ${filePath} 时出错:`, error);
      }
    }
  }
}

// 执行处理
console.log('开始修复模型定义中的时间戳字段...');
processDirectory(modelsDir);
console.log('模型定义中的时间戳字段修复完成!'); 