import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {

  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  /* ================= LOAD USER ================= */

  useEffect(() => {
    loadUser();
    loadProfileImage();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    } catch (e) {
      console.log("User load error", e);
    }
  };

  const loadProfileImage = async () => {
    try {
      const img = await AsyncStorage.getItem("profileImage");
      if (img) setProfileImage(img);
    } catch (e) {
      console.log("Image load error", e);
    }
  };

  /* ================= PICK IMAGE ================= */

  const pickImage = async () => {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required to access gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1
    });

    if (!result.canceled) {

      const uri = result.assets[0].uri;

      setProfileImage(uri);

      await AsyncStorage.setItem("profileImage", uri);
    }
  };

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure?",
      [
        { text: "Cancel" },
        {
          text: "Logout",
          onPress: async () => {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            router.replace("/login");
          }
        }
      ]
    );
  };

  /* ================= UI ================= */

  return (
    <LinearGradient
      colors={["#5f3dc4", "#3b2fa3"]}
      style={styles.container}
    >

      <Text style={styles.logo}>YantraGuard</Text>

      <View style={styles.card}>

        <Text style={styles.title}>Profile</Text>

        {/* PROFILE IMAGE */}

        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={pickImage}
        >

          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.avatar}
            />
          ) : (
            <Text style={styles.avatarText}>+</Text>
          )}

        </TouchableOpacity>

        <Text style={styles.uploadText}>Tap to upload photo</Text>

        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name || "-"}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || "-"}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role || "-"}</Text>

        {user?.department && (
          <>
            <Text style={styles.label}>Department</Text>
            <Text style={styles.value}>{user.department}</Text>
          </>
        )}

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </View>

    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20
  },

  logo: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 25,
    padding: 25
  },

  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },

  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 10
  },

  avatar: {
    width: "100%",
    height: "100%"
  },

  avatarText: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold"
  },

  uploadText: {
    textAlign: "center",
    color: "#ddd",
    marginBottom: 15
  },

  label: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 10
  },

  value: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10
  },

  logoutBtn: {
    marginTop: 25,
    backgroundColor: "#ff4d6d",
    padding: 16,
    borderRadius: 30,
    alignItems: "center"
  },

  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  }

});