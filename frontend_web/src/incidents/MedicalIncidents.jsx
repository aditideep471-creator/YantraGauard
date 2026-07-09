import { useEffect, useState } from "react";
import Page from "../components/Page";
import Card from "../components/Card";
import api from "../api/axios";
import styles from "./MedicalIncidents.module.css";

function MedicalIncidents() {

  const [incidents, setIncidents] = useState([]);

  const fetchIncidents = async () => {
    try {
      const res = await api.get("/incidents");

      const medical = res.data.filter(
        (i) => i.department === "Medical"
      );

      setIncidents(medical);

    } catch (err) {
      console.error("Failed to load incidents");
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/incidents/${id}/status`, { status });
      fetchIncidents();
    } catch {
      console.error("Status update failed");
    }
  };

  return (
    <Page title="Medical Incidents">

      <div className={styles.wrapper}>

        {incidents.length === 0 && (
          <p className={styles.empty}>
            No medical incidents assigned.
          </p>
        )}

        {incidents.map((incident) => (

          <Card key={incident.id}>

            <div className={styles.row}>

              <img
                src={`http://localhost:5000/uploads/${incident.image_path}`}
                alt="incident"
                className={styles.image}
              />

              <div className={styles.details}>

                <h3 className={styles.class}>
                  {incident.detected_class.replace("_", " ").toUpperCase()}
                </h3>

                <p>
                  <strong>Status:</strong> {incident.status}
                </p>

                <p>
                  <strong>Location:</strong> {incident.location_text || "N/A"}
                </p>

                <div className={styles.buttons}>

                  <button
                    onClick={() => updateStatus(incident.id, "Acknowledged")}
                    className={styles.ack}
                  >
                    Acknowledge
                  </button>

                  <button
                    onClick={() => updateStatus(incident.id, "Resolved")}
                    className={styles.resolve}
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

export default MedicalIncidents;