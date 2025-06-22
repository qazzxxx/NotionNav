import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import { NavMenuItem } from "@/types";
import { NOTION_CONFIG, NOTION_PROPERTY_MAPPING } from "@/config/notion";

const api = new NotionAPI();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId") || NOTION_CONFIG.DEFAULT_PAGE_ID;

    console.log("Fetching database with ID:", pageId);

    // fetch database content
    const database = await api.getPage(pageId);

    console.log("Database structure:");
    console.log("Database keys:", Object.keys(database));
    console.log("Database block keys:", Object.keys(database.block || {}));

    // 解析数据库内容，提取菜单项
    const menuItems = parseDatabaseToMenuItems(database);

    console.log("Parsed menu items:", menuItems);

    return NextResponse.json({ menuItems });
  } catch (error) {
    console.error("Error fetching from Notion:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Notion" },
      { status: 500 }
    );
  }
}

function parseDatabaseToMenuItems(database: any): NavMenuItem[] {
  const menuItems: NavMenuItem[] = [];

  if (!database.block) {
    console.log("No block data found in database");
    return menuItems;
  }

  // 获取属性映射
  const propertyMapping = getPropertyMapping(database);
  console.log("Property mapping:", propertyMapping);

  // 遍历数据库的块
  for (const blockId of Object.keys(database.block)) {
    const block = database.block[blockId];

    console.log(`\n--- Block ${blockId} ---`);
    console.log("Block structure:", Object.keys(block));
    console.log("Block value keys:", Object.keys(block.value || {}));
    console.log("Block value type:", block.value?.type);

    // 检查是否是数据库项
    if (block.value?.type === "page") {
      const page = block.value;

      console.log("Page properties keys:", Object.keys(page.properties || {}));
      console.log("Page properties:", page.properties);

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

      // 新增：status和category属性
      const status =
        getPropertyValueByMapping(page.properties, propertyMapping, "status") ||
        "active";
      const category =
        getPropertyValueByMapping(
          page.properties,
          propertyMapping,
          "category"
        ) || "其他";

      console.log("Extracted values:");
      console.log("- title:", title);
      console.log("- description:", description);
      console.log("- href:", href);
      console.log("- avatar:", avatar);
      console.log("- roles:", roles);
      console.log("- lanHref:", lanHref);
      console.log("- status:", status);
      console.log("- category:", category);

      // 检查状态，只显示状态为"显示"或"active"的菜单项
      const isActive =
        status === "显示" || status === "active" || status === "Active";

      if (title && href && isActive) {
        menuItems.push({
          id: blockId,
          title: title.trim(),
          description: description.trim(),
          href: href.trim(),
          lanHref: lanHref.trim() || undefined,
          avatar: avatar.trim() || undefined,
          roles: roles.map((role: string) => role.trim()),
          category: category.trim(), // 添加分类信息
        });
      } else {
        if (!isActive) {
          console.log("Skipping item - status is not active:", status);
        } else {
          console.log("Skipping item - missing title/href");
        }
      }
    } else {
      console.log("Skipping block - not a page type");
    }
  }

  return menuItems;
}

// 获取属性映射
function getPropertyMapping(database: any): Record<string, string> {
  const mapping: Record<string, string> = {};

  if (!database.collection) {
    console.log("No collection found");
    return mapping;
  }

  // 获取第一个collection
  const collectionId = Object.keys(database.collection)[0];
  const collection = database.collection[collectionId];

  if (!collection?.value?.schema) {
    console.log("No schema found in collection");
    return mapping;
  }

  const schema = collection.value.schema;
  console.log("Schema:", schema);

  // 遍历schema，创建属性映射
  for (const [propertyId, propertyInfo] of Object.entries(schema)) {
    const property = propertyInfo as any;
    const propertyName = property.name?.toLowerCase();

    if (propertyName) {
      mapping[propertyId] = propertyName;
      console.log(`Mapped ${propertyId} -> ${propertyName}`);
    }
  }

  return mapping;
}

// 通过映射获取属性值
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
        // 尝试不同的访问路径
        const value = property[0]?.[0] || property[0] || property;
        console.log(`Found ${targetProperty} (${propertyId}):`, value);
        return value;
      }
    }
  }

  // 如果没有找到映射，尝试直接访问
  for (const propertyName of NOTION_PROPERTY_MAPPING[
    targetProperty.toUpperCase() as keyof typeof NOTION_PROPERTY_MAPPING
  ] || []) {
    const property = properties[propertyName];
    if (property) {
      const value = property[0]?.[0] || property[0] || property;
      if (value) {
        console.log(`Found ${targetProperty} (${propertyName}):`, value);
        return value;
      }
    }
  }

  return undefined;
}
