import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

export default function Forgot() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please provide email");

    try {
      setLoading(true);

      // ✅ backend: /forgot/send-otp
      const res = await api.post("/forgot/send-otp", { email });

      toast.success(res.data?.msg || "OTP sent to email");
      nav("/forgot/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Request failed");
    } finally {
      setLoading(false);
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

        <h2>Recover Password</h2>
        <p className="helper-text">Enter your email to receive OTP.</p>

        <button
          type="button"
          onClick={() => nav("/login")}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 12,
            border: "1px solid rgba(246,194,26,.25)",
            background: "rgba(246,194,26,.08)",
            color: "#f6c21a",
            fontWeight: 900,
            letterSpacing: 1,
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          ← BACK TO LOGIN
        </button>


        <form onSubmit={submit} noValidate autoComplete="off">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="your.name@royal.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="none"
          />

          <button type="submit" disabled={loading}>
            {loading ? "SENDING..." : "SEND OTP"}
          </button>
        </form>

        <div className="footer">
          Back to <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
