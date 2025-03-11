import React from 'react';
import { Card } from 'antd';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams();
  
  return (
    <Card title={`订单详情 #${id}`}>
      <p>订单详情页面正在开发中...</p>
    </Card>
  );
};

export default OrderDetail; 