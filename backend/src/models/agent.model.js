const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Agent = sequelize.define('agent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '代理名称'
    },
    contact_person: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '联系人'
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '联系电话'
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '地址'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
      comment: '状态（合作中/已终止）'
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    }
  }, {
    tableName: 'agent',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Agent;
}; 