# 前端多阶段构建：Node 构建 → Nginx 运行
FROM node:22-alpine AS build
WORKDIR /app

# 可配置 npm 源（国内环境可传 https://registry.npmmirror.com）
ARG NPM_REGISTRY=https://registry.npmjs.org

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --registry=${NPM_REGISTRY}

COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
