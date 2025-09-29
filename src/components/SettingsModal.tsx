import { useEffect, useState } from 'react';
import LiquidGlassWrapper from './LiquidGlassWrapper';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeToggle: () => void;
  onNetworkToggle: () => void;
  isLiquidGlass: boolean;
  isLan: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onThemeToggle,
  onNetworkToggle,
  isLiquidGlass,
  isLan,
}) => {
  useEffect(() => {
    const scrollContainer = document.getElementById('main-content') || document.body;
    if (isOpen) {
      scrollContainer.style.overflow = 'hidden';
    } else {
      scrollContainer.style.overflow = '';
    }
    return () => {
      scrollContainer.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* 设置面板 */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <LiquidGlassWrapper isActive={true} className="relative rounded-2xl">
          <div className="w-80 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">设置</h2>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* 主题设置 */}
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors">
                <div className="text-white">
                  <div className="font-medium">液态玻璃主题</div>
                  <div className="text-sm text-white/70">
                    {isLiquidGlass ? '已启用' : '已禁用'}
                  </div>
                </div>
                <button
                  onClick={onThemeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isLiquidGlass ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isLiquidGlass ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 网络设置 */}
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors">
                <div className="text-white">
                  <div className="font-medium">内外网切换</div>
                  <div className="text-sm text-white/70">
                    {isLan ? '当前：内网' : '当前：外网'}
                  </div>
                </div>
                <button
                  onClick={onNetworkToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isLan ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isLan ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </LiquidGlassWrapper>
      </div>
    </>
  );
};

export default SettingsModal;