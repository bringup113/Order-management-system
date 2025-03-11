const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OperationLog = sequelize.define('operation_log', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户ID'
    },
    operation_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '操作类型'
    },
    operation_content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '操作内容'
    },
    operation_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '操作时间'
    },
    ip_address: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'IP地址'
    },
    device_info: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '设备信息'
    }
  }, {
    tableName: 'operation_log',
    timestamps: false
  });

  return OperationLog;
}; 