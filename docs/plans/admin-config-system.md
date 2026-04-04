# 管理员配置系统方案

## 目标

实现管理员后台配置系统，支持：
1. 系统级配置（字体、背景色、导航栏样式等）
2. 页面布局配置（每个页面的模块顺序、显隐、样式等）

所有配置存储在数据库中，实时生效，重启服务不丢失。

---

## 数据库模型设计

### SystemConfig 表 - 系统级配置

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| key | str | 配置键名，唯一索引 |
| value | str | 配置值（JSON 字符串） |
| updated_at | datetime | 更新时间 |

### PageLayout 表 - 页面布局配置

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| page_path | str | 页面路径，如 `/`, `/blogs`, `/projects` |
| layout_config | str | 布局配置（JSON） |
| updated_at | datetime | 更新时间 |

---

## 配置项设计

### 系统级配置 (SystemConfig)

| key | value 示例 | 说明 |
|-----|------------|------|
| `global_font` | `"FusionPixel"` | 全局字体 |
| `background_color` | `"#ffffff"` | 背景色 |
| `navbar_style` | `"transparent"` | 导航栏样式 |
| `page_layout` | `"grid"` | 默认页面布局 |
| `site_title` | `"Wenmudong"` | 网站标题 |
| `site_description` | `"Personal website"` | 网站描述 |

### 页面布局配置 (PageLayout)

```json
{
  "page_path": "/blogs",
  "modules": [
    {
      "id": "header",
      "visible": true,
      "order": 1,
      "config": { "title": "blogs.", "description": "我的博客" }
    },
    {
      "id": "filter",
      "visible": true,
      "order": 2
    },
    {
      "id": "blog-list",
      "visible": true,
      "order": 3,
      "config": { "columns": 3 }
    }
  ]
}
```

---

## API 设计

### 系统配置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/config` | 获取所有系统配置 |
| GET | `/api/admin/config/{key}` | 获取单个配置 |
| PUT | `/api/admin/config/{key}` | 更新单个配置 |

### 页面布局

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/page-layout/{page_path}` | 获取页面布局 |
| PUT | `/api/page-layout/{page_path}` | 更新页面布局 |
| GET | `/api/page-layout` | 获取所有页面布局 |

---

## 前端设计

### 1. 管理员视图

管理员登录后，每个页面显示**布局编辑面板**：
- 拖拽调整模块顺序
- 显示/隐藏模块
- 配置模块参数
- 实时预览效果

### 2. 左下角头像右键菜单

在 `FloatingAvatar` 组件中：
- 检测用户 `role === "admin"`
- 右键菜单显示「系统配置」入口

### 3. 系统配置页面

路由：`/admin/config`

配置项：
| 配置项 | 类型 | 说明 |
|--------|------|------|
| 全局字体 | select | 像素字体 / 系统字体 |
| 背景色 | color picker | 主题色 |
| 导航栏样式 | select | 固定/透明/毛玻璃 |
| 网站标题 | input | 站点名称 |
| 网站描述 | textarea | 站点描述 |

### 4. 全局配置 Context

```tsx
interface SystemConfig {
  globalFont: string;
  backgroundColor: string;
  navbarStyle: string;
  siteTitle: string;
  siteDescription: string;
}

// 页面组件读取配置并应用
const { config } = useSystemConfig();
<div style={{ fontFamily: config.globalFont }}>...</div>
```

---

## 改动文件清单

### 后端 (sc-backend/)

| 文件 | 改动 |
|------|------|
| `app/models/system.py` | 新增 SystemConfig 模型 |
| `app/models/page_layout.py` | 新增 PageLayout 模型 |
| `app/routers/admin.py` | 新增管理员配置路由 |
| `app/routers/page_layout.py` | 新增页面布局路由 |
| `app/main.py` | 注册新路由 |

### 前端 (sc-frontend/)

| 文件 | 改动 |
|------|------|
| `src/app/admin/config/page.tsx` | 新增系统配置页面 |
| `src/components/FloatingAvatar.tsx` | 右键菜单添加系统配置入口 |
| `src/contexts/SystemConfigContext.tsx` | 新增全局配置 Context |
| `src/components/LayoutEditor.tsx` | 新增布局编辑器组件 |
| `src/app/layout.tsx` | 应用全局配置 |
| `src/services/api.ts` | 新增配置 API 调用 |

---

## 工作流程

### 管理员配置流程

```
1. 管理员右键头像 → 点击「系统配置」
      ↓
2. 进入 /admin/config 页面
      ↓
3. 修改配置（如字体、背景色）
      ↓
4. 点击保存
      ↓
5. 前端调用 PUT /api/admin/config/{key}
      ↓
6. 后端更新数据库
      ↓
7. 前端实时应用新配置
```

### 页面布局配置流程

```
1. 管理员在任意页面
      ↓
2. 点击「编辑布局」按钮
      ↓
3. 出现布局编辑面板
      ↓
4. 拖拽/配置模块
      ↓
5. 点击保存
      ↓
6. 前端调用 PUT /api/page-layout/{page_path}
      ↓
7. 普通用户访问时自动应用新布局
```

---

## 优先级

1. **Phase 1**: 系统配置基础（SystemConfig 模型 + API + 前端 Context）
2. **Phase 2**: 系统配置页面（/admin/config）
3. **Phase 3**: FloatingAvatar 右键菜单
4. **Phase 4**: 页面布局配置（PageLayout 模型 + API）
5. **Phase 5**: 布局编辑面板
