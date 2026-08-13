import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import PrimaryButton from "../components/common/PrimaryButton";
import TextLink from "../components/common/TextLink";
import AIArtwork from "../components/features/AIArtwork";
import Footer from "../components/Footer";

export default function SignupScreen({ onRegisterSuccess }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("Name is required.");
      return;
    }
    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (!confirmPassword) {
      setError("Confirm Password is required.");
      return;
    }
    if (name.length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        username: name,
        email,
        password,
      });

      const successMsg =
        response.data?.message ||
        "Account created successfully! Please log in.";
      toast.success(successMsg);
      setError("");
      if (onRegisterSuccess) onRegisterSuccess(successMsg);
      navigate("/login");
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
          {/* Left: artwork + messaging (visual, bold) */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#071A2E] to-[#061827] p-12 h-full">
            <div className="w-full h-full flex flex-col items-center justify-center gap-6">
              <div className="w-64 h-64 md:w-[420px] md:h-[420px]">
                <AIArtwork />
              </div>
              <div className="text-center px-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-white">
                  Welcome to InterXview
                </h2>
                <p className="text-[#94a3b8] mt-3 max-w-xs md:max-w-sm">
                  AI powered interview prep & CV optimization — get
                  interview-ready faster.
                </p>
              </div>
            </div>
          </div>

          {/* Right: form (immersive) */}
          <div className="p-12 bg-[#071A2E] flex items-center">
            <div className="max-w-lg w-full mx-auto">
              <h1 className="text-white text-3xl md:text-4xl font-semibold mb-2">
                Create Account
              </h1>
              <p className="text-[#94a3b8] mb-6 text-sm md:text-base">
                Join InterXview and unlock personalized interview practice.
              </p>

              {error && (
                <div className="mb-4 rounded-lg bg-red-900/60 border border-red-700 text-red-100 px-4 py-2 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name field */}
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f2847] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
                  />
                </div>

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
                      placeholder="Create a strong password"
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

                {/* Confirm Password field with toggle */}
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-[#0f2847] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      title={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition focus:outline-none p-1"
                    >
                      {showConfirmPassword ? (
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

                <PrimaryButton type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </PrimaryButton>
              </form>

              <div className="mt-4 text-center">
                <TextLink onClick={() => navigate("/login")} showIcon={false}>
                  Already have an account? Sign in
                </TextLink>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
