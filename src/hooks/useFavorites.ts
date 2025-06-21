import { useState, useCallback } from "react";
import { NavMenuItem } from "@/types";
import { storage } from "@/utils/storage";

export const useFavorites = () => {
  // 初始化时从localStorage读取收藏数据
  const [favorites, setFavorites] = useState<NavMenuItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = storage.get("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // 使用useCallback缓存函数
  const toggleFavorite = useCallback((item: NavMenuItem) => {
    setFavorites((prev) => {
      const isCurrentlyFavorited = prev.some((fav) => fav.href === item.href);
      const newFavorites = isCurrentlyFavorited
        ? prev.filter((fav) => fav.href !== item.href)
        : [...prev, { ...item, isFavorite: true }];

      // 更新localStorage
      storage.set("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (href: string) => {
      return favorites.some((fav) => fav.href === href);
    },
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
};
