import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

export default function Register() {
  const nav = useNavigate();

  const [step, setStep] = useState("FORM"); // FORM -> OTP
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // STEP 1: Send OTP (name+email only)
  const sendOtp = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return toast.error("Fill all fields");
    }

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const res = await api.post("/register", {
        name: form.name,
        email: form.email,
      });

      toast.success(res.data?.msg || "OTP sent to your email");
      setStep("OTP");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Registration request failed");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 + 3: Verify OTP then set password (create user)
  const verifyAndCreate = async (e) => {
    e.preventDefault();

    if (!otp) return toast.error("Enter OTP");
    if (!form.email) return toast.error("Email missing");

    try {
      setLoading(true);

      const v = await api.post("/register/verify-otp", {
        email: form.email,
        otp,
      });
      toast.success(v.data?.msg || "OTP verified");

      const c = await api.post("/register/set-password", {
        email: form.email,
        newPassword: form.password,
        confirmPassword: form.confirmPassword,
      });

      toast.success(c.data?.msg || "Registration completed");
      nav("/login");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Verification / registration failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!form.name || !form.email) return toast.error("Name/email missing");

    try {
      setLoading(true);

      const res = await api.post("/register", {
        name: form.name,
        email: form.email,
      });

      toast.success(res.data?.msg || "OTP resent");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Resend failed");
    } finally {
      setLoading(false);
    }
  };

  const backToForm = () => {
    setOtp("");
    setStep("FORM");
  };

  const backBtnStyle = {
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
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <div className="logo">✿</div>
          <h1>Royal Florist</h1>
          <p>EST. 1892 • LONDON</p>
        </div>

        {step === "FORM" ? (
          <>
            <h2>Apply for Entry</h2>
            <p className="helper-text">
              Fill details, then we’ll send an OTP to verify email.
            </p>

            {/* ✅ BACK BUTTON (FORM STEP) */}
            <button type="button" style={backBtnStyle} onClick={() => nav("/login")}>
              ← BACK TO LOGIN
            </button>

            <form onSubmit={sendOtp} noValidate autoComplete="off">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={onChange}
                autoComplete="off"
                spellCheck={false}
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="your.name@royal.com"
                value={form.email}
                onChange={onChange}
                autoComplete="off"
                spellCheck={false}
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={form.password}
                onChange={onChange}
                autoComplete="new-password"
              />

              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={onChange}
              />

              <button type="submit" disabled={loading}>
                {loading ? "SENDING..." : "SEND OTP"}
              </button>
            </form>

            <div className="footer">
              Already a Member? <Link to="/login">Sign In</Link>
            </div>
          </>
        ) : (
          <>
            <h2>Verify OTP</h2>
            <p className="helper-text">
              Enter the OTP sent to <br />
              <span style={{ color: "#f6c21a", fontWeight: 800 }}>
                {form.email}
              </span>
            </p>

            {/* ✅ BACK BUTTON (OTP STEP) */}
            <button type="button" style={backBtnStyle} onClick={() => nav("/login")}>
              ← BACK TO LOGIN
            </button>

            <form onSubmit={verifyAndCreate}>
              <label>OTP</label>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                inputMode="numeric"
                maxLength={6}
                style={{
                  letterSpacing: "6px",
                  textAlign: "center",
                  fontWeight: 800,
                }}
              />

              <button type="submit" disabled={loading}>
                {loading ? "VERIFYING..." : "VERIFY & CREATE"}
              </button>
            </form>

            <div
              className="footer"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={resendOtp}
                disabled={loading}
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

              <button
                type="button"
                onClick={backToForm}
                disabled={loading}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#f6c21a",
                  fontWeight: 800,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Edit Details
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
