/**
 * Notion 数据格式清理工具
 * 用于处理 Notion API 返回的数据结构变化
 */

/**
 * 递归解包 value
 * 解决 Notion API 返回的多层嵌套问题
 * 旧版 block: { value: {} }
 * 新版 block: { spaceId: { id: { value: {} } } } 或其他嵌套形式
 */
export function unwrapValue(obj: any): any {
  let cur = obj;
  let guard = 0;

  // 循环解包，直到找到最内层的对象
  // 或者是直到不再包含 value 属性的对象
  while (cur?.value && typeof cur.value === 'object' && guard < 10) {
    cur = cur.value;
    guard++;
  }

  return cur;
}

/**
 * 清理 Notion 返回的数据结构
 * 将多层嵌套的数据展平，使其符合原有代码的预期（直接包含属性的对象）
 */
export function adapterNotionBlockMap(recordMap: any) {
  if (!recordMap) return recordMap;

  const cleanedBlocks: Record<string, any> = {};
  const cleanedCollection: Record<string, any> = {};

  // 处理 blocks
  if (recordMap.block) {
    for (const [id, block] of Object.entries(recordMap.block)) {
      // 展平 block，并重新封装成 { value: ... } 结构以保持兼容性
      cleanedBlocks[id] = { value: unwrapValue(block) };
    }
  }

  // 处理 collections
  if (recordMap.collection) {
    for (const [id, collection] of Object.entries(recordMap.collection)) {
      // 展平 collection，并重新封装成 { value: ... } 结构
      cleanedCollection[id] = { value: unwrapValue(collection) };
    }
  }

  // 返回新的 recordMap，保留其他字段，替换 block 和 collection
  return {
    ...recordMap,
    block: cleanedBlocks,
    collection: cleanedCollection,
  };
}
