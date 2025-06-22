"use client";

import { useState, useEffect } from "react";

interface MenuItem {
  id: string;
  title: string;
  description: string;
  href: string;
  avatar?: string;
  roles: string[];
  category: string;
  status: string;
  isVisible: boolean;
  rawStatus: string;
}

interface DebugData {
  allItems: MenuItem[];
  totalCount: number;
  visibleCount: number;
  hiddenCount: number;
}

export default function TestStatusPage() {
  const [data, setData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/debug-menu")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">无数据</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">菜单状态测试</h1>

        {/* 统计信息 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">统计信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-white">
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {data.totalCount}
              </div>
              <div className="text-sm text-gray-400">总菜单数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {data.visibleCount}
              </div>
              <div className="text-sm text-gray-400">显示菜单数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {data.hiddenCount}
              </div>
              <div className="text-sm text-gray-400">隐藏菜单数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {
                  data.allItems.filter((item) => item.roles?.includes("qazz"))
                    .length
                }
              </div>
              <div className="text-sm text-gray-400">qazz用户可访问</div>
            </div>
          </div>
        </div>

        {/* 所有菜单列表 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">所有菜单项</h2>
          {data.allItems.length === 0 ? (
            <p className="text-gray-400">暂无菜单项</p>
          ) : (
            <div className="grid gap-4">
              {data.allItems.map((item) => (
                <div
                  key={item.href}
                  className={`p-4 rounded-lg border ${
                    item.isVisible
                      ? "bg-gray-700 border-green-500"
                      : "bg-gray-600 border-red-500 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center ${
                          item.isVisible ? "bg-green-400" : "bg-red-400"
                        }`}
                      >
                        {item.isVisible ? "✅" : "❌"}
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
                        <div className="text-gray-400 text-xs mt-1">
                          分类: {item.category} | 权限: {item.roles?.join(", ")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-semibold ${
                          item.isVisible ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        状态: {item.status}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {item.isVisible ? "显示中" : "已隐藏"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 说明 */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">状态说明</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              •
              当前只显示状态为&ldquo;显示&rdquo;、&ldquo;active&rdquo;或&ldquo;Active&rdquo;的菜单项
            </p>
            <p>
              •
              状态为&ldquo;隐藏&rdquo;、&ldquo;hidden&rdquo;或其他值的菜单项会被过滤掉
            </p>
            <p>• 如果菜单项不显示，请检查Notion数据库中的status字段</p>
            <p>• 支持的显示状态值：显示、active、Active</p>
            <p>• 支持的隐藏状态值：隐藏、hidden、Hidden、inactive等</p>
          </div>
        </div>
      </div>
    </div>
  );
}
