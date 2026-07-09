import { useEffect, useState } from "react";
import api from "../api/axios";
import Page from "../components/Page";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import styles from "./ManagerIncidents.module.css";

function ManagerIncidents() {
  const [incidents, setIncidents] = useState([]);

  const fetchIncidents = async () => {
    try {
      const res = await api.get("/incidents");
      setIncidents(res.data);
    } catch (err) {
      console.error("Failed to fetch incidents");
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const markResolved = async (id) => {
    try {
      await api.put(`/incidents/${id}/status`, {
        status: "Resolved",
      });
      fetchIncidents();
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  return (
    <Page title="All Incidents">
      <Card>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Class</th>
              <th>Location</th>
              <th>Department</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td>

                <td>
                  <img
                    src={`http://localhost:5000/uploads/${i.image_path}`}
                    alt="incident"
                    className={styles.image}
                  />
                </td>

                <td>{i.detected_class}</td>

                <td>{i.location_text || "N/A"}</td>

                <td>{i.department}</td>

                <td>
                  <StatusBadge status={i.status} />
                </td>

                <td>
                  {i.status !== "Resolved" && (
                    <button
                      className={styles.button}
                      onClick={() => markResolved(i.id)}
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

export default ManagerIncidents;