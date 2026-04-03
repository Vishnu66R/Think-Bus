import React, { useState, useEffect } from "react";
import { 
  Bus, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { loginUser } from "../api";

function LoginPage({ onLoginSuccess, goToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');

      * { box-sizing: border-box; }

      body { margin: 0; font-family: 'DM Sans', sans-serif; }

      .login-container {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background: var(--bg-main, #f8fafc);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-primary, #0f172a);
      }

      /* Animated Blobs */
      .blob {
        position: absolute;
        background: rgba(var(--color-primary-rgb, 37,99,235), 0.06);
        filter: blur(8px);
        animation: morph 15s ease-in-out infinite alternate;
        z-index: 0;
      }
      .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; animation-delay: 0s; }
      .blob-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; animation-delay: -2s; background: rgba(var(--color-secondary-rgb, 124,58,237), 0.04); }
      .blob-3 { top: 40%; left: 30%; width: 40vw; height: 40vw; animation-delay: -4s; background: rgba(var(--color-primary-rgb, 37,99,235), 0.05); }
      .blob-4 { top: 10%; right: 10%; width: 35vw; height: 35vw; animation-delay: -6s; background: rgba(var(--color-secondary-rgb, 124,58,237), 0.06); }
      .blob-5 { bottom: 10%; left: 10%; width: 45vw; height: 45vw; animation-delay: -8s; background: rgba(var(--color-primary-rgb, 37,99,235), 0.04); }

      @keyframes morph {
        0%   { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(0deg) scale(1); }
        34%  { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; transform: rotate(120deg) scale(1.05); }
        67%  { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; transform: rotate(240deg) scale(0.95); }
        100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(360deg) scale(1); }
      }

      /* Ring decoration */
      .ring-container {
        position: absolute;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 300px;
        z-index: 0;
        pointer-events: none;
      }
      .ring {
        position: absolute;
        border-radius: 50%;
        border: 2px solid transparent;
      }
      .ring-1 {
        top: 20px; left: 20px; right: 20px; bottom: 20px;
        border-top-color: rgba(var(--color-primary-rgb, 37,99,235), 0.2);
        border-right-color: rgba(var(--color-primary-rgb, 37,99,235), 0.2);
        animation: spin-clockwise 20s linear infinite;
      }
      .ring-2 {
        top: 40px; left: 40px; right: 40px; bottom: 40px;
        border-bottom-color: rgba(var(--color-secondary-rgb, 124,58,237), 0.15);
        border-left-color: rgba(var(--color-secondary-rgb, 124,58,237), 0.15);
        animation: spin-counter 15s linear infinite;
      }
      @keyframes spin-clockwise { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes spin-counter   { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }

      /* Glass Card */
      .glass-card {
        position: relative;
        z-index: 10;
        width: 92vw;
        max-width: 400px;
        background: var(--bg-card, rgba(255,255,255,0.85));
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1.5px solid var(--border-glass, rgba(0,0,0,0.1));
        border-radius: 20px;
        padding: 2rem 1.5rem;
        box-shadow: var(--glass-shadow, 0 25px 50px -12px rgba(0,0,0,0.15));
        animation: cardIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        transform: translateY(50px) scale(0.95);
        opacity: 0;
      }
      @media (min-width: 768px) {
        .glass-card { max-width: 440px; padding: 2.5rem 3rem; }
      }
      @keyframes cardIn {
        to { transform: translateY(0) scale(1); opacity: 1; }
      }

      /* Header */
      .header-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 0.5rem;
      }
      .logo-icon {
        width: 44px;
        height: 44px;
        background: rgba(var(--color-primary-rgb, 37,99,235), 0.1);
        border: 1px solid rgba(var(--color-primary-rgb, 37,99,235), 0.2);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-primary);
      }
      .brand-title {
        font-family: 'Syne', sans-serif;
        font-weight: 800;
        font-size: 1.8rem;
        margin: 0;
        letter-spacing: -0.5px;
        background: linear-gradient(135deg, var(--color-primary, #2563eb), var(--color-secondary, #7c3aed));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .login-heading {
        font-family: 'Syne', sans-serif;
        font-weight: 700;
        font-size: 1.35rem;
        margin: 0 0 1.5rem 0;
        color: var(--text-primary, #0f172a);
      }
      .login-subtitle {
        font-size: 0.85rem;
        color: var(--text-muted, #94a3b8);
        margin: 0.25rem 0 1.75rem;
      }

      /* Inputs */
      .input-group {
        margin-bottom: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .input-label {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-secondary, #475569);
        text-transform: uppercase;
        letter-spacing: 0.8px;
      }
      .input-wrapper {
        position: relative;
        display: flex;
        width: 100%;
      }
      .glass-input {
        width: 100%;
        background: var(--bg-input, rgba(248,250,252,0.9));
        border: 1.5px solid var(--border-input, rgba(0,0,0,0.12));
        border-radius: 10px;
        padding: 0.75rem 1rem;
        color: var(--text-primary, #0f172a);
        font-family: 'DM Sans', sans-serif;
        font-size: 1rem;
        outline: none;
        transition: all 0.3s ease;
      }
      .glass-input::placeholder { color: var(--text-muted, #94a3b8); }
      .glass-input:focus {
        border-color: var(--color-primary, #2563eb);
        box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 37,99,235), 0.15);
      }
      .password-toggle {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--text-muted, #94a3b8);
        cursor: pointer;
        padding: 0;
        font-size: 1rem;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .password-toggle:hover { color: var(--text-primary, #0f172a); }

      /* Forgot Password */
      .forgot-link {
        display: block;
        text-align: right;
        font-size: 0.8rem;
        color: var(--color-primary, #2563eb);
        text-decoration: none;
        margin-top: -0.5rem;
        margin-bottom: 1.5rem;
        cursor: pointer;
        transition: opacity 0.2s;
        font-weight: 600;
      }
      .forgot-link:hover { opacity: 0.7; }

      /* Submit Button */
      .submit-btn {
        width: 100%;
        background: linear-gradient(135deg, var(--color-primary, #2563eb), var(--color-secondary, #7c3aed));
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 0.9rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 16px rgba(var(--color-primary-rgb, 37,99,235), 0.35);
        margin-bottom: 1rem;
        letter-spacing: 0.3px;
      }
      .submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(var(--color-primary-rgb, 37,99,235), 0.45);
      }
      .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

      /* Error/Success Message */
      .error-msg {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.25);
        border-radius: 8px;
        padding: 0.65rem 1rem;
        color: var(--color-danger, #ef4444);
        font-size: 0.85rem;
        text-align: center;
        margin-bottom: 1rem;
      }

      /* Footer */
      .footer-text {
        text-align: center;
        font-size: 0.85rem;
        color: var(--text-secondary, #475569);
        margin: 0;
      }
      .footer-link {
        color: var(--color-primary, #2563eb);
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
        transition: opacity 0.2s;
      }
      .footer-link:hover { opacity: 0.8; }
    `;
    document.head.appendChild(styleSheet);
    return () => { document.head.removeChild(styleSheet); };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      setMessage("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const result = await loginUser(username, password);
      setLoading(false);

      if (result && result.success) {
        if (onLoginSuccess) {
          onLoginSuccess(result.username || username, result.role);
        }
      } else {
        setMessage((result && result.message) ? result.message : "Login failed.");
      }
    } catch (err) {
      setLoading(false);
      setMessage("An error occurred. Please try again.");
    }
  }

  return (
    <div className="login-container">
      {/* Background blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>
      <div className="blob blob-5"></div>

      <div className="ring-container">
        <div className="ring ring-1"></div>
        <div className="ring ring-2"></div>
      </div>

      {/* Card */}
      <div className="glass-card">
        <div className="header-row">
          <div className="logo-icon">
            <Bus size={28} />
          </div>
          <h1 className="brand-title">ThinkBus</h1>
        </div>

        <h2 className="login-heading">Welcome back</h2>
        <p className="login-subtitle">Sign in to your account to continue</p>

        {message && <div className="error-msg">{message}</div>}

        <form onSubmit={handleSubmit} id="login-form">
          <div className="input-group">
            <label className="input-label">Username</label>
            <div className="input-wrapper">
              <input
                id="login-username"
                className="glass-input"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: "0.5rem" }}>
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <input
                id="login-password"
                className="glass-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: "2.8rem" }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <a className="forgot-link">Forgot Password?</a>

          <button
            id="login-submit-btn"
            className="submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="footer-text">
          Don't have an account?{" "}
          <span className="footer-link" onClick={goToSignup}>
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
