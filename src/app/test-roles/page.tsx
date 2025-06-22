"use client";

import { useState } from "react";
import { useNotionRoles } from "@/hooks/useNotionRoles";
import { PASSWORDS } from "@/config/constants";

export default function TestRolesPage() {
  const { roles, loading, error } = useNotionRoles();
  const [testRole, setTestRole] = useState("");
  const [testResult, setTestResult] = useState("");

  const handleTestRole = () => {
    if (!testRole.trim()) {
      setTestResult("请输入要测试的角色");
      return;
    }

    const validRoles = [...roles, ...PASSWORDS];
    const isValid = validRoles.includes(testRole);

    setTestResult(
      isValid
        ? `✅ 角色 "${testRole}" 验证成功！`
        : `❌ 角色 "${testRole}" 验证失败！\n可用角色: ${validRoles.join(", ")}`
    );
  };

  const handleTestUrl = (role: string) => {
    const url = `${window.location.origin}?role=${encodeURIComponent(role)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">角色验证测试</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Notion角色状态 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Notion角色状态
            </h2>

            {loading && (
              <div className="text-white/70">正在加载Notion角色...</div>
            )}

            {error && <div className="text-red-400">加载失败: {error}</div>}

            {!loading && !error && (
              <div>
                <p className="text-white/70 mb-2">从Notion数据库获取的角色:</p>
                <div className="space-y-2">
                  {roles.length > 0 ? (
                    roles.map((role, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                      >
                        <span className="text-white">{role}</span>
                        <button
                          onClick={() => handleTestUrl(role)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                        >
                          测试URL
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/50">暂无角色数据</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 角色测试 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              角色验证测试
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  测试角色:
                </label>
                <input
                  type="text"
                  value={testRole}
                  onChange={(e) => setTestRole(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="输入要测试的角色"
                />
              </div>

              <button
                onClick={handleTestRole}
                className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                验证角色
              </button>

              {testResult && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <pre className="text-white text-sm whitespace-pre-wrap">
                    {testResult}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 备用密码 */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">备用密码</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PASSWORDS.map((password, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 rounded-lg p-3"
              >
                <span className="text-white">{password}</span>
                <button
                  onClick={() => handleTestUrl(password)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                >
                  测试URL
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-blue-500/20 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">使用说明</h2>
          <div className="text-white/80 space-y-2">
            <p>• 点击"测试URL"按钮会在新标签页中打开带有role参数的页面</p>
            <p>• 如果role参数有效，页面会显示加载状态然后自动解锁</p>
            <p>• 如果role参数无效，页面会显示锁定界面</p>
            <p>• 这样可以测试URL角色验证功能是否正常工作</p>
          </div>
        </div>
      </div>
    </div>
  );
}
