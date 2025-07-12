import {
  getNotionPageId,
  getNotionToken,
  getNotionActiveUser,
} from "@/utils/env";

// Notion配置
export const NOTION_CONFIG = {
  // 使用环境变量管理工具获取页面 ID
  get DEFAULT_PAGE_ID() {
    return getNotionPageId();
  },

  // 如果有多个数据库，可以在这里配置
  DATABASES: {
    get MENU() {
      return getNotionPageId();
    },
    // 可以添加更多数据库
    // NEWS: "your-news-database-id",
    // TOOLS: "your-tools-database-id",
  },
};

/**
 * 获取 Notion API 配置
 * 统一管理 Notion API 的初始化参数
 */
export function getNotionAPIConfig() {
  const token = getNotionToken();
  const activeUser = getNotionActiveUser();

  // 如果同时有 token 和 activeUser，使用完整配置
  if (token && activeUser) {
    return {
      activeUser,
      authToken: token,
    };
  }

  // 如果只有 token，使用 token 配置
  if (token) {
    return {
      authToken: token,
    };
  }

  // 如果都没有，返回 undefined（使用默认配置）
  return undefined;
}

// Notion数据库属性映射
export const NOTION_PROPERTY_MAPPING = {
  // 标题属性
  TITLE: ["title", "Name", "name"],

  // 描述属性
  DESCRIPTION: ["Description", "description", "desc"],

  // URL属性
  URL: ["URL", "url", "Link", "link", "href"],

  // 头像属性
  AVATAR: ["Avatar", "avatar", "Icon", "icon", "image"],

  // 分类属性
  CATEGORY: ["Category", "category", "Type", "type"],

  // 角色权限属性
  ROLES: ["Roles", "roles", "Access", "access", "permissions"],

  // 内网URL属性
  LAN_URL: ["LanURL", "lanHref", "lan_url", "internal_url"],

  // 状态属性
  STATUS: ["Status", "status", "State", "state"],
};
