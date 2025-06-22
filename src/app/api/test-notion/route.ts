import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import { NOTION_CONFIG } from "@/config/notion";
import { NotionDatabase } from "@/types";

const api = new NotionAPI();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId") || NOTION_CONFIG.DEFAULT_PAGE_ID;

    console.log("Testing Notion API with page ID:", pageId);

    // fetch database content
    const database = (await api.getPage(pageId)) as NotionDatabase;

    // 分析数据库结构
    const analysis = analyzeDatabaseStructure(database);

    return NextResponse.json({
      success: true,
      pageId,
      analysis,
      databaseKeys: Object.keys(database),
      blockCount: Object.keys(database.block || {}).length,
    });
  } catch (error) {
    console.error("Error testing Notion API:", error);
    return NextResponse.json(
      { error: "Failed to test Notion API" },
      { status: 500 }
    );
  }
}

interface DatabaseAnalysis {
  totalBlocks: number;
  blockTypes: Record<string, number>;
  hasCollection: boolean;
  hasSchema: boolean;
  schemaProperties: string[];
  sampleBlock: unknown;
}

function analyzeDatabaseStructure(database: NotionDatabase): DatabaseAnalysis {
  const analysis: DatabaseAnalysis = {
    totalBlocks: 0,
    blockTypes: {},
    hasCollection: false,
    hasSchema: false,
    schemaProperties: [],
    sampleBlock: null,
  };

  // 分析块
  if (database.block) {
    analysis.totalBlocks = Object.keys(database.block).length;

    // 统计块类型
    for (const blockId of Object.keys(database.block)) {
      const block = database.block[blockId] as import("@/types").NotionBlock;
      const blockType = block.value?.type || "unknown";
      analysis.blockTypes[blockType] =
        (analysis.blockTypes[blockType] || 0) + 1;

      // 保存第一个块作为样本
      if (!analysis.sampleBlock) {
        analysis.sampleBlock = block;
      }
    }
  }

  // 分析集合
  if (database.collection) {
    analysis.hasCollection = true;
    const collectionId = Object.keys(database.collection)[0];
    const collection = database.collection[collectionId];

    if (collection?.value?.schema) {
      analysis.hasSchema = true;
      analysis.schemaProperties = Object.keys(collection.value.schema);
    }
  }

  return analysis;
}
