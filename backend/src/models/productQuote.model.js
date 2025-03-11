const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductQuote = sequelize.define('product_quote', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '产品ID'
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '供应商ID'
    },
    cost_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '成本价格'
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    }
  }, {
    tableName: 'product_quote',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ProductQuote;
}; 