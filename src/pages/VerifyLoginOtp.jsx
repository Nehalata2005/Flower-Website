import React, { useState, useContext } from 'react';
import "./Login.css";
import api from '../api';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function VerifyLoginOtp() {
  const loc = useLocation();
  const nav = useNavigate();
  const { login } = useContext(AuthContext);
  const email = loc.state?.email || '';
  const [otp, setOtp] = useState('');

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login/verify-otp', { email, otp });
      login(res.data.user, res.data.token);
      toast.success("Authentication Successful");
      nav('/home');
    } catch (err) {
      toast.error(err?.response?.data?.msg || 'Verification failed');
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

        <h2 className="majestic-title">Verify Login</h2>
        <div className="title-underline"></div>

        <p style={{ color: "#b2dfdb", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Please enter the secure code sent to <br />
          <span style={{ color: "#ffd700", fontWeight: "bold" }}>{email}</span>
        </p>

        <form className="royal-form" onSubmit={submit}>
          <div className="input-group">
            <label>ACCESS CODE</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                style={{ letterSpacing: "5px", textAlign: "center" }}
              />
              <span className="icon-right">🔑</span>
            </div>
          </div>

          <button type="submit" className="royal-btn">
            ENTER ATELIER
          </button>
        </form>
      </div>
    </div>
  );
}
