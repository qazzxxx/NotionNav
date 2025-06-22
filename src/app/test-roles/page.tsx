"use client";

import { useNotionRoles } from "@/hooks/useNotionRoles";
import { PASSWORDS } from "@/config/constants";

export default function TestRolesPage() {
  const { roles, loading, error, refetch } = useNotionRoles();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Notion 角色测试页面
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            角色获取状态
          </h2>

          {loading && (
            <div className="text-blue-600 mb-4">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
              正在从 Notion 数据库获取角色...
            </div>
          )}

          {error && (
            <div className="text-red-600 mb-4 p-4 bg-red-50 rounded border border-red-200">
              <strong>错误:</strong> {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Notion 数据库中的角色 ({roles.length} 个)
                </h3>
                {roles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">未找到任何角色</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  备用密码 ({PASSWORDS.length} 个)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PASSWORDS.map((password, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {password}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  所有有效角色 ({roles.length + PASSWORDS.length} 个)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[...roles, ...PASSWORDS].map((role, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        roles.includes(role)
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {role}
                      {roles.includes(role) ? " (Notion)" : " (备用)"}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={refetch}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "获取中..." : "重新获取角色"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            URL 参数测试
          </h2>
          <p className="text-gray-600 mb-4">
            您可以通过以下 URL 参数测试角色验证功能：
          </p>
          <div className="space-y-2">
            {roles.slice(0, 3).map((role, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border">
                <code className="text-sm text-blue-600">?role={role}</code>
                <span className="ml-2 text-xs text-gray-500">
                  (Notion 角色)
                </span>
              </div>
            ))}
            {PASSWORDS.map((password, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border">
                <code className="text-sm text-green-600">?role={password}</code>
                <span className="ml-2 text-xs text-gray-500">(备用密码)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
