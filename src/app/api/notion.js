import { NotionAPI } from "notion-client";
import { getNotionAPIConfig } from "@/config/notion";
import { adapterNotionBlockMap } from "@/utils/notion-adapter";

const api = new NotionAPI(getNotionAPIConfig());

export default async function handler(req, res) {
  try {
    const { databaseId } = req.query;

    if (!databaseId) {
      return res.status(400).json({ error: "Database ID is required" });
    }

    // fetch database content
    let database = await api.getPage(databaseId);
    
    // 清理 Notion 数据结构，适配新版 API 返回格式
    database = adapterNotionBlockMap(database);

    // 解析数据库内容，提取菜单项
    const menuItems = parseDatabaseToMenuItems(database, databaseId);

    res.status(200).json({ menuItems });
  } catch (error) {
    console.error("Error fetching from Notion:", error);
    res.status(500).json({ error: "Failed to fetch data from Notion" });
  }
}

function parseDatabaseToMenuItems(database, databaseId) {
  const menuItems = [];

  // 遍历数据库的块
  for (const blockId of Object.keys(database.block)) {
    const block = database.block[blockId];

    // 检查是否是数据库项
    // 使用传入的 databaseId 作为 parent_id 的对比基准
    // 如果 database 本身有 id 属性（通常 recordMap 没有），也可以作为 fallback
    const targetId = databaseId || database.id;
    
    // 获取 collection ID（如果存在）
    // 通常 collection_view_page 的 items 的 parent_id 指向 collection ID
    const collectionId = database.collection ? Object.keys(database.collection)[0] : null;
    
    // 兼容 collection_view_page 的子页面
    // 允许 parent_id 匹配 databaseId 或 collectionId
    const isParentMatch = block.parent_id && (
      block.parent_id.replaceAll('-', '') === targetId.replaceAll('-', '') ||
      (collectionId && block.parent_id.replaceAll('-', '') === collectionId.replaceAll('-', ''))
    );

    if (block.type === "page" && isParentMatch) {
      const page = block; // block 已经被展平，直接作为 page 使用

      // 提取页面属性
      const title =
        page.properties?.title?.[0]?.[0] ||
        page.properties?.Name?.[0]?.[0] ||
        "Untitled";

      const description =
        page.properties?.Description?.[0]?.[0] ||
        page.properties?.description?.[0]?.[0] ||
        "";

      const href =
        page.properties?.URL?.[0]?.[0] ||
        page.properties?.url?.[0]?.[0] ||
        page.properties?.Link?.[0]?.[0] ||
        "";

      // 优先级：Icon属性 > Avatar属性 > 页面图标 > 空
      const avatar =
        page.properties?.Icon?.[0]?.[0] ||
        page.properties?.Avatar?.[0]?.[0] ||
        page.format?.page_icon ||
        "";

      const category =
        page.properties?.Category?.[0]?.[0] ||
        page.properties?.Type?.[0]?.[0] ||
        "other";

      const roles = page.properties?.Roles?.[0]?.[0]?.split(",") ||
        page.properties?.Access?.[0]?.[0]?.split(",") || ["guest"];

      const lanHref =
        page.properties?.LanURL?.[0]?.[0] ||
        page.properties?.lanHref?.[0]?.[0] ||
        "";

        const target =
        page.properties?.Target?.[0]?.[0] ||
        page.properties?.target?.[0]?.[0] ||
        "";

      // 获取最后编辑时间
      const lastEditedTime = page.last_edited_time || 0;

      if (title && href) {
        menuItems.push({
          id: blockId,
          title: title.trim(),
          description: description.trim(),
          href: href.trim(),
          lanHref: lanHref.trim() || undefined,
          target: target.trim() || undefined,
          avatar: avatar.trim() || undefined,
          roles: roles.map((role) => role.trim()),
          category: category.trim(),
          lastEditedTime: lastEditedTime, // 添加最后编辑时间
        });
      }
    }
  }

  return menuItems;
}
