# SuperCenter 命令与配置

## 后端启动命令

```bash
cd sc-backend
uv sync                  # 安装/更新依赖
uv run sc.py             # 启动服务（默认端口 8000）
uv run sc.py 9000        # 启动服务（指定端口 9000）
```

API 访问：http://localhost:8000/api/health

## 前端启动命令

```bash
cd sc-frontend
npm install              # 安装依赖
npm run dev              # 启动开发服务器
npm run build            # 生产构建
```

页面访问：http://localhost:3000

## 环境变量配置

后端配置通过 `sc-backend/.env` 文件管理（需创建）：

```env
APP_NAME=SuperCenter API
DEBUG=true
DATABASE_URL=sqlite:///data/supercenter.db
```

## 端口说明

| 服务 | 默认端口 |
|------|---------|
| 后端 API | 8000 |
| 前端 | 3000 |
