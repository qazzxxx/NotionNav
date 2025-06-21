import notionAPI from "@/lib/notion/getNotionApi";

export async function getNotionData() {
  const pageId = process.env.NOTION_PAGE_ID;
  try {
    const response = await notionAPI.getPage(
      pageId || "219692535678800fbefffd8ae6924454"
    );
    return response;
  } catch (error) {
    console.error("Error fetching Notion data:", error);
    throw error;
  }
}
