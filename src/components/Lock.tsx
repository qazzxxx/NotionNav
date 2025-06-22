import { useState } from "react";

interface LockProps {
  onUnlock: (role: string) => void;
}

interface AuthResponse {
  success: boolean;
  role?: string;
  message: string;
  availableRoles?: string[];
}

export const Lock = ({ onUnlock }: LockProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setError(true);
      setErrorMessage("请输入密码");
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 2000);
      return;
    }

    setLoading(true);
    setError(false);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.role) {
        onUnlock(data.role);
      } else {
        setError(true);
        setErrorMessage(data.message || "密码错误");
        setPassword("");
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error("登录验证失败:", error);
      setError(true);
      setErrorMessage("网络错误，请重试");
      setPassword("");
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />
      <div className="relative z-10 p-8 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">页面锁定</h2>
            <p className="text-white/70 text-sm">请输入密码解锁页面</p>
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-64 px-4 py-2 pr-12 rounded-full bg-white/5 backdrop-blur-sm 
                       border border-white/20 text-white placeholder-white/50 
                       outline-none focus:ring-2 focus:ring-white/30 
                       transition-all duration-300
                       ${error ? "animate-shake-error border-red-400" : ""}`}
              placeholder="请输入密码..."
              autoFocus
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2
                       w-8 h-8 flex items-center justify-center
                       rounded-full bg-white/10 hover:bg-white/20
                       transition-all duration-300 group disabled:opacity-50"
              aria-label="提交"
            >
              {loading ? (
                <svg
                  className="animate-spin w-5 h-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
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
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="text-red-400 text-sm text-center animate-pulse">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
