import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response) {
      // 如果返回401，清除token并跳转到登录页
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const auth = {
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data)
};

// 用户相关API
export const user = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

// 护照相关API
export const passport = {
  getPassports: (params) => api.get('/passports', { params }),
  getPassportById: (id) => api.get(`/passports/${id}`),
  createPassport: (data) => api.post('/passports', data),
  updatePassport: (id, data) => api.put(`/passports/${id}`, data),
  deletePassport: (id) => api.delete(`/passports/${id}`)
};

// 签证相关API
export const visa = {
  getVisas: (params) => api.get('/visas', { params }),
  getVisaById: (id) => api.get(`/visas/${id}`),
  createVisa: (data) => api.post('/visas', data),
  updateVisa: (id, data) => api.put(`/visas/${id}`, data),
  deleteVisa: (id) => api.delete(`/visas/${id}`)
};

// 产品相关API
export const product = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

// 产品报价相关API
export const productQuote = {
  getProductQuotes: (params) => api.get('/product-quotes', { params }),
  getProductQuoteById: (id) => api.get(`/product-quotes/${id}`),
  createProductQuote: (data) => api.post('/product-quotes', data),
  updateProductQuote: (id, data) => api.put(`/product-quotes/${id}`, data),
  deleteProductQuote: (id) => api.delete(`/product-quotes/${id}`)
};

// 代理产品价格相关API
export const agentProductPrice = {
  getAgentProductPrices: (params) => api.get('/agent-product-prices', { params }),
  getAgentProductPriceById: (id) => api.get(`/agent-product-prices/${id}`),
  createAgentProductPrice: (data) => api.post('/agent-product-prices', data),
  updateAgentProductPrice: (id, data) => api.put(`/agent-product-prices/${id}`, data),
  deleteAgentProductPrice: (id) => api.delete(`/agent-product-prices/${id}`)
};

// 订单相关API
export const order = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrder: (id, data) => api.put(`/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/orders/${id}`)
};

// 账单相关API
export const invoice = {
  getInvoices: (params) => api.get('/invoices', { params }),
  getInvoiceById: (id) => api.get(`/invoices/${id}`),
  createInvoice: (data) => api.post('/invoices', data),
  updateInvoice: (id, data) => api.put(`/invoices/${id}`, data),
  deleteInvoice: (id) => api.delete(`/invoices/${id}`)
};

// 支付记录相关API
export const payment = {
  getPayments: (params) => api.get('/payments', { params }),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  createPayment: (data) => api.post('/payments', data),
  updatePayment: (id, data) => api.put(`/payments/${id}`, data),
  deletePayment: (id) => api.delete(`/payments/${id}`)
};

// 供应商相关API
export const supplier = {
  getSuppliers: (params) => api.get('/suppliers', { params }),
  getSupplierById: (id) => api.get(`/suppliers/${id}`),
  createSupplier: (data) => api.post('/suppliers', data),
  updateSupplier: (id, data) => api.put(`/suppliers/${id}`, data),
  deleteSupplier: (id) => api.delete(`/suppliers/${id}`)
};

// 代理相关API
export const agent = {
  getAgents: (params) => api.get('/agents', { params }),
  getAgentById: (id) => api.get(`/agents/${id}`),
  createAgent: (data) => api.post('/agents', data),
  updateAgent: (id, data) => api.put(`/agents/${id}`, data),
  deleteAgent: (id) => api.delete(`/agents/${id}`)
};

// 系统配置相关API
export const config = {
  getConfigs: (params) => api.get('/configs', { params }),
  getConfigById: (id) => api.get(`/configs/${id}`),
  createConfig: (data) => api.post('/configs', data),
  updateConfig: (id, data) => api.put(`/configs/${id}`, data),
  deleteConfig: (id) => api.delete(`/configs/${id}`)
};

// 操作日志相关API
export const log = {
  getLogs: (params) => api.get('/logs', { params }),
  getLogById: (id) => api.get(`/logs/${id}`)
};

export default {
  auth,
  user,
  passport,
  visa,
  product,
  productQuote,
  agentProductPrice,
  order,
  invoice,
  payment,
  supplier,
  agent,
  config,
  log
}; 