import { NavMenuItem } from "@/types";
import { HeartIcon } from "./icons/HeartIcon";
import { Avatar } from "./Avatar";
import { useCallback, memo, useState, useEffect } from "react";

interface NotionMenuProps {
  menuItems: NavMenuItem[];
  isLan: boolean;
  onToggleFavorite: (item: NavMenuItem) => void;
  isFavorite: (href: string) => boolean;
  userRole: string;
}

export const NotionMenu = memo(
  ({
    menuItems,
    isLan,
    onToggleFavorite,
    isFavorite,
    userRole,
  }: NotionMenuProps) => {
    // 添加客户端渲染控制
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const handleFavoriteClick = useCallback(
      (e: React.MouseEvent, item: NavMenuItem) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleFavorite(item);
      },
      [onToggleFavorite]
    );

    // 过滤菜单项，只显示用户有权限访问的
    const filteredItems = menuItems.filter((item) =>
      item.roles?.includes(userRole)
    );

    // 服务端渲染时返回基础结构
    if (!mounted) {
      return <div className="mb-6" />;
    }

    return filteredItems.length ? (
      <div className="mb-6">
        <h2 className="font-semibold text-slate-800 text-base mb-4 text-white">
          <i
            className="iconfont icon-notion"
            style={{ marginRight: "4px", marginTop: "-3px" }}
          />
          Notion菜单
        </h2>

        <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id || item.href}
              className="relative nav-item rounded-2xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <HeartIcon
                isFavorite={isFavorite(item.href)}
                onClick={(e) => handleFavoriteClick(e, item)}
                className={`absolute top-2 right-2 z-10 favorite-icon ${
                  isFavorite(item.href) ? "opacity-100" : ""
                }`}
              />
              <a
                href={isLan ? item.lanHref || item.href : item.href}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: "rgba(42, 42, 42, 0.42)" }}
                className="flex justify-items-start items-center rounded-2xl space-x-6 p-5 text-white"
              >
                <Avatar
                  src={item.avatar}
                  alt={item.title}
                  href={item.href}
                  size={36}
                  className="rounded-lg"
                />
                <div className="min-w-0 relative flex-auto">
                  <h3 className="font-semibold text-slate-900 truncate pr-20 text-white">
                    {item.title}
                  </h3>
                  <div className="font-normal text-sm truncate mt-1 text-white">
                    {item.description}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  }
);

NotionMenu.displayName = "NotionMenu";
