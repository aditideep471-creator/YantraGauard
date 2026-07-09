import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOGIN ================= */

  const handleLogin = async () => {

    if (!email || !password) {
      Alert.alert("Error", "Enter email and password");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      });

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (err) {
        console.log("SERVER RAW RESPONSE:", text);
        throw new Error("Server returned invalid response");
      }

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        throw new Error(
          data.msg ||
          data.message ||
          data.error ||
          "Login failed"
        );
      }

      /* ===== TOKEN ===== */

      const token =
        data.access_token ||
        data.token ||
        data.accessToken;

      if (!token) {
        throw new Error("Token not received from server");
      }

      await AsyncStorage.setItem("token", token);

      /* ===== USER SAVE ===== */

      if (data.user) {

        const normalizedUser = {
          ...data.user,
          department:
            data.user.role === "employee"
              ? null
              : data.user.department || null
        };

        await AsyncStorage.setItem(
          "user",
          JSON.stringify(normalizedUser)
        );

        console.log("SAVED USER:", normalizedUser);
      }

      Alert.alert("Success", "Login Successful");

      setTimeout(() => {
        router.replace("/dashboard");
      }, 300);

    } catch (err) {

      console.log("LOGIN ERROR:", err);

      Alert.alert(
        "Login Failed",
        err.message || "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  };

  /* ================= UI ================= */

  return (
    <LinearGradient colors={["#6a5acd", "#3b2fa3"]} style={styles.screen}>

      <View style={styles.card}>

        <View style={styles.iconCircle}>
          <Ionicons name="log-in-outline" size={42} color="white" />
        </View>

        <Text style={styles.title}>Welcome Back</Text>

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
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => router.push("/forgot-password")}
          style={styles.forgotCenter}
        >
          <Text style={styles.forgotLink}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerWrap}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.registerText}>
            Don’t have an account?{" "}
            <Text style={styles.registerBold}>Register</Text>
          </Text>
        </TouchableOpacity>

      </View>

    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 25
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 30,
    padding: 25
  },

  iconCircle: {
    width: 85,
    height: 85,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18
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

  forgotCenter: {
    width: "100%",
    alignItems: "center",
    marginBottom: 18
  },

  forgotLink: {
    color: "#E0D9FF",
    fontSize: 14,
    textDecorationLine: "underline"
  },

  button: {
    backgroundColor: "#7b68ee",
    padding: 18,
    borderRadius: 35,
    alignItems: "center"
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  },

  registerWrap: {
    marginTop: 25,
    alignItems: "center"
  },

  registerText: {
    color: "#ddd",
    fontSize: 14
  },

  registerBold: {
    color: "white",
    fontWeight: "600"
  }

});