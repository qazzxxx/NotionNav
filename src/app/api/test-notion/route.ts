import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import { NOTION_CONFIG } from "@/config/notion";

const api = new NotionAPI();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId") || NOTION_CONFIG.DEFAULT_PAGE_ID;

    console.log("Testing Notion API with page ID:", pageId);

    // 尝试获取页面
    const page = await api.getPage(pageId);

    console.log("Page structure:");
    console.log("Keys:", Object.keys(page));

    let schemaInfo = null;

    // 显示collection信息
    if (page.collection) {
      console.log("\nCollection information:");
      console.log("Collection keys:", Object.keys(page.collection));

      for (const collectionId of Object.keys(page.collection)) {
        const collection = page.collection[collectionId];
        console.log(`\nCollection ${collectionId}:`);
        console.log("Collection keys:", Object.keys(collection));

        if (collection.value) {
          console.log("Collection value keys:", Object.keys(collection.value));
          if (collection.value.schema) {
            console.log(
              "Schema:",
              JSON.stringify(collection.value.schema, null, 2)
            );
            schemaInfo = collection.value.schema;
          }
        }
      }
    }

    const detailedBlocks = [];

    if (page.block) {
      console.log("\nBlock information:");
      console.log("Block keys:", Object.keys(page.block));
      console.log("Number of blocks:", Object.keys(page.block).length);

      // 显示所有块的信息
      for (const blockId of Object.keys(page.block)) {
        const block = page.block[blockId];
        console.log(`\nBlock ${blockId}:`);
        console.log("  Keys:", Object.keys(block));

        const blockInfo: any = {
          id: blockId,
          keys: Object.keys(block),
        };

        if (block.value) {
          console.log("  Value keys:", Object.keys(block.value));
          console.log("  Value type:", block.value.type);
          console.log("  Value:", JSON.stringify(block.value, null, 2));

          blockInfo.valueKeys = Object.keys(block.value);
          blockInfo.valueType = block.value.type;

          if (block.value.properties) {
            console.log(
              "  Properties keys:",
              Object.keys(block.value.properties)
            );
            console.log(
              "  Properties:",
              JSON.stringify(block.value.properties, null, 2)
            );

            blockInfo.propertiesKeys = Object.keys(block.value.properties);
            blockInfo.properties = block.value.properties;
          }
        }

        detailedBlocks.push(blockInfo);
      }
    }

    return NextResponse.json({
      success: true,
      pageKeys: Object.keys(page),
      collectionInfo: page.collection ? Object.keys(page.collection) : [],
      schemaInfo: schemaInfo,
      blockCount: page.block ? Object.keys(page.block).length : 0,
      detailedBlocks: detailedBlocks,
    });
  } catch (error) {
    console.error("Error testing Notion API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
