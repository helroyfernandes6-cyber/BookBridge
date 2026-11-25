
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { auth } from "../firebase/firebaseConfig";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth.currentUser) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={s.container}>
      <View style={s.logo}>
        <Ionicons name="library" size={65} color="#E9B96E" />
      </View>
      <Text style={s.title}>BookBridge</Text>
      <Text style={s.tagline}>Give Books a Second Life.</Text>
      <View style={s.bottom}>
        <Text style={s.footer}>A community of readers, sharing knowledge.</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#173B65",
    justifyContent: "center", alignItems: "center"
  },
  logo: {
    width: 120, height: 120, borderRadius: 35,
    backgroundColor: "#285078", alignItems: "center",
    justifyContent: "center", marginBottom: 22
  },
  title: { color: "#FFFFFF", fontSize: 37, fontWeight: "bold", letterSpacing: 1 },
  tagline: { color: "#E9B96E", fontSize: 15, marginTop: 9 },
  bottom: { position: "absolute", bottom: 55 },
  footer: { color: "#DCE5F1", fontSize: 12 }
});
