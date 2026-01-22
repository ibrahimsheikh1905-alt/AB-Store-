import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(
    location.pathname === '/register' || location.state?.showRegister
  );

  // Update isRegister when location changes
  useEffect(() => {
    if (location.pathname === '/register' || location.state?.showRegister) {
      setIsRegister(true);
    }
  }, [location]);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const result = await login(loginData.email, loginData.password);
    setLoading(false);

    if (result.success) {
      // Regular users only - redirect to home
      if (result.user?.isAdmin) {
        setErrorMsg("Please use admin login page");
        return;
      }
      setSuccessMsg("Login successful");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/");
      }, 1200);
    } else {
      setErrorMsg(result.error || "Login failed");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    if (registerData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    setLoading(true);
    const result = await register(registerData.name, registerData.email, registerData.password);
    setLoading(false);

    if (result.success) {
      // Regular users only
      if (result.user?.isAdmin) {
        setErrorMsg("Please use admin registration page");
        return;
      }
      setSuccessMsg("Account created successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        setIsRegister(false);
        navigate("/");
      }, 2500);
    } else {
      setErrorMsg(result.error || "Signup failed");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const fieldWrapperClass =
    "relative animate-fade-in-up bg-white/5 rounded-2xl border-2 border-white/40 hover:border-white/70 focus-within:border-orange-500 focus-within:shadow-[0_0_0_4px_rgba(249,115,22,0.15)] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.25)]";

  const inputClass =
    "w-full bg-transparent text-white placeholder-gray-400 px-11 py-3 rounded-2xl outline-none border-0 focus:ring-0";

  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-gray-300";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] relative overflow-hidden p-4 animate-fade-in">
      {/* BACKGROUND */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/30 blur-[180px] animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 blur-[180px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative w-full max-w-[900px] h-[560px] bg-white/5 backdrop-blur-xl border-2 border-orange-500 rounded-[40px] overflow-hidden shadow-[0_0_25px_rgba(249,115,22,0.9),0_0_90px_rgba(249,115,22,0.65)] animate-scale-in">

        {/* SUCCESS */}
        {successMsg && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500/20 border border-green-400 text-green-300 px-6 py-3 rounded-2xl animate-slide-down backdrop-blur-sm">
            {successMsg}
          </div>
        )}

        {/* ERROR */}
        {errorMsg && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500/20 border border-red-400 text-red-300 px-6 py-3 rounded-2xl animate-slide-down backdrop-blur-sm">
            {errorMsg}
          </div>
        )}

        {/* LOGIN */}
        <div className={`absolute inset-y-0 left-0 w-1/2 px-12 flex flex-col justify-center z-20 transition-all duration-[700ms]
          ${isRegister ? "opacity-0 -translate-x-10 pointer-events-none" : "opacity-100 translate-x-0"}`}>
          
          <h2 className="text-4xl font-bold text-white mb-2 animate-fade-in-up">Welcome Back</h2>
          <p className="text-gray-400 mb-8 text-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Please enter your details to sign in.</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className={fieldWrapperClass} style={{ animationDelay: '0.2s' }}>
              <FaEnvelope className={iconClass} />
              <input
                type="email"
                className={inputClass}
                placeholder="Email Address"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>

            <div className={fieldWrapperClass} style={{ animationDelay: '0.3s' }}>
              <FaLock className={iconClass} />
              <input
                type={showLoginPassword ? "text" : "password"}
                className={inputClass}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_35px_rgba(249,115,22,0.6)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* REGISTER */}
        <div
          className={`absolute inset-y-0 right-0 w-1/2 px-12 flex flex-col justify-center z-20 transition-all duration-[700ms]
          ${isRegister ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"}`}
        >
          <h2 className="text-4xl font-bold text-white mb-2 animate-fade-in-up">Create Account</h2>
          <p className="text-gray-400 mb-6 text-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Join us and start your journey today.
          </p>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className={fieldWrapperClass} style={{ animationDelay: '0.2s' }}>
              <FaUser className={iconClass} />
              <input
                type="text"
                className={inputClass}
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                required
              />
            </div>

            <div className={fieldWrapperClass} style={{ animationDelay: '0.3s' }}>
              <FaEnvelope className={iconClass} />
              <input
                type="email"
                className={inputClass}
                placeholder="Email Address"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                required
              />
            </div>

            <div className={fieldWrapperClass} style={{ animationDelay: '0.4s' }}>
              <FaLock className={iconClass} />
              <input
                type={showRegisterPassword ? "text" : "password"}
                className={inputClass}
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowRegisterPassword(!showRegisterPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className={fieldWrapperClass} style={{ animationDelay: '0.5s' }}>
              <FaLock className={iconClass} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={inputClass}
                placeholder="Confirm Password"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({ ...registerData, confirmPassword: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-4 rounded-2xl font-bold text-white
                bg-gradient-to-r from-orange-500 to-orange-600
                shadow-[0_0_35px_rgba(249,115,22,0.6)]
                transition-all duration-300
                hover:from-orange-400 hover:to-orange-600
                hover:shadow-[0_0_55px_rgba(249,115,22,0.9)]
                hover:-translate-y-[1px]
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                animate-fade-in-up
              "
              style={{ animationDelay: '0.6s' }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        {/* SLIDER */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 z-10 bg-gradient-to-br from-orange-500 to-orange-700 transition-transform duration-[1400ms] ease-in-out
          ${isRegister ? "translate-x-0 rounded-r-[90px]" : "translate-x-full rounded-l-[90px]"}`}
        >
          <div className="h-full flex flex-col items-center justify-center text-white text-center px-10">
            {isRegister ? (
              <>
                <h2 className="text-3xl font-extrabold mb-4 animate-fade-in-up">Welcome Back!</h2>
                <p className="opacity-90 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Login to continue your journey.
                </p>
                <button
                  onClick={() => setIsRegister(false)}
                  className="px-10 py-3 border-2 border-white rounded-full font-bold hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-110 active:scale-95 animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  SIGN IN
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold mb-4 animate-fade-in-up">New here?</h2>
                <p className="opacity-90 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Create an account and start today.
                </p>
                <button
                  onClick={() => setIsRegister(true)}
                  className="px-10 py-3 border-2 border-white rounded-full font-bold hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-110 active:scale-95 animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  SIGN UP
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
