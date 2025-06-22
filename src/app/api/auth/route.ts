import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import { NOTION_CONFIG } from "@/config/notion";

const api = new NotionAPI();

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "密码不能为空" }, { status: 400 });
    }

    const pageId = process.env.NOTION_PAGE_ID || NOTION_CONFIG.DEFAULT_PAGE_ID;

    if (!pageId) {
      return NextResponse.json({ error: "页面ID未配置" }, { status: 500 });
    }

    // 获取数据库内容
    const database = await api.getPage(pageId);

    // 提取所有角色
    const allRoles = new Set<string>();

    if (database.block) {
      // 获取属性映射
      const propertyMapping = getPropertyMapping(database);

      // 遍历数据库的块
      for (const blockId of Object.keys(database.block)) {
        const block = database.block[blockId];

        // 检查是否是数据库项
        if (block.value?.type === "page") {
          const page = block.value;

          // 获取roles属性
          const rolesValue = getPropertyValueByMapping(
            page.properties,
            propertyMapping,
            "roles"
          );

          if (rolesValue) {
            const roles = rolesValue
              .split(",")
              .map((role: string) => role.trim());
            roles.forEach((role) => allRoles.add(role));
          }
        }
      }
    }

    // 检查密码是否匹配任何角色
    const isValidRole = Array.from(allRoles).some(
      (role) => role.toLowerCase() === password.toLowerCase()
    );

    if (isValidRole) {
      return NextResponse.json({
        success: true,
        role: password.toLowerCase(),
        message: "登录成功",
        availableRoles: Array.from(allRoles),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "密码错误",
          availableRoles: Array.from(allRoles),
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("登录验证错误:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 获取属性映射
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
        return value;
      }
    }
  }

  return undefined;
}
