
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "@react-native-firebase/auth";
import { router } from "expo-router";
import {
  Alert,
  StyleSheet,
  Text, TouchableOpacity,
  View
} from "react-native";
import { auth } from "../../firebase/firebaseConfig";

const C = {
  navy: "#173B65", blue: "#2857A9", gold: "#E9B96E",
  cream: "#F7F3EA", white: "#FFFFFF", text: "#243247",
  muted: "#788496", border: "#E5E1D8", red: "#D9534F"
};

export default function ProfileScreen() {
  const user = auth.currentUser;

  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace("/login");
          } catch (error: any) {
            Alert.alert("Error", error.message || "Unable to logout.");
          }
        }
      }
    ]);
  };

  return (
    <View style={s.container}>
      <Text style={s.heading}>My Profile</Text>
      <Text style={s.subtitle}>Your BookBridge account</Text>

      <View style={s.profileCard}>
        <View style={s.avatar}>
          <Ionicons name="person" size={42} color={C.gold} />
        </View>
        <Text style={s.name}>BookBridge Student</Text>
        <Text style={s.accountText}>Community Member</Text>
      </View>

      <View style={s.infoCard}>
        <View style={s.infoRow}>
          <View style={s.infoIcon}>
            <Ionicons name="mail-outline" size={21} color={C.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Email Address</Text>
            <Text style={s.value}>{user?.email || "Not linked"}</Text>
          </View>
        </View>

        <View style={s.separator} />

        <View style={s.infoRow}>
          <View style={s.infoIcon}>
            <Ionicons name="call-outline" size={21} color={C.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Phone Number</Text>
            <Text style={s.value}>{user?.phoneNumber || "Not linked"}</Text>
          </View>
        </View>

        <View style={s.separator} />

        <View style={s.infoRow}>
          <View style={s.infoIcon}>
            <Ionicons name="shield-checkmark-outline" size={21} color={C.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Account Status</Text>
            <Text style={s.value}>Authenticated</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={s.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={21} color={C.white} />
        <Text style={s.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={s.footer}>BookBridge · Give Books a Second Life.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.cream, padding: 20 },
  heading: { fontSize: 29, fontWeight: "bold", color: C.navy, marginTop: 12 },
  subtitle: { color: C.muted, marginTop: 5, marginBottom: 22 },
  profileCard: { backgroundColor: C.navy, borderRadius: 21, padding: 27, alignItems: "center" },
  avatar: { width: 85, height: 85, borderRadius: 43, backgroundColor: "#285078", alignItems: "center", justifyContent: "center", marginBottom: 13 },
  name: { color: C.white, fontSize: 20, fontWeight: "bold" },
  accountText: { color: "#DCE5F1", marginTop: 5 },
  infoCard: { backgroundColor: C.white, borderRadius: 18, padding: 17, marginTop: 20, borderWidth: 1, borderColor: C.border },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 9 },
  infoIcon: { width: 43, height: 43, borderRadius: 12, backgroundColor: "#EEF2F8", alignItems: "center", justifyContent: "center" },
  label: { color: C.muted, fontSize: 12 },
  value: { color: C.text, fontWeight: "600", marginTop: 4, fontSize: 13 },
  separator: { height: 1, backgroundColor: C.border, marginVertical: 7 },
  logoutButton: { backgroundColor: C.red, height: 53, borderRadius: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 25 },
  logoutText: { color: C.white, fontWeight: "bold", fontSize: 15 },
  footer: { color: C.muted, textAlign: "center", marginTop: 25, fontSize: 12 }
});
