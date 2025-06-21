import { PASSWORDS } from "@/config/constants";
import { useState } from "react";

interface LockProps {
  onUnlock: (role: string) => void;
}

export const Lock = ({ onUnlock }: LockProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (PASSWORDS.includes(password)) {
      onUnlock(password);
    } else {
      setError(true);
      setPassword("");
      // 500ms 后重置错误状态
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />
      <div className="relative z-10 p-8 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-64 px-4 py-2 pr-12 rounded-full bg-white/5 backdrop-blur-sm 
                       border border-white/20 text-white placeholder-white/50 
                       outline-none focus:ring-2 focus:ring-white/30 
                       transition-all duration-300
                       ${error ? "animate-shake-error" : ""}`}
              placeholder="请输入密码解锁..."
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2
                       w-8 h-8 flex items-center justify-center
                       rounded-full bg-white/10 hover:bg-white/20
                       transition-all duration-300 group"
              aria-label="提交"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5 text-white/70 group-hover:text-white
                         transition-colors duration-300"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
