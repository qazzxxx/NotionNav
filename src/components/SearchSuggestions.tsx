import { NavMenuItem } from "@/types";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface SearchSuggestionsProps {
  searchValue: string;
  menuItems: NavMenuItem[];
  userRole: string;
  isLan: boolean;
  onSelectItem: (item: NavMenuItem) => void;
  visible: boolean;
}

export const SearchSuggestions = ({
  searchValue,
  menuItems,
  userRole,
  onSelectItem,
  visible,
}: SearchSuggestionsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 过滤匹配的菜单项
  const matchingItems = menuItems
    .filter(
      (item) =>
        item.roles?.includes(userRole) &&
        (item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.href.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchValue.toLowerCase()))
    )
    .slice(0, 5); // 最多显示5个建议

  // 重置选中索引
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchValue]);

  // 处理键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!visible || matchingItems.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < matchingItems.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : matchingItems.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < matchingItems.length) {
            onSelectItem(matchingItems[selectedIndex]);
          } else if (selectedIndex === -1 && matchingItems.length > 0) {
            // 没有选中时，回车默认打开第一个
            onSelectItem(matchingItems[0]);
          }
          break;
        case "Escape":
          setSelectedIndex(-1);
          break;
      }
    };

    if (visible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, matchingItems, selectedIndex, onSelectItem]);

  if (
    !visible ||
    searchValue.trim().length === 0 ||
    matchingItems.length === 0
  ) {
    return null;
  }

  return (
    <div
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 z-50 max-h-60 overflow-y-auto rounded-xl shadow-xl border border-white/10 backdrop-blur-lg bg-black/40 dark:bg-black/60 transition-all duration-200"
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {matchingItems.map((item, index) => (
        <div
          key={item.id || item.href}
          className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors rounded-lg ${
            index === selectedIndex ? "bg-black/20" : "hover:bg-black/10"
          }`}
          onClick={() => onSelectItem(item)}
        >
          {item.avatar ? (
            <Image
              src={item.avatar}
              alt={item.title}
              className="rounded w-6 h-6"
              width={24}
              height={24}
              loading="lazy"
            />
          ) : (
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-xs text-white"
              style={{
                background: "#673ab7",
              }}
            >
              {item.title.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div
              className={`font-medium truncate ${
                index === selectedIndex ? "text-blue-400" : "text-white"
              }`}
            >
              {item.title}
            </div>
            {item.description && (
              <div className="text-sm text-gray-300 truncate">
                {item.description}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-300">{item.category || "其他"}</div>
        </div>
      ))}
    </div>
  );
};
