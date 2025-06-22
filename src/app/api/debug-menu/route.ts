import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import { NOTION_CONFIG, NOTION_PROPERTY_MAPPING } from "@/config/notion";

const api = new NotionAPI();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId") || NOTION_CONFIG.DEFAULT_PAGE_ID;

    console.log("Debug: Fetching database with ID:", pageId);

    // fetch database content
    const database = await api.getPage(pageId);

    // 解析数据库内容，提取所有菜单项（包括隐藏的）
    const allItems = parseAllDatabaseItems(database);

    return NextResponse.json({
      allItems,
      totalCount: allItems.length,
      visibleCount: allItems.filter((item) => item.isVisible).length,
      hiddenCount: allItems.filter((item) => !item.isVisible).length,
    });
  } catch (error) {
    console.error("Error fetching from Notion:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Notion" },
      { status: 500 }
    );
  }
}

function parseAllDatabaseItems(database: any) {
  const allItems: any[] = [];

  if (!database.block) {
    console.log("No block data found in database");
    return allItems;
  }

  // 获取属性映射
  const propertyMapping = getPropertyMapping(database);
  console.log("Property mapping:", propertyMapping);

  // 遍历数据库的块
  for (const blockId of Object.keys(database.block)) {
    const block = database.block[blockId];

    // 检查是否是数据库项
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

      // 检查状态
      const isVisible =
        status === "显示" || status === "active" || status === "Active";

      if (title && href) {
        allItems.push({
          id: blockId,
          title: title.trim(),
          description: description.trim(),
          href: href.trim(),
          lanHref: lanHref.trim() || undefined,
          avatar: avatar.trim() || undefined,
          roles: roles.map((role: string) => role.trim()),
          category: category.trim(),
          status: status,
          isVisible: isVisible,
          rawStatus: status,
        });
      }
    }
  }

  return allItems;
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
