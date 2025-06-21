import { BingImage } from "@/types";
import { useState } from "react";

interface WallpaperInfoProps {
  wallpaperInfo?: BingImage;
}

export const WallpaperInfo = ({ wallpaperInfo }: WallpaperInfoProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      className="rounded-full navhover text-white p-2 text-sm font-semibold md:block hidden relative"
      style={{
        float: "right",
        backgroundColor: "rgba(42, 42, 42, 0.42)",
        cursor: "pointer",
        marginTop: "-35px",
        marginRight: "8px",
        lineHeight: 1,
        zIndex: 9999,
      }}
      href={`https://cn.bing.com${wallpaperInfo?.clickUrl}`}
      target="_blank"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <i
        className="iconfont icon-weizhi"
        style={{ lineHeight: 1, fontSize: 18 }}
      />

      {/* 悬浮信息层 */}
      {isHovered && (
        <div className="absolute right-1 top-9 w-72 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm z-50">
          <h3 className="text-sm font-medium mb-2">{wallpaperInfo?.title}</h3>
          <p className="text-xs text-gray-300 mb-2">
            {wallpaperInfo?.description}
          </p>
          <p className="text-xs text-gray-300 mb-2">
            {wallpaperInfo?.descriptionPara2}
          </p>
          <p className="text-xs text-gray-300">{wallpaperInfo?.copyright}</p>
        </div>
      )}
    </a>
  );
};
