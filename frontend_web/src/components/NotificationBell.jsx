import { useEffect, useState, useRef } from "react";
import { fetchIncidents } from "../api/incidents";
import styles from "./NotificationBell.module.css";
import toast from "react-hot-toast";
import socket from "../services/socket";

function NotificationBell() {

  const [count, setCount] = useState(0);
  const lastIncidentId = useRef(null);

  const loadNotifications = async () => {

    try {

      const data = await fetchIncidents();

      setCount(data.length);

      if (data.length > 0) {

        const newest = data[0];

        if (lastIncidentId.current && newest.id !== lastIncidentId.current) {

          const readableClass =
            newest.detected_class
              ?.replaceAll("_", " ")
              ?.replace(/\b\w/g, l => l.toUpperCase());

          toast.error(`🚨 ${readableClass} detected`, {
  duration: 10000,
  icon: "⚠️"
});


        }

        lastIncidentId.current = newest.id;

      }

    } catch (err) {
      console.error("Notification fetch failed");
    }

  };

  useEffect(() => {

    loadNotifications();

    const interval = setInterval(loadNotifications, 10000);

    return () => clearInterval(interval);

  }, []);

  /* SOCKET REAL-TIME ALERT */

  useEffect(() => {

    socket.on("new_incident", (data) => {

      const readableClass =
        data.class
          ?.replaceAll("_", " ")
          ?.replace(/\b\w/g, l => l.toUpperCase());

      toast.error(`🚨 ${readableClass} detected`);

      setCount((prev) => prev + 1);

    });

    return () => socket.off("new_incident");

  }, []);

  return (
    <div className={styles.bell}>
      🔔
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </div>
  );
}

export default NotificationBell;