import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import loadRazorpay from "../utils/loadRazorpay";

export default function Cart() {
  const nav = useNavigate();

  const API_BASE = import.meta?.env?.VITE_API_BASE || "https://apiflower.technorapide.in";

  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const token = localStorage.getItem("token");
  const authHeader = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  // ================= LOAD CART =================
  const loadCart = async () => {
    if (!token || token === "null" || token === "undefined") {
      nav("/login");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/cart/me`, {
        headers: authHeader,
      });
      setCart(res.data?.cart || { items: [], totalPrice: 0 });
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= CART ACTIONS =================
  const inc = async (productId) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/cart/update`,
        { productId, action: "inc" },
        { headers: authHeader }
      );
      setCart(res.data?.cart);
    } catch {
      toast.error("Update failed");
    }
  };

  const dec = async (productId) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/cart/update`,
        { productId, action: "dec" },
        { headers: authHeader }
      );
      setCart(res.data?.cart);
    } catch {
      toast.error("Update failed");
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/cart/remove`,
        { productId },
        { headers: authHeader }
      );
      setCart(res.data?.cart);
      toast.success("Removed");
    } catch {
      toast.error("Remove failed");
    }
  };

  // ================= CHECKOUT =================
  const handleCheckout = async () => {
    try {
      setPaying(true);

      const ok = await loadRazorpay();
      if (!ok) return toast.error("Razorpay SDK failed to load");

      if (!cart.items.length) return toast.error("Cart is empty");

      const totalAmount = Number(cart.totalPrice);
      if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
        return toast.error("Invalid total");
      }

      // build orderDetails from cart
      const orderDetails = cart.items.map((it) => ({
        productId:
          typeof it.productId === "object" ? it.productId._id : it.productId,
        name: it.productName,
        amount: it.itemTotal,
      }));

      // fetch user profile
      const profileRes = await axios.get(`${API_BASE}/api/auth/profile`, {
        headers: authHeader,
      });
      const user = profileRes.data.user;

      // CREATE ORDER (backend)
      const { data } = await axios.post(
        `${API_BASE}/api/payments/razorpay/create-order`,
        {
          userDetails: {
            name: user.name,
            phone: user.phone,
            email: user.email,
          },
          addressDetails: {
            pincode: "753001",
            city: "Cuttack",
            state: "Odisha",
          },
          totalAmount,
          currency: "INR",
          orderDetails,
        },
        { headers: authHeader }
      );

      const { orderId, keyId, totalAmount: amt, currency } = data;

      // Razorpay options
      const options = {
        key: keyId,
        amount: amt * 100, // paise
        currency,
        name: "Flower Shop",
        description: "Order Payment",
        order_id: orderId,

        handler: async function (response) {
          try {
            await axios.post(
              `${API_BASE}/api/payments/razorpay/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: authHeader }
            );

            toast.success("✅ Payment successful!");
            loadCart();
          } catch (err) {
            toast.error(
              err?.response?.data?.msg || "Payment verification failed"
            );
          }
        },

        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },

        theme: { color: "#e91e63" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (resp) {
        toast.error(resp?.error?.description || "Payment failed");
      });

      rzp.open();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Checkout failed");
    } finally {
      setPaying(false);
    }
  };

  // ================= UI =================
  return (
    <div className="ib-page">
      <header className="ib-topbar">
        <div className="ib-title">Cart</div>
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

      <div className="ib-wrap">
        {loading ? (
          <div style={{ opacity: 0.8 }}>Loading...</div>
        ) : cart.items.length === 0 ? (
          <div style={{ opacity: 0.8 }}>Cart is empty.</div>
        ) : (
          <>
            <div className="cart-list">
              {cart.items.map((it) => {
                const pid =
                  typeof it.productId === "object" && it.productId?._id
                    ? it.productId._id
                    : it.productId;

                return (
                  <div className="cart-item" key={String(pid)}>
                    <img
                      className="cart-img"
                      src={it.image}
                      alt={it.productName}
                    />

                    <div className="cart-mid">
                      <div className="cart-name">{it.productName}</div>
                      <div className="cart-desc">
                        {it.description || "—"}
                      </div>

                      <div className="cart-price-row">
                        <span className="cart-unit">
                          ₹{Number(it.unitPrice).toFixed(2)}
                        </span>
                        <span className="cart-itemtotal">
                          Item: ₹{Number(it.itemTotal).toFixed(2)}
                        </span>
                      </div>

                      <div className="cart-qty">
                        <button
                          type="button"
                          onClick={() => dec(pid)}
                          className="cart-qty-btn"
                        >
                          −
                        </button>

                        <div className="cart-qty-num">{it.quantity}</div>

                        <button
                          type="button"
                          onClick={() => inc(pid)}
                          className="cart-qty-btn"
                        >
                          +
                        </button>

                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() => removeItem(pid)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-total">
              <div>Total</div>
              <b>₹{Number(cart.totalPrice || 0).toFixed(2)}</b>
            </div>

            <button
              className="ib-gold-btn"
              type="button"
              onClick={handleCheckout}
              disabled={paying}
            >
              {paying ? "PROCESSING..." : "CHECKOUT"}
            </button>
          </>
        )}
      </div>

      <nav className="ib-bottom">
        <button
          className="ib-nav"
          aria-label="Home"
          onClick={() => nav("/")}
          type="button"
        >
          ⌂
          <span>HOME</span>
        </button>

        <button
          className="ib-nav"
          aria-label="Wishlist"
          onClick={() => nav("/wishlist")}
          type="button"
        >
          ♡
          <span>WISHLIST</span>
        </button>

        <button
          className="ib-nav"
          aria-label="Profile"
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
