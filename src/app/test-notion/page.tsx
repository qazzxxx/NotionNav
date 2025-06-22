"use client";

import { useNotionMenu } from "@/hooks/useNotionMenu";
import { NavMenuItem } from "@/types";

export default function TestNotionPage() {
  const { menuItems, loading, error, refetch } = useNotionMenu();

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
        <div className="text-red-400 text-xl">
          错误: {error}
          <button
            onClick={refetch}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Notion菜单测试</h1>

        <div className="mb-6">
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            刷新数据
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            菜单项数量: {menuItems.length}
          </h2>
        </div>

        {menuItems.length === 0 ? (
          <div className="text-yellow-400 text-lg">
            没有找到菜单项。请检查：
            <ul className="list-disc list-inside mt-2 ml-4">
              <li>数据库ID是否正确</li>
              <li>数据库是否包含数据</li>
              <li>数据库权限设置</li>
              <li>属性名称是否匹配</li>
            </ul>
          </div>
        ) : (
          <div className="grid gap-4">
            {menuItems.map((item: NavMenuItem) => (
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
                      权限: {item.roles?.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white font-semibold mb-2">原始数据</h3>
          <pre className="text-gray-300 text-sm overflow-auto">
            {JSON.stringify(menuItems, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
