# SuperCenter 后端

个人网站后端 API 服务，基于 FastAPI 构建。

## 技术栈

| 项 | 技术 | 说明 |
|---|------|------|
| 框架 | FastAPI | ASGI，高性能 Web 框架 |
| 工具 | uv | 包管理与项目工具 |
| ORM | SQLModel | Pydantic + SQLAlchemy 融合 |
| 数据库 | SQLite | 开发阶段；生产可切换 PostgreSQL |
| 验证 | Pydantic + JWT | 请求/响应数据校验、Token 认证 |
| 密码哈希 | argon2-cffi | 安全密码哈希 |

## 项目结构

```
sc-backend/
├── app/
│   ├── main.py              # FastAPI 应用入口，CORS、路由挂载
│   ├── config.py             # Settings 配置类
│   ├── database.py           # 数据库引擎创建
│   ├── models/               # 数据模型
│   │   ├── user.py           # 用户模型
│   │   ├── blog.py           # 博客模型（含软删除）
│   │   └── comment.py        # 评论模型
│   ├── schemas/              # Pydantic 请求/响应模型
│   │   ├── user.py
│   │   ├── blog.py
│   │   └── comment.py
│   ├── routers/              # API 路由
│   │   ├── auth.py           # 认证路由
│   │   ├── users.py          # 用户路由
│   │   ├── blogs.py          # 博客路由
│   │   ├── comments.py       # 评论路由
│   │   └── upload.py         # 上传路由（base64 存储）
│   └── middleware/           # 中间件
│       └── auth.py           # JWT 认证中间件
├── scripts/                 # 脚本
│   ├── seed_db.py           # 数据库种子脚本
│   ├── migrate_add_subtitle.py   # 添加 subtitle 列
│   └── migrate_add_is_deleted.py  # 添加软删除列
├── data/                    # 数据库文件目录
├── public/                  # 静态文件
└── pyproject.toml           # 项目依赖
```

## 核心文件解析

### `app/main.py`
- FastAPI 应用入口
- 定义 `lifespan` 上下文管理器，启动时创建数据库表
- 挂载静态文件目录（头像等）
- 配置 CORS 允许前端 localhost:3000

### `app/models/`
- `user.py`: 用户模型（用户名、邮箱、密码哈希、角色、头像 URL）
- `blog.py`: 博客模型（标题、副标题、内容、软删除标记）
- `comment.py`: 评论模型（支持无限嵌套）

### `app/routers/`
- `auth.py`: 注册、登录、获取当前用户
- `users.py`: 获取/更新个人信息
- `blogs.py`: 博客 CRUD（软删除）
- `comments.py`: 评论 CRUD
- `upload.py`: 头像上传（base64 直接存储）

## 启动方式

```bash
cd sc-backend
uv sync                  # 安装依赖
uv run uvicorn app.main:app --reload --port 8000
```

API 访问：http://localhost:8000/api/health
API 文档：http://localhost:8000/docs

## 数据库

- 数据库文件统一存放在 `data/` 目录下
- 后端启动时自动创建 SQLite 数据库和表
- 所有 `.db` 文件已被 `.gitignore` 忽略
- 博客使用软删除机制（`is_deleted` 标记）

## 数据库迁移

```bash
# 添加 subtitle 列
python -m scripts.migrate_add_subtitle

# 添加软删除列
python -m scripts.migrate_add_is_deleted
```

## 预置账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| `wenmudong` | `wenmudong.hwd` | blogger |
| `admin` | `admin.hwd` | admin |

> ⚠️ 部署时需修改为自定义账号密码

## 开发约定

- API 遵循 RESTful 规范
- 使用 SQLModel 定义数据模型
- 路由通过 `Depends` 注入认证依赖
- 使用 `require_blogger` 装饰器限制博主权限
- 头像使用 base64 存储在数据库
