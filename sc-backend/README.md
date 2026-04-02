# SuperCenter 后端

个人网站后端 API 服务，基于 FastAPI 构建。

## 技术栈

| 项 | 技术 | 说明 |
|---|------|------|
| 框架 | FastAPI | ASGI，高性能 Web 框架 |
| 工具 | uv | 包管理与项目工具 |
| ORM | SQLModel | Pydantic + SQLAlchemy 融合 |
| 数据库 | SQLite | 开发阶段；生产可切换 PostgreSQL |
| 验证 | Pydantic | 请求/响应数据校验 |

## 项目结构详解

```
sc-backend/
├── app/                          # 应用核心代码
│   ├── __init__.py               # 包初始化，create_db_and_tables 在此导出
│   ├── main.py                   # FastAPI 应用入口，定义 lifespan 和路由挂载
│   ├── config.py                 # 配置管理，Settings 类从环境变量/.env 读取
│   ├── database.py               # 数据库引擎创建，SQLModel.metadata.create_all
│   ├── routers/                  # 路由模块
│   │   ├── __init__.py
│   │   └── api.py                # API 路由定义，如 /api/health
│   └── models/                   # 数据模型
│       ├── __init__.py
│       └── __all_models.py       # 所有 SQLModel 模型定义（需创建）
├── data/                         # 数据库文件目录
│   └── supercenter.db            # SQLite 数据库文件
├── pyproject.toml                # 项目依赖和配置
├── .venv/                        # Python 虚拟环境（已忽略）
└── .gitignore                    # 版本控制忽略规则
```

## 核心文件解析

### `app/__init__.py`
- 包入口文件
- 导出 `create_db_and_tables` 函数，供 `main.py` 调用

### `app/main.py`
- FastAPI 应用实例创建
- 定义 `lifespan` 上下文管理器，启动时创建数据库表
- 挂载路由：`app.include_router(api.router, prefix="/api")`
- 配置 CORS 允许前端 localhost:3000

### `app/config.py`
- `Settings` 类继承 `BaseSettings`
- 从 `.env` 文件读取配置
- 主要配置项：
  - `app_name`: 应用名称
  - `debug`: 调试模式
  - `database_url`: 数据库连接 URL

### `app/database.py`
- 创建 SQLAlchemy 引擎
- SQLite 配置 `check_same_thread=False` 解决跨线程访问问题
- `create_db_and_tables()` 调用 `SQLModel.metadata.create_all(engine)`

### `app/routers/api.py`
- 定义 API 路由
- 示例端点：`GET /api/health` 健康检查

### `app/models/`
- 数据模型目录
- 存放所有 SQLModel 模型类
- 模型类定义数据库表结构

## 启动方式

```bash
cd sc-backend
uv sync                  # 安装依赖
uv run sc                # 启动服务（默认端口 8000）
uv run sc 9000           # 启动服务（指定端口 9000）
```

API 访问：http://localhost:8000/api/health

## 数据库

- 数据库文件统一存放在 `data/` 目录下
- 支持多数据库：可在 `data/` 目录添加新的 `.db` 文件
- 后端启动时自动创建 SQLite 数据库和表
- 所有 `.db` 文件已被 `.gitignore` 忽略

## 开发约定

- API 遵循 RESTful 规范
- 使用 SQLModel 定义数据模型（结合 Pydantic 和 SQLAlchemy）
- 配置通过环境变量或 `.env` 文件管理
- 后端启动时自动初始化数据库