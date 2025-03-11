import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import Cookies from 'js-cookie'
import store from '@/store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: { title: '登录' }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    hidden: true,
    meta: { title: '404' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'el-icon-s-home' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    meta: { title: '订单管理', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/OrderList.vue'),
        meta: { title: '订单列表' }
      },
      {
        path: 'create',
        name: 'OrderCreate',
        component: () => import('@/views/order/OrderCreate.vue'),
        hidden: true,
        meta: { title: '创建订单' }
      },
      {
        path: 'edit/:id',
        name: 'OrderEdit',
        component: () => import('@/views/order/OrderEdit.vue'),
        hidden: true,
        meta: { title: '编辑订单' }
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/OrderDetail.vue'),
        hidden: true,
        meta: { title: '订单详情' }
      }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/passport/list',
    meta: { title: '客户管理', icon: 'el-icon-user' },
    children: [
      {
        path: 'passport/list',
        name: 'PassportList',
        component: () => import('@/views/passport/PassportList.vue'),
        meta: { title: '护照列表' }
      },
      {
        path: 'passport/create',
        name: 'PassportCreate',
        component: () => import('@/views/passport/PassportForm.vue'),
        hidden: true,
        meta: { title: '创建护照' }
      },
      {
        path: 'passport/edit/:id',
        name: 'PassportEdit',
        component: () => import('@/views/passport/PassportForm.vue'),
        hidden: true,
        meta: { title: '编辑护照' }
      },
      {
        path: 'passport/detail/:id',
        name: 'PassportDetail',
        component: () => import('@/views/passport/PassportDetail.vue'),
        hidden: true,
        meta: { title: '护照详情' }
      },
      {
        path: 'visa/list',
        name: 'VisaList',
        component: () => import('@/views/visa/VisaList.vue'),
        hidden: true,
        meta: { title: '签证列表' }
      },
      {
        path: 'visa/create',
        name: 'VisaCreate',
        component: () => import('@/views/visa/VisaForm.vue'),
        hidden: true,
        meta: { title: '创建签证' }
      },
      {
        path: 'visa/edit/:id',
        name: 'VisaEdit',
        component: () => import('@/views/visa/VisaForm.vue'),
        hidden: true,
        meta: { title: '编辑签证' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    meta: { title: '产品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'list',
        name: 'ProductList',
        component: () => import('@/views/product/ProductList.vue'),
        meta: { title: '产品列表' }
      },
      {
        path: 'create',
        name: 'ProductCreate',
        component: () => import('@/views/product/ProductForm.vue'),
        hidden: true,
        meta: { title: '创建产品' }
      },
      {
        path: 'edit/:id',
        name: 'ProductEdit',
        component: () => import('@/views/product/ProductForm.vue'),
        hidden: true,
        meta: { title: '编辑产品' }
      },
      {
        path: 'detail/:id',
        name: 'ProductDetail',
        component: () => import('@/views/product/ProductDetail.vue'),
        hidden: true,
        meta: { title: '产品详情' }
      },
      {
        path: 'quotes/:id',
        name: 'ProductQuotes',
        component: () => import('@/views/product/ProductDetail.vue'),
        hidden: true,
        meta: { title: '产品报价' }
      },
      {
        path: 'quote/create',
        name: 'ProductQuoteCreate',
        component: () => import('@/views/product/ProductQuoteForm.vue'),
        hidden: true,
        meta: { title: '创建产品报价' }
      },
      {
        path: 'quote/edit/:id',
        name: 'ProductQuoteEdit',
        component: () => import('@/views/product/ProductQuoteForm.vue'),
        hidden: true,
        meta: { title: '编辑产品报价' }
      },
      {
        path: 'quote/:id/agent-prices',
        name: 'AgentPriceList',
        component: () => import('@/views/product/AgentPriceList.vue'),
        hidden: true,
        meta: { title: '代理价格管理' }
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    redirect: '/supplier/list',
    meta: { title: '供应商管理', icon: 'el-icon-office-building' },
    children: [
      {
        path: 'list',
        name: 'SupplierList',
        component: () => import('@/views/supplier/SupplierList.vue'),
        meta: { title: '供应商列表' }
      },
      {
        path: 'create',
        name: 'SupplierCreate',
        component: () => import('@/views/supplier/SupplierForm.vue'),
        hidden: true,
        meta: { title: '新增供应商' }
      },
      {
        path: 'edit/:id',
        name: 'SupplierEdit',
        component: () => import('@/views/supplier/SupplierForm.vue'),
        hidden: true,
        meta: { title: '编辑供应商' },
        props: true
      }
    ]
  },
  {
    path: '/agent',
    component: Layout,
    redirect: '/agent/list',
    meta: { title: '代理管理', icon: 'el-icon-user' },
    children: [
      {
        path: 'list',
        name: 'AgentList',
        component: () => import('@/views/agent/AgentList.vue'),
        meta: { title: '代理列表' }
      },
      {
        path: 'create',
        name: 'AgentCreate',
        component: () => import('@/views/agent/AgentForm.vue'),
        hidden: true,
        meta: { title: '新增代理' }
      },
      {
        path: 'edit/:id',
        name: 'AgentEdit',
        component: () => import('@/views/agent/AgentForm.vue'),
        hidden: true,
        meta: { title: '编辑代理' },
        props: true
      }
    ]
  },
  {
    path: '/invoice',
    component: Layout,
    redirect: '/invoice/list',
    meta: { title: '账单管理', icon: 'el-icon-money' },
    children: [
      {
        path: 'list',
        name: 'InvoiceList',
        component: () => import('@/views/invoice/InvoiceList.vue'),
        meta: { title: '账单列表' }
      },
      {
        path: 'create',
        name: 'InvoiceCreate',
        component: () => import('@/views/invoice/InvoiceForm.vue'),
        hidden: true,
        meta: { title: '创建账单', activeMenu: '/invoice/list' }
      },
      {
        path: 'edit/:id',
        name: 'InvoiceEdit',
        component: () => import('@/views/invoice/InvoiceForm.vue'),
        hidden: true,
        meta: { title: '编辑账单', activeMenu: '/invoice/list' }
      },
      {
        path: 'detail/:id',
        name: 'InvoiceDetail',
        component: () => import('@/views/invoice/InvoiceDetail.vue'),
        hidden: true,
        meta: { title: '账单详情', activeMenu: '/invoice/list' }
      },
      {
        path: 'payments/:id',
        name: 'InvoicePayments',
        component: () => import('@/views/invoice/InvoicePayments.vue'),
        hidden: true,
        meta: { title: '支付记录', activeMenu: '/invoice/list' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'el-icon-setting' },
    children: [
      {
        path: 'user',
        name: 'UserList',
        component: () => import('@/views/system/user/UserList.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        name: 'RoleList',
        component: () => import('@/views/system/role/RoleList.vue'),
        meta: { title: '角色管理' }
      },
      /* 暂时注释掉操作日志路由，等待文件创建
      {
        path: 'logs',
        name: 'OperationLogs',
        component: () => import('@/views/system/OperationLogs.vue'),
        meta: { title: '操作日志' }
      },
      */
      {
        path: 'error-logs',
        name: 'ErrorLogs',
        component: () => import('@/views/system/ErrorLogs.vue'),
        meta: { title: '错误日志' }
      },
      /* 暂时注释掉系统配置路由，等待文件创建
      {
        path: 'config',
        name: 'SystemConfig',
        component: () => import('@/views/system/Config.vue'),
        meta: { title: '系统配置' }
      },
      */
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/system/profile/index.vue'),
        hidden: true,
        meta: { title: '个人信息' }
      }
    ]
  },
  // 404页面必须放在最后
  { path: '/:pathMatch(.*)*', redirect: '/404', hidden: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '订单管理系统'
  
  // 获取token，从Cookies中获取
  const token = Cookies.get('token')
  
  // 如果访问的是登录页面，且已经有token，则重定向到首页
  if (to.path === '/login' && token) {
    next({ path: '/' })
    return
  }
  
  // 如果访问的不是登录页面，且没有token，则重定向到登录页面
  if (to.path !== '/login' && !token) {
    next({ path: '/login' })
    return
  }
  
  next()
})

export default router 