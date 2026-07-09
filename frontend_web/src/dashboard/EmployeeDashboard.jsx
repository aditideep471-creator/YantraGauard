import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; 
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./EmployeeDashboard.module.css";

function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate(); 

  return (
    <Page title="Employee Dashboard">
      <div className={styles.header}>
        <h2 className={styles.welcome}>
          Hello, <span>{user.name}</span>
        </h2>
      </div>

      <div className={styles.grid}>
        {/* REPORT INCIDENT */}
        <Card
          className={styles.card}
          onClick={() => navigate("/incidents/upload")} 
        >
          <h3 className={styles.cardTitle}>Report an Incident</h3>
          <p className={styles.cardText}>
            Capture and submit a safety incident directly from the workplace.
          </p>
        </Card>

        {/* EMPLOYEE INCIDENT HISTORY */}
        <Card
          className={styles.card}
          onClick={() => navigate("/employee/incidents")} 
        >
          <h3 className={styles.cardTitle}>My Incident History</h3>
          <p className={styles.cardText}>
            View incidents reported by you.
          </p>
        </Card>
      </div>
    </Page>
  );
}

export default EmployeeDashboard;