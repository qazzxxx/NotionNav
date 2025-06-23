/**
 * 从URL中提取域名
 * @param url 网站URL
 * @returns 域名或null
 */
export function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * 生成favicon.im的URL
 * @param url 网站URL
 * @returns favicon.im URL或null
 */
export function getFaviconUrl(url: string): string | null {
  const domain = extractDomain(url);
  if (!domain) return null;

  return `https://favicon.im/${domain}`;
}

/**
 * 生成带大尺寸参数的favicon.im URL
 * @param url 网站URL
 * @returns 大尺寸favicon.im URL或null
 */
export function getLargeFaviconUrl(url: string): string | null {
  const domain = extractDomain(url);
  if (!domain) return null;

  return `https://favicon.im/${domain}?larger=true`;
}

/**
 * 验证favicon URL是否有效
 * @param url favicon URL
 * @returns Promise<boolean>
 */
export async function validateFaviconUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
