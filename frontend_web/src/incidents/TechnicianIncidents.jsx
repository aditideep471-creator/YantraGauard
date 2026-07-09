import { useEffect, useState } from "react";
import { fetchIncidents } from "../api/incidents";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./TechnicianIncidents.module.css";

function TechnicianIncidents() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    const data = await fetchIncidents();

    const deptIncidents = data.filter(
      (i) =>
        i.department?.toLowerCase() ===
        user.department?.toLowerCase()
    );

    setIncidents(deptIncidents);
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/incidents/${id}/status`, { status });
      loadIncidents();
    } catch (err) {
      console.error("Status update failed");
    }
  };

  return (
    <Page title="Manage Incidents">

      <div className={styles.wrapper}>

        {incidents.length === 0 && (
          <p className={styles.empty}>No incidents assigned</p>
        )}

        {incidents.map((inc) => (

          <Card key={inc.id}>

            <div className={styles.row}>

              <img
                src={`http://localhost:5000/uploads/${inc.image_path}`}
                alt="incident"
                className={styles.image}
              />

              <div className={styles.details}>

                <h3 className={styles.class}>
                  {inc.detected_class.replace("_", " ").toUpperCase()}
                </h3>

                <p>
                  <strong>Status:</strong> {inc.status}
                </p>

                <p>
                  <strong>Location:</strong> {inc.location_text || "N/A"}
                </p>

                <p className={styles.time}>
                  {new Date(inc.created_at).toLocaleString()}
                </p>

                <div className={styles.buttons}>

                  <button
                    className={styles.ack}
                    onClick={() => updateStatus(inc.id, "Acknowledged")}
                  >
                    Acknowledge
                  </button>

                  <button
                    className={styles.resolve}
                    onClick={() => updateStatus(inc.id, "Resolved")}
                  >
                    Resolve
                  </button>

                </div>

              </div>

            </div>

          </Card>

        ))}

      </div>

    </Page>
  );
}

export default TechnicianIncidents;