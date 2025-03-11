FROM node:16-alpine as build-stage

WORKDIR /app

COPY package*.json ./

# 安装所有依赖，包括开发依赖
RUN npm install --include=dev

COPY . .

# 构建生产版本
RUN npm run build

# 第二阶段：使用 nginx 提供静态文件
FROM nginx:stable-alpine as production-stage

# 从构建阶段复制构建结果到 nginx 目录
COPY --from=build-stage /app/build /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]