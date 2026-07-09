import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { updateIncidentStatus } from "../api/incidents";
import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./IncidentDetails.module.css";

function IncidentDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [incident, setIncident] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIncident = async () => {
      try {
        const res = await api.get(`/incidents/${id}`);
        setIncident(res.data);
      } catch {
        setError("Failed to load incident");
      }
    };
    loadIncident();
  }, [id]);

  const canUpdate =
    user.role === "admin" ||
    user.role === "manager" ||
    (user.role === "technician" &&
      user.department === incident?.department);

  const handleStatusChange = async (status) => {
    try {
      const updated = await updateIncidentStatus(id, status);
      setIncident((prev) => ({ ...prev, status: updated.status }));
    } catch {
      alert("Failed to update status");
    }
  };

  if (error) return <p className={styles.error}>{error}</p>;
  if (!incident) return <p className={styles.loading}>Loading incident…</p>;

  return (
    <Page title="Incident Details">
      <div className={styles.grid}>
        {/* IMAGE */}
        <Card>
          <img
            src={`http://127.0.0.1:5000/uploads/${incident.image_path}`}
            alt="incident"
            className={styles.image}
          />
        </Card>

        {/* INFO */}
        <Card>
          <h3 className={styles.title}>
            {incident.detected_class || "Unknown Incident"}
          </h3>

          <div className={styles.meta}>
            <span>
              <strong>Status:</strong>{" "}
              <span className={styles.status}>{incident.status}</span>
            </span>
            <span>
              <strong>Department:</strong>{" "}
              {incident.department || "Manager Review"}
            </span>
          </div>

          <div className={styles.section}>
            <h4>Description</h4>
            <p>{incident.description || "No description provided."}</p>
          </div>

          {canUpdate && incident.status !== "resolved" && (
            <div className={styles.actions}>
              {incident.status === "reported" && (
                <button
                  className={`${styles.button} ${styles.primary}`}
                  onClick={() => handleStatusChange("acknowledged")}
                >
                  Acknowledge
                </button>
              )}

              {incident.status === "acknowledged" && (
                <button
                  className={`${styles.button} ${styles.success}`}
                  onClick={() => handleStatusChange("resolved")}
                >
                  Resolve
                </button>
              )}
            </div>
          )}
        </Card>
      </div>
    </Page>
  );
}

export default IncidentDetails;
