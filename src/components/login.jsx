import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, [navigate]);

  const collectdata = async () => {
    setIsLoading(true);
    setError("");

    try {
      let result = await fetch("http://localhost:9000/login", {
        body: JSON.stringify({ email, password }),
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      console.log(result);

      if (result.auth) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", JSON.stringify(result.auth));
        navigate("/");
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    collectdata();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-[#3B82F6] rounded-full opacity-5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-[#10B981] rounded-full opacity-5 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.08, 0.05, 0.08],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main card */}
        <motion.div
          className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-3xl shadow-2xl overflow-hidden border border-[#334155]/50"
          whileHover={{
            boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.15)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="relative px-10 pt-12 pb-10 text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] mb-8 shadow-lg shadow-[#3B82F6]/20">
                <LogIn className="w-10 h-10 text-white" strokeWidth={2} />
              </div>

              <h1 className="text-4xl font-bold text-[#F1F5F9] mb-3 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-[#94A3B8] text-base">
                Enter your credentials to access your account
              </p>
            </motion.div>
          </div>

          {/* Form area */}
          <div className="px-10 pb-10 space-y-6">
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 rounded-xl p-4"
              >
                <p className="text-sm text-red-400 text-center">{error}</p>
              </motion.div>
            )}

            {/* Email field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-3"
            >
              <label className="block text-sm font-semibold text-[#F1F5F9] tracking-wide">
                EMAIL ADDRESS
              </label>
              <motion.div className="relative" whileTap={{ scale: 0.995 }}>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] pointer-events-none" />
                <motion.input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-5 py-4 bg-[#0F172A] border-2 rounded-2xl text-[#F1F5F9] text-base placeholder-[#475569] focus:outline-none transition-all duration-300"
                  style={{
                    borderColor:
                      focusedField === "email" ? "#3B82F6" : "#334155",
                  }}
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-[#F1F5F9] tracking-wide">
                  PASSWORD
                </label>
                <button
                  onClick={() => console.log("Forgot password")}
                  className="text-sm font-medium text-[#3B82F6] hover:text-[#60A5FA] transition-colors duration-200"
                >
                  Forgot?
                </button>
              </div>
              <motion.div className="relative" whileTap={{ scale: 0.995 }}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] pointer-events-none" />
                <motion.input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-14 py-4 bg-[#0F172A] border-2 rounded-2xl text-[#F1F5F9] text-base placeholder-[#475569] focus:outline-none transition-all duration-300"
                  style={{
                    borderColor:
                      focusedField === "password" ? "#3B82F6" : "#334155",
                  }}
                  whileFocus={{ scale: 1.01 }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </motion.div>
            </motion.div>

            {/* Sign in button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.button
                onClick={handleSubmit}
                disabled={isLoading}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full mt-2 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold py-4 px-6 rounded-2xl shadow-xl shadow-[#3B82F6]/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 text-base">
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span>Signing you in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#334155]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-b from-[#1E293B] to-[#0F172A] text-[#64748B] font-medium">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-3 px-5 py-4 bg-[#0F172A] border-2 border-[#334155] rounded-2xl text-[#F1F5F9] font-medium hover:border-[#3B82F6] hover:bg-[#1E293B] transition-all duration-300 shadow-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm">Google</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-3 px-5 py-4 bg-[#0F172A] border-2 border-[#334155] rounded-2xl text-[#F1F5F9] font-medium hover:border-[#3B82F6] hover:bg-[#1E293B] transition-all duration-300 shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="text-sm">GitHub</span>
              </motion.button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-10 py-8 bg-[#0F172A]/80 border-t border-[#334155]/50 text-center backdrop-blur-sm">
            <p className="text-sm text-[#94A3B8]">
              Don't have an account?{" "}
              <motion.button
                onClick={() => navigate("/signup")}
                whileHover={{ scale: 1.05 }}
                className="text-[#3B82F6] hover:text-[#60A5FA] font-semibold transition-colors duration-200"
              >
                Create one
              </motion.button>
            </p>
          </div>
        </motion.div>

        {/* Bottom links */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 text-center text-xs text-[#64748B]"
        >
          Protected by industry-standard encryption
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;