import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import { NOTION_CONFIG, NOTION_PROPERTY_MAPPING } from "@/config/notion";
import {
  NotionDatabase,
  NotionPropertyValue,
  NotionPropertyMapping,
} from "@/types";

const api = new NotionAPI();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId") || NOTION_CONFIG.DEFAULT_PAGE_ID;

    console.log("Debug: Fetching database with ID:", pageId);

    // fetch database content
    const database = (await api.getPage(pageId)) as NotionDatabase;

    console.log("Debug: Database structure:");
    console.log("Database keys:", Object.keys(database));
    console.log("Database block keys:", Object.keys(database.block || {}));

    // 解析所有数据库项
    const allItems = parseAllDatabaseItems(database);

    console.log("Debug: All database items:", allItems);

    return NextResponse.json({
      success: true,
      databaseInfo: {
        totalBlocks: Object.keys(database.block || {}).length,
        totalItems: allItems.length,
        items: allItems,
      },
    });
  } catch (error) {
    console.error("Debug: Error fetching from Notion:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Notion" },
      { status: 500 }
    );
  }
}

interface DatabaseItem {
  id: string;
  type: string;
  properties: Record<string, unknown>;
  rawData: unknown;
}

function parseAllDatabaseItems(database: NotionDatabase): DatabaseItem[] {
  const allItems: DatabaseItem[] = [];

  if (!database.block) {
    console.log("Debug: No block data found in database");
    return allItems;
  }

  // 获取属性映射
  const propertyMapping = getPropertyMapping(database);
  console.log("Debug: Property mapping:", propertyMapping);

  // 遍历数据库的块
  for (const blockId of Object.keys(database.block)) {
    const block = database.block[blockId];

    console.log(`\n--- Debug Block ${blockId} ---`);
    console.log("Block structure:", Object.keys(block));
    console.log("Block value keys:", Object.keys(block.value || {}));
    console.log("Block value type:", block.value?.type);

    // 记录所有块，不仅仅是页面
    const item: DatabaseItem = {
      id: blockId,
      type: block.value?.type || "unknown",
      properties: block.value?.properties || {},
      rawData: block,
    };

    allItems.push(item);

    // 如果是页面类型，额外解析属性
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
      const status =
        getPropertyValueByMapping(page.properties, propertyMapping, "status") ||
        "active";
      const category =
        getPropertyValueByMapping(
          page.properties,
          propertyMapping,
          "category"
        ) || "其他";

      console.log("Debug: Extracted values:");
      console.log("- title:", title);
      console.log("- description:", description);
      console.log("- href:", href);
      console.log("- avatar:", avatar);
      console.log("- roles:", roles);
      console.log("- lanHref:", lanHref);
      console.log("- status:", status);
      console.log("- category:", category);
    }
  }

  return allItems;
}

// 获取属性映射
function getPropertyMapping(database: NotionDatabase): NotionPropertyMapping {
  const mapping: NotionPropertyMapping = {};

  if (!database.collection) {
    console.log("Debug: No collection found");
    return mapping;
  }

  // 获取第一个collection
  const collectionId = Object.keys(database.collection)[0];
  const collection = database.collection[collectionId];

  if (!collection?.value?.schema) {
    console.log("Debug: No schema found in collection");
    return mapping;
  }

  const schema = collection.value.schema;
  console.log("Debug: Schema:", schema);

  // 遍历schema，创建属性映射
  for (const [propertyId, propertyInfo] of Object.entries(schema)) {
    const property = propertyInfo;
    const propertyName = property.name?.toLowerCase();

    if (propertyName) {
      mapping[propertyId] = propertyName;
      console.log(`Debug: Mapped ${propertyId} -> ${propertyName}`);
    }
  }

  return mapping;
}

// 通过映射获取属性值
function getPropertyValueByMapping(
  properties: Record<string, NotionPropertyValue[]> | undefined,
  propertyMapping: NotionPropertyMapping,
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
        console.log(`Debug: Found ${targetProperty} (${propertyId}):`, value);
        return typeof value === "string" ? value : undefined;
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
      if (value && typeof value === "string") {
        console.log(`Debug: Found ${targetProperty} (${propertyName}):`, value);
        return value;
      }
    }
  }

  return undefined;
}
