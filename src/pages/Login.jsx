import React, { useContext, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const nav = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Fill all fields");
    try {
      const res = await api.post("/login", form);
      login(res.data?.user, res.data?.token);
      toast.success("Logged in");
      nav("/home");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Authentication failed.");
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

        <h2>Sign in</h2>

        <button
          type="button"
          onClick={() => nav("/")}
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
          ⌂ HOME
        </button>


        <form onSubmit={submit} noValidate autoComplete="off">
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


          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={onChange}
            autoComplete="current-password"
          />


          <div className="auth-row">
            <Link to="/forgot" className="forgot-link">Forgot password?</Link>
          </div>

          <button type="submit">SIGN IN</button>
        </form>


        <div className="footer">
          New here? <Link to="/register">Apply for Entry</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
