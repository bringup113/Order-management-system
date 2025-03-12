#!/bin/bash

# 输出彩色文本的函数
print_green() {
  echo -e "\033[0;32m$1\033[0m"
}

print_yellow() {
  echo -e "\033[0;33m$1\033[0m"
}

print_red() {
  echo -e "\033[0;31m$1\033[0m"
}

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    print_red "错误: 未安装Node.js，请先安装Node.js"
    exit 1
fi

# 检查是否存在package.json
if [ ! -f "start-package.json" ]; then
    print_red "错误: 未找到start-package.json文件"
    exit 1
fi

# 停止所有服务
print_yellow "停止所有服务..."
docker-compose down

# 执行字段命名规范重构
print_yellow "执行字段命名规范重构..."
node fix-naming.js

# 执行模型定义中的时间戳字段修复
print_yellow "执行模型定义中的时间戳字段修复..."
node fix-model-timestamps.js

# 安装依赖
print_yellow "正在安装依赖..."
npm install --prefix . --package-lock=false --no-save dotenv

# 执行启动脚本
print_yellow "正在执行启动脚本..."
node start-services.js

# 等待服务启动
print_yellow "等待服务启动..."
sleep 5

# 检查服务状态
print_yellow "检查服务状态..."
docker-compose ps

print_green "所有服务已启动，并完成了字段命名规范重构!"
print_green "前端访问地址: http://localhost:3000"
print_green "后端API地址: http://localhost:5001" 