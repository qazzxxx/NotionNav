import { NextRequest, NextResponse } from "next/server";
import {
  validateEnvironment,
  getEnvironmentInfo,
  getNotionPageId,
  getNotionToken,
  getNotionActiveUser,
} from "@/utils/env";
import { getNotionAPIConfig } from "@/config/notion";

export async function GET(request: NextRequest) {
  try {
    const validation = validateEnvironment();
    const envInfo = getEnvironmentInfo();
    const currentPageId = getNotionPageId();
    const notionToken = getNotionToken();
    const notionActiveUser = getNotionActiveUser();
    const notionAPIConfig = getNotionAPIConfig();

    return NextResponse.json({
      success: true,
      validation,
      environment: envInfo,
      currentPageId,
      notionConfig: {
        token: notionToken ? "set" : "not set",
        activeUser: notionActiveUser ? "set" : "not set",
        apiConfig: notionAPIConfig,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error checking environment:", error);
    return NextResponse.json(
      { error: "Failed to check environment" },
      { status: 500 }
    );
  }
}
