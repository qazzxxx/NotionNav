# 环境变量配置

本文档说明如何配置 NNav 项目的环境变量。

## 必需环境变量

### NOTION_PAGE_ID

Notion Page ID，用于访问 Notion API。

**获取步骤：**

1. 访问 [Notion Developers](https://developers.notion.com/)
2. 点击 "New integration"
3. 填写集成信息：
   - Name: 你的集成名称（如 "NNav Integration"）
   - Associated workspace: 选择你的工作区
   - Capabilities: 选择 "Read content"
4. 点击 "Submit"
5. 复制 Integration Token

**示例：**

```
NOTION_PAGE_ID=secret_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### NOTION_DATABASE_ID

Notion 数据库 ID，用于指定要读取的数据库。

**获取步骤：**

1. 打开你的 Notion 数据库页面
2. 复制页面 URL
3. 从 URL 中提取数据库 ID

**URL 格式：**

```
https://notion.so/workspace/database-id?v=...
```

**示例：**

```
NOTION_DATABASE_ID=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

## 可选环境变量

### NODE_ENV

运行环境，默认为 `production`。

**可选值：**

- `development`: 开发环境
- `production`: 生产环境
- `test`: 测试环境

**示例：**

```
NODE_ENV=production
```

### NEXT_PUBLIC_BASE_URL

应用基础 URL，用于生成绝对链接。

**示例：**

```
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 配置文件

### 本地开发

创建 `.env.local` 文件：

```env
NOTION_PAGE_ID=your_page_id_here
NOTION_DATABASE_ID=your_database_id_here
NODE_ENV=development
```

### 生产部署

在 Vercel 等平台的环境变量设置中配置：

```env
NOTION_PAGE_ID=secret_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
NOTION_DATABASE_ID=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
NODE_ENV=production
```

## 安全注意事项

1. **不要提交敏感信息**

   - 确保 `.env.local` 在 `.gitignore` 中
   - 不要在代码中硬编码 Token

2. **定期轮换 Token**

   - 定期更新 Notion Integration Token
   - 及时撤销不再使用的 Token

3. **限制权限**

   - 只给集成必要的权限（Read content）
   - 不要给写权限除非需要

4. **环境隔离**
   - 开发和生产环境使用不同的 Token
   - 使用不同的数据库进行测试

## 验证配置

运行以下命令验证配置：

```bash
# 检查部署配置
npm run deploy-check

# 启动开发服务器
npm run dev

# 测试 API
curl http://localhost:3000/api/menu
```

## 故障排除

### 常见错误

1. **Invalid token**

   - 检查 Token 格式是否正确
   - 确认 Token 没有过期

2. **Database not found**

   - 检查数据库 ID 是否正确
   - 确认数据库已分享给集成

3. **Permission denied**
   - 确认集成有读取权限
   - 检查数据库共享设置

### 调试步骤

1. 检查环境变量是否正确设置
2. 验证 Notion 集成配置
3. 确认数据库权限设置
4. 查看应用日志
5. 使用测试页面验证功能
