import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./TechnicianDashboard.module.css";
function TechnicianDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Page title="Technician Dashboard">
      <div className={styles.header}>
        <h2 className={styles.welcome}>
          Welcome, <span>{user.name}</span>
        </h2>

        <p className={styles.subtitle}>
          Department: <strong>{user.department}</strong>
        </p>
      </div>

      <div className={styles.grid}>
        {/* View Incidents */}
        <Card onClick={() => navigate("/incidents")}>
          <h3 className={styles.cardTitle}>Department Incidents</h3>
          <p className={styles.cardText}>
            View incidents assigned to your department.
          </p>
        </Card>

        {/* Update Status */}
        <Card onClick={() => navigate("/incidents?mode=manage")}>
          <h3 className={styles.cardTitle}>Update Incident Status</h3>
          <p className={styles.cardText}>
            Acknowledge and resolve incidents.
          </p>
        </Card>
      </div>
    </Page>
  );
}

export default TechnicianDashboard;