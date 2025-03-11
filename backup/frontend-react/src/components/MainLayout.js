import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Badge } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  BankOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  LogoutOutlined,
  KeyOutlined,
  DashboardOutlined,
  IdcardOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/MainLayout.css';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const MainLayout = ({ children, currentUser, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const handleLogout = () => {
    onLogout();
  };

  // 根据当前路径获取面包屑
  const getBreadcrumb = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const breadcrumbItems = [
      <Breadcrumb.Item key="home">
        <Link to="/">首页</Link>
      </Breadcrumb.Item>
    ];

    const breadcrumbNameMap = {
      'dashboard': '仪表盘',
      'passport': '护照管理',
      'visa': '签证管理',
      'product': '产品管理',
      'product-quote': '产品报价',
      'agent-product-price': '代理产品价格',
      'order': '订单管理',
      'invoice': '账单管理',
      'supplier': '供应商管理',
      'agent': '代理管理',
      'user': '用户管理',
      'config': '系统配置',
      'log': '操作日志'
    };

    pathSnippets.forEach((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const name = breadcrumbNameMap[pathSnippets[index]];
      
      if (name) {
        breadcrumbItems.push(
          <Breadcrumb.Item key={url}>
            <Link to={url}>{name}</Link>
          </Breadcrumb.Item>
        );
      }
    });

    return breadcrumbItems;
  };

  // 用户菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">个人资料</Link>
      </Menu.Item>
      <Menu.Item key="change-password" icon={<KeyOutlined />}>
        <Link to="/change-password">修改密码</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  // 通知菜单
  const notificationMenu = (
    <Menu>
      <Menu.Item key="notification1">
        <Badge status="processing" text="有新的订单需要处理" />
      </Menu.Item>
      <Menu.Item key="notification2">
        <Badge status="default" text="有新的账单已生成" />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="all">
        <Link to="/notifications">查看所有通知</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo">
          {!collapsed && <span className="logo-text">订单管理系统</span>}
        </div>
        <Menu theme="dark" defaultSelectedKeys={['dashboard']} mode="inline" selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">仪表盘</Link>
          </Menu.Item>
          <SubMenu key="customer" icon={<UserOutlined />} title="客户管理">
            <Menu.Item key="passport" icon={<IdcardOutlined />}>
              <Link to="/passport">护照管理</Link>
            </Menu.Item>
            <Menu.Item key="visa" icon={<GlobalOutlined />}>
              <Link to="/visa">签证管理</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="product" icon={<ShoppingOutlined />} title="产品管理">
            <Menu.Item key="product">
              <Link to="/product">产品信息</Link>
            </Menu.Item>
            <Menu.Item key="product-quote">
              <Link to="/product-quote">产品报价</Link>
            </Menu.Item>
            <Menu.Item key="agent-product-price">
              <Link to="/agent-product-price">代理产品价格</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="order" icon={<FileTextOutlined />}>
            <Link to="/order">订单管理</Link>
          </Menu.Item>
          <Menu.Item key="invoice" icon={<BankOutlined />}>
            <Link to="/invoice">账单管理</Link>
          </Menu.Item>
          <SubMenu key="system" icon={<SettingOutlined />} title="系统管理">
            <Menu.Item key="supplier">
              <Link to="/supplier">供应商管理</Link>
            </Menu.Item>
            <Menu.Item key="agent">
              <Link to="/agent">代理管理</Link>
            </Menu.Item>
            <Menu.Item key="user">
              <Link to="/user">用户管理</Link>
            </Menu.Item>
            <Menu.Item key="config">
              <Link to="/config">系统配置</Link>
            </Menu.Item>
            <Menu.Item key="log">
              <Link to="/log">操作日志</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background header">
          <div className="header-left">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
          <div className="header-right">
            <Dropdown overlay={notificationMenu} trigger={['click']}>
              <Badge count={2} className="notification-badge">
                <BellOutlined className="header-icon" />
              </Badge>
            </Dropdown>
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div className="user-info">
                <Avatar icon={<UserOutlined />} />
                <span className="username">{currentUser?.name || '用户'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {getBreadcrumb()}
          </Breadcrumb>
          <div className="site-layout-content">
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          订单管理系统 ©{new Date().getFullYear()} 版权所有
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 