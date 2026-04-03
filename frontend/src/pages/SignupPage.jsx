import React, { useState, useEffect } from "react";
import { 
  Bus, 
  Eye, 
  EyeOff 
} from "lucide-react";
// We import signupUser but might not use it fully since backend is pending.
import { signupUser } from "../api";

function SignupPage({ goToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    admissionNo: "",
    className: "",
    semester: "",
    department: "",
    stopLocation: "",
    email: "",
    mobileNo: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');

      * { box-sizing: border-box; }
      body { margin: 0; font-family: 'DM Sans', sans-serif; }

      .signup-container {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background: var(--bg-main, #f8fafc);
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-primary, #0f172a);
        padding: 2rem 1rem;
      }

      /* Animated Blobs */
      .blob {
        position: fixed; /* Fixed so they don't move when scrolling */
        background: rgba(var(--color-primary-rgb, 37,99,235), 0.05);
        filter: blur(12px);
        animation: morph 15s ease-in-out infinite alternate;
        z-index: 0;
      }
      .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; animation-delay: 0s; }
      .blob-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; animation-delay: -2s; background: rgba(var(--color-secondary-rgb, 124,58,237), 0.04); }
      .blob-3 { top: 40%; left: 30%; width: 40vw; height: 40vw; animation-delay: -4s; background: rgba(var(--color-primary-rgb, 37,99,235), 0.06); }

      @keyframes morph {
        0%   { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(0deg) scale(1); }
        34%  { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; transform: rotate(120deg) scale(1.05); }
        67%  { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; transform: rotate(240deg) scale(0.95); }
        100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(360deg) scale(1); }
      }

      /* Glass Card */
      .glass-card-signup {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 650px;
        background: var(--bg-card, rgba(255,255,255,0.85));
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1.5px solid var(--border-glass, rgba(0,0,0,0.1));
        border-radius: 24px;
        padding: 2.5rem 2rem;
        box-shadow: var(--glass-shadow, 0 25px 50px -12px rgba(0,0,0,0.15));
        animation: cardIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        transform: translateY(30px) scale(0.98);
        opacity: 0;
      }
      @media (min-width: 768px) {
        .glass-card-signup { padding: 3rem 4rem; }
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
        color: var(--color-primary, #2563eb);
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
      .signup-heading {
        font-family: 'Syne', sans-serif;
        font-weight: 700;
        font-size: 1.45rem;
        margin: 0 0 0.25rem 0;
        color: var(--text-primary, #0f172a);
      }
      .signup-subtitle {
        font-size: 0.85rem;
        color: var(--text-muted, #94a3b8);
        margin: 0 0 2rem;
      }

      /* Form Grid */
      .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem 1.25rem;
        margin-bottom: 1.5rem;
      }
      @media (min-width: 600px) {
        .form-grid { grid-template-columns: 1fr 1fr; }
        .full-width { grid-column: span 2; }
      }

      /* Inputs */
      .input-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 0.25rem;
      }
      .input-label {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-secondary, #475569);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .input-wrapper {
        position: relative;
        display: flex;
        width: 100%;
      }
      .glass-input {
        width: 100%;
        background: var(--bg-input, rgba(248,250,252,0.8));
        border: 1.5px solid var(--border-input, rgba(0,0,0,0.12));
        border-radius: 12px;
        padding: 0.75rem 1rem;
        color: var(--text-primary, #0f172a);
        font-family: 'DM Sans', sans-serif;
        font-size: 0.95rem;
        outline: none;
        transition: all 0.3s ease;
      }
      .glass-input::placeholder { color: var(--text-muted, #94a3b8); }
      .glass-input:focus {
        border-color: var(--color-primary, #2563eb);
        background: var(--bg-card, #ffffff);
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

      /* Submit Button */
      .submit-btn {
        width: 100%;
        background: linear-gradient(135deg, var(--color-primary, #2563eb), var(--color-secondary, #7c3aed));
        color: #fff;
        border: none;
        border-radius: 12px;
        padding: 1rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 700;
        font-size: 1.05rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 16px rgba(var(--color-primary-rgb, 37,99,235), 0.35);
        margin-bottom: 1.5rem;
        letter-spacing: 0.5px;
        margin-top: 1rem;
      }
      .submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(var(--color-primary-rgb, 37,99,235), 0.45);
      }
      .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

      /* Messages */
      .msg-box {
        border-radius: 12px;
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
        text-align: center;
        margin-bottom: 1.5rem;
        font-weight: 500;
      }
      .msg-error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.25);
        color: var(--color-danger, #ef4444);
      }
      .msg-success {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.25);
        color: var(--color-success, #16a34a);
      }

      /* Footer */
      .footer-text {
        text-align: center;
        font-size: 0.9rem;
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    // Basic validation
    if (!formData.name || !formData.email || !formData.admissionNo) {
      setMessage("Please fill in required fields.");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call for now (Frontend only request)
      // If you want to connect to a real backend, you would map formData to your backend payload.
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      setMessage("Student account created successfully! You can now log in.");
      
      // Optional: clear form
      // setFormData({ ...initialState });
      
    } catch (err) {
      setIsSuccess(false);
      setMessage("An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-container">
      {/* Background Elements */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* Glass Card */}
      <div className="glass-card-signup">
        <div className="header-row">
          <div className="logo-icon">
            <Bus size={28} />
          </div>
          <h1 className="brand-title">ThinkBus</h1>
        </div>
        
        <h2 className="signup-heading">Create a Student Account</h2>
        <p className="signup-subtitle">Register for the college transport network</p>

        {message && (
          <div className={`msg-box ${isSuccess ? 'msg-success' : 'msg-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-grid">
            
            {/* Name */}
            <div className="input-group full-width">
              <label className="input-label">Full Name *</label>
              <div className="input-wrapper">
                <input
                  name="name"
                  className="glass-input"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="input-group">
              <label className="input-label">Email Address *</label>
              <div className="input-wrapper">
                <input
                  name="email"
                  className="glass-input"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {/* Mobile No */}
            <div className="input-group">
              <label className="input-label">Mobile No.</label>
              <div className="input-wrapper">
                <input
                  name="mobileNo"
                  className="glass-input"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.mobileNo}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Admission No */}
            <div className="input-group">
              <label className="input-label">Admission No. *</label>
              <div className="input-wrapper">
                <input
                  name="admissionNo"
                  className="glass-input"
                  type="text"
                  placeholder="e.g. 23BCE001"
                  value={formData.admissionNo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Semester */}
            <div className="input-group">
              <label className="input-label">Semester</label>
              <div className="input-wrapper">
                <input
                  name="semester"
                  className="glass-input"
                  type="text"
                  placeholder="e.g. S4"
                  value={formData.semester}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Department */}
            <div className="input-group">
              <label className="input-label">Department</label>
              <div className="input-wrapper">
                <input
                  name="department"
                  className="glass-input"
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Class */}
            <div className="input-group">
              <label className="input-label">Class / Section</label>
              <div className="input-wrapper">
                <input
                  name="className"
                  className="glass-input"
                  type="text"
                  placeholder="e.g. CS-A"
                  value={formData.className}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Stop Location */}
            <div className="input-group full-width">
              <label className="input-label">Preferred Stop Location</label>
              <div className="input-wrapper">
                <input
                  name="stopLocation"
                  className="glass-input"
                  type="text"
                  placeholder="Enter nearest bus stop"
                  value={formData.stopLocation}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password (Optional based on requirements but keeping it for completeness of an account) */}
            <div className="input-group full-width">
              <label className="input-label">Password *</label>
              <div className="input-wrapper">
                <input
                  name="password"
                  className="glass-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: "2.8rem" }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

          </div>

          <button
            className="submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="footer-text">
          Already have an account?{" "}
          <span className="footer-link" onClick={goToLogin}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
