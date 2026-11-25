
import { Ionicons } from "@expo/vector-icons";
import { signInWithPhoneNumber } from "@react-native-firebase/auth";
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

export default function PhoneOTPScreen() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getFormattedPhone = () => {
    const value = phone.trim();

    if (value.startsWith("+")) {
      return value;
    }

    return `+91${value.replace(/\D/g, "")}`;
  };

  const sendOTP = async () => {
    const digits = phone.replace(/\D/g, "");

    if (
      (!phone.trim().startsWith("+") && digits.length !== 10) ||
      (phone.trim().startsWith("+") && digits.length < 8)
    ) {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid phone number with country code."
      );
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithPhoneNumber(
        auth,
        getFormattedPhone()
      );

      setConfirmation(result);

      Alert.alert(
        "OTP Sent",
        "A verification code has been sent to your phone."
      );
    } catch (error: any) {
      Alert.alert(
        "OTP Error",
        error.message || "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert("Enter OTP", "Please enter the verification code.");
      return;
    }

    setLoading(true);

    try {
      await confirmation.confirm(otp.trim());

      Alert.alert("Success", "You are now logged in to BookBridge.");

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Invalid OTP",
        error.message || "Please enter the correct verification code."
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={COLORS.navy}
          />
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>

        <View style={styles.logoCircle}>
          <Ionicons
            name="phone-portrait"
            size={43}
            color={COLORS.gold}
          />
        </View>

        <Text style={styles.appName}>BookBridge</Text>
        <Text style={styles.tagline}>Give Books a Second Life</Text>

        <View style={styles.card}>
          <Text style={styles.heading}>
            Phone Verification
          </Text>

          <Text style={styles.subtitle}>
            Login securely using a one-time password sent to your phone.
          </Text>

          <View style={styles.illustration}>
            <Ionicons
              name="shield-checkmark"
              size={42}
              color={COLORS.blue}
            />
            <Text style={styles.illustrationText}>
              Secure Login
            </Text>
          </View>

          <Text style={styles.label}>Phone Number</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color={COLORS.muted}
            />

            <TextInput
              style={styles.input}
              placeholder="+91 9876543210"
              placeholderTextColor={COLORS.muted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={!confirmation}
            />
          </View>

          {!confirmation ? (
            <TouchableOpacity
              style={styles.mainButton}
              onPress={sendOTP}
              disabled={loading}
            >
              <Text style={styles.mainButtonText}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </Text>
              <Ionicons
                name="paper-plane-outline"
                size={19}
                color={COLORS.white}
              />
            </TouchableOpacity>
          ) : (
            <>
              <Text style={styles.label}>Verification Code</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="keypad-outline"
                  size={20}
                  color={COLORS.muted}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor={COLORS.muted}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                />
              </View>

              <TouchableOpacity
                style={styles.mainButton}
                onPress={verifyOTP}
                disabled={loading}
              >
                <Text style={styles.mainButtonText}>
                  {loading ? "Verifying..." : "Verify & Login"}
                </Text>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={COLORS.white}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                  setConfirmation(null);
                  setOtp("");
                }}
              >
                <Text style={styles.resendText}>
                  Change Phone Number
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.bottomSection}>
          <Ionicons
            name="lock-closed"
            size={14}
            color={COLORS.gold}
          />
          <Text style={styles.bottomText}>
            Your account is protected with secure verification.
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
    paddingVertical: 30,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 28,
  },
  backText: {
    color: COLORS.navy,
    fontWeight: "600",
    fontSize: 13,
  },
  logoCircle: {
    width: 85,
    height: 85,
    borderRadius: 27,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    elevation: 5,
  },
  appName: {
    color: COLORS.navy,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 14,
  },
  tagline: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 28,
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
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  illustration: {
    backgroundColor: "#EEF2F9",
    borderRadius: 16,
    height: 105,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 23,
    marginBottom: 12,
  },
  illustrationText: {
    color: COLORS.blue,
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
  },
  label: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
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
    marginTop: 24,
  },
  mainButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  resendButton: {
    alignItems: "center",
    marginTop: 20,
  },
  resendText: {
    color: COLORS.blue,
    fontWeight: "bold",
    fontSize: 12,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    marginTop: 25,
  },
  bottomText: {
    color: COLORS.muted,
    fontSize: 10,
    textAlign: "center",
  },
});
