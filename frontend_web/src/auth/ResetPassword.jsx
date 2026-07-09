import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import styles from "./ResetPassword.module.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get email from URL
  const queryParams = new URLSearchParams(location.search);
  const initialEmail = queryParams.get("email")?.toLowerCase() || "";

  const [email] = useState(initialEmail); // 🔒 locked email
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/reset-password", {
        email: email.trim().toLowerCase(),
        otp,
        password, // ✅ correct key
      });

      setMsg(res.data.msg || "Password Reset Successful");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setMsg(err?.response?.data?.msg || "Reset Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Reset Password</h2>

        <p className={styles.subtitle}>
          Enter OTP and create new password
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* 🔒 Email (read-only) */}
          <input
            className={styles.input}
            type="email"
            value={email}
            disabled
          />

          {/* OTP */}
          <input
            className={styles.input}
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          {/* New Password */}
          <input
            className={styles.input}
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Button */}
          <button className={styles.button} type="submit">
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {/* Message */}
          {msg && <p className={styles.message}>{msg}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;