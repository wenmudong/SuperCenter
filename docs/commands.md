# SuperCenter 命令与配置

## 后端启动命令

```bash
cd sc-backend
uv sync                  # 安装/更新依赖
uv run uvicorn app.main:app --reload --port 8000   # 启动服务
```

API 访问：http://localhost:8000/api/health
API 文档：http://localhost:8000/docs

## 前端启动命令

```bash
cd sc-frontend
npm install              # 安装依赖
npm run dev              # 启动开发服务器
npm run build            # 生产构建
```

页面访问：http://localhost:3000

## 数据库迁移

```bash
cd sc-backend

# 添加 subtitle 列
python -m scripts.migrate_add_subtitle

# 添加软删除列
python -m scripts.migrate_add_is_deleted

# 重建数据库（清空所有数据）
# 删除 data/supercenter.db 后重启后端即可
```

## 环境变量配置

后端配置通过 `sc-backend/.env` 文件管理（需创建）：

```env
APP_NAME=SuperCenter API
DEBUG=true
DATABASE_URL=sqlite:///data/supercenter.db
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
UPLOAD_DIR=public/uploads
MAX_AVATAR_SIZE=2097152
```

## 端口说明

| 服务 | 默认端口 |
|------|---------|
| 后端 API | 8000 |
| 前端 | 3000 |
