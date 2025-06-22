"use client"; // 声明这是一个客户端组件

import { Suspense } from "react";

// 导入React Hooks
import { useEffect, useState } from "react";
// 导入自定义组件
import { Background } from "@/components/Background";
import { GroupedNotionMenu } from "@/components/GroupedNotionMenu";
import { FavoritesMenu } from "@/components/FavoritesMenu";
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
import { useNotionRoles } from "@/hooks/useNotionRoles";
import { useFavorites } from "@/hooks/useFavorites";
import { SearchBar } from "@/components/SearchBar";
import { LanToggle } from "@/components/LanToggle";
import { WallpaperInfo } from "@/components/WallpaperInfo";
import { Lock } from "@/components/Lock";
import { useSearchParams } from "next/navigation";
import { Weather } from "@/components/Weather";

// 创建一个包装组件来使用 useSearchParams
function HomeContent() {
  const searchParams = useSearchParams();

  const [userRole, setUserRole] = useState<string>("guest");

  const [searchValue, setSearchValue] = useState(""); // 添加搜索值状态

  // 使用Notion菜单Hook
  const {
    menuItems: notionMenuItems,
    databaseMetadata,
    loading: notionLoading,
    error: notionError,
  } = useNotionMenu();

  // 使用Notion角色Hook
  const {
    roles: notionRoles,
    loading: _rolesLoading,
    error: _rolesError,
  } = useNotionRoles();

  // 使用自定义Hook获取一言数据
  const { data: hitokoto, fetchHitokoto } = useHitokoto();

  // 使用自定义Hook检测是否为Apple设备
  const isApple = useDeviceDetect();

  // 管理语言切换状态
  const [isLan, setIsLan] = useState(storage.get("isLan") === "true");

  const [wallpaperInfo, setWallpaperInfo] = useState<BingImage>();

  // 添加锁屏状态
  const [isLocked, setIsLocked] = useState(() => {
    // 如果URL中有role参数，初始状态为验证中而不是锁定
    const role = searchParams.get("role");
    return !role; // 有role参数时初始不锁定，没有role参数时初始锁定
  });

  // 添加URL角色验证状态
  const [isValidatingUrlRole, setIsValidatingUrlRole] = useState(() => {
    // 如果URL中有role参数，初始状态为验证中
    const role = searchParams.get("role");
    return !!role; // 有role参数时初始为验证中
  });

  // 使用自定义Hook管理收藏状态
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

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

  // 监听URL参数变化，重置验证状态
  useEffect(() => {
    const role = searchParams.get("role");
    console.log("URL参数变化:", role);

    if (role) {
      // 有role参数时，设置为验证中状态
      setIsValidatingUrlRole(true);
      setIsLocked(false);
    } else {
      // 没有role参数时，设置为锁定状态
      setIsValidatingUrlRole(false);
      setIsLocked(true);
    }
  }, [searchParams]);

  // URL角色验证逻辑
  useEffect(() => {
    const role = searchParams.get("role");
    console.log("URL角色验证检查:", {
      role,
      _rolesLoading,
      notionRoles,
      validRoles: [...notionRoles, ...PASSWORDS],
      isValidatingUrlRole,
      isLocked,
    });

    // 如果有role参数且roles已加载完毕，开始验证
    if (role && !_rolesLoading) {
      console.log("开始验证URL角色:", role);
      setIsValidatingUrlRole(true);

      // 使用setTimeout来模拟验证过程，让加载状态持续显示
      setTimeout(() => {
        const validRoles = [...notionRoles, ...PASSWORDS];
        if (validRoles.includes(role)) {
          console.log("URL角色验证成功:", role);
          handleUnlock(role);
          setIsValidatingUrlRole(false);
        } else {
          console.log("URL角色验证失败:", role, "可用角色:", validRoles);
          setIsValidatingUrlRole(false); // 验证失败，显示锁定页面
          setIsLocked(true); // 验证失败时重新锁定
        }
      }, 1000); // 延迟1秒，让用户看到加载状态
    }
  }, [searchParams, notionRoles, _rolesLoading]);

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
      {/* 调试信息 */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-0 left-0 z-[60] bg-black/80 text-white p-2 text-xs">
          <div>isValidatingUrlRole: {String(isValidatingUrlRole)}</div>
          <div>isLocked: {String(isLocked)}</div>
          <div>role: {searchParams.get("role") || "none"}</div>
        </div>
      )}

      {/* 背景组件始终显示 */}
      <Background
        isApple={isApple}
        isLan={isLan}
        onWallpaperInfo={setWallpaperInfo}
      />

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
      {!isValidatingUrlRole && isLocked && <Lock onUnlock={handleUnlock} />}

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
            <>
              {/* 收藏菜单 */}
              <FavoritesMenu
                userRole={userRole}
                isLan={isLan}
                favorites={favorites}
                removeFavorite={removeFavorite}
              />

              {/* 分组菜单 */}
              <GroupedNotionMenu
                menuItems={notionMenuItems}
                isLan={isLan}
                userRole={userRole}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
                isFavorite={isFavorite}
              />
            </>
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
