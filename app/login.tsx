
import { Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../firebase/firebaseConfig";

const COLORS = {
  navy: "#173B65",
  blue: "#2857A9",
  gold: "#E9B96E",
  cream: "#F7F3EA",
  white: "#FFFFFF",
  text: "#243247",
  muted: "#788496",
  border: "#E5E1D8",
};

export default function LoginScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Details", "Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        Alert.alert("Welcome!", "Your BookBridge account was created.");
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      }

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Authentication Failed",
        error.message || "Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topDecoration}>
          <View style={styles.logoCircle}>
  <Ionicons
    name="library"
    size={43}
    color={COLORS.gold}
  />
</View>

          <Text style={styles.appName}>BookBridge</Text>
          <Text style={styles.tagline}>Give Books a Second Life</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>
            {isRegister ? "Create Account" : "Welcome Back!"}
          </Text>

          <Text style={styles.subtitle}>
            {isRegister
              ? "Join our community of book lovers."
              : "Your next favourite book is waiting for you."}
          </Text>

          <Text style={styles.label}>Email Address</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={COLORS.muted}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={COLORS.muted}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.muted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={COLORS.muted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.mainButtonText}>
              {loading
                ? "Please wait..."
                : isRegister
                ? "Create Account"
                : "Login"}
            </Text>

            {!loading && (
              <Ionicons
                name="arrow-forward"
                size={20}
                color={COLORS.white}
              />
            )}
          </TouchableOpacity>

          <View style={styles.separator}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.phoneButton}
            onPress={() => router.push("/phone-otp")}
          >
            <Ionicons
              name="phone-portrait-outline"
              size={20}
              color={COLORS.blue}
            />
            <Text style={styles.phoneButtonText}>
              Continue with Phone OTP
            </Text>
          </TouchableOpacity>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
            </Text>

            <TouchableOpacity
              onPress={() => setIsRegister(!isRegister)}
            >
              <Text style={styles.switchLink}>
                {isRegister ? " Login" : " Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Ionicons name="book-outline" size={17} color={COLORS.gold} />
          <Text style={styles.bottomText}>
            Read More. Share More. Connect More.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22,
    paddingVertical: 35,
  },
  topDecoration: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  logo: {
    fontSize: 43,
  },
  appName: {
    color: COLORS.navy,
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 14,
  },
  tagline: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 5,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 23,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
  },
  heading: {
    color: COLORS.navy,
    fontSize: 25,
    fontWeight: "bold",
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 7,
    marginBottom: 25,
  },
  label: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 12,
  },
  inputContainer: {
    height: 53,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FAFAF8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.text,
    fontSize: 14,
  },
  mainButton: {
    backgroundColor: COLORS.blue,
    height: 54,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 25,
  },
  mainButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 15,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 23,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  orText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "bold",
  },
  phoneButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.blue,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  phoneButtonText: {
    color: COLORS.blue,
    fontWeight: "bold",
    fontSize: 13,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  switchText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  switchLink: {
    color: COLORS.blue,
    fontWeight: "bold",
    fontSize: 12,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 25,
  },
  bottomText: {
    color: COLORS.muted,
    fontSize: 11,
  },
});
