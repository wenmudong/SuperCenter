# CLAUDE.md

This file provides guidance to Claude Code when working with code in `sc-backend/`.

## 常用命令

```bash
# 激活虚拟环境
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# 安装依赖
uv sync

# 启动开发服务器
uvicorn app.main:app --reload --port 8000

# 运行数据库种子脚本（创建预置账号）
python -m scripts.seed_db

# 数据库迁移脚本
python -m scripts.migrate_add_subtitle    # 添加 subtitle 列
python -m scripts.migrate_add_is_deleted   # 添加软删除列
```

## 项目结构

```
app/
├── main.py          # FastAPI 入口，CORS 配置，路由注册
├── config.py        # Settings 配置类
├── database.py      # 数据库引擎
├── models/          # SQLModel 数据模型
│   ├── user.py      # 用户模型
│   ├── blog.py      # 博客模型（含软删除）
│   └── comment.py   # 评论模型
├── schemas/         # Pydantic 请求/响应模型
│   ├── user.py
│   ├── blog.py
│   └── comment.py
├── routers/         # FastAPI 路由
│   ├── auth.py      # 认证路由（注册/登录）
│   ├── users.py     # 用户路由
│   ├── blogs.py     # 博客路由
│   ├── comments.py   # 评论路由
│   └── upload.py    # 上传路由（base64 存储）
├── middleware/     # 中间件
│   └── auth.py      # JWT 认证中间件
└── database.py     # 数据库连接

scripts/
├── seed_db.py      # 数据库种子脚本
├── migrate_add_subtitle.py   # 添加 subtitle 列
└── migrate_add_is_deleted.py # 添加软删除列

data/               # SQLite 数据库文件目录
public/             # 静态文件
```

## 数据模型

### User（用户）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| username | str | 用户名（唯一，5-16位字母/数字/下划线） |
| email | str | 邮箱（唯一） |
| password_hash | str | Argon2 哈希密码 |
| avatar_url | str | 头像 URL（base64 data URL） |
| role | str | 角色：blogger/user/admin |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### Blog（博客）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| author_id | int | 作者 ID（外键） |
| title | str | 标题 |
| subtitle | str | 副标题（可选） |
| content | str | 内容（Markdown 格式） |
| is_deleted | bool | 软删除标记（默认 False） |
| deleted_at | datetime | 删除时间 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### Comment（评论）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| blog_id | int | 博客 ID（外键，级联删除） |
| author_id | int | 评论者 ID（外键） |
| parent_id | int | 父评论 ID（支持嵌套） |
| content | str | 评论内容 |
| depth | int | 嵌套深度 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

## 角色权限

| 角色 | 说明 | 权限 |
|------|------|------|
| `blogger` | 博主 | 发布/管理博客、增删改查评论 |
| `user` | 普通用户 | 评论、修改个人信息 |
| `admin` | 管理员 | 功能待定 |

## 预置账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| `wenmudong` | `wenmudong.hwd` | blogger |
| `admin` | `admin.hwd` | admin |

## API 路由

### 认证 API

| 方法 | 路由 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册（验证用户名、邮箱唯一性） | 否 |
| POST | /api/auth/login | 用户登录 | 否 |
| GET | /api/auth/me | 获取当前用户 | 是 |

### 用户 API

| 方法 | 路由 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/users/me | 获取个人信息 | 是 |
| PATCH | /api/users/me | 更新个人信息 | 是 |

### 上传 API

| 方法 | 路由 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/upload/avatar | 上传头像（base64 直接存储） | 是 |

### 博客 API

| 方法 | 路由 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/blogs | 获取博客列表（排除已删除） | 否 |
| POST | /api/blogs | 创建博客（需 title、subtitle、content） | 是 (blogger) |
| GET | /api/blogs/{id} | 获取博客详情 | 否 |
| PUT | /api/blogs/{id} | 更新博客 | 是 (blogger) |
| DELETE | /api/blogs/{id} | 软删除博客 | 是 (blogger) |

### 评论 API

| 方法 | 路由 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/blogs/{id}/comments | 获取评论列表（树形结构） | 否 |
| POST | /api/blogs/{id}/comments | 发布评论 | 是 |
| DELETE | /api/blogs/{id}/comments/{cid} | 删除评论 | 是 |

## 配置说明

配置文件：`app/config.py`

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| app_name | "SuperCenter API" | 应用名称 |
| debug | True | 调试模式 |
| database_url | "sqlite:///./data/supercenter.db" | 数据库 URL |
| secret_key | "your-super-secret-key..." | JWT 密钥（生产需更换） |
| algorithm | "HS256" | JWT 算法 |
| access_token_expire_minutes | 10080 (7天) | Token 过期时间 |
| upload_dir | "public/uploads" | 上传目录 |
| maxAvatarSize | 2MB | 头像最大大小 |

## 技术栈

- **框架**：FastAPI
- **ORM**：SQLModel（Pydantic + SQLAlchemy）
- **数据库**：SQLite（开发）
- **密码哈希**：argon2-cffi
- **Token**：python-jose (JWT)
- **文件上传**：图片转为 base64 直接存储在数据库

## 开发约定

- 使用 SQLModel 定义模型，继承 `SQLModel, table=True`
- 使用 Pydantic Schema 进行请求/响应验证
- 路由通过 `Depends` 注入认证依赖
- 使用 `verify_token` 验证 JWT Token
- 使用 `require_blogger` 装饰器限制博主权限
- 博客使用软删除机制（`is_deleted` 标记），不会真正删除数据
- 头像使用 base64 存储，直接存储 data URL 到数据库

## 相关文档

- 项目总览：`docs/SPEC.md`
- API 文档：http://localhost:8000/docs（启动后可访问）
