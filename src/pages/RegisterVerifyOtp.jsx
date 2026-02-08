import React, { useState } from "react";
import "./Login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

export default function RegisterVerifyOtp() {
  const loc = useLocation();
  const nav = useNavigate();

  const email = loc.state?.email || "";
  const name = loc.state?.name || "";
  const [otp, setOtp] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email missing. Please register again.");
      return nav("/register");
    }
    if (!otp) return toast.error("Enter OTP");

    try {
      // ✅ backend: router.post("/register/verify-otp", verifyOtpRegister)
      const res = await api.post("/register/verify-otp", { email, otp });
      toast.success(res.data?.msg || "OTP verified");

      nav("/register/set-password", { state: { email, name } });
    } catch (err) {
      toast.error(err?.response?.data?.msg || "OTP verification failed");
    }
  };

  // optional resend
  const resend = async () => {
    try {
      const res = await api.post("/register", { name, email });
      toast.success(res.data?.msg || "OTP resent");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Resend failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <div className="logo">✿</div>
          <h1>Royal Florist</h1>
          <p>EST. 1892 • LONDON</p>
        </div>

        <h2>Verify OTP</h2>
        <p className="helper-text">
          Enter the OTP sent to <br />
          <span style={{ color: "#f6c21a", fontWeight: 800 }}>{email}</span>
        </p>

        <form onSubmit={submit}>
          <label>OTP</label>
          <input
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            inputMode="numeric"
            maxLength={6}
            style={{ letterSpacing: "6px", textAlign: "center", fontWeight: 800 }}
          />

          <button type="submit">VERIFY</button>
        </form>

        <div className="footer" style={{ display: "flex", justifyContent: "center", gap: 14 }}>
          <button
            type="button"
            onClick={resend}
            style={{
              background: "transparent",
              border: "none",
              color: "#f6c21a",
              fontWeight: 800,
              cursor: "pointer",
              padding: 0,
            }}
          >
            Resend OTP
          </button>

          <span style={{ opacity: 0.5 }}>|</span>

          <Link to="/register">Change Email</Link>
        </div>
      </div>
    </div>
  );
}
