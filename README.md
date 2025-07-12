# NotionNav - 基于 Notion 数据库的导航页

一个基于 Next.js 和 Notion 数据库的现代化导航页面，支持动态菜单管理、权限控制、搜索功能和登录验证。

|                   桌面端                    |                         移动端                          |
| :-----------------------------------------: | :-----------------------------------------------------: |
| ![NotionNav 预览图](./public/notionnav.png) | ![NotionNav 手机端预览图](./public/notionnavmobile.png) |

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
- 🎨 **现代化 UI**：毛玻璃效果和流畅动画
- 🌅 **动态背景**：支持 Notion 封面、Bing 每日图片和本地图片
- 🔄 **状态过滤**：根据 Notion 中的 Status 字段过滤菜单项
- 📂 **分类分组**：按 Category 字段自动分组显示
- 🖼️ **智能图标**：Avatar 加载失败时自动使用 favicon.im 服务获取网站图标
- 🧪 **测试页面**：提供完整的测试页面验证各项功能

## 🚀 快速开始

### 一键部署到 Vercel

1. **获取 Notion 页面 ID**

   - 📋 **[NotionNav 导航菜单模板](https://like-emmental-3d4.notion.site/219692535678800fbefffd8ae6924454?v=2196925356788073920e000c2a02bf98)**

     1. 点击上面的模板链接
     2. 点击右上角的 "复制" 按钮复制到你的 Notion 工作区
     3. 复制完成后，点击右上角 "分享" 按钮，点击发布 Tab，进行发布
     4. 复制页面 ID（URL 中的 32 位字母与数字字符串）

2. **点击部署按钮**

   点击 [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/qazzxxx/NotionNav&env=NOTION_PAGE_ID&envDescription=Notion%20Page%20ID&envLink=https://github.com/qazzxxx/NotionNav%23environment-configuration) 按钮进行部署

3. **配置环境变量**

   在 Vercel 部署页面中，需要配置以下环境变量：

   - `NOTION_PAGE_ID`: 你的 Notion 页面 ID（URL 中的 32 位字母与数字字符串）

4. **完成部署**

   点击 "Deploy" 按钮，等待部署完成即可访问你的导航页面

### 环境变量说明

| 变量名               | 必需 | 说明                                                  |
| -------------------- | ---- | ----------------------------------------------------- |
| `NOTION_PAGE_ID`     | ✅   | Notion 页面 ID                                        |
| `NOTION_TOKEN`       | ❌   | Notion 私有 Token（可选，设置后可访问未公开的数据库） |
| `NOTION_ACTIVE_USER` | ❌   | Notion 活跃用户 ID（可选，用于访问未分享的文档）      |

### 🔐 访问未分享的 Notion 文档

如果你需要访问未公开分享的 Notion 文档，需要配置以下环境变量：

1. **获取 Notion Token 和 Notion Active User ID**

   - 两者都可以从您的 Web 浏览器中检索。查看工作流程后，打开 > Application > Cookie >的开发工具，然后复制 和 。分别是 activeUser： notion_user_id， authToken： token_v2。

2. **配置环境变量**

   ```bash
   NOTION_TOKEN=your_notion_token_here
   NOTION_ACTIVE_USER=your_user_id_here
   ```

### 🖼️ 设置背景图

**重要功能**：你可以为 Notion 数据库设置封面图片，它会自动同步为导航页的背景图！

#### 如何设置封面

1. **设置数据库封面**

   - 打开你的 Notion 数据库页面
   - 点击页面顶部的 "Add cover" 按钮
   - 选择 "Upload" 上传本地图片，或选择 "Unsplash" 搜索在线图片
   - 调整封面显示方式（居中、填充等）

2. **背景图优先级**

   - 🥇 **Notion 封面**：最高优先级，如果设置了封面则优先显示
   - 🥈 **Bing 每日图片**：当没有 Notion 封面时显示
   - 🥉 **本地图片**：当没有 Notion 封面和 Bing 图片时显示

### 数据库结构

数据库需要包含以下属性：

| 属性名称      | 类型         | 必需 | 说明                 |
| ------------- | ------------ | ---- | -------------------- |
| `title`       | Title        | ✅   | 菜单项标题           |
| `description` | Text         | ❌   | 菜单项描述           |
| `href`        | URL          | ✅   | 外网链接地址         |
| `lanHref`     | URL          | ❌   | 内网链接地址         |
| `avatar`      | URL          | ❌   | 图标/头像地址        |
| `roles`       | Multi-select | ❌   | 用户权限（guest 等） |
| `status`      | Select       | ❌   | 状态（显示/隐藏）    |
| `category`    | Select       | ❌   | 分类名称             |

### 图标优化

- **多级备选方案**：
  1. 🥇 **原始 Avatar**：优先显示 Notion 中设置的图标
  2. 🥈 **Favicon 备选**：当原始图标为空或加载失败时，自动使用 [favicon.im](https://favicon.im/) 服务获取网站图标
  3. 🥉 **文本图标**：当无法获取任何图标时，显示网站名称首字母
- **自动域名解析**：智能提取网站域名生成 favicon URL
- **错误处理**：优雅处理各种加载失败情况
- **性能优化**：懒加载和异步解码
