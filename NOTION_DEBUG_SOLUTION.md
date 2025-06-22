# Notion API 问题分析与解决方案

## 问题描述

在集成 Notion 数据库时，发现只能获取到 `title` 属性，其他属性（如 `description`、`URL`、`avatar` 等）都无法获取。

## 问题原因

### 1. Notion API 数据结构特点

Notion API 返回的数据结构中，数据库的属性名称是加密的 ID，而不是我们在 Notion 界面中设置的属性名称。

例如：

```json
{
  "properties": {
    "title": [["Google"]],                    // 标题属性
    "Mz^>": [["guest,qazz"]],                // 角色属性（加密ID）
    "U__D": [["https://www.google.com/favicon.ico", ...]], // 头像属性（加密ID）
    "WAk[": [["https://www.google.com", ...]],            // URL属性（加密ID）
    "eu{\\": [["全球最大的搜索引擎"]]                      // 描述属性（加密ID）
  }
}
```

### 2. 原始解析逻辑的问题

原始代码试图直接使用属性名称来访问数据：

```typescript
const title = getPropertyValue(page.properties, NOTION_PROPERTY_MAPPING.TITLE);
const description = getPropertyValue(
  page.properties,
  NOTION_PROPERTY_MAPPING.DESCRIPTION
);
```

但 `NOTION_PROPERTY_MAPPING.TITLE` 包含的是 `['title', 'Name', 'name']`，而实际的属性名称是加密的 ID。

## 解决方案

### 1. 使用 Collection Schema 获取属性映射

Notion 数据库的 `collection` 对象包含 `schema`，其中存储了属性 ID 到属性名称的映射：

```typescript
function getPropertyMapping(database: any): Record<string, string> {
  const mapping: Record<string, string> = {};

  if (!database.collection) {
    return mapping;
  }

  // 获取第一个collection
  const collectionId = Object.keys(database.collection)[0];
  const collection = database.collection[collectionId];

  if (!collection?.value?.schema) {
    return mapping;
  }

  const schema = collection.value.schema;

  // 遍历schema，创建属性映射
  for (const [propertyId, propertyInfo] of Object.entries(schema)) {
    const property = propertyInfo as any;
    const propertyName = property.name?.toLowerCase();

    if (propertyName) {
      mapping[propertyId] = propertyName;
    }
  }

  return mapping;
}
```

### 2. 通过映射获取属性值

使用属性映射来正确获取属性值：

```typescript
function getPropertyValueByMapping(
  properties: any,
  propertyMapping: Record<string, string>,
  targetProperty: string
): string | undefined {
  if (!properties) {
    return undefined;
  }

  // 查找匹配的属性ID
  for (const [propertyId, propertyName] of Object.entries(propertyMapping)) {
    if (propertyName === targetProperty) {
      const property = properties[propertyId];
      if (property) {
        const value = property[0]?.[0] || property[0] || property;
        return value;
      }
    }
  }

  return undefined;
}
```

### 3. 更新解析逻辑

修改主解析函数使用新的映射方法：

```typescript
function parseDatabaseToMenuItems(database: any): NavMenuItem[] {
  const menuItems: NavMenuItem[] = [];

  // 获取属性映射
  const propertyMapping = getPropertyMapping(database);

  // 遍历数据库的块
  for (const blockId of Object.keys(database.block)) {
    const block = database.block[blockId];

    if (block.value?.type === "page") {
      const page = block.value;

      // 使用属性映射来提取数据
      const title =
        getPropertyValueByMapping(page.properties, propertyMapping, "title") ||
        "Untitled";
      const description =
        getPropertyValueByMapping(
          page.properties,
          propertyMapping,
          "description"
        ) || "";
      const href =
        getPropertyValueByMapping(page.properties, propertyMapping, "url") ||
        "";
      const avatar =
        getPropertyValueByMapping(page.properties, propertyMapping, "avatar") ||
        "";
      const roles = getPropertyValueByMapping(
        page.properties,
        propertyMapping,
        "roles"
      )?.split(",") || ["guest"];
      const lanHref =
        getPropertyValueByMapping(page.properties, propertyMapping, "lanurl") ||
        "";

      if (title && href) {
        menuItems.push({
          id: blockId,
          title: title.trim(),
          description: description.trim(),
          href: href.trim(),
          lanHref: lanHref.trim() || undefined,
          avatar: avatar.trim() || undefined,
          roles: roles.map((role: string) => role.trim()),
        });
      }
    }
  }

  return menuItems;
}
```

## 调试过程

### 1. 创建测试 API

创建了 `/api/test-notion` 端点来调试 Notion 数据结构：

```typescript
export async function GET(request: NextRequest) {
  const page = await api.getPage(databaseId);

  // 显示数据库结构
  console.log("Database keys:", Object.keys(page));
  console.log("Collection info:", page.collection);
  console.log("Block info:", page.block);

  // 显示详细的块信息
  for (const blockId of Object.keys(page.block)) {
    const block = page.block[blockId];
    console.log(`Block ${blockId}:`, block);
  }
}
```

### 2. 分析数据结构

通过调试发现：

- 数据库包含 `collection` 对象，其中包含属性映射
- 页面属性使用加密的 ID 而不是属性名称
- 需要从 `collection.schema` 获取属性映射

### 3. 验证解决方案

修改后的 API 成功返回完整的菜单项数据：

```json
{
  "menuItems": [
    {
      "id": "21a69253-5678-80c9-9554-d18028d0ee35",
      "title": "Google",
      "description": "全球最大的搜索引擎",
      "href": "https://www.google.com",
      "avatar": "https://www.google.com/favicon.ico",
      "roles": ["guest", "qazz"]
    }
  ]
}
```

## 关键要点

### 1. Notion API 特性

- 属性名称在 API 中是加密的 ID
- 需要通过 `collection.schema` 获取属性映射
- 属性值存储在嵌套数组中

### 2. 数据访问模式

```typescript
// 正确的访问方式
const value = property[0]?.[0] || property[0] || property;

// 错误的访问方式
const value = property; // 直接访问
```

### 3. 属性映射策略

- 优先使用 `collection.schema` 中的映射
- 备用使用配置的属性名称列表
- 支持多种属性名称变体

## 测试验证

### API 测试

```bash
curl -s http://localhost:3000/api/menu | jq .
```

### 前端测试

- 访问 `http://localhost:3000` 查看主页面
- 访问 `http://localhost:3000/test-notion` 查看测试页面

## 总结

通过分析 Notion API 的数据结构特点，发现属性名称使用加密 ID 的问题。通过使用 `collection.schema` 获取属性映射，成功解决了只能获取标题而无法获取其他属性的问题。

现在系统可以正确解析 Notion 数据库中的所有属性，包括标题、描述、链接、头像和权限设置。
