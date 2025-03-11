const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Invoice = sequelize.define('invoice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    invoice_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '账单编号'
    },
    passport_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '客户ID'
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '代理ID'
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '账单总金额'
    },
    paid_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '已支付金额'
    },
    unpaid_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '未支付金额'
    },
    status: {
      type: DataTypes.ENUM('unpaid', 'partially_paid', 'paid'),
      allowNull: false,
      defaultValue: 'unpaid',
      comment: '账单状态（未支付/部分支付/已支付）'
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '生成日期'
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '创建人'
    }
  }, {
    tableName: 'invoice',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Invoice;
}; 