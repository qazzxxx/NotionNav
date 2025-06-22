# 部署指南

本文档提供详细的部署说明，帮助你快速将 NNav 部署到各种平台。

## 🚀 Vercel 部署（推荐）

### 一键部署

1. **点击部署按钮**

   在项目 README 中点击 "Deploy with Vercel" 按钮

2. **配置环境变量**

   在 Vercel 部署页面中配置以下环境变量：

   ```
   NOTION_PAGE_ID=your_page_id_here
   ```

3. **获取 Notion 配置**

   - 访问 [Notion Developers](https://developers.notion.com/)
   - 创建新的集成
   - 复制 Integration Token
   - 在数据库中分享权限给集成
   - 复制数据库 ID

4. **完成部署**

   点击 "Deploy" 按钮，等待部署完成

### 手动部署

1. **Fork 项目**

   在 GitHub 上 Fork 本项目

2. **导入到 Vercel**

   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库

3. **配置项目**

   - 项目名称：自定义
   - Framework Preset：Next.js
   - Root Directory：`./`
   - Build Command：`npm run build`
   - Output Directory：`.next`

4. **环境变量配置**

   在项目设置中添加：

   ```
   NOTION_PAGE_ID=your_page_id_here
   ```

5. **部署**

   点击 "Deploy" 完成部署

## 🌐 其他平台部署

### Netlify

1. **连接仓库**

   - 访问 [Netlify](https://netlify.com)
   - 点击 "New site from Git"
   - 选择 GitHub 并授权

2. **配置构建设置**

   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **环境变量**

   在 Site settings > Environment variables 中添加：

   ```
   NOTION_PAGE_ID=your_page_id_here
   ```

4. **部署**

   点击 "Deploy site" 完成部署

### Railway

1. **连接仓库**

   - 访问 [Railway](https://railway.app)
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"

2. **自动配置**

   Railway 会自动检测 Next.js 项目并配置

3. **环境变量**

   在 Variables 标签页中添加：

   ```
   NOTION_PAGE_ID=your_page_id_here
   ```

4. **部署**

   自动部署完成

### Docker 部署

1. **创建 Dockerfile**

   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .
   RUN npm run build

   EXPOSE 3000

   CMD ["npm", "start"]
   ```

2. **构建镜像**

   ```bash
   docker build -t nnav .
   ```

3. **运行容器**

   ```bash
   docker run -p 3000:3000 \
     -e NOTION_PAGE_ID=your_page_id_here \
     nnav
   ```

## 🔧 环境变量配置

### 必需环境变量

| 变量名           | 说明           | 获取方式            |
| ---------------- | -------------- | ------------------- |
| `NOTION_PAGE_ID` | Notion Page ID | 从数据库 URL 中提取 |

### 可选环境变量

| 变量名                 | 默认值       | 说明         |
| ---------------------- | ------------ | ------------ |
| `NODE_ENV`             | `production` | 运行环境     |
| `NEXT_PUBLIC_BASE_URL` | 自动检测     | 应用基础 URL |

### 获取 Notion 配置

1. **创建 Notion 集成**

   - 访问 [Notion Developers](https://developers.notion.com/)
   - 点击 "New integration"
   - 填写集成信息
   - 复制 Integration Token

2. **配置数据库权限**

   - 打开你的 Notion 数据库
   - 点击右上角 "Share" 按钮
   - 添加你的集成
   - 确保有 "Read content" 权限

3. **获取数据库 ID**

   - 复制数据库页面 URL
   - 格式：`https://notion.so/workspace/database-id?v=...`
   - 提取 `database-id` 部分

## 🔍 部署检查清单

### 部署前检查

- [ ] Notion 集成已创建
- [ ] 数据库已分享给集成
- [ ] 环境变量已配置
- [ ] 本地测试通过
- [ ] 代码已提交到 Git

### 部署后检查

- [ ] 网站可以正常访问
- [ ] 菜单数据正常加载
- [ ] 搜索功能正常
- [ ] 登录功能正常
- [ ] 收藏功能正常

## 🚨 常见问题

### 部署失败

1. **构建错误**

   - 检查 Node.js 版本（需要 18+）
   - 确认所有依赖已安装
   - 查看构建日志

2. **环境变量错误**

   - 确认环境变量名称正确
   - 检查 Notion Token 格式
   - 验证数据库 ID 正确

3. **API 错误**

   - 确认 Notion 集成权限
   - 检查数据库共享设置
   - 验证 API 调用限制

### 性能优化

1. **Vercel 优化**

   - 启用 Vercel Analytics
   - 配置 CDN 缓存
   - 使用 Edge Functions

2. **Notion API 优化**

   - 合理设置缓存时间
   - 避免频繁 API 调用
   - 使用错误重试机制

## 📞 技术支持

如果遇到部署问题，可以：

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 检查 [Next.js 文档](https://nextjs.org/docs)
3. 查看 [Notion API 文档](https://developers.notion.com/)
4. 提交 GitHub Issue

## 🔄 更新部署

### 自动更新

- Vercel 会自动监听 Git 仓库变化
- 推送代码到主分支会自动触发重新部署

### 手动更新

1. 在 Vercel Dashboard 中点击 "Redeploy"
2. 或在本地推送新代码到 Git 仓库

### 回滚部署

1. 在 Vercel Dashboard 中查看部署历史
2. 点击之前的部署版本
3. 选择 "Promote to Production"
