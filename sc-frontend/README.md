# SuperCenter 前端

个人网站前端，基于 Next.js (App Router) 构建。

## 技术栈

| 项 | 技术 | 说明 |
|---|------|------|
| 框架 | Next.js (App Router) | React 18，SSR/SSG |
| UI | Tailwind CSS | 原子化 CSS |
| 语言 | TypeScript | 类型安全 |
| 包管理 | npm | |
| MD 编辑器 | @uiw/react-md-editor | Markdown 编辑器 |

## 项目结构

```
sc-frontend/
├── src/
│   ├── app/                     # Next.js App Router 页面
│   │   ├── page.tsx             # 首页
│   │   ├── layout.tsx          # 根布局（Providers、全局样式）
│   │   ├── globals.css          # 全局样式（含呼吸动画）
│   │   ├── auth/               # 认证
│   │   │   ├── login/         # 登录页
│   │   │   └── register/       # 注册页
│   │   ├── profile/           # 个人中心
│   │   ├── blogs/             # 博客
│   │   │   ├── page.tsx       # 博客列表
│   │   │   ├── new/           # 创建博客
│   │   │   └── [id]/          # 博客详情
│   │   ├── projects/          # Projects 页
│   │   ├── hobbies/           # Hobbies 页
│   │   └── tools/             # Tools 页
│   ├── components/            # React 组件
│   │   ├── Navbar.tsx         # 导航栏
│   │   ├── FloatingAvatar.tsx  # 左下角悬浮头像
│   │   ├── PageHeader.tsx     # 页面标题
│   │   ├── Card.tsx           # 项目卡片
│   │   ├── EmptyState.tsx     # 空状态组件
│   │   ├── Toast.tsx          # 提示组件
│   │   ├── ConfirmDialog.tsx  # 确认弹窗
│   │   └── Providers.tsx       # 全局 Provider 组合
│   ├── contexts/              # React Context
│   │   └── AuthContext.tsx    # 认证状态管理
│   ├── services/             # API 服务层
│   │   └── api.ts            # 后端 API 调用
│   └── types/               # TypeScript 类型
│       └── index.ts         # 类型定义
├── public/                  # 静态资源
│   ├── uploads/avatars/     # 头像上传目录
│   └── fonts/               # 字体文件
├── package.json
└── README.md
```

## 核心组件

### FloatingAvatar
- 左下角悬浮头像
- 呼吸动画效果
- 未登录显示登录入口
- 已登录：左键进入个人页，右键显示菜单
- 菜单包含用户名、角色、Profile、Logout

### Toast
- 顶部居中弹出提示
- 支持 success/error/info 三种类型
- 3秒后自动消失
- 使用 `useToast()` Hook

### ConfirmDialog
- 居中确认弹窗
- 带遮罩背景
- 可自定义标题、信息、按钮文字

### EmptyState
- 列表为空时显示
- 彩虹渐变文字效果

### PageHeader
- 页面标题组件
- 可选 title/description/children
- 全为空时不渲染

## 认证系统

使用 `AuthContext` 管理认证状态：

```tsx
const { user, token, login, register, logout, updateUser } = useAuth();
```

- Token 存储在 localStorage，有效期 7 天
- 页面刷新自动验证 Token 有效性

## 博客功能

- 列表页：有数据时右上角显示添加按钮
- 创建页：标题、副标题、Markdown 编辑器
- 详情页：Markdown 渲染、评论功能
- 评论：一级评论可展开/缩放，自己评论右侧显示

## 启动方式

```bash
cd sc-frontend
npm install              # 安装依赖
npm run dev              # 开发模式 (http://localhost:3000)
npm run build            # 生产构建
```

## 开发约定

- 使用 App Router 模式开发
- 组件放在 `src/components/` 目录
- 页面放在 `src/app/` 目录
- 样式使用 Tailwind CSS
- 交互逻辑需要 `"use client"` 声明
- 全局底部留白 32px（`pb-8`）
- 与后端 API 通信使用 `/api` 前缀（已配置 CORS 允许 localhost:3000）
