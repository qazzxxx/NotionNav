export interface NavMenuItem {
  id?: string; // 添加唯一标识
  title: string;
  href: string;
  lanHref?: string;
  description?: string;
  avatar?: string;
  avatarText?: string;
  avatarColor?: string;
  isFavorite?: boolean; // 添加收藏状态
  roles: string[]; // 角色权限
  category?: string; // 添加分类属性
  menuTitle?: string; // 菜单标题（用于HTML标签名）
  menuIcon?: string; // 菜单图标
  lastEditedTime?: number; // 最后编辑时间（时间戳）
}

export interface MenuData {
  title: string;
  icon: string;
  items: NavMenuItem[];
}

export interface ImageLandscape {
  highDef: string;
  ultraHighDef: string;
  wallpaper: string;
}

export interface ImageUrl {
  landscape: ImageLandscape;
  portrait: ImageLandscape;
}

export interface BingImage {
  caption: string;
  title: string;
  description: string;
  copyright: string;
  date: string;
  descriptionPara2?: string;
  imageUrls: ImageUrl;
  clickUrl: string;
}

// 导出 Notion 相关类型
export * from "./notion";
