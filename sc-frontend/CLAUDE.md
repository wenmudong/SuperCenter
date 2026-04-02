# CLAUDE.md

This file provides guidance to Claude Code when working with code in `sc-frontend/`.

## 常用命令

```bash
npm install              # 安装依赖
npm run dev              # 开发服务器 (http://localhost:3000)
npm run build            # 生产构建
npm run lint             # ESLint 检查
npm run type-check       # TypeScript 类型检查
```

## 项目结构

```
src/
├── app/                  # App Router 页面
│   ├── page.tsx          # 首页 (/)
│   ├── layout.tsx        # 根布局
│   └── globals.css       # 全局样式
└── components/          # React 组件
    └── Navbar.tsx        # 导航栏
```

## Next.js App Router 关键约定

**这是 NOT 你熟悉的 Next.js** — App Router 有重大变更。

### 路由规则
- `src/app/` 目录结构直接映射 URL：`src/app/about/page.tsx` → `/about`
- 布局组件 `layout.tsx`：定义 HTML 结构和子组件包装
- 页面组件 `page.tsx`：路由对应的页面内容

### Server vs Client Component
- **默认是 Server Component**：服务端渲染，可直接访问数据库
- **Client Component**：需要 `"use client"` 指令才能使用 `useState`、`useEffect` 等

```tsx
// Server Component（默认）
export default function Page() {
  return <div>服务端渲染</div>
}

// Client Component（需声明）
"use client"
import { useState } from "react"
export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### 组件导入
- Server Component 可直接导入 Client Component
- Client Component **不能**导入 Server Component（但可以接收 children 作为 prop）

## 与后端通信

- 后端地址：`http://localhost:8000`
- 健康检查：`GET http://localhost:8000/api/health`
- CORS 已配置允许 `localhost:3000`

## 开发约定

- 使用 TypeScript
- 样式使用 Tailwind CSS（原子化 CSS）
- 组件文件用 `.tsx` 扩展名
- 交互逻辑需要 `"use client"` 声明
- 新页面放在 `src/app/` 目录
- 全局组件放在 `src/components/`

## 相关文档

- 项目详细文档：`README.md`
- Next.js 官方文档：`node_modules/next/dist/docs/`