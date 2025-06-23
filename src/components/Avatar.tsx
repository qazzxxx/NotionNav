import Image from "next/image";
import { useState } from "react";
import { getFaviconUrl } from "@/utils/favicon";

interface AvatarProps {
  src?: string;
  alt: string;
  fallbackText?: string;
  size?: number;
  className?: string;
  href?: string; // 用于生成favicon URL
}

export const Avatar = ({
  src,
  alt,
  fallbackText,
  size = 36,
  className = "",
  href,
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  // 获取显示文本
  const getDisplayText = () => {
    if (fallbackText) return fallbackText;
    if (alt) return alt.charAt(0).toUpperCase();
    return "?";
  };

  // 如果有原始avatar且没有加载错误，显示原始avatar
  if (src && !imageError) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-lg ${className}`}
        loading="lazy"
        decoding="async"
        onError={() => setImageError(true)}
      />
    );
  }

  // 如果有href且favicon没有加载错误，尝试使用favicon
  if (href && !faviconError) {
    const faviconUrl = getFaviconUrl(href);
    if (faviconUrl) {
      return (
        <Image
          src={faviconUrl}
          alt={alt}
          width={size}
          height={size}
          className={`rounded-lg ${className}`}
          loading="lazy"
          decoding="async"
          onError={() => setFaviconError(true)}
        />
      );
    }
  }

  // 最后显示默认的文本头像
  return (
    <div
      className={`text-white text-sm rounded-lg flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        background: "#673ab7",
      }}
    >
      {getDisplayText()}
    </div>
  );
};
