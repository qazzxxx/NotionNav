import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import { NOTION_CONFIG, NOTION_PROPERTY_MAPPING } from "@/config/notion";
import {
  NotionDatabase,
  NotionPropertyValue,
  NotionPropertyMapping,
  DatabaseMetadata,
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

    // 提取数据库元数据（包括封面）
    const databaseMetadata = extractDatabaseMetadata(database);

    console.log("Debug: All database items:", allItems);
    console.log("Debug: Database metadata:", databaseMetadata);

    return NextResponse.json({
      success: true,
      databaseInfo: {
        totalBlocks: Object.keys(database.block || {}).length,
        totalItems: allItems.length,
        items: allItems,
        metadata: databaseMetadata,
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

// 提取数据库元数据（标题、图标和封面）
function extractDatabaseMetadata(database: NotionDatabase): DatabaseMetadata {
  const metadata: DatabaseMetadata = {
    title: "导航页",
    icon: "",
    cover: "",
  };

  if (!database.block) {
    console.log("No block data found for metadata extraction");
    return metadata;
  }

  console.log("Extracting database metadata...");
  console.log("Database block keys:", Object.keys(database.block));

  // 查找数据库页面本身
  for (const blockId of Object.keys(database.block)) {
    const block = database.block[blockId];

    console.log(`Checking block ${blockId}:`, block.value?.type);

    // 检查是否是数据库页面
    if (
      block.value?.type === "collection_view_page" ||
      block.value?.type === "page"
    ) {
      const page = block.value;

      console.log("Found database page:", page);
      console.log("Page properties:", page.properties);
      console.log("Page format:", page.format);

      // 尝试获取页面标题
      if (page.properties?.title) {
        const titleValue = page.properties.title[0]?.[0];
        if (titleValue && typeof titleValue === "string") {
          metadata.title = titleValue;
          console.log("Found title:", titleValue);
        }
      }

      // 尝试获取页面图标
      if (page.format?.page_icon) {
        metadata.icon = page.format.page_icon;
        console.log("Found icon:", page.format.page_icon);
      }

      // 如果没有找到图标，尝试从其他位置获取
      if (!metadata.icon && page.format?.icon) {
        metadata.icon = page.format.icon;
        console.log("Found icon from format.icon:", page.format.icon);
      }

      // 尝试获取页面封面
      if (page.format?.page_cover) {
        metadata.cover = page.format.page_cover;
        console.log("Found cover:", page.format.page_cover);
      }

      // 尝试获取社交媒体预览图片作为封面
      if (!metadata.cover && page.format?.social_media_image_preview_url) {
        const previewUrl = page.format.social_media_image_preview_url;
        console.log("Found social media preview URL:", previewUrl);

        // 从signed_urls中获取实际的图片URL
        if (database.signed_urls && previewUrl.startsWith("attachment:")) {
          const attachmentId = previewUrl.split(":")[1].split(":")[0];
          console.log("Looking for attachment ID:", attachmentId);

          for (const [urlId, urlData] of Object.entries(database.signed_urls)) {
            if (urlId.includes(attachmentId) && typeof urlData === "string") {
              metadata.cover = urlData;
              console.log("Found cover from signed_urls:", urlData);
              break;
            }
          }
        } else {
          metadata.cover = previewUrl;
          console.log("Using social media preview URL as cover:", previewUrl);
        }
      }

      // 尝试从signed_urls获取封面
      if (!metadata.cover && database.signed_urls) {
        console.log("Checking signed_urls for cover...");
        console.log("Signed URLs:", database.signed_urls);

        // 遍历signed_urls查找封面
        for (const [urlId, urlData] of Object.entries(database.signed_urls)) {
          console.log(`Checking signed URL ${urlId}:`, urlData);
          if (typeof urlData === "string" && urlData.includes("cover")) {
            metadata.cover = urlData;
            console.log("Found cover from signed_urls:", urlData);
            break;
          }
        }
      }

      break;
    }
  }

  // 如果没有找到数据库页面，尝试从collection中获取信息
  if (metadata.title === "导航页" && database.collection) {
    console.log("Trying to get metadata from collection...");
    const collectionId = Object.keys(database.collection)[0];
    const collection = database.collection[collectionId];

    if (collection?.value?.name) {
      // Notion collection name is usually [["xxx"]], flatten it
      const nameArr = collection.value.name;
      if (Array.isArray(nameArr) && Array.isArray(nameArr[0])) {
        const titleValue = nameArr[0][0];
        if (typeof titleValue === "string") {
          metadata.title = titleValue;
          console.log("Found title from collection:", metadata.title);
        }
      } else if (typeof nameArr === "string") {
        metadata.title = nameArr;
        console.log("Found title from collection (string):", metadata.title);
      }
    }
    // 新增：尝试从 collection 的 format.icon 读取图标
    if (collection?.value) {
      console.log("collection.value:", collection.value);
      console.log("collection.value.format:", collection.value.format);
      if (collection.value.format?.icon) {
        metadata.icon = collection.value.format.icon;
        console.log("Found icon from collection.format.icon:", metadata.icon);
      }
      // 新增：尝试从 collection 的 format.page_cover 读取封面
      if (collection.value.format?.page_cover) {
        metadata.cover = collection.value.format.page_cover;
        console.log(
          "Found cover from collection.format.page_cover:",
          metadata.cover
        );
      }
    }
  }

  // 如果还没有找到封面，尝试从其他位置搜索
  if (!metadata.cover) {
    console.log("Searching for cover in other locations...");

    // 搜索所有block中的封面信息
    for (const blockId of Object.keys(database.block)) {
      const block = database.block[blockId];
      if (block.value?.format?.page_cover) {
        metadata.cover = block.value.format.page_cover;
        console.log("Found cover in block:", blockId, metadata.cover);
        break;
      }
      // 搜索社交媒体预览图片
      if (block.value?.format?.social_media_image_preview_url) {
        const previewUrl = block.value.format.social_media_image_preview_url;
        console.log(
          "Found social media preview in block:",
          blockId,
          previewUrl
        );

        // 从signed_urls中获取实际的图片URL
        if (database.signed_urls && previewUrl.startsWith("attachment:")) {
          const attachmentId = previewUrl.split(":")[1].split(":")[0];
          console.log("Looking for attachment ID:", attachmentId);

          for (const [urlId, urlData] of Object.entries(database.signed_urls)) {
            if (urlId.includes(attachmentId) && typeof urlData === "string") {
              metadata.cover = urlData;
              console.log("Found cover from signed_urls:", urlData);
              break;
            }
          }
        } else {
          metadata.cover = previewUrl;
          console.log("Using social media preview URL as cover:", previewUrl);
        }
        break;
      }
    }
  }

  console.log("Final metadata:", metadata);
  return metadata;
}
