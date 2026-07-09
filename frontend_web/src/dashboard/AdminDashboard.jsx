import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./AdminDashboard.module.css";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    api.get("/incidents")
      .then(res => {
        setIncidents(res.data);
      })
      .catch(err => {
        console.log("Incident fetch error:", err);
      });
  }, []);

  return (
    <Page title="Admin Dashboard">
      <div className={styles.header}>
        <h2 className={styles.welcome}>
          Welcome back, <span>{user?.name}</span>
        </h2>
        <p className={styles.subtitle}>
          System overview and administrative controls
        </p>
      </div>

      <div className={styles.grid}>

        {/* Total Incidents */}
        <div 
          className={styles.clickableCard}
          onClick={() => navigate("/incidents")}
        >
          <Card>
            <h3 className={styles.cardTitle}>Total Incidents</h3>
            <p className={styles.cardText}>
              {incidents.length}
            </p>
          </Card>
        </div>

        {/* User Management */}
        <div 
          className={styles.clickableCard}
          onClick={() => navigate("/admin/users")}
        >
          <Card>
            <h3 className={styles.cardTitle}>User Management</h3>
            <p className={styles.cardText}>
              Manage system users and roles
            </p>
          </Card>
        </div>

        {/* System Status */}
        <div 
          className={styles.clickableCard}
          onClick={() => navigate("/system-status")}
        >
          <Card>
            <h3 className={styles.cardTitle}>System Status</h3>
            <p className={styles.cardText}>
              Running Normally
            </p>
          </Card>
        </div>

      </div>
    </Page>
  );
}

export default AdminDashboard;