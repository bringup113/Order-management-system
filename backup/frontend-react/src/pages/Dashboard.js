import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button, Spin } from 'antd';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  FileTextOutlined, 
  BankOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customerCount: 0,
    productCount: 0,
    orderCount: 0,
    invoiceCount: 0,
    recentOrders: [],
    pendingPayments: []
  });

  useEffect(() => {
    // 模拟从API获取数据
    setTimeout(() => {
      setStats({
        customerCount: 128,
        productCount: 56,
        orderCount: 324,
        invoiceCount: 198,
        recentOrders: [
          {
            id: 1,
            orderNo: 'ORD20230001',
            customerName: '张三',
            productName: '日本东京3日游',
            amount: 3600,
            status: 'pending',
            date: '2023-03-01'
          },
          {
            id: 2,
            orderNo: 'ORD20230002',
            customerName: '李四',
            productName: '泰国曼谷5日游',
            amount: 5400,
            status: 'processing',
            date: '2023-03-02'
          },
          {
            id: 3,
            orderNo: 'ORD20230003',
            customerName: '王五',
            productName: '香港迪士尼乐园门票',
            amount: 500,
            status: 'completed',
            date: '2023-03-03'
          },
          {
            id: 4,
            orderNo: 'ORD20230004',
            customerName: '赵六',
            productName: '东京羽田机场-市区单程接机',
            amount: 400,
            status: 'cancelled',
            date: '2023-03-04'
          }
        ],
        pendingPayments: [
          {
            id: 1,
            invoiceNo: 'INV20230001',
            customerName: '张三',
            amount: 3600,
            dueDate: '2023-03-15',
            status: 'unpaid'
          },
          {
            id: 2,
            invoiceNo: 'INV20230002',
            customerName: '李四',
            amount: 5400,
            dueDate: '2023-03-20',
            status: 'partially_paid'
          },
          {
            id: 3,
            invoiceNo: 'INV20230003',
            customerName: '王五',
            amount: 500,
            dueDate: '2023-03-25',
            status: 'unpaid'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  // 订单状态标签
  const orderStatusTag = (status) => {
    const statusMap = {
      pending: { color: 'gold', text: '待处理' },
      processing: { color: 'blue', text: '处理中' },
      completed: { color: 'green', text: '已完成' },
      cancelled: { color: 'red', text: '已取消' }
    };
    
    return (
      <Tag color={statusMap[status].color}>
        {statusMap[status].text}
      </Tag>
    );
  };

  // 支付状态标签
  const paymentStatusTag = (status) => {
    const statusMap = {
      unpaid: { color: 'red', text: '未支付' },
      partially_paid: { color: 'orange', text: '部分支付' },
      paid: { color: 'green', text: '已支付' }
    };
    
    return (
      <Tag color={statusMap[status].color}>
        {statusMap[status].text}
      </Tag>
    );
  };

  // 最近订单表格列
  const orderColumns = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => <Link to={`/order/${record.id}`}>{text}</Link>
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `¥${amount.toFixed(2)}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => orderStatusTag(status)
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date'
    }
  ];

  // 待付款表格列
  const paymentColumns = [
    {
      title: '账单编号',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      render: (text, record) => <Link to={`/invoice/${record.id}`}>{text}</Link>
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `¥${amount.toFixed(2)}`
    },
    {
      title: '到期日',
      dataIndex: 'dueDate',
      key: 'dueDate'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => paymentStatusTag(status)
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" size="small">
          <Link to={`/invoice/${record.id}`}>查看</Link>
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="客户总数"
              value={stats.customerCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="产品总数"
              value={stats.productCount}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={stats.orderCount}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="账单总数"
              value={stats.invoiceCount}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card title="最近订单" extra={<Link to="/order">查看全部</Link>}>
            <Table
              columns={orderColumns}
              dataSource={stats.recentOrders}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="待付款账单" extra={<Link to="/invoice">查看全部</Link>}>
            <Table
              columns={paymentColumns}
              dataSource={stats.pendingPayments}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 