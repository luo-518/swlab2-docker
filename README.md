# Simple-Weibo 微博简化全栈项目

基于 **前端 + 后端 + 数据库 + Docker Compose** 构建的简易微博系统，支持用户发布微博、查看微博内容，并可通过 Docker 一键部署运行，作为全栈、容器化部署实践示例。

---

##  功能特性

- 微博发布、展示基础功能
- 前后端分离架构，结构清晰
- Docker Compose 一键启动多服务
- 数据库数据持久化（`db_data` 数据卷）
- 可扩展性良好，可添加用户系统/评论/AI内容推荐等功能

---

##  项目结构
```bash
simple-weibo/
├── backend/             # 后端服务（API接口、业务逻辑）
├── frontend/            # 前端界面（用户微博展示/发布）
├── db_data/             # 数据持久化挂载目录
└── docker-compose.yml   # 多容器编排入口
```

### 技术栈
```bash
领域	技术
部署	Docker + Docker Compose
后端	Python
前端	JS/HTML
数据库	MongoDB
```

### 使用 Docker 启动项目
1. 克隆项目
```bash
git clone https://github.com/yourname/simple-weibo.git
cd simple-weibo
```
2. 构建 & 启动服务
```bash
docker-compose up --build -d
```
3. 访问网页
浏览器打开：
```bash
http://localhost:80   # 视 docker-compose 配置为准
```
4. 停止服务
```bash
docker-compose down
```
