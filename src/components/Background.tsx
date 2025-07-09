import { VIDEO_URL } from "@/config/constants";
import { BingImage } from "@/types";
import { storage } from "@/utils/storage";
import { useEffect, useState } from "react";

interface BackgroundProps {
  isApple: boolean;
  isLan: boolean;
  notionCover?: string;
  notionLoading: boolean;
  onWallpaperInfo?: (info: BingImage) => void;
}

export const Background = ({
  isApple,
  isLan,
  notionCover,
  notionLoading,
  onWallpaperInfo,
}: BackgroundProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentBg, setCurrentBg] = useState<string>("");

  useEffect(() => {
    if (notionLoading) {
      // Notion 数据还在加载，什么都不做
      return;
    }
    // 如果有Notion封面，优先使用
    if (notionCover) {
      // 预加载图片
      const img = new Image();
      img.src = notionCover;
      img.onload = () => {
        setCurrentBg(notionCover);
        setIsLoading(false);
      };
      img.onerror = () => {
        console.error("Failed to load Notion cover, falling back to default");
        loadDefaultBackground();
      };
      return;
    }
    // 如果没有Notion封面，使用原有逻辑
    loadDefaultBackground();
  }, [isApple, isLan, notionCover, notionLoading, onWallpaperInfo]);

  const loadDefaultBackground = () => {
    if (isApple && !isLan) {
      const fetchBingWallpaper = async () => {
        try {
          const response = await fetch(
            "/bing/hp/api/v1/imagegallery?format=json"
          );
          const data = await response.json();
          const todayImage: BingImage =
            data.data.images[Number(storage.get("bg"))]; // 获取最新的一张图片

          // 传递壁纸信息给父组件
          onWallpaperInfo?.(todayImage);

          // 构建完整的图片URL
          const imgUrl = `https://www.bing.com/${todayImage.imageUrls.landscape.ultraHighDef}`;

          // 预加载图片
          const img = new Image();
          img.src = imgUrl;
          img.onload = () => {
            setCurrentBg(imgUrl);
            setIsLoading(false);
          };
        } catch (error) {
          console.error("Failed to fetch Bing wallpaper:", error);
          // 加载失败时使用默认图片
          const errorImgUrl = `/bg/${storage.get("bg")}.jpg`;

          // 预加载图片
          const img = new Image();
          img.src = errorImgUrl;
          img.onload = () => {
            setCurrentBg(errorImgUrl);
            setIsLoading(false);
          };
          setIsLoading(false);
        }
      };

      fetchBingWallpaper();
    } else {
      // 非苹果设备或内网环境，使用本地图片作为fallback
      const localImgUrl = `/bg/${storage.get("bg")}.jpg`;

      // 预加载图片
      const img = new Image();
      img.src = localImgUrl;
      img.onload = () => {
        setCurrentBg(localImgUrl);
        setIsLoading(false);
      };
      img.onerror = () => {
        // 如果本地图片也加载失败，使用视频背景
        setCurrentBg("");
        setIsLoading(false);
      };
    }
  };

  return (
    <>
      {/* 添加黑色背景层 */}
      <div className="cover" style={{ backgroundColor: "#000000" }} />

      {/* 图片背景层 */}
      {currentBg && (
        <div
          className={`cover wallpaper transition-all duration-1000 ease-in-out ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background: `url('${currentBg}') center center / cover no-repeat`,
          }}
        />
      )}

      {/* 视频背景层 - 只在没有图片背景时显示 */}
      {!currentBg && !isApple && (
        <div className="video-background">
          <video
            id="bgVideo"
            autoPlay
            loop
            muted
            className="transition-opacity duration-1000"
            onLoadedData={() => setIsLoading(false)}
          >
            <source src={VIDEO_URL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </>
  );
};
