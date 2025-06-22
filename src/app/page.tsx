"use client"; // 声明这是一个客户端组件

import { Suspense } from "react";

// 导入React Hooks
import { useEffect, useState } from "react";
// 导入自定义组件
import { Background } from "@/components/Background";
import { GroupedNotionMenu } from "@/components/GroupedNotionMenu";
// 导入常量配置
import { MAX_BG_COUNT, PASSWORDS } from "@/config/constants";
// 导入类型定义
import { BingImage, NavMenuItem } from "@/types";
// 导入工具函数
import { storage } from "@/utils/storage";
// 导入自定义Hooks
import { useHitokoto } from "@/hooks/useHitokoto";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { useNotionMenu } from "@/hooks/useNotionMenu";
import { SearchBar } from "@/components/SearchBar";
import { LanToggle } from "@/components/LanToggle";
import { useFavorites } from "@/hooks/useFavorites";
import { WallpaperInfo } from "@/components/WallpaperInfo";
import { Lock } from "@/components/Lock";
import { useSearchParams } from "next/navigation";
import { Weather } from "@/components/Weather";

// 创建一个包装组件来使用 useSearchParams
function HomeContent() {
  const searchParams = useSearchParams();

  const [userRole, setUserRole] = useState<string>("guest");

  const [searchValue, setSearchValue] = useState(""); // 添加搜索值状态

  const { toggleFavorite, isFavorite } = useFavorites();

  // 使用Notion菜单Hook
  const {
    menuItems: notionMenuItems,
    loading: notionLoading,
    error: notionError,
  } = useNotionMenu();

  // 使用自定义Hook获取一言数据
  const { data: hitokoto, fetchHitokoto } = useHitokoto();

  // 使用自定义Hook检测是否为Apple设备
  const isApple = useDeviceDetect();

  // 管理语言切换状态
  const [isLan, setIsLan] = useState(storage.get("isLan") === "true");

  const [wallpaperInfo, setWallpaperInfo] = useState<BingImage>();

  // 添加锁屏状态
  const [isLocked, setIsLocked] = useState(true);

  /**
   * 生成不同于当前值的随机数(0-3)
   * @param current 当前值
   * @returns 新的随机数
   */
  const getNewRandomIndex = (current: number): number => {
    const newRandom = Math.floor(Math.random() * (MAX_BG_COUNT - 1));
    // 如果生成的随机数大于等于当前值，则加1以避免重复
    return newRandom >= current ? newRandom + 1 : newRandom;
  };

  // 组件挂载时获取一言数据
  useEffect(() => {
    fetchHitokoto();
    storage.set("bg", String(getNewRandomIndex(Number(storage.get("bg")))));
  }, []);

  // 组件挂载时检查 URL 参数
  useEffect(() => {
    const role = searchParams.get("role");
    if (role && PASSWORDS.includes(role)) {
      handleUnlock(role);
    }
  }, [searchParams]);

  /**
   * 处理语言切换
   * 切换语言状态并更新本地存储
   */
  const handleLanToggle = () => {
    const newValue = !isLan;
    storage.set("isLan", String(newValue));
    setIsLan(newValue);
  };

  /**
   * 处理搜索输入
   * @param e 输入事件对象
   */
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const onResetSearch = () => {
    // 清空搜索框
    setSearchValue("");
  };

  /**
   * 处理菜单项选择
   * @param item 选中的菜单项
   */
  const handleSelectMenuItem = (item: NavMenuItem) => {
    const url = isLan ? item.lanHref || item.href : item.href;
    window.open(url, "_blank");
    onResetSearch();
  };

  /**
   * 提交搜索表单
   * @param e 提交事件对象
   */
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchValue.trim()) {
      // 首先尝试在Notion菜单项中搜索
      const matchingMenuItem = notionMenuItems.find(
        (item) =>
          item.roles?.includes(userRole) &&
          (item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchValue.toLowerCase()))
      );

      if (matchingMenuItem) {
        // 如果找到匹配的菜单项，直接打开
        const url = isLan
          ? matchingMenuItem.lanHref || matchingMenuItem.href
          : matchingMenuItem.href;
        window.open(url, "_blank");
        onResetSearch();
        return;
      }

      // 如果没有找到匹配的菜单项，检查是否是URL
      const urlRegex =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

      if (urlRegex.test(searchValue)) {
        // 如果输入的是有效的URL
        const url =
          searchValue.startsWith("http://") ||
          searchValue.startsWith("https://")
            ? searchValue // 如果已经有协议头，直接使用
            : `https://${searchValue}`; // 否则添加 https:// 协议头
        window.open(url, "_blank");
      } else {
        // 否则使用百度搜索
        const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(
          searchValue
        )}`;
        window.open(searchUrl, "_blank");
      }
    }

    // 重置搜索框
    onResetSearch();
  };

  // 添加键盘快捷键处理函数
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查是否按下了 ctrl+k (Mac 上也可以用 cmd+k)
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault(); // 阻止默认行为

        // 获取主内容容器
        const mainContainer = document.querySelector(".overflow-y-auto");
        if (mainContainer) {
          // 平滑滚动到顶部
          mainContainer.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }

        // 获取搜索输入框并聚焦
        const searchInput = document.querySelector(
          "#search"
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    // 添加事件监听
    window.addEventListener("keydown", handleKeyDown);

    // 清理函数
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // 空依赖数组，因为这个效果只需要在组件挂载时执行一次

  // 处理解锁事件
  const handleUnlock = (role: string) => {
    setUserRole(role);
    setIsLocked(false);
    // 获取搜索输入框并聚焦
    const searchInput = document.querySelector("#search") as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  return (
    <div className="h-screen overflow-hidden relative">
      {/* 背景组件始终显示 */}
      <Background
        isApple={isApple}
        isLan={isLan}
        onWallpaperInfo={setWallpaperInfo}
      />

      {/* 锁屏组件 */}
      {isLocked && <Lock onUnlock={handleUnlock} />}

      {/* 主要内容区域 */}
      <div
        className={`fixed inset-0 overflow-y-auto overflow-x-hidden transition-transform duration-500 ease-out ${
          isLocked ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="px-6 py-8">
          {/* 头部搜索区域 */}
          <header className="space-y-4 mb-3 mt-3">
            {/* 搜索表单 */}
            <SearchBar
              value={searchValue}
              hitokoto={hitokoto}
              onSearch={onSearch}
              onSubmit={onSubmit}
              menuItems={notionMenuItems}
              userRole={userRole}
              isLan={isLan}
              onSelectMenuItem={handleSelectMenuItem}
            />

            <LanToggle isLan={isLan} onToggle={handleLanToggle} />

            {/* 操作按钮组 */}
            {wallpaperInfo ? (
              <WallpaperInfo wallpaperInfo={wallpaperInfo} />
            ) : null}

            {/* 显示锁屏状态 */}
          </header>

          {userRole === "qazz" && (
            <div className="mb-6 mt-3">
              <h2 className="font-semibold text-slate-800 text-base mb-4 text-white">
                <span className="text mr-2">🧩</span>小组件
              </h2>
              <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
                <div
                  className="relative nav-item rounded-2xl"
                  style={{ animationDelay: `${0 * 0.1}s` }}
                >
                  {/* 天气信息 */}
                  <Weather />
                </div>
              </div>
            </div>
          )}

          {/* Notion菜单 */}
          {!notionLoading && !notionError && notionMenuItems.length > 0 && (
            <GroupedNotionMenu
              menuItems={notionMenuItems}
              isLan={isLan}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
              userRole={userRole}
            />
          )}

          {/* 底部信息展示区域 */}
          {/* {isLan && <Footer daysUntil={daysUntil} />} */}
        </div>
      </div>
    </div>
  );
}

// 主页面组件
export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="text-white/70">加载中...</div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
