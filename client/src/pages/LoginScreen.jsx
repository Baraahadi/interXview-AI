import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axiosInstance";
import PrimaryButton from "../components/common/PrimaryButton";
import toast from "react-hot-toast";
import AIArtwork from "../components/features/AIArtwork.jsx";
import Footer from "../components/Footer";

export default function LoginScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email validation
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email || !password) {
      setError("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      toast.error("Please enter a valid email.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Save token + user
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login successful!");

      // Redirect to dashboard or home
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Network error. Please try again.";
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#071A2E]">
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-7xl min-h-[80vh] md:min-h-[86vh] lg:min-h-[92vh] rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            background:
              "linear-gradient(135deg, rgba(7,26,46,0.95) 0%, rgba(6,24,39,0.95) 100%)",
          }}
        >
          <div className="p-12 bg-[#071A2E] flex items-center">
            <div className="max-w-lg w-full mx-auto">
              <h1 className="text-white text-3xl md:text-4xl font-semibold mb-1">
                Welcome Back
              </h1>
              <p className="text-[#94a3b8] mb-6 text-sm md:text-base">
                Sign in to continue to InterXview.
              </p>

              {error && (
                <div className="mb-4 rounded-lg bg-red-900/60 border border-red-700 text-red-100 px-4 py-2 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email field */}
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f2847] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
                  />
                </div>

                {/* Password field with toggle */}
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-[#0f2847] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      title={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition focus:outline-none p-1"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.964 9.964 0 012.058-5.637m4.5.658A3 3 0 0115 12a3 3 0 11-6 0c0-.314.051-.617.146-.896M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3l18 18"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="rounded border-gray-600 bg-[#0f2847] text-sky-400 focus:ring-sky-400"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-[#94a3b8]"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot"
                    className="text-sm text-sky-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <PrimaryButton type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </PrimaryButton>
              </form>

              <div className="mt-4 text-center">
                <Link
                  to="/signup"
                  className="text-sm text-sky-400 hover:underline"
                >
                  Don't have an account? Create one
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#071A2E] to-[#061827] p-8">
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <AIArtwork />
              <div className="text-center px-6">
                <h2 className="text-2xl font-semibold text-white">
                  Interview practice with AI
                </h2>
                <p className="text-[#94a3b8] mt-2">
                  Practice real interview questions, get instant feedback, and
                  improve faster.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
