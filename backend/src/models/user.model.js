const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '用户名'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '密码（加密存储）'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '姓名'
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'supplier'),
      allowNull: false,
      defaultValue: 'user',
      comment: '角色（管理员/普通用户/供应商）'
    },
    status: {
      type: DataTypes.ENUM('enabled', 'disabled'),
      allowNull: false,
      defaultValue: 'enabled',
      comment: '状态（启用/禁用）'
    },
    last_login_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登录时间'
    }
  }, {
    tableName: 'user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return User;
};
