import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { Toaster } from "react-hot-toast";

import Register from "./pages/Register";
import VerifyRegisterOTP from "./pages/RegisterVerifyOtp";
import SetPassword from "./pages/RegisterSetPassword";

import Login from "./pages/Login";
import SendLoginOtp from "./pages/SendLoginOtp";
import VerifyLoginOtp from "./pages/VerifyLoginOtp";

import Forgot from "./pages/Forgot";
import ForgotVerifyOtp from "./pages/ForgotVerifyOtp";
import ForgotResetPassword from "./pages/ForgotResetPassword";

import Wishlist from "./pages/Wishlist";

import Profile from "./pages/Profile";

import Cart from "./pages/Cart";

import Home from "./pages/Home";
import { AuthContext } from "./context/AuthContext";

// ✅ protect only the pages that require login (Profile etc.)
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      {/* ✅ Toaster: bottom-center + Royal theme */}
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        gutter={10}
        toastOptions={{
          duration: 2500,
          style: {
            background: "rgba(0, 20, 20, 0.92)",
            color: "#e8f3f2",
            border: "1px solid rgba(246, 194, 26, 0.35)",
            borderRadius: "14px",
            padding: "12px 14px",
            boxShadow: "0 18px 40px rgba(0,0,0,.35)",
            fontWeight: 700,
            letterSpacing: "0.2px",
            minWidth: "260px",
            textAlign: "center",
          },
          success: {
            iconTheme: { primary: "#f6c21a", secondary: "#001f22" },
          },
          error: {
            iconTheme: { primary: "#f6c21a", secondary: "#001f22" },
          },
        }}
      />

      <Routes>
        {/* ✅ Website opens Home first */}
        <Route path="/" element={<Home />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/send-otp" element={<SendLoginOtp />} />
        <Route path="/login/verify-otp" element={<VerifyLoginOtp />} />

        <Route path="/register" element={<Register />} />
        <Route path="/register/verify-otp" element={<VerifyRegisterOTP />} />
        <Route path="/register/set-password" element={<SetPassword />} />

        <Route path="/forgot" element={<Forgot />} />
        <Route path="/forgot/verify-otp" element={<ForgotVerifyOtp />} />
        <Route path="/forgot/reset-password" element={<ForgotResetPassword />} />

        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
        />

        {/* ✅ Optional: keep /home working too */}
        <Route path="/home" element={<Home />} />

        {/* ✅ Profile should open login if not logged in */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
