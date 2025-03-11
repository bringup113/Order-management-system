import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, message } from 'antd';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import MainLayout from './components/MainLayout';
import PassportList from './pages/passport/PassportList';
import VisaList from './pages/visa/VisaList';
import ProductList from './pages/product/ProductList';
import ProductQuoteList from './pages/product/ProductQuoteList';
import AgentProductPriceList from './pages/product/AgentProductPriceList';
import OrderList from './pages/order/OrderList';
import OrderDetail from './pages/order/OrderDetail';
import InvoiceList from './pages/invoice/InvoiceList';
import InvoiceDetail from './pages/invoice/InvoiceDetail';
import SupplierList from './pages/supplier/SupplierList';
import AgentList from './pages/agent/AgentList';
import UserList from './pages/user/UserList';
import ConfigList from './pages/config/ConfigList';
import OperationLogList from './pages/log/OperationLogList';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 检查本地存储中是否有token
    const token = localStorage.getItem('token');
    if (token) {
      // 验证token有效性
      // 这里应该调用API验证token，简化处理直接认为有token就是已认证
      setIsAuthenticated(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      setCurrentUser(userInfo);
    } else if (location.pathname !== '/login') {
      // 如果没有token且不在登录页，则重定向到登录页
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  const handleLogin = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(user));
    setIsAuthenticated(true);
    setCurrentUser(user);
    message.success('登录成功');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setCurrentUser(null);
    message.success('已退出登录');
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <MainLayout currentUser={currentUser} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/passport" element={<PassportList />} />
                <Route path="/visa" element={<VisaList />} />
                <Route path="/product" element={<ProductList />} />
                <Route path="/product-quote" element={<ProductQuoteList />} />
                <Route path="/agent-product-price" element={<AgentProductPriceList />} />
                <Route path="/order" element={<OrderList />} />
                <Route path="/order/:id" element={<OrderDetail />} />
                <Route path="/invoice" element={<InvoiceList />} />
                <Route path="/invoice/:id" element={<InvoiceDetail />} />
                <Route path="/supplier" element={<SupplierList />} />
                <Route path="/agent" element={<AgentList />} />
                <Route path="/user" element={<UserList />} />
                <Route path="/config" element={<ConfigList />} />
                <Route path="/log" element={<OperationLogList />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App; 