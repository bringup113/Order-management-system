const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Config = sequelize.define('config', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    config_key: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '配置键'
    },
    config_value: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '配置值'
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '配置描述'
    }
  }, {
    tableName: 'config',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Config;
}; 