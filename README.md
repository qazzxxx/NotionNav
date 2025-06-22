# NNav - 基于 Notion 的智能导航系统

一个基于 Next.js 和 Notion 数据库的现代化导航页面，支持动态菜单管理、权限控制、搜索功能和登录验证。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nnav&env=NOTION_PAGE_ID&envDescription=Notion%20Page%20ID&envLink=https://github.com/yourusername/nnav%23environment-configuration)

## ✨ 功能特性

- 🎯 **动态菜单管理** - 通过 Notion 数据库实时管理菜单项
- 🔐 **权限控制** - 基于用户角色的菜单访问控制
- 🔍 **智能搜索** - 支持菜单项标题和描述的实时搜索
- 🏷️ **分类分组** - 按分类自动分组显示菜单项
- 🌐 **内网/外网切换** - 自动根据环境切换链接
- 🔑 **登录验证** - 基于 Notion Roles 字段的登录验证
- 🔗 **URL 角色验证** - 支持通过 URL 参数 `?role=xxx` 直接验证角色
- ⭐ **收藏功能** - 支持收藏常用菜单项，独立显示
- 📱 **响应式设计** - 完美适配各种设备
- ⚡ **实时更新** - 无需重启应用即可更新菜单

## 🚀 快速开始

### 方式一：一键部署到 Vercel（推荐）

1. **点击部署按钮**

   点击上方的 [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nnav&env=NOTION_PAGE_ID&envDescription=Notion%20Page%20ID&envLink=https://github.com/yourusername/nnav%23environment-configuration) 按钮

2. **配置环境变量**

   在 Vercel 部署页面中，需要配置以下环境变量：

   - `NOTION_PAGE_ID`: 你的 Notion 页面 ID

3. **获取 Notion 页面 ID**

   - 打开你的 Notion 页面或数据库页面
   - 复制页面 URL
   - 提取页面 ID 部分

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

> 📖 **详细配置说明**：查看 [ENV_SETUP.md](./ENV_SETUP.md) 获取完整的环境变量配置指南。

1. 在项目根目录创建 `.env.local` 文件：

```env
NOTION_PAGE_ID=your_page_id_here
```

2. 获取 Notion 页面 ID：

   - 打开你的 Notion 页面或数据库页面
   - 复制页面 URL
   - 提取页面 ID 部分

#### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 🌐 部署指南

> 📖 **详细部署说明**：查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取完整的部署指南和故障排除信息。

### Vercel 部署

#### 自动部署（推荐）

1. **Fork 项目**

   在 GitHub 上 Fork 本项目到你的账户

2. **修改部署链接**

   将 README 中的部署链接中的 `yourusername` 替换为你的 GitHub 用户名

3. **一键部署**

   点击部署按钮，按照提示配置环境变量即可

#### 手动部署

1. **导入项目**

   在 [Vercel Dashboard](https://vercel.com/dashboard) 中点击 "New Project"

2. **连接 GitHub**

   选择你的 GitHub 仓库或直接导入项目

3. **配置环境变量**

   在项目设置中添加以下环境变量：

   ```
   NOTION_PAGE_ID=your_page_id_here
   ```

4. **部署**

   点击 "Deploy" 按钮完成部署

### 其他平台部署

#### Netlify

1. 连接 GitHub 仓库
2. 构建命令：`npm run build`
3. 发布目录：`.next`
4. 环境变量配置同 Vercel

#### Railway

1. 连接 GitHub 仓库
2. 自动检测 Next.js 项目
3. 配置环境变量
4. 自动部署

### 环境变量说明

| 变量名           | 必需 | 说明           |
| ---------------- | ---- | -------------- |
| `NOTION_PAGE_ID` | ✅   | Notion 页面 ID |

### 域名配置

部署完成后，你可以：

1. **使用 Vercel 默认域名**

   - 格式：`your-project.vercel.app`
   - 自动 HTTPS 支持

2. **配置自定义域名**

   - 在 Vercel Dashboard 中添加自定义域名
   - 支持 CNAME 和 A 记录配置
   - 自动 SSL 证书

3. **配置重定向**
   - 支持 www 到非 www 重定向
   - 支持 HTTP 到 HTTPS 重定向

## 📊 Notion 页面/数据库设置

### 🎯 快速开始 - 使用模板

**推荐使用我们的 Notion 模板快速开始：**

📋 **[NNav 导航菜单模板](https://like-emmental-3d4.notion.site/219692535678800fbefffd8ae6924454?v=2196925356788073920e000c2a02bf98)**

1. 点击上面的模板链接
2. 点击右上角的 "Duplicate" 按钮复制到你的 Notion 工作区
3. 复制页面 ID（URL 中的长字符串）
4. 在环境变量中设置 `NOTION_PAGE_ID`

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

### 页面/数据库设置步骤

1. **创建新页面或数据库**

   - 在 Notion 中点击 `+ New` 按钮
   - 选择 `Table` 或 `Database`
   - 命名为 "导航菜单"

2. **添加属性列**

   - 点击 `+` 按钮添加新列
   - 按照上表配置每个属性列
   - 确保属性类型正确

3. **获取页面 ID**
   - 复制页面或数据库页面的 URL
   - 提取页面 ID 部分
   - 更新环境变量中的 `NOTION_PAGE_ID`

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

### 调试工具

- 访问 `/api/menu` 查看原始 API 响应
- 访问 `/api/auth` 测试登录验证（POST 请求）
- 访问 `/api/auth/roles` 查看所有可用角色
- 访问 `/api/env-check` 检查环境变量配置
- 查看浏览器控制台获取详细错误信息

### 部署检查清单

在部署到 Vercel 之前，请确认：

- [ ] Notion 页面已创建并配置
- [ ] 页面已分享给需要的成员
- [ ] 环境变量已正确配置
- [ ] GitHub 仓库已 Fork 或克隆
- [ ] 项目依赖已安装
- [ ] 本地测试通过

**💡 快速检查**：运行 `npm run deploy-check` 来自动检查部署配置是否正确。

### 性能优化建议

1. **Vercel 优化**

   - 启用 Vercel Analytics
   - 配置 CDN 缓存策略
   - 使用 Vercel Edge Functions

2. **Notion API 优化**

   - 合理设置缓存时间
   - 避免频繁的 API 调用
   - 使用适当的错误重试机制

3. **前端优化**
   - 启用 Next.js 图片优化
   - 配置适当的缓存策略
   - 优化字体加载

## 🔧 高级配置

### 自定义角色管理

1. 在 Notion 页面中为菜单项设置不同的 Roles 值
2. 这些值将自动成为可用的登录密码
3. 系统会动态读取所有角色值
4. 支持实时添加新角色而无需重启应用

### 权限控制策略

- **自定义角色**: 可以设置特定的访问权限
