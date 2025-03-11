const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '订单编号'
    },
    passport_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '客户ID（护照ID）'
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '代理ID'
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '订单总金额'
    },
    order_status: {
      type: DataTypes.ENUM('pending', 'processing', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
      comment: '订单状态（待处理/处理中/已取消/已完成）'
    },
    payment_status: {
      type: DataTypes.ENUM('unpaid', 'partial', 'paid'),
      allowNull: false,
      defaultValue: 'unpaid',
      comment: '支付状态（未支付/部分支付/已支付）'
    },
    order_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '下单日期'
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '创建人ID'
    }
  }, {
    tableName: 'order',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Order;
}; 