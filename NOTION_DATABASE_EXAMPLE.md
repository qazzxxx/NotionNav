# Notion 数据库示例结构

## 数据库结构示例

以下是一个完整的 Notion 数据库结构示例，你可以参考这个结构来创建你的菜单数据库：

### 数据库属性配置

| 属性名      | 类型 | 示例值                               | 说明             |
| ----------- | ---- | ------------------------------------ | ---------------- |
| title       | Text | "Google"                             | 菜单项标题       |
| URL         | URL  | "https://www.google.com"             | 外部链接         |
| Description | Text | "全球最大的搜索引擎"                 | 菜单项描述       |
| Avatar      | URL  | "https://www.google.com/favicon.ico" | 图标 URL         |
| Roles       | Text | "guest,qazz"                         | 访问权限         |
| LanURL      | URL  | "http://192.168.1.100:8080"          | 内网链接（可选） |

### 示例数据行

#### 行 1：Google 搜索

```
title: "Google"
URL: "https://www.google.com"
Description: "全球最大的搜索引擎"
Avatar: "https://www.google.com/favicon.ico"
Roles: "guest,qazz"
```

#### 行 2：GitHub

```
title: "GitHub"
URL: "https://github.com"
Description: "代码托管平台"
Avatar: "https://github.com/favicon.ico"
Roles: "guest,qazz"
```

#### 行 3：内网工具（仅管理员可见）

```
title: "内网管理"
URL: "https://admin.example.com"
LanURL: "http://192.168.1.100:8080"
Description: "内网管理工具"
Avatar: "https://admin.example.com/favicon.ico"
Roles: "qazz"
```

#### 行 4：访客工具

```
title: "公共工具"
URL: "https://tools.example.com"
Description: "公共访问工具"
Avatar: "https://tools.example.com/favicon.ico"
Roles: "guest"
```

## 数据库设置步骤

### 1. 创建新数据库

1. 在 Notion 中点击 `+ New` 按钮
2. 选择 `Table` 或 `Database`
3. 命名为 "导航菜单" 或类似名称

### 2. 添加属性列

1. 点击 `+` 按钮添加新列
2. 按照上表配置每个属性列
3. 确保属性类型正确（Text、URL 等）

### 3. 设置数据库权限

1. 点击右上角的 `Share` 按钮
2. 选择 `Public` 或设置适当的访问权限
3. 确保 API 可以访问数据库

### 4. 获取数据库 ID

1. 复制数据库页面的 URL
2. 提取数据库 ID 部分
3. 更新 `src/config/notion.ts` 中的配置

## 属性类型说明

### Text 类型属性

- `title`: 菜单项显示名称
- `Description`: 菜单项描述
- `Roles`: 访问权限列表（逗号分隔）

### URL 类型属性

- `URL`: 外部访问链接
- `Avatar`: 图标图片链接
- `LanURL`: 内网访问链接

## 权限配置

### 角色定义

- `guest`: 访客用户，可以访问公开内容
- `qazz`: 管理员用户，可以访问所有内容
- 可以添加自定义角色

### 权限示例

- `"guest"`: 仅访客可见
- `"qazz"`: 仅管理员可见
- `"guest,qazz"`: 所有用户可见
- `"admin,manager"`: 自定义角色可见

## 测试数据

你可以先添加一些测试数据来验证功能：

```
title: "测试链接1"
URL: "https://www.baidu.com"
Description: "百度搜索"
Avatar: "https://www.baidu.com/favicon.ico"
Roles: "guest,qazz"

title: "测试链接2"
URL: "https://www.bing.com"
Description: "必应搜索"
Avatar: "https://www.bing.com/favicon.ico"
Roles: "guest,qazz"
```

添加测试数据后，访问 `http://localhost:3000/api/menu` 应该能看到返回的数据。
