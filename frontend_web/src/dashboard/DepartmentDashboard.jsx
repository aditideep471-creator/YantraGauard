import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchIncidents } from "../api/incidents";

import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./DepartmentDashboard.module.css";

function DepartmentDashboard() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchIncidents();
        setIncidents(data);
      } catch {
        console.error("Failed to load incidents");
      }
    };
    load();
  }, []);

  const departments = [
    {
      name: "Fire and Safety",
      path: "/department/fire",
    },
    {
      name: "Mechanical",
      path: "/department/mechanical",
    },
    {
      name: "Electrical",
      path: "/department/electrical",
    },
    {
      name: "Medical",
      path: "/department/medical",
    },
  ];

  // ✅ Count incidents per department
  const getCount = (deptName) => {
    return incidents.filter(
      (i) => i.department?.toLowerCase() === deptName.toLowerCase()
    ).length;
  };

  return (
    <Page title="Department Dashboard">
      <div className={styles.header}>
        <h2 className={styles.title}>Departments</h2>
        <p className={styles.subtitle}>
          Select a department to view incidents and reports
        </p>
      </div>

      <div className={styles.grid}>
        {departments.map((dept) => (
          <Card
            key={dept.name}
            className={styles.clickableCard}
            onClick={() => navigate(dept.path)}
          >
            <h3 className={styles.cardTitle}>{dept.name}</h3>

            {/* ⭐ Incident Count */}
            <p className={styles.count}>
              {getCount(dept.name)} Incidents
            </p>
          </Card>
        ))}
      </div>
    </Page>
  );
}

export default DepartmentDashboard;