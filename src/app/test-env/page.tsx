"use client";

import { useState, useEffect } from "react";

interface EnvironmentInfo {
  success: boolean;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  environment: {
    nodeEnv: string;
    notionPageId: string;
    isProduction: boolean;
    isDevelopment: boolean;
  };
  currentPageId: string;
  timestamp: string;
}

export default function TestEnvPage() {
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/env-check");
        const data = await response.json();

        if (data.success) {
          setEnvInfo(data);
        } else {
          setError(data.error || "Failed to check environment");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    checkEnvironment();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">检查环境配置中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">环境检查失败</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            重新检查
          </button>
        </div>
      </div>
    );
  }

  if (!envInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">无法获取环境信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">环境配置检查</h1>

        {/* 验证结果 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">配置验证</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-medium">状态:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-sm ${
                  envInfo.validation.isValid
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {envInfo.validation.isValid ? "✅ 配置正确" : "❌ 配置有误"}
              </span>
            </div>

            {envInfo.validation.errors.length > 0 && (
              <div>
                <span className="font-medium text-red-600">错误:</span>
                <ul className="ml-4 mt-1 text-red-600">
                  {envInfo.validation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {envInfo.validation.warnings.length > 0 && (
              <div>
                <span className="font-medium text-yellow-600">警告:</span>
                <ul className="ml-4 mt-1 text-yellow-600">
                  {envInfo.validation.warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 环境信息 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">环境信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Node 环境:</span>
              <span className="ml-2 text-gray-600">
                {envInfo.environment.nodeEnv}
              </span>
            </div>
            <div>
              <span className="font-medium">生产环境:</span>
              <span className="ml-2 text-gray-600">
                {envInfo.environment.isProduction ? "是" : "否"}
              </span>
            </div>
            <div>
              <span className="font-medium">开发环境:</span>
              <span className="ml-2 text-gray-600">
                {envInfo.environment.isDevelopment ? "是" : "否"}
              </span>
            </div>
            <div>
              <span className="font-medium">环境变量 NOTION_PAGE_ID:</span>
              <span className="ml-2 text-gray-600">
                {envInfo.environment.notionPageId}
              </span>
            </div>
          </div>
        </div>

        {/* 当前配置 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">当前配置</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">当前使用的页面 ID:</span>
              <span className="ml-2 font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {envInfo.currentPageId}
              </span>
            </div>
            <div>
              <span className="font-medium">检查时间:</span>
              <span className="ml-2 text-gray-600">
                {new Date(envInfo.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">操作</h2>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              重新检查
            </button>
            <button
              onClick={() => window.open("/api/env-check", "_blank")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              查看 API 响应
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
