# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# 拷贝 package.json 和可选的 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 拷贝 Vite 配置和入口文件
COPY vite.config.js ./
COPY index.html ./

# 拷贝源码
COPY src ./src

# 构建生产包
RUN npm run build

# 安装 serve 以提供静态文件服务
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]

