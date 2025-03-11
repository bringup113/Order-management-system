/**
 * 订单管理系统配置文件
 * 用于存储系统的IP地址与端口管理信息
 */

const config = {
  // 环境配置
  env: process.env.NODE_ENV || 'development',
  
  // 前端配置
  frontend: {
    host: process.env.FRONTEND_HOST || '0.0.0.0',
    port: process.env.FRONTEND_PORT || 3000, // 使用3000端口
  },
  
  // 后端配置
  backend: {
    host: process.env.BACKEND_HOST || '0.0.0.0',
    port: process.env.BACKEND_PORT || 5001, // 使用5001端口
    apiPrefix: '/api',
  },
  
  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'order_management',
    dialect: 'mysql',
  },
  
  // Redis配置（用于缓存和会话管理）
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
  },
  
  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  
  // 文件存储配置
  storage: {
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  },
};

module.exports = config; 