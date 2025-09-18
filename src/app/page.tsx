"use client";

import { Suspense } from "react";
import { useCallback, useEffect, useState } from "react";
import { Background } from "@/components/Background";
import { GroupedNotionMenu } from "@/components/GroupedNotionMenu";
import { FavoritesMenu } from "@/components/FavoritesMenu";
import { MAX_BG_COUNT } from "@/config/constants";
import { BingImage, NavMenuItem } from "@/types";
import { storage } from "@/utils/storage";
import { useHitokoto } from "@/hooks/useHitokoto";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { useNotionMenu } from "@/hooks/useNotionMenu";
import { useNotionRoles } from "@/hooks/useNotionRoles";
import { useFavorites } from "@/hooks/useFavorites";
import { SearchBar } from "@/components/SearchBar";
import { LanToggle } from "@/components/LanToggle";
import { WallpaperInfo } from "@/components/WallpaperInfo";
import { Lock } from "@/components/Lock";
import { useSearchParams } from "next/navigation";
import GlassFilter from "@/components/GlassFilter";
import LiquidGlassWrapper from "@/components/LiquidGlassWrapper";
import SettingsButton from "@/components/SettingsButton";
import SettingsModal from "@/components/SettingsModal";
import "./liquid-glass.css";

// 创建一个包装组件来使用 useSearchParams
function HomeContent() {
  const searchParams = useSearchParams();

  // Hooks
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { data: hitokoto, fetchHitokoto } = useHitokoto();
  const {
    menuItems: notionMenuItems,
    databaseMetadata,
    loading: notionLoading,
    error: notionError,
    categoryOrder,
  } = useNotionMenu();
  const {
    roles: notionRoles,
    loading: _rolesLoading,
    error: _rolesError,
  } = useNotionRoles();
  const isApple = useDeviceDetect();

  // States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLiquidGlass, setIsLiquidGlass] = useState(() => {
    const savedTheme = storage.get('theme');
    return savedTheme === 'liquid-glass';
  });
  const [userRole, setUserRole] = useState<string>("guest");
  const [searchValue, setSearchValue] = useState("");
  const [isLan, setIsLan] = useState(storage.get("isLan") === "true");
  const [wallpaperInfo, setWallpaperInfo] = useState<BingImage>();
  const [isLocked, setIsLocked] = useState(() => {
    const role = searchParams.get("role");
    return !role;
  });
  const [isValidatingUrlRole, setIsValidatingUrlRole] = useState(() => {
    const role = searchParams.get("role");
    return !!role;
  });
  const [isCheckingRoles, setIsCheckingRoles] = useState(true);

  // Effects
  useEffect(() => {
    const savedTheme = storage.get('theme');
    if (savedTheme === 'liquid-glass') {
      try {
        setIsLiquidGlass(savedTheme === 'liquid-glass');
      } catch {
        setIsLiquidGlass(false);
      }
    }
  }, []);

  // Utility functions
  // Theme handling


  const getLiquidGlassClasses = (baseClasses: string) => {
    if (!isLiquidGlass) return baseClasses;
    return `${baseClasses} liquidGlass`;
  };



  // Theme switching handler
  const handleThemeToggle = useCallback(() => {
    setIsLiquidGlass(!isLiquidGlass);
    storage.set('theme', !isLiquidGlass ? 'liquid-glass' : 'default');
  }, [isLiquidGlass]);

  // 内外网切换处理
  const handleNetworkToggle = useCallback(() => {
    setIsLan(!isLan);
    storage.set('network', !isLan ? 'lan' : 'wan');
  }, [isLan]);  // 继续其他逻辑



  // 动态设置页面标题和favicon
  useEffect(() => {
    if (databaseMetadata.title) {
      document.title = databaseMetadata.title;
    }

    if (databaseMetadata.icon) {
      // 移除现有的favicon
      const existingFavicon = document.querySelector('link[rel="icon"]');
      if (existingFavicon) {
        existingFavicon.remove();
      }

      // 添加新的favicon
      const favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.href = databaseMetadata.icon.startsWith("http")
        ? databaseMetadata.icon
        : `data:image/svg+xml,${encodeURIComponent(databaseMetadata.icon)}`;
      document.head.appendChild(favicon);
    }
  }, [databaseMetadata]);

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

  // 统一的角色验证和锁定状态管理
  useEffect(() => {
    const role = searchParams.get("role");

    // 如果还在加载角色，保持检查状态
    if (_rolesLoading) {
      return;
    }

    // 角色数据加载完成，结束检查状态
    setIsCheckingRoles(false);

    // 如果没有角色限制，直接解锁
    if (notionRoles.length === 0) {
      setIsLocked(false);
      setIsValidatingUrlRole(false);
      return;
    }

    // 有角色限制的情况
    if (role) {
      // 有URL角色参数，进行验证
      setIsValidatingUrlRole(true);
      setIsLocked(false);

      // 验证角色
      if (notionRoles.includes(role)) {
        handleUnlock(role);
        setIsValidatingUrlRole(false);
      } else {
        setIsValidatingUrlRole(false);
        setIsLocked(true);
      }
    } else {
      // 没有URL角色参数，显示锁定页面
      setIsValidatingUrlRole(false);
      setIsLocked(true);
    }
  }, [_rolesLoading, notionRoles, searchParams]);

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
    // const searchInput = document.querySelector("#search") as HTMLInputElement;
    // if (searchInput) {
    //   searchInput.focus();
    // }
  };

  return (
    <div className="h-screen overflow-hidden relative">
      {/* 背景组件始终显示 */}
      <Background
        isApple={isApple}
        isLan={isLan}
        notionCover={databaseMetadata.cover}
        notionLoading={notionLoading}
        onWallpaperInfo={setWallpaperInfo}
      />
      <GlassFilter />

      {/* 角色检查加载状态 */}
      {isCheckingRoles && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />
          <div className="relative z-10 p-8 rounded-2xl text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
            <p className="text-white/70 text-sm">加载数据中...</p>
          </div>
        </div>
      )}

      {/* URL角色验证加载状态 */}
      {isValidatingUrlRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />
          <div className="relative z-10 p-8 rounded-2xl text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
            <p className="text-white/70 text-sm">正在验证角色权限...</p>
          </div>
        </div>
      )}

      {/* 锁屏组件 - 只在未验证URL角色且锁定时显示 */}
      {!isCheckingRoles && !isValidatingUrlRole && isLocked && (
        <Lock onUnlock={handleUnlock} />
      )}

      {/* 主要内容区域 */}
      <div
        className={`fixed inset-0 overflow-y-auto overflow-x-hidden transition-transform duration-500 ease-out ${
          isLocked ? "translate-y-full" : "translate-y-0"
        }`}
        id="main-content"
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
                isLiquidGlass={isLiquidGlass}
              />

            <div style={{
              float: "right",
              backgroundColor: "rgba(42, 42, 42, 0.42)",
              cursor: "pointer",
              marginTop: "-37px",
            }} className="rounded-2xl relative">
                  {/* 设置按钮和模态框 */}
                  <SettingsButton onClick={() => setIsSettingsOpen(true)} />
            </div>

            {/* 操作按钮组 */}
            {wallpaperInfo ? (
              <LiquidGlassWrapper isActive={isLiquidGlass}>
                <WallpaperInfo wallpaperInfo={wallpaperInfo} />
              </LiquidGlassWrapper>
            ) : null}

            {/* 显示锁屏状态 */}
          </header>

          <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onThemeToggle={handleThemeToggle}
        onNetworkToggle={handleNetworkToggle}
        isLiquidGlass={isLiquidGlass}
        isLan={isLan}
      />

          {/* Notion菜单 */}
          {!notionLoading && !notionError && notionMenuItems.length > 0 && (
            <div className="space-y-4">
              {/* 收藏菜单 */}
              <FavoritesMenu
                userRole={userRole}
                isLan={isLan}
                favorites={favorites}
                removeFavorite={removeFavorite}
                isLiquidGlass={isLiquidGlass}
              />

              {/* 分组菜单 */}
              <GroupedNotionMenu
                menuItems={notionMenuItems}
                isLan={isLan}
                userRole={userRole}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
                isFavorite={isFavorite}
                categoryOrder={categoryOrder}
                isLiquidGlass={isLiquidGlass}
              />
            </div>
          )}
        </div>
      </div>

      {/* 主题切换按钮已移至顶部 */}
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
