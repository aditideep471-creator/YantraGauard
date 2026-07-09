import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "../constants/api";

export default function Register() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("employee");

  /* ================= REGISTER ================= */

  const handleRegister = async () => {

    if (!name || !email || !password) {
      Alert.alert("Error", "Fill all required fields");
      return;
    }

    if (role !== "employee" && !department) {
      Alert.alert("Error", "Select department");
      return;
    }

    try {

      const payload = {
        name,
        email: email.trim().toLowerCase(),
        password,
        role,
        department: role === "employee" ? null : department
      };

      console.log("REGISTER URL:", `${API_URL}/auth/register`);
      console.log("REGISTER PAYLOAD:", payload);

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      console.log("REGISTER RESPONSE:", data);

      if (res.ok) {

        Alert.alert("Success", "Account created successfully");

        setTimeout(() => {
          router.replace("/login");
        }, 300);

      } else {

        Alert.alert("Error", data.error || "Registration failed");

      }

    } catch (err) {

      console.log("REGISTER ERROR:", err);

      Alert.alert(
        "Network Error",
        "Cannot connect to backend server"
      );

    }
  };

  /* ================= UI ================= */

  return (
    <LinearGradient colors={["#6a5acd", "#3b2fa3"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.logoBox}>
          <Text style={styles.logoText}>YantraGuard</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#777"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#777"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {/* ROLE PICKER */}
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={role}
              onValueChange={(value) => {

                setRole(value);

                if (value === "employee") {
                  setDepartment("");
                }

                if (value === "medical_staff") {
                  setDepartment("Medical");
                }

              }}
            >
              <Picker.Item label="Employee" value="employee" />
              <Picker.Item label="Technician" value="technician" />
              <Picker.Item label="Medical Staff" value="medical_staff" />
            </Picker>
          </View>

          {/* DEPARTMENT PICKER */}
          {role !== "employee" && role !== "medical_staff" && (
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={department}
                onValueChange={(value) => setDepartment(value)}
              >
                <Picker.Item label="Select Department" value="" />
                <Picker.Item label="Fire and Safety" value="Fire and Safety" />
                <Picker.Item label="Mechanical" value="Mechanical" />
                <Picker.Item label="Electrical" value="Electrical" />
                <Picker.Item label="Medical" value="Medical" />
              </Picker>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginLink}>
              Already have account? Login
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
    justifyContent: "center",
    padding: 25
  },

  logoBox: {
    alignItems: "center",
    marginBottom: 25
  },

  logoText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#4A7CFF"
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 30,
    padding: 25
  },

  title: {
    color: "white",
    fontSize: 26,
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "600"
  },

  input: {
    backgroundColor: "#eee",
    borderRadius: 30,
    padding: 15,
    marginBottom: 15
  },

  pickerWrap: {
    backgroundColor: "#eee",
    borderRadius: 30,
    marginBottom: 15,
    overflow: "hidden"
  },

  button: {
    backgroundColor: "#7b68ee",
    padding: 18,
    borderRadius: 35,
    alignItems: "center",
    marginTop: 10
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  },

  loginLink: {
    color: "#E0D9FF",
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline"
  }

});