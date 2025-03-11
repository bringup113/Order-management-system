# 使用Node.js 16作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有文件
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用（开发模式）
CMD ["npm", "start"] 