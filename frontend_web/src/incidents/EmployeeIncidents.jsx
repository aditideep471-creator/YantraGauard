import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./EmployeeIncidents.module.css";

function EmployeeIncidents() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await api.get("/incidents");

        const myIncidents = res.data.filter(
          (i) => i.reported_by === user.id
        );

        setIncidents(myIncidents);
      } catch (err) {
        console.error("Failed to fetch incidents");
      }
    };

    fetchIncidents();
  }, [user]);

  return (
    <Page title="My Incidents">
      <h2 className={styles.title}>My Reported Incidents</h2>

      <div className={styles.container}>
        {incidents.length === 0 && <p>No incidents reported yet.</p>}

        {incidents.map((incident) => (
          <Card key={incident.id}>
            <div className={styles.incidentRow}>

              <img
                src={`http://localhost:5000/uploads/${incident.image_path}`}
                alt="incident"
                className={styles.image}
              />

              <div className={styles.details}>
                <p><strong>Class:</strong> {incident.detected_class}</p>
                <p>
                  <strong>Status:</strong>
                  <span className={styles.status}>
                    {incident.status}
                  </span>
                </p>
                <p><strong>Department:</strong> {incident.department}</p>
                <p><strong>Location:</strong> {incident.location_text || "N/A"}</p>
              </div>

            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}

export default EmployeeIncidents;