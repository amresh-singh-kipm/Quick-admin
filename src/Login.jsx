import React, { useState } from "react";
import { ShoppingBag, Lock, Smartphone, Loader2 } from "lucide-react";
import api from "./api";

const Login = ({ setToken }) => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { mobile, password });
      if (response.data.success && response.data.user.role === "ADMIN") {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminUser", JSON.stringify(response.data.user));
        setToken(response.data.token);
      } else {
        setError("Access denied: You are not an administrator.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c0e] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-emerald-500 rounded-2xl items-center justify-center shadow-2xl shadow-emerald-500/40 mb-4 animate-bounce-slow">
            <ShoppingBag className="text-black" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            QUICK<span className="text-emerald-500">ADMIN</span>
          </h1>
          <p className="text-gray-400 font-medium">
            Platform Management Portal
          </p>
        </div>

        <div className="bg-[#1e1e1e] p-8 rounded-3xl border border-gray-800 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Mobile Number
              </label>
              <div className="relative group">
                <Smartphone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-emerald-500 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9999999999"
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-gray-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-emerald-500 transition-colors"
                  size={20}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-gray-700"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-black font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                "Enter Dashboard"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-8 font-medium">
          &copy; 2026 Quick Commerce Inc. &bull; Enterprise Admin Security
        </p>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
