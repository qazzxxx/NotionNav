import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import {
  NavMenuItem,
  NotionDatabase,
  NotionPropertyValue,
  NotionPropertyMapping,
  DatabaseMetadata,
} from "@/types";
import {
  NOTION_CONFIG,
  NOTION_PROPERTY_MAPPING,
  getNotionAPIConfig,
} from "@/config/notion";

const api = new NotionAPI(getNotionAPIConfig());

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId") || NOTION_CONFIG.DEFAULT_PAGE_ID;

    // fetch database content
    const database = (await api.getPage(pageId)) as NotionDatabase;

    // 解析数据库内容，提取菜单项
    const menuItems = parseDatabaseToMenuItems(database);

    // 提取数据库元数据（标题和图标）
    const databaseMetadata = extractDatabaseMetadata(database);

    // 提取 category 顺序
    const categoryOrder = extractCategoryOrder(database);

    return NextResponse.json({
      menuItems,
      databaseMetadata,
      categoryOrder,
    });
  } catch (error) {
    console.error("Error fetching from Notion:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Notion" },
      { status: 500 }
    );
  }
}

function parseDatabaseToMenuItems(database: NotionDatabase): NavMenuItem[] {
  const menuItems: NavMenuItem[] = [];

  if (!database.block) {
    return menuItems;
  }

  // 获取属性映射
  const propertyMapping = getPropertyMapping(database);

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
      // 优先级：Icon属性 > Avatar属性 > 页面图标 > 空
      let avatar =
        getPropertyValueByMapping(page.properties, propertyMapping, "avatar") ||
        "";

      // 如果没有从属性字段获取到avatar，尝试从页面图标获取
      if (!avatar && page.format?.page_icon) {
        avatar = page.format.page_icon;
      }

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

      // 获取最后编辑时间
      const lastEditedTime = page.last_edited_time || 0;

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
          lastEditedTime: lastEditedTime, // 添加最后编辑时间
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
function getPropertyMapping(database: NotionDatabase): NotionPropertyMapping {
  const mapping: NotionPropertyMapping = {};

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
    const property = propertyInfo;
    const propertyName = property.name?.toLowerCase();

    if (propertyName) {
      mapping[propertyId] = propertyName;
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
        return value;
      }
    }
  }

  return undefined;
}

// 提取数据库元数据（标题和图标）
function extractDatabaseMetadata(database: NotionDatabase): DatabaseMetadata {
  const metadata: DatabaseMetadata = {
    title: "导航页",
    icon: "",
    cover: "", // 添加封面字段
  };

  if (!database.block) {
    return metadata;
  }

  // 查找数据库页面本身
  for (const blockId of Object.keys(database.block)) {
    const block = database.block[blockId];

    // 检查是否是数据库页面
    if (
      block.value?.type === "collection_view_page" ||
      block.value?.type === "page"
    ) {
      const page = block.value;

      // 尝试获取页面标题
      if (page.properties?.title) {
        const titleValue = page.properties.title[0]?.[0];
        if (titleValue && typeof titleValue === "string") {
          metadata.title = titleValue;
        }
      }

      // 尝试获取页面图标
      if (page.format?.page_icon) {
        metadata.icon = page.format.page_icon;
      }

      // 如果没有找到图标，尝试从其他位置获取
      if (!metadata.icon && page.format?.icon) {
        metadata.icon = page.format.icon;
      }

      // 尝试获取页面封面
      if (page.format?.page_cover) {
        metadata.cover = page.format.page_cover;
      }

      // 尝试获取社交媒体预览图片作为封面
      if (!metadata.cover && page.format?.social_media_image_preview_url) {
        const previewUrl = page.format.social_media_image_preview_url;

        // 从signed_urls中获取实际的图片URL
        if (database.signed_urls && previewUrl.startsWith("attachment:")) {
          const attachmentId = previewUrl.split(":")[1].split(":")[0];

          for (const [urlId, urlData] of Object.entries(database.signed_urls)) {
            if (urlId.includes(attachmentId) && typeof urlData === "string") {
              metadata.cover = urlData;
              break;
            }
          }
        } else {
          metadata.cover = previewUrl;
        }
      }

      // 尝试从signed_urls获取封面
      if (!metadata.cover && database.signed_urls) {
        // 遍历signed_urls查找封面
        for (const [urlId, urlData] of Object.entries(database.signed_urls)) {
          if (typeof urlData === "string" && urlData.includes("cover")) {
            metadata.cover = urlData;
            break;
          }
        }
      }

      break;
    }
  }

  // 如果没有找到数据库页面，尝试从collection中获取信息
  if (metadata.title === "导航页" && database.collection) {
    const collectionId = Object.keys(database.collection)[0];
    const collection = database.collection[collectionId];

    if (collection?.value?.name) {
      // Notion collection name is usually [["xxx"]], flatten it
      const nameArr = collection.value.name;
      if (Array.isArray(nameArr) && Array.isArray(nameArr[0])) {
        const titleValue = nameArr[0][0];
        if (typeof titleValue === "string") {
          metadata.title = titleValue;
        }
      } else if (typeof nameArr === "string") {
        metadata.title = nameArr;
      }
    }
    // 新增：尝试从 collection 的 format.icon 读取图标
    if (collection?.value) {
      if (collection.value.format?.icon) {
        metadata.icon = collection.value.format.icon;
      }
      // 新增：尝试从 collection 的 format.page_cover 读取封面
      if (collection.value.format?.page_cover) {
        metadata.cover = collection.value.format.page_cover;
      }
    }
  }

  // 如果还没有找到封面，尝试从其他位置搜索
  if (!metadata.cover && database.block) {
    // 搜索所有block中的封面信息
    for (const blockId of Object.keys(database.block)) {
      const block = database.block[blockId];
      if (block.value?.format?.page_cover) {
        metadata.cover = block.value.format.page_cover;
        break;
      }
      // 搜索社交媒体预览图片
      if (block.value?.format?.social_media_image_preview_url) {
        const previewUrl = block.value.format.social_media_image_preview_url;

        // 从signed_urls中获取实际的图片URL
        if (database.signed_urls && previewUrl.startsWith("attachment:")) {
          const attachmentId = previewUrl.split(":")[1].split(":")[0];

          for (const [urlId, urlData] of Object.entries(database.signed_urls)) {
            if (urlId.includes(attachmentId) && typeof urlData === "string") {
              metadata.cover = urlData;
              break;
            }
          }
        } else {
          metadata.cover = previewUrl;
        }
        break;
      }
    }
  }

  // 如果还没有找到封面，尝试从 collection.value.cover 读取
  if (!metadata.cover && database.collection) {
    const collectionId = Object.keys(database.collection)[0];
    const collection = database.collection[collectionId];
    if (collection?.value?.cover) {
      metadata.cover = collection.value.cover;
    }
  }

  // 如果cover是以/开头的相对路径，加上Notion前缀
  if (metadata.cover && metadata.cover.startsWith("/")) {
    metadata.cover = "https://www.notion.so" + metadata.cover;
  }

  return metadata;
}

// 新增：提取 category 顺序
function extractCategoryOrder(database: NotionDatabase): string[] {
  if (!database.collection) return [];
  const collectionId = Object.keys(database.collection)[0];
  const collection = database.collection[collectionId];
  if (!collection?.value?.schema) return [];
  const schema = collection.value.schema;
  // 找到 category 属性
  for (const property of Object.values(schema)) {
    if (
      property.name?.toLowerCase() === "category" &&
      property.type === "select" &&
      Array.isArray(property.options)
    ) {
      // 兼容 name、value、text 字段
      return property.options.map(
        (opt) => opt.name || opt.value || opt.text || ""
      );
    }
  }
  return [];
}
