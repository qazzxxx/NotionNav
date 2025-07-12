import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import {
  NOTION_CONFIG,
  NOTION_PROPERTY_MAPPING,
  getNotionAPIConfig,
} from "@/config/notion";
import {
  NotionDatabase,
  NotionPropertyValue,
  NotionPropertyMapping,
} from "@/types";

const api = new NotionAPI(getNotionAPIConfig());

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // 获取数据库中的所有角色
    const database = (await api.getPage(
      NOTION_CONFIG.DEFAULT_PAGE_ID
    )) as NotionDatabase;
    const allRoles = getAllRolesFromDatabase(database);

    // 验证密码是否匹配任何角色
    if (allRoles.includes(password)) {
      return NextResponse.json({
        success: true,
        role: password,
        message: "Authentication successful",
      });
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

function getAllRolesFromDatabase(database: NotionDatabase): string[] {
  const roles: string[] = [];

  if (!database.block) {
    console.log("No block data found in database");
    return roles;
  }

  // 获取属性映射
  const propertyMapping = getPropertyMapping(database);

  // 遍历数据库的块
  for (const blockId of Object.keys(database.block)) {
    const block = database.block[blockId];

    // 检查是否是数据库项
    if (block.value?.type === "page") {
      const page = block.value;

      // 获取角色属性
      const rolesValue = getPropertyValueByMapping(
        page.properties,
        propertyMapping,
        "roles"
      );

      if (rolesValue) {
        // 分割角色字符串并添加到列表中
        const pageRoles = rolesValue
          .split(",")
          .map((role: string) => role.trim());
        roles.push(...pageRoles);
      }
    }
  }

  // 去重并返回
  return [...new Set(roles)];
}

// 获取属性映射
function getPropertyMapping(database: NotionDatabase): NotionPropertyMapping {
  const mapping: NotionPropertyMapping = {};

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
