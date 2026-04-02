# SuperCenter 前端结构与样式

## 页面结构

```
<body>
  └── <div> — 居中容器
        ├── <Navbar /> — 顶部导航
        └── <main class="pb-8">
              └── {children} — 页面内容
                    └── <PageHeader /> — 页面标题（可选）
                    └── <EmptyState /> — 空状态（列表为空时）
                    └── <Card /> — 项目卡片
```

### 居中容器

- 类名：`mx-auto w-full max-w-screen-sm px-8 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl`
- 作用：响应式最大宽度 + 水平居中 + 两侧留白
- 全局底部留白 32px（`pb-8`）

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
│   ├── page.tsx           # 首页
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   ├── auth/              # 认证页面
│   │   ├── login/
│   │   └── register/
│   ├── profile/           # 个人中心
│   ├── blogs/             # 博客
│   │   ├── page.tsx       # 博客列表
│   │   ├── new/           # 创建博客
│   │   └── [id]/          # 博客详情
│   ├── projects/          # Projects 页
│   ├── hobbies/           # Hobbies 页
│   └── tools/             # Tools 页
├── components/             # 全局通用组件
│   ├── Navbar.tsx         # 导航栏
│   ├── FloatingAvatar.tsx  # 左下角悬浮头像
│   ├── PageHeader.tsx     # 页面标题
│   ├── Card.tsx           # 通用卡片组件
│   ├── EmptyState.tsx     # 空状态组件
│   ├── Toast.tsx          # 提示组件
│   ├── ConfirmDialog.tsx  # 确认弹窗
│   └── Providers.tsx       # 全局 Provider 组合
├── contexts/              # React Context
│   └── AuthContext.tsx    # 认证状态管理
├── services/              # API 服务层
│   └── api.ts
└── types/                # TypeScript 类型定义
    └── index.ts
```

## 组件列表

### FloatingAvatar

左下角悬浮头像组件。

| 状态 | 行为 |
|------|------|
| 未登录 | 显示登录入口 |
| 已登录 | 左键进入个人页，右键显示菜单 |
| 菜单 | 用户名、角色、Profile、Logout |

特效：呼吸动画（轻微放大缩小）

### Toast

顶部居中弹出提示组件。

| 类型 | 样式 |
|------|------|
| success | 绿色背景 |
| error | 红色背景 |
| info | 蓝色背景 |

自动 3 秒后消失。

### ConfirmDialog

居中确认弹窗组件。

- 带遮罩背景
- 可自定义标题、信息、按钮文字
- 确认按钮支持自定义样式

### EmptyState

空状态组件。

- 居中大号文字
- 彩虹渐变色（红→黄→绿→蓝→紫）

### PageHeader

页面标题组件。

```tsx
interface PageHeaderProps {
  title?: string;          // 大标题（可选）
  description?: string;     // 描述文字（可选）
  children?: ReactNode;   // 自定义内容（可选）
}
```

全为空时不渲染任何内容。

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

## 认证系统

使用 `AuthContext` 管理认证状态：

```tsx
const { user, token, login, register, logout, updateUser } = useAuth();
```

- Token 存储在 localStorage，有效期 7 天
- 页面刷新自动验证 Token 有效性
- 过期或无效时自动清除并跳转首页

## API 服务层

`services/api.ts` — 统一封装 API 请求：

- `authApi`: 注册、登录、获取当前用户
- `userApi`: 获取/更新个人信息
- `blogApi`: 博客 CRUD
- `commentApi`: 评论 CRUD
- `uploadApi`: 头像上传

## 技术栈

| 项 | 技术 |
|---|------|
| 框架 | Next.js (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 字体 | Geist Sans + Geist Mono |
| MD 编辑器 | @uiw/react-md-editor |

## 响应式断点

| 断点 | 宽度 | 导航 | 网格列数 |
|------|------|------|---------|
| 默认 | screen-sm | 紧凑 | 1 |
| sm | — | 紧凑 | 2 |
| md | screen-md | 显示右侧链接 | 2 |
| lg | screen-lg | 显示右侧链接 | 3 |
| xl | screen-2xl | 显示右侧链接 | 4 |
