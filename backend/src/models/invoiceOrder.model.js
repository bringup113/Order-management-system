const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InvoiceOrder = sequelize.define('invoice_order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '账单ID'
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '订单ID'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '金额'
    },
    status: {
      type: DataTypes.ENUM('active', 'cancelled'),
      allowNull: false,
      defaultValue: 'active',
      comment: '状态（有效/取消）'
    }
  }, {
    tableName: 'invoice_order',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return InvoiceOrder;
}; 