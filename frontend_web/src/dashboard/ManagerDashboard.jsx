import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./ManagerDashboard.module.css";

function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Page title="Manager Dashboard">
      <div className={styles.header}>
        <h2 className={styles.welcome}>
          Welcome, <span>{user?.name}</span>
        </h2>

        <p className={styles.subtitle}>
          Role: <strong>Manager</strong>
        </p>
      </div>

      <div className={styles.grid}>

        {/* ALL INCIDENTS */}
        <Card onClick={() => navigate("/manager/incidents")}>
          <h3 className={styles.cardTitle}>All Incidents</h3>
          <p className={styles.cardText}>
            View and monitor incidents across all departments.
          </p>
        </Card>

        {/* UNASSIGNED INCIDENTS */}
        <Card onClick={() => navigate("/manager/unassigned")}>
          <h3 className={styles.cardTitle}>Unassigned Incidents</h3>
          <p className={styles.cardText}>
            Review incidents awaiting department assignment.
          </p>
        </Card>

      </div>
    </Page>
  );
}

export default ManagerDashboard;