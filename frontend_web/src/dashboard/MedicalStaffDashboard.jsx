import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./MedicalStaffDashboard.module.css";

function MedicalStaffDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Page title="Medical Staff Dashboard">
      <div className={styles.header}>
        <h2 className={styles.welcome}>
          Hello, <span>{user.name}</span>
        </h2>

        <p className={styles.subtitle}>
          Respond to workplace medical incidents.
        </p>
      </div>

      <div className={styles.grid}>

        <Card onClick={() => navigate("/incidents/manage")}>
          <h3 className={styles.cardTitle}>Medical Incidents</h3>
          <p className={styles.cardText}>
            View and respond to reported medical emergencies.
          </p>
        </Card>

        <Card onClick={() => navigate("/incidents")}>
          <h3 className={styles.cardTitle}>All Incidents</h3>
          <p className={styles.cardText}>
            Monitor incidents across all departments.
          </p>
        </Card>

      </div>
    </Page>
  );
}

export default MedicalStaffDashboard;