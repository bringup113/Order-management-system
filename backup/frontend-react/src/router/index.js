import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

// 公共路由
const publicRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404' }
  }
]

// 私有路由
const privateRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'House' }
      }
    ]
  },
  {
    path: '/passport',
    component: Layout,
    redirect: '/passport/list',
    meta: { title: '护照管理', icon: 'Document' },
    children: [
      {
        path: 'list',
        name: 'PassportList',
        component: () => import('@/views/passport/PassportList.vue'),
        meta: { title: '护照列表' }
      },
      {
        path: 'create',
        name: 'PassportCreate',
        component: () => import('@/views/passport/PassportForm.vue'),
        meta: { title: '新增护照', activeMenu: '/passport/list' }
      },
      {
        path: 'edit/:id',
        name: 'PassportEdit',
        component: () => import('@/views/passport/PassportForm.vue'),
        meta: { title: '编辑护照', activeMenu: '/passport/list' },
        props: true
      },
      {
        path: 'detail/:id',
        name: 'PassportDetail',
        component: () => import('@/views/passport/PassportDetail.vue'),
        meta: { title: '护照详情', activeMenu: '/passport/list' },
        props: true
      }
    ]
  },
  {
    path: '/visa',
    component: Layout,
    redirect: '/visa/list',
    meta: { title: '签证管理', icon: 'Stamp' },
    children: [
      {
        path: 'list',
        name: 'VisaList',
        component: () => import('@/views/visa/VisaList.vue'),
        meta: { title: '签证列表' }
      },
      {
        path: 'create',
        name: 'VisaCreate',
        component: () => import('@/views/visa/VisaForm.vue'),
        meta: { title: '新增签证', activeMenu: '/visa/list' }
      },
      {
        path: 'edit/:id',
        name: 'VisaEdit',
        component: () => import('@/views/visa/VisaForm.vue'),
        meta: { title: '编辑签证', activeMenu: '/visa/list' },
        props: true
      },
      {
        path: 'detail/:id',
        name: 'VisaDetail',
        component: () => import('@/views/visa/VisaDetail.vue'),
        meta: { title: '签证详情', activeMenu: '/visa/list' },
        props: true
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    meta: { title: '产品管理', icon: 'ShoppingBag' },
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
        meta: { title: '新增产品', activeMenu: '/product/list' }
      },
      {
        path: 'edit/:id',
        name: 'ProductEdit',
        component: () => import('@/views/product/ProductForm.vue'),
        meta: { title: '编辑产品', activeMenu: '/product/list' },
        props: true
      },
      {
        path: 'detail/:id',
        name: 'ProductDetail',
        component: () => import('@/views/product/ProductDetail.vue'),
        meta: { title: '产品详情', activeMenu: '/product/list' },
        props: true
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    redirect: '/supplier/list',
    meta: { title: '供应商管理', icon: 'Truck' },
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
        meta: { title: '新增供应商', activeMenu: '/supplier/list' }
      },
      {
        path: 'edit/:id',
        name: 'SupplierEdit',
        component: () => import('@/views/supplier/SupplierForm.vue'),
        meta: { title: '编辑供应商', activeMenu: '/supplier/list' },
        props: true
      },
      {
        path: 'detail/:id',
        name: 'SupplierDetail',
        component: () => import('@/views/supplier/SupplierDetail.vue'),
        meta: { title: '供应商详情', activeMenu: '/supplier/list' },
        props: true
      }
    ]
  },
  {
    path: '/agent',
    component: Layout,
    redirect: '/agent/list',
    meta: { title: '代理商管理', icon: 'User' },
    children: [
      {
        path: 'list',
        name: 'AgentList',
        component: () => import('@/views/agent/AgentList.vue'),
        meta: { title: '代理商列表' }
      },
      {
        path: 'create',
        name: 'AgentCreate',
        component: () => import('@/views/agent/AgentForm.vue'),
        meta: { title: '新增代理商', activeMenu: '/agent/list' }
      },
      {
        path: 'edit/:id',
        name: 'AgentEdit',
        component: () => import('@/views/agent/AgentForm.vue'),
        meta: { title: '编辑代理商', activeMenu: '/agent/list' },
        props: true
      },
      {
        path: 'detail/:id',
        name: 'AgentDetail',
        component: () => import('@/views/agent/AgentDetail.vue'),
        meta: { title: '代理商详情', activeMenu: '/agent/list' },
        props: true
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    meta: { title: '订单管理', icon: 'ShoppingCart' },
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
        meta: { title: '新建订单', activeMenu: '/order/list' }
      },
      {
        path: 'edit/:id',
        name: 'OrderEdit',
        component: () => import('@/views/order/OrderEdit.vue'),
        meta: { title: '编辑订单', activeMenu: '/order/list' },
        props: true
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/OrderDetail.vue'),
        meta: { title: '订单详情', activeMenu: '/order/list' },
        props: true
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: 'user',
        name: 'UserManagement',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        name: 'RoleManagement',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理' }
      }
    ]
  }
]

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...privateRoutes]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 订单管理系统` : '订单管理系统'
  
  // 判断是否需要登录
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

export default router 