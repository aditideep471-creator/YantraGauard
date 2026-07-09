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
import { API_URL } from "../constants/api";

export default function ForgotPassword() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  /* ================= SEND OTP ================= */
  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Enter email first");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        Alert.alert("Success", "OTP sent to your email");
        setOtpSent(true);
      } else {
        Alert.alert("Error", "Failed to send OTP");
      }
    } catch {
      Alert.alert("Server error");
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async () => {

    if (!otp || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/reset-password-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword
        })
      });

      if (res.ok) {
        Alert.alert("Success", "Password reset successful");
        router.push("/login");
      } else {
        Alert.alert("Error", "Invalid OTP or reset failed");
      }
    } catch {
      Alert.alert("Server error");
    }
  };

  return (
    <LinearGradient
      colors={["#5f3dc4", "#3b2fa3"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* BRAND */}
        <Text style={styles.logo}>YantraGuard</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Forgot Password</Text>

          {/* EMAIL */}
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          {/* SEND OTP */}
          {!otpSent && (
            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          )}

          {/* AFTER OTP SENT */}
          {otpSent && (
            <>
              <TextInput
                placeholder="Enter OTP"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
              />

              <TextInput
                placeholder="New Password"
                placeholderTextColor="rgba(255,255,255,0.6)"
                secureTextEntry
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="rgba(255,255,255,0.6)"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleResetPassword}
              >
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>
            </>
          )}

          {/* BACK */}
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.back}>Back to Login</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25
  },

  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 25
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.12)",
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
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "white",
    borderRadius: 30,
    padding: 15,
    marginBottom: 15
  },

  button: {
    backgroundColor: "#7b68ee",
    padding: 18,
    borderRadius: 35,
    alignItems: "center",
    marginTop: 5
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  },

  back: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline"
  }

});