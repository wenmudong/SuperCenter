# SuperCenter 前端

个人网站前端，基于 Next.js 构建。

## 技术栈

| 项 | 技术 | 说明 |
|---|------|------|
| 框架 | Next.js (App Router) | React 18，SSR/SSG |
| UI | Tailwind CSS | 原子化 CSS |
| 语言 | TypeScript | 类型安全 |
| 包管理 | npm | |

## 项目结构详解

```
sc-frontend/
├── src/                         # 源代码目录
│   ├── app/                     # Next.js App Router 页面目录
│   │   ├── favicon.ico          # 网站图标
│   │   ├── globals.css          # 全局样式，引入 Tailwind 指令
│   │   ├── layout.tsx           # 根布局组件，定义 HTML 结构和全局组件
│   │   └── page.tsx             # 首页入口，Server Component
│   └── components/             # React 组件目录
│       └── Navbar.tsx           # 导航栏组件
├── public/                      # 静态资源目录（图片、字体等）
├── app/                         # Next.js 配置文件
│   └── page.tsx
├── package.json                 # 项目依赖
├── tailwind.config.ts           # Tailwind CSS 配置
├── next.config.ts               # Next.js 配置
├── tsconfig.json                # TypeScript 配置
└── README.md                    # 本文档
```

## 核心文件解析

### `src/app/layout.tsx`
- 根布局组件
- 定义 HTML 文档结构
- 包含 `<html>`、`<body>` 标签
- 引入全局样式 `globals.css`
- 可在此放置全局 Provider（如主题、状态管理）

### `src/app/page.tsx`
- 首页组件
- Next.js App Router 中的 Server Component
- 默认从 `src/app` 目录自动映射到路由 `/`

### `src/app/globals.css`
- 全局样式文件
- 引入 Tailwind CSS 的基础指令：`@tailwind base;`、`@tailwind components;`、`@tailwind utilities;`
- 可在此添加全局 CSS 变量和自定义样式

### `src/components/Navbar.tsx`
- 导航栏组件
- 客户端组件（需添加 `"use client"` 指令）
- 包含网站导航链接

### `public/`
- 静态资源目录
- 文件直接映射到根路径：`public/image.png` → `/image.png`
- 用于存放不受构建处理的原始文件

## App Router 路由约定

| 文件路径 | 映射路由 |
|----------|----------|
| `src/app/page.tsx` | `/` |
| `src/app/about/page.tsx` | `/about` |
| `src/app/blog/[slug]/page.tsx` | `/blog/:slug` |

## 组件开发

### Server Component vs Client Component

- **Server Component**（默认）：服务端渲染，可直接访问数据库
- **Client Component**：需要添加 `"use client"` 指令，支持交互和状态管理

```tsx
// 客户端组件示例
"use client"

import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### 组件文件组织建议

```
src/components/           # 全局通用组件
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── Button.tsx
├── features/              # 功能模块组件（按业务划分）
│   ├── blog/
│   │   ├── BlogList.tsx
│   │   └── BlogPost.tsx
│   └── user/
│       ├── Profile.tsx
│       └── LoginForm.tsx
```

## 与后端交互

后端地址：http://localhost:8000

健康检查接口：GET http://localhost:8000/api/health

### API 调用示例

```typescript
// app/actions.ts
export async function getHealth() {
  const res = await fetch("http://localhost:8000/api/health")
  return res.json()
}
```

## 启动方式

```bash
cd sc-frontend
npm install              # 安装依赖
npm run dev              # 开发模式
```

访问 http://localhost:3000

## 开发约定

- 使用 App Router 模式开发
- 组件放在 `src/components/` 目录
- 页面放在 `src/app/` 目录
- 样式使用 Tailwind CSS
- 与后端 API 通信使用 `/api` 前缀（已配置 CORS 允许 localhost:3000）