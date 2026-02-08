import React, { useState } from "react";
import "./Login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

export default function ForgotVerifyOtp() {
  const loc = useLocation();
  const nav = useNavigate();

  const email = loc.state?.email || "";
  const [otp, setOtp] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email missing. Go back and enter email again.");
      return nav("/forgot");
    }
    if (!otp) return toast.error("Enter OTP");

    try {
      // ✅ backend: router.post("/forgot/verify-otp", verifyForgotOtp);
      const res = await api.post("/forgot/verify-otp", { email, otp });

      toast.success(res.data?.msg || "OTP verified");
      nav("/forgot/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Verification failed");
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

          <button type="submit">PROCEED</button>
        </form>

        <div className="footer">
          Go back? <Link to="/forgot">Change Email</Link>
        </div>
      </div>
    </div>
  );
}
