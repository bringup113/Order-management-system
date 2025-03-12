const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AgentProductPrice = sequelize.define('agent_product_price', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_quote_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '产品报价ID'
    },
    agentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '代理ID'
    },
    cost_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '成本价格'
    },
    selling_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '销售价格'
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    }
  }, {
    tableName: 'agent_product_price',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return AgentProductPrice;
}; 