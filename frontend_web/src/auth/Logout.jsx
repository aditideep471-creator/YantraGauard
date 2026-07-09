import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./Logout.module.css";

function Logout() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    // ⭐ Clear auth safely
    logout();

    // ⭐ Extra safety (in case old key exists)
    localStorage.removeItem("access_token");

    // ⭐ Redirect to login
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 600);

    return () => clearTimeout(timer);

  }, [logout, navigate]);

  return (
    <Page>
      <div className={styles.wrapper}>
        <Card>
          <h2 className={styles.title}>Signing you out</h2>
          <p className={styles.subtitle}>
            Please wait while we securely log you out.
          </p>

          <div className={styles.loader} />
        </Card>
      </div>
    </Page>
  );
}

export default Logout;