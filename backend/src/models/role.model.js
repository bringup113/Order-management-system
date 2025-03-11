const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '角色名称'
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: '角色编码'
    },
    description: {
      type: DataTypes.STRING,
      comment: '角色描述'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      comment: '角色状态：active-启用，inactive-禁用'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'roles',
    timestamps: true
  });

  return Role;
}; 