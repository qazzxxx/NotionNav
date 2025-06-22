# NNav - 基于 Notion 的智能导航系统

一个基于 Next.js 和 Notion 数据库的现代化导航页面，支持动态菜单管理、权限控制、搜索功能和登录验证。

## ✨ 功能特性

- 🎯 **动态菜单管理** - 通过 Notion 数据库实时管理菜单项
- 🔐 **权限控制** - 基于用户角色的菜单访问控制
- 🔍 **智能搜索** - 支持菜单项标题和描述的实时搜索
- 🏷️ **分类分组** - 按分类自动分组显示菜单项
- 🌐 **内网/外网切换** - 自动根据环境切换链接
- 🔑 **登录验证** - 基于 Notion Roles 字段的登录验证
- ⭐ **收藏功能** - 支持收藏常用菜单项，独立显示
- 📱 **响应式设计** - 完美适配各种设备
- ⚡ **实时更新** - 无需重启应用即可更新菜单

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm/yarn/pnpm
- Notion 账户和 API 密钥

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 环境配置

1. 在项目根目录创建 `.env.local` 文件：

```env
NOTION_TOKEN=your_integration_token_here
NOTION_DATABASE_ID=your_database_id_here
```

2. 获取 Notion API 密钥：

   - 访问 [Notion Developers](https://developers.notion.com/)
   - 创建新的集成
   - 复制 Integration Token

3. 配置数据库权限：
   - 在 Notion 数据库页面点击 "Share"
   - 添加你的集成到数据库
   - 确保集成有 "Read content" 权限

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 📊 Notion 数据库设置

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

### 数据库设置步骤

1. **创建新数据库**

   - 在 Notion 中点击 `+ New` 按钮
   - 选择 `Table` 或 `Database`
   - 命名为 "导航菜单"

2. **添加属性列**

   - 点击 `+` 按钮添加新列
   - 按照上表配置每个属性列
   - 确保属性类型正确

3. **获取数据库 ID**
   - 复制数据库页面的 URL
   - 提取数据库 ID 部分
   - 更新环境变量中的 `NOTION_DATABASE_ID`

## 🔧 核心功能

### 1. 动态菜单管理

- 通过 Notion 数据库实时管理菜单项
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

- 使用数据库中的 Roles 字段作为登录密码
- 实时验证用户权限
- 支持多角色登录
- 安全的 API 验证机制

### 6. 收藏功能

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
│   │   │   ├── auth/          # 登录验证 API
│   │   │   └── test-notion/   # 测试 API
│   │   ├── test-search/       # 搜索测试页面
│   │   ├── test-auth/         # 登录测试页面
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

## 🧪 测试功能

### 菜单功能测试

访问 `/test-search` 页面可以测试搜索功能：

- 切换用户角色测试权限控制
- 切换内网模式测试链接切换
- 输入关键词测试搜索建议
- 查看所有菜单项数据

### 登录验证测试

访问 `/test-auth` 页面可以测试登录功能：

- 使用 Notion 数据库中的 Roles 值作为密码
- 验证登录成功后的角色显示
- 测试不同角色的权限控制
- 重新锁定功能测试

### 收藏功能测试

访问 `/test-favorites` 页面可以测试收藏功能：

- 查看收藏统计信息
- 测试添加/移除收藏
- 验证权限控制
- 测试清空收藏功能
- 查看收藏列表和菜单列表

### API 测试

```bash
# 获取菜单数据
curl http://localhost:3000/api/menu

# 测试登录验证
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"password":"qazz"}'
```

## 🔍 故障排除

### 常见问题

1. **菜单项不显示**

   - 检查 status 字段是否为 "显示" 或 "active"
   - 确认用户角色权限配置
   - 验证数据库共享设置

2. **搜索无结果**

   - 确认菜单项有 title 或 description
   - 检查用户角色权限
   - 验证搜索关键词拼写

3. **登录验证失败**

   - 确认 Notion 数据库中有 Roles 字段
   - 检查 Roles 字段的值是否正确设置
   - 验证 API 连接是否正常
   - 查看浏览器控制台错误信息

4. **API 错误**
   - 检查环境变量配置
   - 确认 Notion Token 有效
   - 验证数据库 ID 正确

### 调试工具

- 访问 `/api/menu` 查看原始 API 响应
- 访问 `/api/auth` 测试登录验证（POST 请求）
- 访问 `/test-notion` 查看数据库连接状态
- 访问 `/test-auth` 测试登录功能
- 访问 `/test-favorites` 测试收藏功能
- 查看浏览器控制台获取详细错误信息

## 🔧 高级配置

### 自定义角色管理

1. 在 Notion 数据库中为菜单项设置不同的 Roles 值
2. 这些值将自动成为可用的登录密码
3. 系统会动态读取所有角色值
4. 支持实时添加新角色而无需重启应用

### 权限控制策略

- **guest**: 访客权限，只能访问公开菜单项
- **qazz**: 管理员权限，可以访问所有菜单项
- **自定义角色**: 可以设置特定的访问权限

### 多数据库支持

```typescript
export const NOTION_CONFIG = {
  DATABASES: {
    MENU: "menu-database-id",
    NEWS: "news-database-id",
    TOOLS: "tools-database-id",
  },
};
```
