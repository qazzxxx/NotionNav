"use client";

import { useNotionMenu } from "@/hooks/useNotionMenu";
import { useFavorites } from "@/hooks/useFavorites";
import { NavMenuItem } from "@/types";
import { useState } from "react";

export default function TestFavoritesSyncPage() {
  const { menuItems, loading, error } = useNotionMenu();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [userRole, setUserRole] = useState("qazz");

  const handleToggleFavorite = (item: NavMenuItem) => {
    if (isFavorite(item.href)) {
      removeFavorite(item.href);
    } else {
      addFavorite(item);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">错误: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">收藏状态同步测试</h1>

        <div className="mb-6">
          <label className="text-white">
            用户角色:
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="ml-2 bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
            >
              <option value="guest">guest</option>
              <option value="qazz">qazz</option>
            </select>
          </label>
        </div>

        {/* 收藏状态 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">收藏状态</h2>
          <div className="text-white">
            <p>
              总收藏数:{" "}
              <span className="text-yellow-400 font-bold">
                {favorites.length}
              </span>
            </p>
            <p>
              当前用户可访问收藏:{" "}
              <span className="text-green-400 font-bold">
                {
                  favorites.filter(
                    (fav) =>
                      fav.roles?.includes(userRole) ||
                      !fav.roles ||
                      fav.roles.length === 0
                  ).length
                }
              </span>
            </p>
          </div>
        </div>

        {/* 菜单列表 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">菜单列表</h2>
          <div className="grid gap-4">
            {menuItems
              .filter((item) => item.roles?.includes(userRole))
              .map((item) => (
                <div
                  key={item.href}
                  className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <p className="text-gray-300 text-sm">
                        {item.description}
                      </p>
                      <div className="text-gray-400 text-xs mt-1">
                        分类: {item.category} | 权限: {item.roles?.join(", ")}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(item)}
                      className={`px-4 py-2 rounded transition-colors ${
                        isFavorite(item.href)
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                          : "bg-gray-600 hover:bg-gray-500 text-white"
                      }`}
                    >
                      {isFavorite(item.href) ? "❤️ 已收藏" : "🤍 收藏"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 收藏列表 */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">收藏列表</h2>
          {favorites.length === 0 ? (
            <p className="text-gray-400">暂无收藏</p>
          ) : (
            <div className="grid gap-4">
              {favorites
                .filter(
                  (fav) =>
                    fav.roles?.includes(userRole) ||
                    !fav.roles ||
                    fav.roles.length === 0
                )
                .map((item) => (
                  <div
                    key={item.href}
                    className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">
                          ⭐ {item.title}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {item.description}
                        </p>
                        <div className="text-gray-400 text-xs mt-1">
                          链接: {item.href}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFavorite(item.href)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                      >
                        移除
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
