"use client";

import { Avatar } from "@/components/Avatar";
import Link from "next/link";

export default function TestAvatarPage() {
  const testItems = [
    {
      title: "Google",
      href: "https://google.com",
      avatar: "", // 空avatar，应该使用favicon
    },
    {
      title: "GitHub",
      href: "https://github.com",
      avatar: "", // 空avatar，应该使用favicon
    },
    {
      title: "Stack Overflow",
      href: "https://stackoverflow.com",
      avatar: "", // 空avatar，应该使用favicon
    },
    {
      title: "Invalid URL",
      href: "invalid-url",
      avatar: "", // 无效URL，应该显示默认图标
    },
    {
      title: "With Custom Avatar",
      href: "https://example.com",
      avatar: "https://via.placeholder.com/36x36/ff6b6b/ffffff?text=AV", // 有avatar，应该显示原始avatar
    },
    {
      title: "Broken Avatar",
      href: "https://example.org",
      avatar: "https://broken-image-url-that-will-fail.com/image.png", // 损坏的avatar，应该使用favicon
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Avatar 组件测试
        </h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">测试说明</h2>
          <ul className="text-gray-200 space-y-2">
            <li>• 空avatar：使用 favicon.im 服务获取网站图标</li>
            <li>• 损坏avatar：加载失败后使用 favicon.im 备选</li>
            <li>• 有效avatar：正常显示原始图标</li>
            <li>• 无效URL：显示默认文本图标</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testItems.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center space-x-4 mb-4">
                <Avatar
                  src={item.avatar}
                  alt={item.title}
                  href={item.href}
                  size={48}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.href}</p>
                </div>
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <div>Avatar: {item.avatar || "空"}</div>
                <div>URL: {item.href}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
