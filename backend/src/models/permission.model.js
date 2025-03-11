const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Permission = sequelize.define('Permission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '权限名称'
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: '权限编码'
    },
    description: {
      type: DataTypes.STRING,
      comment: '权限描述'
    },
    module: {
      type: DataTypes.STRING,
      comment: '所属模块'
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
    tableName: 'permissions',
    timestamps: true
  });

  return Permission;
}; 