# SuperCenter 前端结构与样式

## 页面结构

```
<body>
  └── <div> — 居中容器
        ├── <Navbar /> — 粘性顶部导航
        └── <main>
              └── {children} — 页面内容
                    └── <PageHeader /> — 页面标题
                    └── <div.grid> — 内容网格
                          └── <Card /> — 项目卡片
```

### 居中容器

- 类名：`mx-auto w-full max-w-screen-sm px-8 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl`
- 作用：响应式最大宽度 + 水平居中 + 两侧留白

| 断点 | 最大宽度 |
|------|---------|
| 默认 | screen-sm |
| md | screen-md |
| lg | screen-lg |
| xl | screen-2xl |

## 项目结构

```
src/
├── app/                    # App Router 页面
│   ├── page.tsx           # 首页（Projects 页面）
│   ├── layout.tsx         # 根布局
│   └── globals.css
├── components/             # 全局通用组件
│   ├── Navbar.tsx         # 导航栏
│   ├── PageHeader.tsx     # 页面标题
│   └── Card.tsx           # 通用卡片组件
├── features/               # 业务模块（按功能组织）
│   └── projects/          # Projects 模块
│       ├── api/           # API 调用
│       │   └── projects.ts
│       └── hooks/         # 模块 hooks
│           └── useProjects.ts
├── services/               # API 服务层
│   └── api.ts
├── types/                  # TypeScript 类型定义
│   └── index.ts
└── lib/                    # 工具函数（如有）
```

### 目录说明

| 目录 | 用途 |
|------|------|
| `features/` | 按业务模块组织，后续可扩展 blogs、hobbies、tools |
| `services/` | 统一封装 API 调用，集中管理后端接口 |
| `types/` | 类型定义，确保前后端类型一致 |
| `components/` | 全局通用组件，不依赖业务逻辑 |

## 组件列表

### Card

通用卡片组件，支持图片展示和状态标签。

**Props**：
```tsx
interface CardProps {
  id: string;              // 唯一标识
  title: string;           // 标题
  description?: string;    // 描述
  status: "ACTIVE" | "COMPLETED" | "PLANNING";  // 状态
  coverUrl?: string;       // 封面图
  linkUrl?: string;        // 外部链接
  category?: string;        // 分类，默认 "Project"
}
```

**状态样式**：

| 状态 | 标签 | 背景色 | 文字色 |
|------|------|--------|--------|
| ACTIVE | ACTIVE | green-400/40 | green-900 |
| COMPLETED | COMPLETED | blue-400/40 | blue-900 |
| PLANNING | PLANNING | amber-400/40 | amber-900 |

**交互**：
- 悬停：图片旋转 -3° + 放大 1.1 倍
- 背景色变深

### PageHeader

页面标题组件。

**Props**：
```tsx
interface PageHeaderProps {
  title: string;          // 大标题
  description?: string;   // 描述文字
}
```

### Navbar

导航栏组件，Chester 风格。

| 功能 | 说明 |
|------|------|
| 左侧胶囊 | 滑动指示器跟随当前选中项 |
| 菜单项 | Wenmudong、Blogs、Projects、Hobbies、Tools |
| 右侧链接 | Github |
| 交互 | 点击切换 activeIndex，指示器平滑移动 |

## 后端对接

### API 服务层

`services/api.ts` — 统一封装 API 请求：

```tsx
const API_BASE = "http://localhost:8000/api";

async function request<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const api = {
  projects: {
    list: () => request<Project[]>("/projects"),
    get: (id: string) => request<Project>(`/projects/${id}`),
  },
};
```

### 类型定义

`types/index.ts` — 定义前后端共享类型：

```tsx
export interface Project {
  id: string;
  title: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "PLANNING";
  coverUrl?: string;
  linkUrl?: string;
  category?: string;
}
```

## 技术栈

| 项 | 技术 |
|---|------|
| 框架 | Next.js (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 字体 | Geist Sans + Geist Mono |

## 响应式断点

| 断点 | 宽度 | 导航 | 网格列数 |
|------|------|------|---------|
| 默认 | screen-sm | 紧凑 | 1 |
| sm | — | 紧凑 | 2 |
| md | screen-md | 显示右侧链接 | 2 |
| lg | screen-lg | 显示右侧链接 | 3 |
| xl | screen-2xl | 显示右侧链接 | 4 |
