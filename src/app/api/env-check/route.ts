import { NextRequest, NextResponse } from "next/server";
import {
  validateEnvironment,
  getEnvironmentInfo,
  getNotionPageId,
} from "@/utils/env";

export async function GET(request: NextRequest) {
  try {
    const validation = validateEnvironment();
    const envInfo = getEnvironmentInfo();
    const currentPageId = getNotionPageId();

    return NextResponse.json({
      success: true,
      validation,
      environment: envInfo,
      currentPageId,
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
