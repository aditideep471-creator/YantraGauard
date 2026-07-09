import { useEffect, useState } from "react";
import api from "../api/axios";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./ManagerIncidents.module.css";
import toast from "react-hot-toast";

function UnassignedIncidents() {

  const [incidents, setIncidents] = useState([]);
  const [department, setDepartment] = useState({});

  /* ================= FETCH INCIDENTS ================= */
 
  const fetchIncidents = async () => {

  try {

    const res = await api.get("/incidents");

    const unassigned = res.data.filter(
      (i) =>
        i.department === "Manager Review" &&
        i.status !== "Discarded"
    );

    setIncidents(unassigned);

  } catch (err) {

    console.error("Failed to fetch incidents", err);

  }

};
  

  useEffect(() => {
    fetchIncidents();
  }, []);

  /* ================= ASSIGN INCIDENT ================= */
 const assignDepartment = async (id) => {

  try {

    await api.put(`/incidents/${id}/assign`, {
      department: department[id]
    });

    fetchIncidents();

  } catch (err) {

    console.error("Assignment failed", err);

  }

};
  

  /* ================= DISCARD INCIDENT ================= */
 const discardIncident = async (id) => {

  try {

    await api.put(`/incidents/${id}/status`, {
      status: "Discarded"
    });

    toast.success("Incident discarded");

    fetchIncidents();

  } catch (err) {

    console.error("Discard failed", err);

    toast.error("Failed to discard incident");

  }

};
  
  return (

    <Page title="Unassigned Incidents">

      <Card>

        <table className={styles.table}>

          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Class</th>
              <th>Location</th>
              <th>Assign Department</th>
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

                <td>

                  <select
                    value={department[i.id] || ""}
                    onChange={(e) =>
                      setDepartment({
                        ...department,
                        [i.id]: e.target.value,
                      })
                    }
                  >

                    <option value="">Select</option>
                    <option value="Fire and Safety">Fire and Safety</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Medical">Medical</option>

                  </select>

                  <button
                    className={styles.button}
                    onClick={() => assignDepartment(i.id)}
                  >
                    Assign
                  </button>

                  <button
                    className={styles.button}
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "#ef4444"
                    }}
                    onClick={() => discardIncident(i.id)}
                  >
                    Discard
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </Card>

    </Page>

  );

}

export default UnassignedIncidents;