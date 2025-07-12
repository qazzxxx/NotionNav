import { NavMenuItem } from "@/types";
import { HeartIcon } from "./icons/HeartIcon";
import { Avatar } from "./Avatar";
import { useCallback, memo, useState, useEffect, useMemo } from "react";

interface GroupedNotionMenuProps {
  menuItems: NavMenuItem[];
  isLan: boolean;
  userRole: string;
  addFavorite: (item: NavMenuItem) => void;
  removeFavorite: (href: string) => void;
  isFavorite: (href: string) => boolean;
  categoryOrder?: string[];
}

export const GroupedNotionMenu = memo(
  ({
    menuItems,
    isLan,
    userRole,
    addFavorite,
    removeFavorite,
    isFavorite,
    categoryOrder = [],
  }: GroupedNotionMenuProps) => {
    // 添加客户端渲染控制
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const handleFavoriteClick = useCallback(
      (e: React.MouseEvent, item: NavMenuItem) => {
        e.preventDefault();
        e.stopPropagation();

        if (isFavorite(item.href)) {
          removeFavorite(item.href);
        } else {
          addFavorite(item);
        }
      },
      [addFavorite, removeFavorite, isFavorite]
    );

    // 过滤菜单项，只显示用户有权限访问的
    const filteredItems = menuItems.filter((item) =>
      item.roles?.includes(userRole)
    );

    // 按分类分组菜单项
    const groupedItems = useMemo(() => {
      const groups: Record<string, NavMenuItem[]> = {};

      filteredItems.forEach((item) => {
        const category = item.category || "其他";
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(item);
      });

      // 对每个分类内的菜单项按照最后编辑时间排序（最新的在前）
      Object.keys(groups).forEach((category) => {
        groups[category].sort((a, b) => {
          const timeA = a.lastEditedTime || 0;
          const timeB = b.lastEditedTime || 0;
          return timeB - timeA; // 降序排列，最新的在前
        });
      });

      return groups;
    }, [filteredItems]);

    // 获取排序后的分组类别
    const sortedCategories = useMemo(() => {
      const allCategories = Object.keys(groupedItems);
      // 按 categoryOrder 排序，未在 order 中的排在最后
      return [
        ...categoryOrder.filter((cat) => allCategories.includes(cat)),
        ...allCategories.filter((cat) => !categoryOrder.includes(cat)),
      ];
    }, [groupedItems, categoryOrder]);

    // 调试输出
    console.log("categoryOrder from Notion:", categoryOrder);
    console.log("sortedCategories used for rendering:", sortedCategories);
    console.log(
      "All menuItems categories:",
      filteredItems.map((i) => i.category)
    );

    // 服务端渲染时返回基础结构
    if (!mounted) {
      return <div className="mb-6" />;
    }

    if (filteredItems.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        {sortedCategories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="font-semibold text-slate-800 text-base mb-4 text-white">
              <i
                className="iconfont icon-notion"
                style={{ marginRight: "4px", marginTop: "-3px" }}
              />
              {category}
            </h2>

            <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
              {groupedItems[category].map((item, index) => (
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
        ))}
      </div>
    );
  }
);

GroupedNotionMenu.displayName = "GroupedNotionMenu";
