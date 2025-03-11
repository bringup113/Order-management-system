const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { sequelize } = require('./models');
const config = require('../config');
const responseMiddleware = require('./middlewares/response.middleware');

// 导入路由
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const passportRoutes = require('./routes/passport.routes');
const visaRoutes = require('./routes/visa.routes');
const productRoutes = require('./routes/product.routes');
const productQuoteRoutes = require('./routes/productQuote.routes');
const agentProductPriceRoutes = require('./routes/agentProductPrice.routes');
const supplierRoutes = require('./routes/supplier.routes');
const agentRoutes = require('./routes/agent.routes');
const orderRoutes = require('./routes/order.routes');
const orderItemRoutes = require('./routes/orderItem.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const paymentRoutes = require('./routes/payment.routes');
const systemRoutes = require('./routes/system.routes');
// 暂时注释掉其他路由，等待实现
/*
const configRoutes = require('./routes/config.routes');
const logRoutes = require('./routes/log.routes');
*/

const app = express();

// 中间件
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 设置响应头，确保中文字符正确显示
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// 响应格式化中间件
app.use(responseMiddleware);

// 静态文件目录
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/passports', passportRoutes);
app.use('/api/visas', visaRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product-quotes', productQuoteRoutes);
app.use('/api/agent-product-prices', agentProductPriceRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/system', systemRoutes);
// 暂时注释掉其他路由，等待实现
/*
app.use('/api/configs', configRoutes);
app.use('/api/logs', logRoutes);
*/

// 添加一个简单的测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: '后端API服务正常运行' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// 启动服务器
const PORT = config.backend.port || 5001;
app.listen(PORT, config.backend.host, async () => {
  console.log(`服务器运行在 http://${config.backend.host}:${PORT}`);
  
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}); 