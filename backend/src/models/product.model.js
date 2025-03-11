const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '产品名称'
    },
    type: {
      type: DataTypes.ENUM('tour', 'hotel', 'flight', 'other'),
      allowNull: false,
      comment: '产品类型（旅游产品/酒店/机票/其他）'
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '产品描述'
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '产品详情'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
      comment: '产品状态（上架/下架）'
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    }
  }, {
    tableName: 'product',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Product;
}; 