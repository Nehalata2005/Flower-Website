import React, { useState } from "react";
import "./Login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

export default function ForgotResetPassword() {
  const loc = useLocation();
  const nav = useNavigate();

  const email = loc.state?.email || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email missing. Please verify OTP again.");
      return nav("/forgot");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      // ✅ backend: router.post("/forgot/reset-password", resetForgotPassword);
      // NOTE: backend does NOT require otp in this step
      const res = await api.post("/forgot/reset-password", {
        email,
        newPassword,
        confirmPassword,
      });

      toast.success(res.data?.msg || "Password reset successful");
      nav("/login");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Reset failed");
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

        <h2>Reset Password</h2>
        <p className="helper-text">
          Create a new password for <br />
          <span style={{ color: "#f6c21a", fontWeight: 800 }}>{email}</span>
        </p>

        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <label>New Password</label>
           <input
            type="password"
            placeholder="Create New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <button type="submit">UPDATE</button>
        </form>

        <div className="footer">
          Back to <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
