"use client";

import { useNotionMenu } from "@/hooks/useNotionMenu";
import { SearchBar } from "@/components/SearchBar";
import { NavMenuItem } from "@/types";
import { useState } from "react";

export default function TestSearchPage() {
  const { menuItems, loading, error } = useNotionMenu();
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState("qazz");
  const [isLan, setIsLan] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Search submitted:", searchValue);
  };

  const handleSelectMenuItem = (item: NavMenuItem) => {
    console.log("Selected menu item:", item);
    const url = isLan ? item.lanHref || item.href : item.href;
    window.open(url, "_blank");
    setSearchValue("");
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
        <h1 className="text-3xl font-bold text-white mb-8">搜索功能测试</h1>

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

        <div className="mb-8">
          <SearchBar
            value={searchValue}
            hitokoto={{ hitokoto: "测试搜索功能", from: "测试" }}
            onSearch={handleSearch}
            onSubmit={handleSubmit}
            menuItems={menuItems}
            userRole={userRole}
            isLan={isLan}
            onSelectMenuItem={handleSelectMenuItem}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            菜单项数量: {menuItems.length}
          </h2>
        </div>

        <div className="grid gap-4">
          {menuItems.map((item) => (
            <div
              key={item.id || item.href}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
            >
              <div className="flex items-center space-x-4">
                {item.avatar && (
                  <img
                    src={item.avatar}
                    alt={item.title}
                    className="w-8 h-8 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                  <div className="text-gray-400 text-xs mt-1">
                    <span>链接: {item.href}</span>
                    {item.lanHref && (
                      <span className="ml-4">内网: {item.lanHref}</span>
                    )}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    权限: {item.roles?.join(", ")} | 分类: {item.category}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
