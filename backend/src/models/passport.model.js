const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Passport = sequelize.define('passport', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '客户姓名'
    },
    passport_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '护照号码'
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '国籍'
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '出生日期'
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false,
      comment: '性别（男/女/其他）'
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '护照签发日期'
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '护照有效期'
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    }
  }, {
    tableName: 'passport',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Passport;
}; 