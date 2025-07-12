/**
 * 环境变量管理工具
 * 统一处理环境变量的获取和验证
 */

/**
 * 获取 Notion 页面 ID
 * 优先级：环境变量 > 默认值
 */
export function getNotionPageId(): string {
  const envPageId = process.env.NOTION_PAGE_ID;

  if (envPageId) {
    return envPageId;
  }

  const defaultPageId = "219692535678800fbefffd8ae6924454";
  return defaultPageId;
}

/**
 * 获取 Notion Token（可选）
 */
export function getNotionToken(): string | undefined {
  return process.env.NOTION_TOKEN;
}

/**
 * 获取 Notion Active User（可选）
 */
export function getNotionActiveUser(): string | undefined {
  return process.env.NOTION_ACTIVE_USER;
}

/**
 * 验证环境变量配置
 */
export function validateEnvironment(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 检查必需的环境变量
  if (!process.env.NOTION_PAGE_ID) {
    warnings.push("NOTION_PAGE_ID not set, using default value");
  }

  // 检查环境变量格式
  const pageId = process.env.NOTION_PAGE_ID;
  if (pageId && !/^[a-f0-9-]+$/i.test(pageId)) {
    errors.push("NOTION_PAGE_ID format is invalid");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 获取环境信息（用于调试）
 */
export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV,
    notionPageId: process.env.NOTION_PAGE_ID || "not set",
    notionToken: process.env.NOTION_TOKEN ? "set" : "not set",
    notionActiveUser: process.env.NOTION_ACTIVE_USER ? "set" : "not set",
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
  };
}
