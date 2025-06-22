# NNav - 基于 Notion 的智能导航系统

一个基于 Next.js 和 Notion 数据库的现代化导航页面，支持动态菜单管理、权限控制、搜索功能和登录验证。

## ✨ 功能特性

- 🎯 **动态菜单管理** - 通过 Notion 数据库实时管理菜单项
- 🔐 **权限控制** - 基于用户角色的菜单访问控制
- 🔍 **智能搜索** - 支持菜单项标题和描述的实时搜索
- 🏷️ **分类分组** - 按分类自动分组显示菜单项
- 🌐 **内网/外网切换** - 自动根据环境切换链接
- 🔑 **登录验证** - 基于 Notion Roles 字段的登录验证
- 🔗 **URL 角色验证** - 支持通过 URL 参数 `?role=xxx` 直接验证角色
- ⭐ **收藏功能** - 支持收藏常用菜单项，独立显示
- 🖼️ **背景图同步** - Notion 数据库封面自动同步为导航页背景图
- 📱 **响应式设计** - 完美适配各种设备
- ⚡ **实时更新** - 无需重启应用即可更新菜单

## 🚀 快速开始

### 方式一：一键部署到 Vercel（推荐）

1. **获取 Notion 页面 ID**

   - 📋 **[NNav 导航菜单模板](https://like-emmental-3d4.notion.site/219692535678800fbefffd8ae6924454?v=2196925356788073920e000c2a02bf98)**

     1. 点击上面的模板链接
     2. 点击右上角的 "复制" 按钮复制到你的 Notion 工作区
     3. 复制完成后，点击右上角 "分享" 按钮，点击发布 Tab，进行发布
     4. 复制页面 ID（URL 中的 32 位字母与数字字符串）

2. **点击部署按钮**

   点击 [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nnav&env=NOTION_PAGE_ID&envDescription=Notion%20Page%20ID&envLink=https://github.com/yourusername/nnav%23environment-configuration) 按钮进行部署

3. **配置环境变量**

   在 Vercel 部署页面中，需要配置以下环境变量：

   - `NOTION_PAGE_ID`: 你的 Notion 页面 ID

4. **完成部署**

   点击 "Deploy" 按钮，等待部署完成即可访问你的导航页面

### 方式二：本地开发

#### 环境要求

- Node.js 18+
- npm/yarn/pnpm
- Notion 账户

#### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

#### 环境配置

> 📖 **详细配置说明**：

1. 在项目根目录创建 `.env.local` 文件：

```env
NOTION_PAGE_ID=your_page_id_here
```

2. 获取 Notion 页面 ID，同上

#### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 环境变量说明

| 变量名           | 必需 | 说明                                                  |
| ---------------- | ---- | ----------------------------------------------------- |
| `NOTION_PAGE_ID` | ✅   | Notion 页面 ID                                        |
| `NOTION_TOKEN`   | ❌   | Notion 私有 Token（可选，设置后可访问未公开的数据库） |

## 📊 Notion 页面/数据库设置

### 🎯 快速开始 - 使用模板

**推荐使用我们的 Notion 模板快速开始：**

📋 **[NNav 导航菜单模板](https://like-emmental-3d4.notion.site/219692535678800fbefffd8ae6924454?v=2196925356788073920e000c2a02bf98)**

1. 点击上面的模板链接
2. 点击右上角的 "Duplicate" 按钮复制到你的 Notion 工作区
3. 复制页面 ID（URL 中的 32 位字母与数字字符串）
4. 在环境变量中设置 `NOTION_PAGE_ID`

### 🖼️ 设置背景图

**重要功能**：你可以为 Notion 数据库设置封面图片，它会自动同步为导航页的背景图！

#### 如何设置封面

1. **设置数据库封面**

   - 打开你的 Notion 数据库页面
   - 点击页面顶部的 "Add cover" 按钮
   - 选择 "Upload" 上传本地图片，或选择 "Unsplash" 搜索在线图片
   - 调整封面显示方式（居中、填充等）

2. **支持的图片格式**

   - JPG/JPEG
   - PNG
   - WebP
   - GIF（静态）

3. **背景图优先级**

   - 🥇 **Notion 封面**：最高优先级，如果设置了封面则优先显示
   - 🥈 **Bing 每日图片**：当没有 Notion 封面时显示
   - 🥉 **本地图片**：当没有 Notion 封面和 Bing 图片时显示

### 数据库结构

数据库需要包含以下属性：

| 属性名称      | 类型         | 必需 | 说明                       |
| ------------- | ------------ | ---- | -------------------------- |
| `title`       | Title        | ✅   | 菜单项标题                 |
| `description` | Text         | ❌   | 菜单项描述                 |
| `href`        | URL          | ✅   | 外网链接地址               |
| `lanHref`     | URL          | ❌   | 内网链接地址               |
| `avatar`      | URL          | ❌   | 图标/头像地址              |
| `roles`       | Multi-select | ❌   | 用户权限（guest, qazz 等） |
| `status`      | Select       | ❌   | 状态（显示/隐藏）          |
| `category`    | Select       | ❌   | 分类名称                   |

### 示例数据

```markdown
title: "GitHub"
description: "全球最大的代码托管平台"
href: "https://github.com"
avatar: "https://github.com/favicon.ico"
roles: ["guest", "qazz"]
status: "显示"
category: "开发工具"
```

## 🔧 核心功能

### 1. 动态菜单管理

- 通过 Notion 页面实时管理菜单项
- 支持添加、修改、删除菜单项
- 无需重新部署应用

### 2. 权限控制

- 基于用户角色控制菜单项访问
- 支持多角色权限配置
- 灵活的权限管理

### 3. 搜索功能

- 支持菜单项标题和描述搜索
- 实时搜索建议
- 键盘导航支持（上下箭头、回车、ESC）
- 点击外部自动关闭建议
- 支持直接打开匹配的菜单项

### 4. 分类分组

- 按分类自动分组显示菜单项
- 支持自定义分类名称
- 清晰的视觉层次

### 5. 登录验证

- 使用页面中的 Roles 字段作为登录密码
- 实时验证用户权限
- 支持多角色登录
- 安全的 API 验证机制

### 6. URL 角色验证

- 支持通过 URL 参数 `?role=xxx` 直接验证角色
- 自动从 Notion 数据库中读取所有角色进行验证
- 同时支持备用密码（qazz, guest）
- 验证成功后自动解锁页面并设置用户角色
- 支持实时角色更新，无需重启应用
- **智能加载状态**：当 URL 包含 role 参数时，先显示"正在验证角色权限..."的加载状态，验证失败才显示锁定页面

**使用示例：**

```
https://your-domain.vercel.app/?role=qa
https://your-domain.vercel.app/?role=qazz
https://your-domain.vercel.app/?role=guest
```

**验证流程：**

1. 检测 URL 中的 role 参数
2. 显示"正在验证角色权限..."加载状态
3. 优先使用 Notion 数据库中的 Roles 字段值进行验证
4. 如果 Notion 角色验证失败，使用备用密码验证
5. 验证成功后自动解锁页面并设置用户角色
6. 验证失败则显示锁定页面
7. 支持多角色配置（用逗号分隔）

### 7. 收藏功能

- 支持收藏常用菜单项
- 收藏数据存储在浏览器 localStorage 中
- 独立显示在"常用"分类下
- 支持一键清空所有收藏
- 权限控制，只显示用户有权限的收藏
- 支持内网/外网链接切换

## 📁 项目结构

```
nnav/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── menu/          # 菜单 API
│   │   │   │   └── index.ts   # 菜单 API 入口
│   │   │   └── auth/          # 登录验证 API
│   │   └── page.tsx           # 主页面
│   ├── components/
│   │   ├── NotionMenu.tsx     # Notion 菜单组件
│   │   ├── GroupedNotionMenu.tsx # 分组菜单组件
│   │   ├── SearchBar.tsx      # 搜索栏组件
│   │   ├── SearchSuggestions.tsx # 搜索建议组件
│   │   └── Lock.tsx           # 锁定组件
│   ├── hooks/
│   │   └── useNotionMenu.ts   # Notion 菜单 Hook
│   ├── config/
│   │   └── notion.ts          # Notion 配置
│   └── types/
│       └── index.ts           # 类型定义
├── public/                    # 静态资源
└── docs/                      # 文档
```

### API 测试

```bash
# 获取菜单数据
curl http://localhost:3000/api/menu

# 测试登录验证
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"password":"qazz"}'

# 获取所有角色
curl http://localhost:3000/api/auth/roles

# 检查环境变量配置
curl http://localhost:3000/api/env-check
```

## 🔍 故障排除

### 常见问题

1. **菜单项不显示**

   - 检查 status 字段是否为 "显示" 或 "active"
   - 确认用户角色权限配置
   - 验证页面共享设置

2. **搜索无结果**

   - 确认菜单项有 title 或 description
   - 检查用户角色权限
   - 验证搜索关键词拼写

3. **登录验证失败**

   - 确认 Notion 页面中有 Roles 字段
   - 检查 Roles 字段的值是否正确设置
   - 验证 API 连接是否正常
   - 查看浏览器控制台错误信息

4. **API 错误**

   - 检查环境变量配置
   - 验证页面 ID 是否正确

5. **部署失败**

   - 检查环境变量是否正确配置
   - 确认 GitHub 仓库权限设置
   - 验证页面 ID 格式
   - 查看 Vercel 构建日志

6. **Vercel 部署问题**

   - 确保环境变量在 Vercel Dashboard 中正确设置
   - 检查构建日志中的错误信息
   - 确认 Next.js 版本兼容性
   - 验证 API 路由配置

7. **背景图不显示**

   - 确认 Notion 数据库已设置封面图片
   - 检查封面图片格式是否支持（JPG、PNG、WebP、GIF）
   - 验证图片文件大小是否过大（建议小于 5MB）
   - 确认数据库页面权限设置正确
   - 查看浏览器控制台是否有图片加载错误
   - 如果 Notion 封面不显示，系统会自动回退到 Bing 图片或本地图片

8. **背景图显示异常**
   - 检查图片分辨率是否合适（推荐 1920x1080 或更高）
   - 确认图片没有损坏或格式错误
   - 验证网络连接是否正常
   - 清除浏览器缓存后重试

### 调试工具

- 访问 `/api/menu` 查看原始 API 响应
- 访问 `/api/auth` 测试登录验证（POST 请求）
- 访问 `/api/auth/roles` 查看所有可用角色
- 访问 `/api/env-check` 检查环境变量配置
- 访问 `/api/debug-menu` 查看菜单数据（包含封面信息）
- 查看浏览器控制台获取详细错误信息
- 使用浏览器开发者工具检查图片加载状态

### 部署检查清单

在部署到 Vercel 之前，请确认：

- [ ] Notion 页面已创建并配置
- [ ] 页面已分享给需要的成员
- [ ] 环境变量已正确配置
- [ ] GitHub 仓库已 Fork 或克隆
- [ ] 项目依赖已安装
- [ ] 本地测试通过
- [ ] Notion 数据库封面已设置（可选，用于背景图）
- [ ] 封面图片格式和大小符合要求

**💡 快速检查**：运行 `npm run deploy-check` 来自动检查部署配置是否正确。
