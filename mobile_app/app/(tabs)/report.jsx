import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/api";

export default function ReportIncident() {

  /* ================= STATES ================= */

  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOCATION ================= */

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Required", "Location permission is required");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to fetch location");
    }
  };

  /* ================= IMAGE PICK ================= */

  const pickImage = async () => {
    try {

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }

    } catch (err) {
      console.log(err);
    }
  };

  /* ================= CAMERA ================= */

  const openCamera = async () => {

    try {

      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission Required", "Camera permission needed");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }

    } catch (err) {
      console.log(err);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    if (!image) {
      Alert.alert("Required", "Please capture incident image");
      return;
    }

    if (!location) {
      Alert.alert("Please Wait", "Fetching location...");
      return;
    }

    try {

      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const formData = new FormData();

      formData.append("image", {
        uri: image,
        name: "incident.jpg",
        type: "image/jpeg"
      });

      formData.append("description", description || "");

      /* GPS Location */
      formData.append("latitude", location.latitude.toString());
      formData.append("longitude", location.longitude.toString());

      /* Manual Location (NEW) */
      formData.append("location", manualLocation || "");

      /* Optional placeholder class */
      formData.append("detected_class", "fire");

      const res = await fetch(`${API_URL}/incidents/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {

        Alert.alert("Success", "Incident reported successfully");

        setImage(null);
        setDescription("");
        setManualLocation("");

      } else {

        const text = await res.text();
        console.log("UPLOAD ERROR:", text);
        Alert.alert("Error", "Failed to submit incident");

      }

    } catch (err) {

      console.log("SUBMIT ERROR:", err);
      Alert.alert("Server Error", "Something went wrong");

    } finally {

      setLoading(false);

    }
  };

  /* ================= UI ================= */

  return (
    <LinearGradient colors={["#5f3dc4", "#3b2fa3"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <Text style={styles.logo}>YantraGuard</Text>

        <View style={styles.card}>

          <Text style={styles.title}>
            Capture incident photo and submit for review
          </Text>

          <TouchableOpacity style={styles.button} onPress={openCamera}>
            <Text style={styles.buttonText}>Open Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOutline} onPress={pickImage}>
            <Text style={styles.buttonText}>Choose From Gallery</Text>
          </TouchableOpacity>

          {image && (
            <Image source={{ uri: image }} style={styles.preview} />
          )}

          <TextInput
            placeholder="Description (Optional)"
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.textArea}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {/* NEW Manual Location Field */}
          <TextInput
            placeholder="Manual Location (e.g. Basement 3 - Machine 1)"
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.input}
            value={manualLocation}
            onChangeText={setManualLocation}
          />

          <Text style={styles.location}>
            📍 GPS Location:{" "}
            {location
              ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
              : "Fetching..."}
          </Text>

          <TouchableOpacity
            style={styles.submit}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? "Submitting..." : "Submit Incident"}
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  container: { flex: 1 },

  scroll: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center"
  },

  logo: {
    fontSize: 34,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 25,
    padding: 20
  },

  title: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center"
  },

  button: {
    backgroundColor: "#7b68ee",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10
  },

  buttonOutline: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15
  },

  buttonText: {
    color: "white",
    fontWeight: "600"
  },

  preview: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 15
  },

  textArea: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "white",
    borderRadius: 15,
    padding: 15,
    minHeight: 100,
    marginBottom: 15
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15
  },

  location: {
    color: "#4ADE80",
    marginBottom: 20
  },

  submit: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 35,
    alignItems: "center"
  },

  submitText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  }

});