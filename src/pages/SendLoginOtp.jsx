import React, { useState } from 'react';
import "./Login.css";
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SendLoginOtp() {
  const [email, setEmail] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login/send-otp', { email });
      toast.success(res.data.msg || "OTP Sent");
      nav('/login/verify-otp', { state: { email } });
    } catch (err) {
      toast.error(err?.response?.data?.msg || 'Server error');
    }
  };

  return (
    <div className="royal-login-container">
      <div className="royal-card">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="flower-bubble">
            <span className="flower-icon">✿</span>
            <div className="medal-badge">★</div>
          </div>
          <h1 className="royal-title">ROYAL FLORIST</h1>
          <p className="royal-est">EST. 1892 &bull; LONDON</p>
        </div>

        <h2 className="majestic-title">Secure Access</h2>
        <div className="title-underline"></div>

        <p style={{ color: "#b2dfdb", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Enter your email to receive a login key.
        </p>

        <form className="royal-form" onSubmit={submit}>
          <div className="input-group">
            <label>EMAIL ADDRESS</label>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="your.name@royal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="icon-right">✉</span>
            </div>
          </div>

          <button type="submit" className="royal-btn">
            SEND ACCESS KEY
          </button>
        </form>
        <div className="royal-footer" style={{ marginTop: "2rem" }}>
          Use password instead? <Link to="/login" className="gold-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
