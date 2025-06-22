"use client";

import { useState } from "react";
import { Lock } from "@/components/Lock";

export default function TestAuthPage() {
  const [isLocked, setIsLocked] = useState(true);
  const [userRole, setUserRole] = useState("");

  const handleUnlock = (role: string) => {
    setUserRole(role);
    setIsLocked(false);
  };

  const handleLock = () => {
    setIsLocked(true);
    setUserRole("");
  };

  if (isLocked) {
    return <Lock onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">登录验证测试</h1>
          <div className="space-y-2 text-white">
            <p>
              <strong>当前用户角色:</strong> {userRole}
            </p>
            <p>
              <strong>登录状态:</strong> 已解锁
            </p>
          </div>
          <button
            onClick={handleLock}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            重新锁定
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">使用说明</h2>
          <div className="space-y-3 text-gray-300">
            <p>1. 页面默认处于锁定状态</p>
            <p>2. 输入Notion数据库中Roles字段的值进行解锁</p>
            <p>3. 系统会验证密码是否匹配任何角色</p>
            <p>4. 验证成功后显示用户角色信息</p>
            <p>5. 可以点击"重新锁定"按钮测试锁定功能</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">测试步骤</h2>
          <div className="space-y-3 text-gray-300">
            <p>1. 在Notion数据库中添加菜单项，设置Roles字段</p>
            <p>2. 使用Roles字段的值作为密码尝试登录</p>
            <p>3. 验证登录成功后会显示对应的用户角色</p>
            <p>4. 测试不同角色的权限控制</p>
          </div>
        </div>
      </div>
    </div>
  );
}
