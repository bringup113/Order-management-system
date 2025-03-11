#!/bin/bash

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 未安装Node.js，请先安装Node.js"
    exit 1
fi

# 检查是否存在package.json
if [ ! -f "start-package.json" ]; then
    echo "错误: 未找到start-package.json文件"
    exit 1
fi

# 安装依赖
echo "正在安装依赖..."
npm install --prefix . --package-lock=false --no-save dotenv

# 执行启动脚本
echo "正在执行启动脚本..."
node start-services.js 