import { useEffect, useState,useRef } from "react";
import { fetchIncidents } from "../api/incidents";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import IncidentCard from "./IncidentCard";
import Page from "../components/Page";
import styles from "./IncidentList.module.css";
import toast from "react-hot-toast";
import socket from "../services/socket";

function IncidentList({ department }) {

  const { user } = useAuth();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  /* ================= LOAD INCIDENTS ================= */

const loadIncidents = async () => {
  try {
    const data = await fetchIncidents();
    setIncidents(data);
  } catch (err) {
    console.error("Failed to load incidents", err);
  } finally {
    setLoading(false);
  }
};



  /* ================= INITIAL LOAD ================= */

  useEffect(() => {

  loadIncidents();

  const interval = setInterval(() => {
    loadIncidents();
  }, 10000); // every 10 seconds

  return () => clearInterval(interval);

}, []);

  /* ================= SOCKET LISTENER ================= */

  useEffect(() => {

  const handleNewIncident = (data) => {

    console.log("🚨 New incident received:", data);

    const readableClass =
      data.class
        ?.replaceAll("_", " ")
        ?.replace(/\b\w/g, l => l.toUpperCase());

    toast.error(`🚨 ${readableClass} detected`);

    lastIncidentId.current = data.id;

    loadIncidents();
  };

  const handleStatusUpdate = () => {
    loadIncidents();
  };

  socket.on("new_incident", handleNewIncident);
  socket.on("incident_status_update", handleStatusUpdate);

  return () => {
    socket.off("new_incident", handleNewIncident);
    socket.off("incident_status_update", handleStatusUpdate);
  };

}, []);

  /* ================= FILTER INCIDENTS ================= */

  const dept = department || user?.department;

  const filteredIncidents = dept
    ? incidents.filter(
        (inc) =>
          inc.department?.toLowerCase() === dept?.toLowerCase()
      )
    : incidents;

  if (loading) return <p className={styles.state}>Loading incidents…</p>;

  const pageTitle =
    mode === "manage"
      ? `Manage ${dept} Incidents`
      : dept
      ? `${dept} Incidents`
      : "Incidents";

  return (
    <Page title={pageTitle}>
      <div className={styles.list}>

        {filteredIncidents.length === 0 && (
          <p className={styles.empty}>No incidents found.</p>
        )}

        {filteredIncidents.map((inc) => (
          <IncidentCard
            key={inc.id}
            incident={inc}
            showActions={mode === "manage"}
          />
        ))}

      </div>
    </Page>
  );
}

export default IncidentList;