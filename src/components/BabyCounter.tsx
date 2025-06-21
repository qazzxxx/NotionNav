import { useMemo } from "react";
import { TARGET_DATE } from "@/config/constants";

export const BabyCounter = () => {
  const daysUntil = useMemo(() => {
    const targetDate = new Date(TARGET_DATE);
    const now = new Date();
    const diffTime = Math.abs(targetDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  return (
    <div
      style={{ backgroundColor: "rgba(42, 42, 42, 0.42)" }}
      className="group nav-item rounded-2xl p-5 text-white hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        {/* 左侧图标和文字 */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full">
            <span className="text-4xl mr-2">👶</span>
          </div>
          <div>
            <div className="text-sm text-white/70 mb-1">小也宝</div>
            <div className="flex items-baseline">
              <span className="text-3xl font-light text-white">
                {daysUntil}
              </span>
              <span className="ml-2 text-sm text-white/70">天啦</span>
            </div>
          </div>
        </div>

        {/* 右侧装饰 */}
        <div className="hidden md:flex items-center space-x-1 text-pink-400/30">
          <span className="text-lg">♡</span>
          <span className="text-lg">♡</span>
          <span className="text-lg">♡</span>
        </div>
      </div>
    </div>
  );
};
