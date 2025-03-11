# 订单管理系统

## 项目概述
本系统是一个订单管理系统，用于管理与供应商之间的订单。业务流程为：从供应商获得产品 → 加价报给代理 → 代理把订单给用户。系统主要由用户和供应商使用，不需要代理直接使用，但需要管理不同代理的产品价格。

## 核心功能
- 客户管理：管理客户的护照信息和签证信息
- 产品管理：管理供应商给的产品与报价
- 订单管理：记录订单信息和业务信息
- 账单管理：管理付款凭证与生成账单
- 代理管理：管理不同代理的产品价格

## 技术栈
- 前端：Vue.js + Element Plus
- 后端：Node.js + Express
- 数据库：MySQL
- 容器化：Docker + Docker Compose

## 项目结构
```
订单管理系统/
├── backend/             # 后端代码
│   ├── src/             # 源代码
│   │   ├── controllers/ # 控制器
│   │   ├── models/      # 数据模型
│   │   ├── routes/      # 路由
│   │   ├── middlewares/ # 中间件
│   │   └── app.js       # 应用入口
│   └── package.json     # 依赖配置
├── frontend/            # 前端代码
│   ├── src/             # 源代码
│   │   ├── api/         # API接口
│   │   ├── views/       # 页面组件
│   │   ├── router/      # 路由配置
│   │   ├── utils/       # 工具函数
│   │   └── main.js      # 应用入口
│   └── package.json     # 依赖配置
├── docker/              # Docker配置
│   └── mysql/           # MySQL初始化脚本
├── docker-compose.yml   # Docker Compose配置
└── README.md            # 项目说明
```

## 开发状态
基本功能已实现，待测试。

## 安装与运行
1. 克隆仓库
```bash
git clone https://github.com/bringup113/Order-management-system.git
cd Order-management-system
```

2. 使用Docker Compose启动服务
```bash
docker-compose up -d
```

3. 访问应用
- 前端：http://localhost:3000
- 后端API：http://localhost:5001

## 默认账号
- 用户名：admin
- 密码：admin123 