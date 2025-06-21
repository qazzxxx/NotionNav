import { VIDEO_URL } from "@/config/constants";
import { BingImage } from "@/types";
import { storage } from "@/utils/storage";
import { useEffect, useState } from "react";

interface BackgroundProps {
  isApple: boolean;
  isLan: boolean;
  onWallpaperInfo?: (info: BingImage) => void;
}

export const Background = ({
  isApple,
  isLan,
  onWallpaperInfo,
}: BackgroundProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentBg, setCurrentBg] = useState<string>("");

  useEffect(() => {
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
      // 加载失败时使用默认图片
      const localImgUrl = `/bg/${storage.get("bg")}.jpg`;

      // 预加载图片
      const img = new Image();
      img.src = localImgUrl;
      img.onload = () => {
        setCurrentBg(localImgUrl);
        setIsLoading(false);
      };
      setIsLoading(false);
    }
  }, [isApple, isLan, onWallpaperInfo]);

  return isApple ? (
    <>
      {/* 添加黑色背景层 */}
      <div className="cover" style={{ backgroundColor: "#000000" }} />
      {/* 图片层 */}
      <div
        className={`cover wallpaper transition-all duration-1000 ease-in-out ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        style={{
          background: currentBg
            ? `url('${currentBg}') center center / cover no-repeat`
            : undefined,
        }}
      />
    </>
  ) : (
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
  );
};
