import { NotionAPI } from "notion-client";

const notionToken = process.env.NOTION_TOKEN;
const api = new NotionAPI(notionToken ? { authToken: notionToken } : undefined);

export default async function handler(req, res) {
  try {
    const { databaseId } = req.query;

    if (!databaseId) {
      return res.status(400).json({ error: "Database ID is required" });
    }

    // fetch database content
    const database = await api.getPage(databaseId);

    // 解析数据库内容，提取菜单项
    const menuItems = parseDatabaseToMenuItems(database);

    res.status(200).json({ menuItems });
  } catch (error) {
    console.error("Error fetching from Notion:", error);
    res.status(500).json({ error: "Failed to fetch data from Notion" });
  }
}

function parseDatabaseToMenuItems(database) {
  const menuItems = [];

  // 遍历数据库的块
  for (const blockId of Object.keys(database.block)) {
    const block = database.block[blockId];

    // 检查是否是数据库项
    if (block.type === "page" && block.parent_id === database.id) {
      const page = database.block[blockId];

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

      const avatar =
        page.properties?.Avatar?.[0]?.[0] ||
        page.properties?.Icon?.[0]?.[0] ||
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

      if (title && href) {
        menuItems.push({
          id: blockId,
          title: title.trim(),
          description: description.trim(),
          href: href.trim(),
          lanHref: lanHref.trim() || undefined,
          avatar: avatar.trim() || undefined,
          roles: roles.map((role) => role.trim()),
          category: category.trim(),
        });
      }
    }
  }

  return menuItems;
}
