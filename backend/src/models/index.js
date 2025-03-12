const { Sequelize } = require('sequelize');
const config = require('../../config');

// 创建Sequelize实例
const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    logging: config.env === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      underscored: false,
      freezeTableName: false,
      charset: 'utf8mb4',
      timestamps: true
    },
    timezone: '+08:00', // 东八区
    dialectOptions: {
      charset: 'utf8mb4',
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  }
);

// 导入模型
const User = require('./user.model')(sequelize);
const Role = require('./role.model')(sequelize);
const Permission = require('./permission.model')(sequelize);
const Passport = require('./passport.model')(sequelize);
const Visa = require('./visa.model')(sequelize);
const Supplier = require('./supplier.model')(sequelize);
const Agent = require('./agent.model')(sequelize);
const Product = require('./product.model')(sequelize);
const ProductQuote = require('./productQuote.model')(sequelize);
const AgentProductPrice = require('./agentProductPrice.model')(sequelize);
const Order = require('./order.model')(sequelize);
const OrderItem = require('./orderItem.model')(sequelize);
const Invoice = require('./invoice.model')(sequelize);
const InvoiceOrder = require('./invoiceOrder.model')(sequelize);
const Payment = require('./payment.model')(sequelize);
const Config = require('./config.model')(sequelize);
const OperationLog = require('./operationLog.model')(sequelize);

// 创建模型对象
const models = {
  User,
  Role,
  Permission,
  Passport,
  Visa,
  Supplier,
  Agent,
  Product,
  ProductQuote,
  AgentProductPrice,
  Order,
  OrderItem,
  Invoice,
  InvoiceOrder,
  Payment,
  Config,
  OperationLog
};

// 调用模型的associate方法设置关联关系
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// 定义模型之间的关联关系
// 注意：用户和角色的关联关系已经在User.associate方法中定义，这里不需要重复定义
// User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
// Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

// 角色和权限的多对多关系
Role.belongsToMany(Permission, { through: 'RolePermissions', foreignKey: 'roleId' });
Permission.belongsToMany(Role, { through: 'RolePermissions', foreignKey: 'permissionId' });

// 护照和签证的一对多关系
Passport.hasMany(Visa, { foreignKey: 'passport_id', as: 'visas' });
Visa.belongsTo(Passport, { foreignKey: 'passport_id', as: 'passport' });

// 产品和产品报价的一对多关系
Product.hasMany(ProductQuote, { foreignKey: 'productId', as: 'quotes' });
ProductQuote.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// 供应商和产品报价的一对多关系
Supplier.hasMany(ProductQuote, { foreignKey: 'supplierId', as: 'quotes' });
ProductQuote.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });

// 产品报价和代理产品价格的一对多关系
ProductQuote.hasMany(AgentProductPrice, { foreignKey: 'productQuoteId', as: 'agentPrices' });
AgentProductPrice.belongsTo(ProductQuote, { foreignKey: 'productQuoteId', as: 'quote' });

// 代理和代理产品价格的一对多关系
Agent.hasMany(AgentProductPrice, { foreignKey: 'agentId', as: 'productPrices' });
AgentProductPrice.belongsTo(Agent, { foreignKey: 'agentId', as: 'agent' });

// 护照和订单的一对多关系
Passport.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
Order.belongsTo(Passport, { foreignKey: 'customerId', as: 'customer' });

// 代理和订单的一对多关系
Agent.hasMany(Order, { foreignKey: 'agentId', as: 'orders' });
Order.belongsTo(Agent, { foreignKey: 'agentId', as: 'agent' });

// 用户和订单的一对多关系（创建人）
User.hasMany(Order, { foreignKey: 'createdBy', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// 订单和订单明细的一对多关系
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// 产品和订单明细的一对多关系
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// 产品报价和订单明细的一对多关系
ProductQuote.hasMany(OrderItem, { foreignKey: 'productQuoteId', as: 'orderItems' });
OrderItem.belongsTo(ProductQuote, { foreignKey: 'productQuoteId', as: 'quote' });

// 代理产品价格和订单明细的一对多关系
AgentProductPrice.hasMany(OrderItem, { foreignKey: 'agentProductPriceId', as: 'orderItems' });
OrderItem.belongsTo(AgentProductPrice, { foreignKey: 'agentProductPriceId', as: 'agentPrice' });

// 护照和账单的一对多关系
Passport.hasMany(Invoice, { foreignKey: 'customerId', as: 'invoices' });
Invoice.belongsTo(Passport, { foreignKey: 'customerId', as: 'customer' });

// 代理和账单的一对多关系
Agent.hasMany(Invoice, { foreignKey: 'agentId', as: 'invoices' });
Invoice.belongsTo(Agent, { foreignKey: 'agentId', as: 'agent' });

// 用户和账单的一对多关系（创建人）
User.hasMany(Invoice, { foreignKey: 'createdBy', as: 'invoices' });
Invoice.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// 账单和账单订单关联的一对多关系
Invoice.hasMany(InvoiceOrder, { foreignKey: 'invoiceId', as: 'invoiceOrders' });
InvoiceOrder.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

// 订单和账单订单关联的一对多关系
Order.hasMany(InvoiceOrder, { foreignKey: 'orderId', as: 'invoiceOrders' });
InvoiceOrder.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// 账单和支付记录的一对多关系
Invoice.hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments' });
Payment.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

// 用户和支付记录的一对多关系（创建人）
User.hasMany(Payment, { foreignKey: 'createdBy', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// 用户和支付记录的一对多关系（审核人）
User.hasMany(Payment, { foreignKey: 'reviewerId', as: 'reviewedPayments' });
Payment.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });

// 用户和操作日志的一对多关系
User.hasMany(OperationLog, { foreignKey: 'userId', as: 'logs' });
OperationLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 导出模型和Sequelize实例
module.exports = {
  sequelize,
  User,
  Role,
  Permission,
  Passport,
  Visa,
  Supplier,
  Agent,
  Product,
  ProductQuote,
  AgentProductPrice,
  Order,
  OrderItem,
  Invoice,
  InvoiceOrder,
  Payment,
  Config,
  OperationLog
};