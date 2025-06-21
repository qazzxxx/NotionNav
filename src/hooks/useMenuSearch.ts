import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { MenuData } from "@/types";

export const useMenuSearch = (baseData: MenuData[]) => {
  const [menuData, setMenuData] = useState<MenuData[]>(baseData);
  const [searchValue, setSearchValue] = useState("");

  // 重置动画的辅助函数
  const resetAnimations = () => {
    const items = document.querySelectorAll(".nav-item");
    items.forEach((item) => {
      item.classList.remove("nav-item");
      void (item as HTMLElement).offsetWidth; // 触发重排，重置动画
      item.classList.add("nav-item");
    });
  };

  useEffect(() => {
    if (searchValue.trim()) {
      const value = searchValue.toLowerCase();
      const filteredData = baseData.map((menu) => ({
        ...menu,
        items: menu.items.filter(
          (item) =>
            item.title.toLowerCase().includes(value) ||
            item.href.toLowerCase().includes(value) ||
            item.description?.toLowerCase().includes(value)
        ),
      }));
      setMenuData(filteredData);
      // 重置动画
      setTimeout(resetAnimations, 0);
    } else {
      setMenuData(baseData);
      // 重置动画
      setTimeout(resetAnimations, 0);
    }
  }, [baseData, searchValue]);

  const searchMenu = useCallback(
    debounce((value: string) => {
      setSearchValue(value);
    }, 300),
    []
  );

  return { menuData, searchMenu };
};
