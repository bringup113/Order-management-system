# 订单管理系统

基于Node.js、React和MySQL的订单管理系统，用于管理与供应商之间的订单。

## 系统概述

### 业务背景
本系统是一个订单管理系统，用于管理与供应商之间的订单。业务流程为：从供应商获得产品 → 加价报给代理 → 代理把订单给用户。系统主要由用户和供应商使用，不需要代理直接使用，但需要管理不同代理的产品价格。

### 核心功能
- 客户管理：管理客户的护照信息和签证信息
- 产品管理：管理供应商给的产品与报价
- 订单管理：记录订单信息和业务信息
- 账单管理：管理付款凭证与生成账单
- 代理管理：管理不同代理的产品价格

## 技术栈

### 前端
- React
- Ant Design
- Axios
- ECharts

### 后端
- Node.js
- Express
- Sequelize
- MySQL
- Redis
- JWT

### 部署
- Docker
- Docker Compose
- Nginx

## 快速开始

### 环境要求
- Docker
- Docker Compose

### 安装步骤

1. 克隆项目
```bash
git clone <项目地址>
cd 订单管理系统
```

2. 启动项目
```bash
docker-compose up -d
```

3. 访问系统
- 前端：http://localhost:3000
- 后端API：http://localhost:5001/api

### 默认账号
- 管理员：admin / password

## 项目结构

```
订单管理系统/
├── frontend/                # 前端项目
│   ├── public/              # 静态资源
│   ├── src/                 # 源代码
│   │   ├── components/      # 组件
│   │   ├── pages/           # 页面
│   │   ├── utils/           # 工具函数
│   │   ├── api/             # API请求
│   │   ├── App.js           # 主应用组件
│   │   └── index.js         # 入口文件
│   ├── package.json         # 依赖配置
│   └── Dockerfile           # Docker配置
├── backend/                 # 后端项目
│   ├── src/                 # 源代码
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── middlewares/     # 中间件
│   │   ├── utils/           # 工具函数
│   │   ├── config/          # 配置
│   │   └── app.js           # 入口文件
│   ├── config.js            # 配置文件
│   ├── package.json         # 依赖配置
│   └── Dockerfile           # Docker配置
├── docker/                  # Docker相关配置
│   └── mysql/               # MySQL配置
│       └── init/            # 初始化脚本
├── uploads/                 # 上传文件目录
├── docker-compose.yml       # Docker Compose配置
├── config.js                # 全局配置
└── README.md                # 项目说明
```

## 开发指南

### 前端开发
```bash
cd frontend
npm install
npm start
```

### 后端开发
```bash
cd backend
npm install
npm run dev
```

## 部署指南

### 开发环境
```bash
docker-compose up -d
```

### 生产环境
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 许可证

MIT 