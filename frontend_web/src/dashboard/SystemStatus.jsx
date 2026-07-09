import { useEffect, useState } from "react";
import api from "../api/axios";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./SystemStatus.module.css";

function SystemStatus() {

  const [health, setHealth] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {

    const checkHealth = async () => {

      try {

        const res = await api.get("/system-status");

        setHealth(res.data);
        setError(false);

      } catch (err) {

        console.error(err);
        setError(true);

      }

    };

    checkHealth();

    const interval = setInterval(checkHealth, 10000);

    return () => clearInterval(interval);

  }, []);

  return (

    <Page title="System Status">

      <div className={styles.grid}>

        <Card>
          <h3>Backend Server</h3>
          <p className={error ? styles.error : styles.ok}>
            {error ? "Offline" : "Running"}
          </p>
        </Card>

        <Card>
          <h3>Database</h3>
          <p className={styles.ok}>
            {health?.database || "Checking..."}
          </p>
        </Card>

        <Card>
          <h3>Server Time</h3>
          <p>
            {health?.server_time
              ? new Date(health.server_time).toLocaleString()
              : "Loading..."}
          </p>
        </Card>

        <Card>
          <h3>CPU Usage</h3>
          <p>
            {health?.cpu_usage !== undefined
              ? `${health.cpu_usage}%`
              : "Checking..."}
          </p>
        </Card>

        <Card>
          <h3>Memory Usage</h3>
          <p>
            {health?.memory_usage !== undefined
              ? `${health.memory_usage}%`
              : "Checking..."}
          </p>
        </Card>

        <Card>
          <h3>Disk Usage</h3>
          <p>
            {health?.disk_usage !== undefined
              ? `${health.disk_usage}%`
              : "Checking..."}
          </p>
        </Card>

      </div>

    </Page>

  );

}

export default SystemStatus;