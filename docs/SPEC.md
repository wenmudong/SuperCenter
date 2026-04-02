# SuperCenter 技术方案

> **文档语言**：本文档以中文为第一语言，英文仅用于代码注释和技术术语。

## 项目概述

个人网站，前后端分离架构。

## 技术栈

### 后端

| 项 | 技术 | 说明 |
|---|------|------|
| 框架 | FastAPI | ASGI，高性能 |
| 工具 | uv | 包管理与项目工具 |
| ORM | SQLModel | Pydantic + SQLAlchemy |
| 数据库 | SQLite | 开发阶段；生产可切换 PostgreSQL |
| 验证 | Pydantic | 请求/响应数据校验 |

### 前端

| 项 | 技术 | 说明 |
|---|------|------|
| 框架 | Next.js (App Router) | React 18，SSR/SSG |
| UI | Tailwind CSS | 原子化 CSS |
| 语言 | TypeScript | 类型安全 |
| 包管理 | npm | |

### 部署（预留）

- 前端：Vercel / Cloudflare Pages
- 后端：Railway / Fly.io / VPS

## 项目结构

> 各子项目的详细结构说明见对应的 README 文件。

```
supercenter/
├── docs/
│   ├── SPEC.md              # 项目总览文档
│   ├── commands.md          # 启动命令汇总
│   └── frontend-structure.md # 前端结构与样式
├── sc-backend/               # 后端服务（详见 sc-backend/README.md）
│   ├── app/
│   │   ├── __init__.py      # 包初始化
│   │   ├── main.py          # FastAPI 入口
│   │   ├── config.py        # 配置管理
│   │   ├── database.py      # 数据库引擎
│   │   ├── routers/
│   │   │   └── api.py       # API 路由
│   │   └── models/
│   │       └── __init__.py  # 数据模型
│   ├── data/                 # 数据库文件目录
│   │   └── supercenter.db   # SQLite 数据库
│   ├── pyproject.toml
│   └── .venv/
└── sc-frontend/              # 前端应用（详见 sc-frontend/README.md）
    ├── src/
    │   ├── app/              # Next.js App Router
    │   │   ├── page.tsx      # 首页
    │   │   ├── layout.tsx    # 根布局
    │   │   └── globals.css   # 全局样式
    │   └── components/       # React 组件
    │       ├── Navbar.tsx    # 导航栏
    │       ├── BookCard.tsx  # 书籍卡片
    │       └── PageHeader.tsx # 页面标题
    ├── public/               # 静态资源
    ├── package.json
    ├── tailwind.config.ts
    └── next.config.ts
```

## 启动方式

详细命令见 [docs/commands.md](./commands.md)

### 后端

```bash
cd sc-backend
uv sync
uv run sc.py             # 端口 8000
uv run sc.py 9000         # 指定端口
```

### 前端

```bash
cd sc-frontend
npm install
npm run dev
```

## 数据库

- 数据库文件统一存放在 `sc-backend/data/` 目录下
- 支持多数据库：可在 `data/` 目录添加新的 `.db` 文件
- 后端启动时自动创建 SQLite 数据库和表
- 所有 `.db` 文件已被 `.gitignore` 忽略，不会提交到版本控制

## 开发约定

- API 遵循 RESTful 规范
- 前端通过 `/api` 前缀调用后端接口（已配置 CORS 允许 localhost:3000）
- 后端启动时自动创建 SQLite 数据库和表
- 文档随项目更新同步维护
- 各子项目详细文档：
  - 后端详细文档：`sc-backend/README.md`
  - 前端详细文档：`sc-frontend/README.md`
  - 前端结构与样式：`docs/frontend-structure.md`
