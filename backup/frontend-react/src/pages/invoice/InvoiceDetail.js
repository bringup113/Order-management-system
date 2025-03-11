import React from 'react';
import { Card } from 'antd';
import { useParams } from 'react-router-dom';

const InvoiceDetail = () => {
  const { id } = useParams();
  
  return (
    <Card title={`账单详情 #${id}`}>
      <p>账单详情页面正在开发中...</p>
    </Card>
  );
};

export default InvoiceDetail; 