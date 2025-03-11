const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('order_item', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '订单ID'
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '产品ID'
    },
    product_quote_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '产品报价ID'
    },
    agent_product_price_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '代理产品价格ID'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '数量'
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '单价'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '小计金额'
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    }
  }, {
    tableName: 'order_item',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return OrderItem;
}; 