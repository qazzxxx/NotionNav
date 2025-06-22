"use client";

import { useNotionMenu } from "@/hooks/useNotionMenu";
import { useFavorites } from "@/hooks/useFavorites";
import { NavMenuItem } from "@/types";
import { useState } from "react";

export default function TestFavoritesPage() {
  const { menuItems, loading, error } = useNotionMenu();
  const { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites } =
    useFavorites();
  const [userRole, setUserRole] = useState("qazz");
  const [isLan, setIsLan] = useState(false);

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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">收藏功能测试</h1>

        <div className="mb-6 space-y-4">
          <div className="flex space-x-4">
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

            <label className="text-white">
              内网模式:
              <input
                type="checkbox"
                checked={isLan}
                onChange={(e) => setIsLan(e.target.checked)}
                className="ml-2"
              />
            </label>
          </div>
        </div>

        {/* 收藏统计 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">收藏统计</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {favorites.length}
              </div>
              <div className="text-sm text-gray-400">总收藏数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {menuItems.length}
              </div>
              <div className="text-sm text-gray-400">总菜单数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {
                  favorites.filter(
                    (fav) =>
                      fav.roles?.includes(userRole) ||
                      !fav.roles ||
                      fav.roles.length === 0
                  ).length
                }
              </div>
              <div className="text-sm text-gray-400">当前用户可访问收藏</div>
            </div>
          </div>
          <button
            onClick={clearFavorites}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            清空所有收藏
          </button>
        </div>

        {/* 收藏列表 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">收藏列表</h2>
          {favorites.length === 0 ? (
            <p className="text-gray-400">暂无收藏</p>
          ) : (
            <div className="grid gap-4">
              {favorites.map((item) => (
                <div
                  key={item.href}
                  className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                        ⭐
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {item.title}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {item.description}
                        </p>
                        <div className="text-gray-400 text-xs mt-1">
                          链接: {item.href}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFavorite(item.href)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                    >
                      移除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center">
                        🔗
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {item.title}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {item.description}
                        </p>
                        <div className="text-gray-400 text-xs mt-1">
                          分类: {item.category} | 权限: {item.roles?.join(", ")}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(item)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        isFavorite(item.href)
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                          : "bg-gray-600 hover:bg-gray-500 text-white"
                      }`}
                    >
                      {isFavorite(item.href) ? "取消收藏" : "收藏"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
