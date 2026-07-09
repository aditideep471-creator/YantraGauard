
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/api";
import socket from "../../services/socket";

export default function Dashboard() {

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* ================= FETCH INCIDENTS ================= */

  const fetchIncidents = async () => {

    try {

      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");

      if (!token || !userData) {
        console.log("Missing token or user");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);

      const res = await fetch(`${API_URL}/incidents`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      console.log("ALL INCIDENTS:", data);
      console.log("LOGGED USER:", user);

      let filtered = [];

      /* ===== ROLE BASED FILTER ===== */

      if (user.role === "manager") {

        filtered = data;

      }

      else if (user.role === "employee") {

        filtered = data.filter(
          (inc) => inc.reported_by === user.id
        );

      }

      else if (user.role === "technician" || user.role === "medical_staff") {

        filtered = data.filter((inc) => {

          if (!inc.department) return false;

          if (inc.department === "Manager Review") return false;

          return (
            inc.department.toLowerCase() ===
            user.department?.toLowerCase()
          );

        });

      }

      console.log("FILTERED INCIDENTS:", filtered);

      setIncidents(filtered);

    } catch (err) {

      console.log("Fetch error", err);

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };

  /* ================= SOCKET + INITIAL LOAD ================= */

  useEffect(() => {

    fetchIncidents();

    socket.on("new_incident", (data) => {

      console.log("🚨 New Incident:", data);

      const hazard = data.class
        ? data.class.replaceAll("_", " ").toUpperCase()
        : "HAZARD";

      setTimeout(() => {
        Alert.alert(
          "🚨 INCIDENT ALERT",
          `${hazard} DETECTED`
        );
      }, 100);

      fetchIncidents();

    });

    socket.on("incident_status_update", () => {

      console.log("Incident status updated");

      fetchIncidents();

    });

    return () => {

      socket.off("new_incident");
      socket.off("incident_status_update");

    };

  }, []);

  /* ================= PULL TO REFRESH ================= */

  const onRefresh = () => {
    setRefreshing(true);
    fetchIncidents();
  };

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (status) => {

    if (status === "Resolved") return "#22C55E";
    if (status === "Acknowledged") return "#F59E0B";

    return "#EF4444";

  };

  /* ================= INCIDENT CARD ================= */

  const renderItem = ({ item }) => (

    <View style={styles.card}>

      {item.image_path && (
        <Image
          source={{ uri: `${API_URL}/uploads/${item.image_path}` }}
          style={styles.image}
        />
      )}

      <View style={styles.cardContent}>

        <Text style={styles.incidentType}>
          {item.detected_class
            ? item.detected_class.replaceAll("_", " ").toUpperCase()
            : "UNKNOWN"}
        </Text>

        <Text
          style={[
            styles.status,
            { color: getStatusColor(item.status) }
          ]}
        >
          Status: {item.status || "Pending"}
        </Text>

        <Text style={styles.text}>
          Department: {item.department || "Manager Review"}
        </Text>

        <Text style={styles.text}>
          Location: {item.location_text || "Not provided"}
        </Text>

        <Text style={styles.time}>
          {new Date(item.created_at).toLocaleString()}
        </Text>

      </View>

    </View>

  );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <LinearGradient colors={["#5f3dc4", "#3b2fa3"]} style={styles.center}>
        <ActivityIndicator size="large" color="white" />
      </LinearGradient>
    );
  }

  /* ================= UI ================= */

  return (

    <LinearGradient colors={["#5f3dc4", "#3b2fa3"]} style={styles.container}>

      <Text style={styles.logo}>YantraGuard</Text>

      {incidents.length === 0 ? (

        <Text style={styles.noData}>
          No incidents available
        </Text>

      ) : (

        <FlatList
          data={incidents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />

      )}

    </LinearGradient>

  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 15
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  logo: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },

  noData: {
    color: "white",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    marginBottom: 15,
    overflow: "hidden"
  },

  image: {
    width: "100%",
    height: 160
  },

  cardContent: {
    padding: 15
  },

  incidentType: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 6
  },

  status: {
    fontWeight: "600",
    marginBottom: 4
  },

  text: {
    color: "white",
    marginBottom: 3
  },

  time: {
    color: "#D1D5DB",
    marginTop: 6,
    fontSize: 12
  }

});