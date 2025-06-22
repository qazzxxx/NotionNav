# Notion 数据库设置指南

## 概述

本项目使用 Notion 数据库作为菜单数据源，支持动态菜单管理、权限控制、分类分组和搜索功能。

## 数据库设置

### 1. 创建数据库

1. 在 Notion 中创建一个新的数据库
2. 确保数据库类型为 "Table" 或 "Board"
3. 记录数据库的页面 ID（URL 中的最后一段）

### 2. 配置数据库属性

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

### 3. 属性详细说明

#### title (标题)

- **类型**: Title
- **必需**: 是
- **说明**: 菜单项显示的名称
- **示例**: "GitHub", "Google", "百度"

#### description (描述)

- **类型**: Text
- **必需**: 否
- **说明**: 菜单项的详细描述，用于搜索和显示
- **示例**: "全球最大的代码托管平台"

#### href (外网链接)

- **类型**: URL
- **必需**: 是
- **说明**: 外网环境下的访问地址
- **示例**: "https://github.com"

#### lanHref (内网链接)

- **类型**: URL
- **必需**: 否
- **说明**: 内网环境下的访问地址，优先级高于 href
- **示例**: "http://github.internal.com"

#### avatar (图标)

- **类型**: URL
- **必需**: 否
- **说明**: 菜单项的图标地址
- **示例**: "https://github.com/favicon.ico"

#### roles (权限)

- **类型**: Multi-select
- **必需**: 否
- **说明**: 控制哪些用户角色可以访问此菜单项
- **选项**:
  - `guest`: 访客权限
  - `qazz`: 特定用户权限
  - 可自定义其他权限

#### status (状态)

- **类型**: Select
- **必需**: 否
- **说明**: 控制菜单项的显示状态
- **选项**:
  - `显示` 或 `active`: 显示菜单项
  - `隐藏` 或 `hidden`: 隐藏菜单项

#### category (分类)

- **类型**: Select
- **必需**: 否
- **说明**: 菜单项的分类，用于分组显示
- **示例**: "开发工具", "新闻资讯", "娱乐"

## 环境配置

### 1. 获取 Notion API 密钥

1. 访问 [Notion Developers](https://developers.notion.com/)
2. 创建新的集成
3. 复制 Integration Token

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
NOTION_TOKEN=your_integration_token_here
NOTION_DATABASE_ID=your_database_id_here
```

### 3. 共享数据库

1. 在 Notion 数据库页面点击 "Share"
2. 添加你的集成到数据库
3. 确保集成有 "Read content" 权限

## 功能特性

### 1. 动态菜单管理

- 通过 Notion 数据库实时管理菜单项
- 支持添加、修改、删除菜单项
- 无需重新部署应用

### 2. 权限控制

- 基于用户角色控制菜单项访问
- 支持多角色权限配置
- 灵活的权限管理

### 3. 分类分组

- 按分类自动分组显示菜单项
- 支持自定义分类名称
- 清晰的视觉层次

### 4. 搜索功能

- 支持菜单项标题和描述搜索
- 实时搜索建议
- 键盘导航支持（上下箭头、回车、ESC）
- 点击外部自动关闭建议
- 支持直接打开匹配的菜单项

### 5. 内网/外网切换

- 自动根据环境切换链接
- 支持内网专用地址
- 无缝的用户体验

## 使用示例

### 添加新菜单项

1. 在 Notion 数据库中添加新行
2. 填写必要信息：

   - **Title**: "Stack Overflow"
   - **Description**: "程序员问答社区"
   - **URL**: "https://stackoverflow.com"
   - **Avatar**: "https://stackoverflow.com/favicon.ico"
   - **Roles**: 选择 "guest"
   - **Status**: 选择 "显示"
   - **Category**: 选择 "开发工具"

3. 保存后，菜单项将自动出现在应用中

### 搜索功能使用

1. 在搜索框中输入关键词（如 "GitHub"）
2. 系统会显示匹配的菜单项建议
3. 使用键盘导航或鼠标点击选择
4. 直接回车打开匹配的菜单项

## 测试

访问 `/test-search` 页面可以测试搜索功能：

- 切换用户角色测试权限控制
- 切换内网模式测试链接切换
- 输入关键词测试搜索建议
- 查看所有菜单项数据

## 故障排除

### 常见问题

1. **菜单项不显示**

   - 检查 status 字段是否为 "显示" 或 "active"
   - 确认用户角色权限配置
   - 验证数据库共享设置

2. **搜索无结果**

   - 确认菜单项有 title 或 description
   - 检查用户角色权限
   - 验证搜索关键词拼写

3. **API 错误**
   - 检查环境变量配置
   - 确认 Notion Token 有效
   - 验证数据库 ID 正确

### 调试工具

- 访问 `/api/menu` 查看原始 API 响应
- 访问 `/test-notion` 查看数据库连接状态
- 查看浏览器控制台获取详细错误信息

## 高级配置

### 使用多个数据库

如果需要使用多个数据库，可以在配置文件中添加：

```typescript
export const NOTION_CONFIG = {
  DATABASES: {
    MENU: "menu-database-id",
    NEWS: "news-database-id",
    TOOLS: "tools-database-id",
  },
};
```

然后在 Hook 中指定数据库 ID：

```typescript
const { menuItems } = useNotionMenu(NOTION_CONFIG.DATABASES.MENU);
```

### 自定义属性映射

可以在 `src/config/notion.ts` 中添加自定义属性映射：

```typescript
export const NOTION_PROPERTY_MAPPING = {
  // 添加自定义属性
  CUSTOM_PROPERTY: ["CustomProp", "custom_prop"],
};
```
