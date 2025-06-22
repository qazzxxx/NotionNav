import { useState, useEffect } from "react";
import { NavMenuItem } from "@/types";

const FAVORITES_KEY = "nnav_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<NavMenuItem[]>([]);

  // 从localStorage加载收藏
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setFavorites(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error("加载收藏失败:", error);
        setFavorites([]);
      }
    };

    loadFavorites();
  }, []);

  // 添加收藏
  const addFavorite = (item: NavMenuItem) => {
    const newFavorites = [...favorites];
    const exists = newFavorites.find((fav) => fav.href === item.href);

    if (!exists) {
      newFavorites.push(item);
      setFavorites(newFavorites);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    }
  };

  // 移除收藏
  const removeFavorite = (href: string) => {
    const newFavorites = favorites.filter((fav) => fav.href !== href);
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  // 检查是否已收藏
  const isFavorite = (href: string) => {
    return favorites.some((fav) => fav.href === href);
  };

  // 清空所有收藏
  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem(FAVORITES_KEY);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
  };
};
