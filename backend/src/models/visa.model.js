const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Visa = sequelize.define('visa', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    passport_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '护照ID'
    },
    passportId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '护照ID（关联字段）'
    },
    visa_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '签证类型'
    },
    issue_country: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '签发国家/地区'
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '签发日期'
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '有效期'
    },
    entry_count: {
      type: DataTypes.ENUM('single', 'multiple'),
      allowNull: false,
      comment: '入境次数（单次/多次）'
    },
    status: {
      type: DataTypes.ENUM('valid', 'expired', 'expiring_soon'),
      allowNull: false,
      defaultValue: 'valid',
      comment: '签证状态（有效/过期/即将过期）'
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    }
  }, {
    tableName: 'visa',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Visa;
}; 