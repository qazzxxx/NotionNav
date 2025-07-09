// Notion API 相关类型定义

export interface NotionBlock {
  value?: NotionBlockValue;
  role?: string;
}

export interface NotionBlockValue {
  id?: string;
  version?: number;
  type?: string;
  properties?: Record<string, NotionPropertyValue[]>;
  format?: NotionFormat;
  created_time?: number;
  last_edited_time?: number;
  parent_id?: string;
  parent_table?: string;
  alive?: boolean;
  created_by_table?: string;
  created_by_id?: string;
  last_edited_by_table?: string;
  last_edited_by_id?: string;
  space_id?: string;
  crdt_format_version?: number;
  crdt_data?: Record<string, unknown>;
  view_ids?: string[];
  permissions?: NotionPermission[];
  file_ids?: string[];
  collection_pointer?: NotionCollectionPointer;
  site_id?: string;
  social_media_image_preview_url?: string;
  schema?: Record<string, NotionSchemaProperty>;
  name?: NotionPropertyValue[];
  cover?: string;
}

export interface NotionPropertyValue {
  0?: string | NotionPropertyValue[];
  1?: unknown[];
}

export interface NotionFormat {
  page_icon?: string;
  icon?: string;
  page_cover?: string;
  site_id?: string;
  collection_pointer?: NotionCollectionPointer;
  social_media_image_preview_url?: string;
}

export interface NotionCollectionPointer {
  id: string;
  table: string;
  spaceId: string;
}

export interface NotionPermission {
  role: string;
  type: string;
  user_id?: string;
  is_site?: boolean;
  added_timestamp?: number;
  is_public_share_link?: boolean;
}

export interface NotionSchemaProperty {
  name?: string;
  type?: string;
  options?: NotionSelectOption[];
}

export interface NotionSelectOption {
  id?: string;
  name?: string;
  color?: string;
  value?: string; // 兼容部分API
  text?: string; // 兼容部分API
}

export interface NotionDatabase {
  block?: Record<string, NotionBlock>;
  collection?: Record<string, NotionCollection>;
  collection_view?: Record<string, unknown>;
  notion_user?: Record<string, unknown>;
  collection_query?: Record<string, unknown>;
  signed_urls?: Record<string, unknown>;
}

export interface NotionCollection {
  value?: NotionBlockValue;
  role?: string;
}

export interface DatabaseMetadata {
  title: string;
  icon: string;
  cover?: string;
}

export interface NotionPropertyMapping {
  [propertyId: string]: string;
}
