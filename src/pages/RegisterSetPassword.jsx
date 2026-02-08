import React, { useState } from "react";
import "./Login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

export default function RegisterSetPassword() {
  const loc = useLocation();
  const nav = useNavigate();

  const email = loc.state?.email || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email missing. Please verify OTP again.");
      return nav("/register");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      // ✅ backend: router.post("/register/set-password", setPassword)
      const res = await api.post("/register/set-password", {
        email,
        newPassword,
        confirmPassword,
      });

      toast.success(res.data?.msg || "Registration completed");
      nav("/login");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Password setup failed");
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

        <h2>Set Password</h2>
        <p className="helper-text">
          Create a password for <br />
          <span style={{ color: "#f6c21a", fontWeight: 800 }}>{email}</span>
        </p>

        <form onSubmit={submit} noValidate autoComplete="off">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Create Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">CREATE ACCOUNT</button>
        </form>

        <div className="footer">
          Back to <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
