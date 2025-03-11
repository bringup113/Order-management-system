const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '账单ID'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '支付金额'
    },
    payment_method: {
      type: DataTypes.ENUM('bank_transfer', 'cash', 'other'),
      allowNull: false,
      defaultValue: 'bank_transfer',
      comment: '支付方式（银行转账/现金/其他）'
    },
    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '支付日期'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
      comment: '支付状态（待审核/已审核/已拒绝）'
    },
    proof_image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '凭证图片URL'
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '审核人'
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '审核时间'
    },
    approval_remark: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '审核备注'
    }
  }, {
    tableName: 'payment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Payment;
}; 