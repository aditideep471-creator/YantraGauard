import { Link } from "react-router-dom";
import styles from "./IncidentCard.module.css";
import { updateIncidentStatus } from "../api/incidents";
import toast from "react-hot-toast";

function IncidentCard({ incident, showActions }) {

  const handleUpdate = async (e, status) => {

    e.preventDefault();
    e.stopPropagation();

    try {

      await updateIncidentStatus(incident.id, status);

      toast.success(`Incident ${status}`);

      window.location.reload(); // reload to refresh list

    } catch (err) {

      console.error("Status update failed:", err);

      toast.error("Failed to update status");

    }

  };

  const cardContent = (

    <div className={styles.card}>

      <img
        src={`http://127.0.0.1:5000/uploads/${incident.image_path}`}
        alt="incident"
        className={styles.image}
      />

      <div className={styles.content}>

        <h4 className={styles.title}>
          {incident.detected_class || "Unknown"}
        </h4>

        <p className={styles.meta}>
          <strong>Status:</strong> {incident.status || "Pending"}
        </p>

        <p className={styles.meta}>
          <strong>Department:</strong>{" "}
          {incident.department || "Manager Review"}
        </p>

        <p className={styles.time}>
          Reported at {new Date(incident.created_at).toLocaleString()}
        </p>

        {showActions && (

          <div className={styles.actions}>

            <button
              className={styles.ackBtn}
              onClick={(e) => handleUpdate(e, "Acknowledged")}
              disabled={
                incident.status === "Acknowledged" ||
                incident.status === "Resolved"
              }
            >
              Acknowledge
            </button>

            <button
              className={styles.resolveBtn}
              onClick={(e) => handleUpdate(e, "Resolved")}
              disabled={incident.status === "Resolved"}
            >
              Resolve
            </button>

          </div>

        )}

      </div>

    </div>

  );

  if (showActions) return cardContent;

  return (
    <Link to={`/incidents/${incident.id}`} className={styles.link}>
      {cardContent}
    </Link>
  );
}

export default IncidentCard;