import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./Login.module.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      login(res.data.user, res.data.access_token);

      navigate("/dashboard");

    } catch (err) {
      setError(
        err?.response?.data?.msg ||
        "Invalid email or password"
      );
    }
  };

  return (
    <Page>
      <div className={styles.wrapper}>
        <Card>

          <h2 className={styles.title}>YantraGuard</h2>
          <p className={styles.subtitle}>
            Sign in to your safety dashboard
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>

            <input
              className={styles.input}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <p
              style={{
                textAlign: "right",
                color: "#3b82f6",
                cursor: "pointer",
                fontSize: "14px",
                marginBottom: "10px"
              }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </p>

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.button} type="submit">
              Sign in
            </button>

          </form>

        </Card>
      </div>
    </Page>
  );
}

export default Login;