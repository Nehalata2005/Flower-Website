import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const nav = useNavigate();
  const API_BASE = "https://apiflower.technorapide.in";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");
  const authHeader = () => {
    const token = getToken();
    return { Authorization: `Bearer ${token}` };
  };

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/wishlist`, {
        headers: authHeader(),
      });
      setItems(res.data?.items || []);
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to load wishlist");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ remove wishlist item (per user) using productId
  const removeItem = async (productId) => {
    try {
      await axios.delete(`${API_BASE}/api/wishlist/remove/${productId}`, {
        headers: authHeader(),
      });

      // update UI immediately
      setItems((prev) =>
        prev.filter((x) => String(x.productId) !== String(productId))
      );

      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Remove failed");
    }
  };

  return (
    <div className="ib-page">
      <header className="ib-topbar">
        <div className="ib-title">Wishlist</div>
        <div className="ib-actions">
          <button className="ib-icon-btn" onClick={() => nav("/")} aria-label="Home">
            ⌂
          </button>
        </div>
      </header>

      <main className="ib-grid">
        {loading ? (
          <div style={{ gridColumn: "1 / -1", opacity: 0.8, padding: "14px 4px" }}>
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", opacity: 0.8, padding: "14px 4px" }}>
            No wishlist items.
          </div>
        ) : (
          items.map((w) => (
            <article key={w._id} className="ib-card">
              <div className="ib-imgwrap">
                <img src={w.image} alt={w.name} />

                {/* ✅ Delete button */}
                <button
                  className="ib-wish-remove"
                  type="button"
                  aria-label="Remove from wishlist"
                  title="Remove"
                  onClick={() => removeItem(w.productId)}
                >
                  ✕
                </button>
              </div>

              <div className="ib-meta">
                <div className="ib-name">{w.name}</div>
                <div className="ib-price">₹{Number(w.price).toFixed(2)}</div>
              </div>
            </article>
          ))
        )}
      </main>

      <nav className="ib-bottom">
        <button className="ib-nav" aria-label="Home" onClick={() => nav("/")} type="button">
          ⌂
          <span>HOME</span>
        </button>

        <button
          className="ib-nav active"
          aria-label="Wishlist"
          onClick={() => nav("/wishlist")}
          type="button"
        >
          ♡
          <span>WISHLIST</span>
        </button>

        <button className="ib-nav" aria-label="Profile" onClick={() => nav("/profile")} type="button">
          👤
          <span>PROFILE</span>
        </button>
      </nav>
    </div>
  );
}
