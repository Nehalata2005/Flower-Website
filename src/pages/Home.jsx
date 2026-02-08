import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Home() {
  const nav = useNavigate();
  const API_BASE = "https://apiflower.technorapide.in";

  const [activeCatId, setActiveCatId] = useState("ALL");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // wishlist ids for logged user
  const [wishIds, setWishIds] = useState(new Set());

  const getToken = () => localStorage.getItem("token");
  const isLoggedIn = () => {
    const t = getToken();
    return t && t !== "undefined" && t !== "null";
  };
  const authHeader = () => {
    const token = getToken();
    if (!isLoggedIn()) return {};
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch categories
  useEffect(() => {
    (async () => {
      try {
        setLoadingCats(true);
        const res = await axios.get(`${API_BASE}/api/categories/getCategories`);
        const list = res.data?.categories || res.data || [];
        setCategories(Array.isArray(list) ? list : []);
      } catch (err) {
        toast.error(err?.response?.data?.msg || "Failed to load categories");
        setCategories([]);
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);

  // Fetch products
  useEffect(() => {
    (async () => {
      try {
        setLoadingProducts(true);
        const res = await axios.get(`${API_BASE}/api/products/getProducts`);
        const list = res.data?.products || res.data || [];
        setProducts(Array.isArray(list) ? list : []);
      } catch (err) {
        toast.error(err?.response?.data?.msg || "Failed to load products");
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, []);

  // Fetch wishlist (only if logged in)
  useEffect(() => {
    (async () => {
      try {
        if (!isLoggedIn()) return;

        const res = await axios.get(`${API_BASE}/api/wishlist`, {
          headers: authHeader(),
        });

        const ids = new Set(
          (res.data?.items || []).map((x) => String(x.productId))
        );
        setWishIds(ids);
      } catch (err) {
        // ignore silently (token expired etc)
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle wishlist
  const toggleWish = async (product) => {
    if (!isLoggedIn()) {
      toast.error("Please login first");
      return nav("/login");
    }

    const pid = String(product._id);
    const liked = wishIds.has(pid);

    try {
      if (liked) {
        await axios.delete(`${API_BASE}/api/wishlist/remove/${pid}`, {
          headers: authHeader(),
        });

        const next = new Set(wishIds);
        next.delete(pid);
        setWishIds(next);

        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          `${API_BASE}/api/wishlist/add`,
          { productId: pid },
          { headers: authHeader() }
        );

        const next = new Set(wishIds);
        next.add(pid);
        setWishIds(next);

        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Wishlist update failed");
    }
  };

  // Filter products by category (same page)
  const filteredProducts = useMemo(() => {
    if (activeCatId === "ALL") return products;

    return products.filter((p) => {
      const prodCatId =
        typeof p.category === "object" && p.category?._id
          ? String(p.category._id)
          : String(p.category);

      return prodCatId === String(activeCatId);
    });
  }, [products, activeCatId]);

  const activeCategory = useMemo(() => {
    if (activeCatId === "ALL") return null;
    return categories.find((c) => String(c._id) === String(activeCatId)) || null;
  }, [categories, activeCatId]);

  const showLoading = loadingCats || loadingProducts;

  const goWishlist = () => {
    if (!isLoggedIn()) return nav("/login");
    nav("/wishlist");
  };

  const goProfile = () => {
    if (!isLoggedIn()) return nav("/login");
    nav("/profile");
  };

  return (
    <div className="ib-page">
      {/* Top bar */}
      <header className="ib-topbar">
        <div className="ib-topbar-left" />
        <div className="ib-title">Imperial Boutique</div>

        <div className="ib-actions">
          <button className="ib-icon-btn" aria-label="Cart" onClick={() => nav("/cart")}>
            🛒 <span className="ib-badge">3</span>
          </button>

        </div>
      </header>

      {/* Categories */}
      <section className="ib-cats">
        <button
          className={`ib-cat ${activeCatId === "ALL" ? "active" : ""}`}
          onClick={() => setActiveCatId("ALL")}
          type="button"
        >
          <div className="ib-cat-img">
            <img
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&q=80"
              alt="ALL"
            />
          </div>
          <div className="ib-cat-name">ALL</div>
        </button>

        {categories.map((c) => (
          <button
            key={c._id}
            className={`ib-cat ${String(activeCatId) === String(c._id) ? "active" : ""}`}
            onClick={() => setActiveCatId(c._id)}
            type="button"
          >
            <div className="ib-cat-img">
              <img src={c.icon} alt={c.name} />
            </div>
            <div className="ib-cat-name">{(c.name || "CATEGORY").toUpperCase()}</div>
          </button>
        ))}
      </section>

      {/* Section header */}
      <section className="ib-section">
        <div className="ib-section-left">
          <h2>{activeCatId === "ALL" ? "Summer Dynasty" : activeCategory?.name || "Collection"}</h2>
          <p>
            {activeCatId === "ALL"
              ? "EXCLUSIVE CURATION"
              : (activeCategory?.description || "EXCLUSIVE CURATION").toUpperCase()}
          </p>
        </div>
      </section>

      {/* Product grid */}
      <main className="ib-grid">
        {showLoading ? (
          <div style={{ gridColumn: "1 / -1", opacity: 0.8, padding: "14px 4px" }}>
            Loading...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", opacity: 0.8, padding: "14px 4px" }}>
            No products found.
          </div>
        ) : (
          filteredProducts.map((p, idx) => {
            const isBig = idx === 0;
            const liked = wishIds.has(String(p._id));

            return (
              <article key={p._id} className={`ib-card ${isBig ? "big" : ""}`}>
                <div className="ib-imgwrap">
                  <img src={p.image} alt={p.name} />

                  {/* ❤️ Wishlist toggle */}
                  <button
                    className={`ib-like ${liked ? "active" : ""}`}
                    aria-label="Wishlist"
                    onClick={() => toggleWish(p)}
                    type="button"
                  >
                    {liked ? "♥" : "♡"}
                  </button>

                  {isBig && <div className="ib-tag">FEATURED</div>}
                </div>

                <div className="ib-meta">
                  <div className="ib-name">{p.name}</div>
                  <div className="ib-price">₹{Number(p.price).toFixed(2)}</div>
                  <button
                    type="button"
                    className="ib-addcart"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      if (!token || token === "null" || token === "undefined") {
                        return nav("/login");
                      }

                      try {
                        await axios.post(
                          `${API_BASE}/api/cart/add`,
                          { productId: p._id },
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        toast.success("Added to cart");
                        // ✅ NO redirect to cart here
                      } catch (err) {
                        toast.error(err?.response?.data?.msg || "Add to cart failed");
                      }
                    }}
                  >
                    ADD TO CART
                  </button>


                </div>
              </article>
            );
          })
        )}
      </main>

      {/* Bottom nav */}
      <nav className="ib-bottom">
        <button className="ib-nav active" aria-label="Home" onClick={() => nav("/")} type="button">
          ⌂
          <span>HOME</span>
        </button>

        <button className="ib-nav" aria-label="Wishlist" onClick={goWishlist} type="button">
          ♡
          <span>WISHLIST</span>
        </button>

        <button className="ib-nav" aria-label="Profile" onClick={goProfile} type="button">
          👤
          <span>PROFILE</span>
        </button>
      </nav>
    </div>
  );
}
