import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const nav = useNavigate();
  const { logout } = useContext(AuthContext);
  const API_BASE = "https://apiflower.technorapide.in";
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      fullAddress: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  const authHeader = { Authorization: `Bearer ${token}` };

  // ================= LOAD PROFILE =================
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/auth/profile`, {
          headers: authHeader,
        });

        const u = res.data.user;

        setForm({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          address: {
            fullAddress: u.address?.fullAddress || "",
            city: u.address?.city || "",
            state: u.address?.state || "",
            pincode: u.address?.pincode || "",
            country: u.address?.country || "India",
          },
        });
      } catch {
        logout();
        nav("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ================= SAVE PROFILE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      await axios.put(
        `${API_BASE}/api/profile/me`,
        {
          phone: form.phone,
          address: form.address,
        },
        { headers: authHeader }
      );

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    nav("/login");
  };

  if (loading) return <div className="ib-page">Loading...</div>;

  // ================= UI =================
  return (
    <div className="ib-page">
      {/* Topbar */}
      <header className="ib-topbar">
        <div className="ib-title">Profile</div>
        <div className="ib-actions">
          <button
            className="ib-icon-btn"
            onClick={() => nav("/")}
            aria-label="Home"
            type="button"
          >
            ⌂
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <form className="ib-profile-card" onSubmit={handleSubmit}>
          <div className="ib-profile-title">MY DETAILS</div>

          {/* NAME */}
          <div className="profile-field">
            <label>NAME</label>
            <div className="profile-input-wrap">
              <input value={form.name} disabled />
            </div>
          </div>

          {/* EMAIL */}
          <div className="profile-field">
            <label>EMAIL</label>
            <div className="profile-input-wrap">
              <input value={form.email} disabled />
            </div>
          </div>

          {/* PHONE */}
          <div className="profile-field">
            <label>PHONE NUMBER</label>
            <div className="profile-input-wrap">
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
              <span className="profile-icon"></span>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="profile-section-title">ADDRESS DETAILS</div>

          <div className="profile-field">
            <label>FULL ADDRESS</label>
            <div className="profile-input-wrap">
              <textarea
                name="address.fullAddress"
                value={form.address.fullAddress}
                onChange={handleChange}
                placeholder="House no, street, area"
                rows={3}
                required
              />
              <span className="profile-icon"></span>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-field">
              <label>PIN CODE</label>
              <div className="profile-input-wrap">
                <input
                  name="address.pincode"
                  value={form.address.pincode}
                  onChange={handleChange}
                  placeholder="Pin code"
                  required
                />
              </div>
            </div>

            <div className="profile-field">
              <label>CITY</label>
              <div className="profile-input-wrap">
                <input
                  name="address.city"
                  value={form.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
            </div>

            <div className="profile-field">
              <label>STATE</label>
              <div className="profile-input-wrap">
                <input
                  name="address.state"
                  value={form.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                />
              </div>
            </div>
          </div>

          <button className="ib-gold-btn" type="submit" disabled={saving}>
            {saving ? "SAVING..." : "SAVE"}
          </button>

          <button
            className="ib-gold-btn"
            type="button"
            onClick={handleLogout}
            style={{ marginTop: 8 }}
          >
            LOGOUT
          </button>
        </form>
      </div>

      {/* Bottom Nav */}
      <nav className="ib-bottom">
        <button className="ib-nav" onClick={() => nav("/")} type="button">
          ⌂
          <span>HOME</span>
        </button>

        <button className="ib-nav" onClick={() => nav("/wishlist")} type="button">
          ♡
          <span>WISHLIST</span>
        </button>

        <button
          className="ib-nav active"
          onClick={() => nav("/profile")}
          type="button"
        >
          👤
          <span>PROFILE</span>
        </button>
      </nav>
    </div>
  );
}
