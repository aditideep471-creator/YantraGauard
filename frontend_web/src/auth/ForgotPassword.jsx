import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/forgot-password", { email });

      setMsg(res.data.msg || "OTP sent to your mail");

      // ⭐ Redirect to Reset Password Page
      setTimeout(() => {
        navigate("/reset-password?email=" + email);
      }, 1200);

    } catch (err) {
      setMsg(err?.response?.data?.msg || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <div className={styles.wrapper}>
        <Card>
          <h2 className={styles.title}>Forgot Password</h2>

          <p className={styles.subtitle}>
            Enter your registered email to receive OTP
          </p>

          <form onSubmit={sendOTP} className={styles.form}>
            <input
              className={styles.input}
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className={styles.button} type="submit">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            {msg && <p className={styles.message}>{msg}</p>}
          </form>
        </Card>
      </div>
    </Page>
  );
}

export default ForgotPassword;