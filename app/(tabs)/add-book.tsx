
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, serverTimestamp } from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";

const C = {
  navy: "#173B65", blue: "#2857A9", gold: "#E9B96E",
  cream: "#F7F3EA", white: "#FFFFFF", text: "#243247",
  muted: "#788496", border: "#E5E1D8"
};

export default function AddBookScreen() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const addBook = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Login required", "Please login first.");
      router.replace("/login");
      return;
    }

    if (!title.trim() || !author.trim()) {
      Alert.alert("Missing details", "Enter the book title and author.");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "books"), {
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
        userId: user.uid,
        userEmail: user.email || user.phoneNumber || "",
        status: "Available",
        createdAt: serverTimestamp()
      });

      Alert.alert("Success", "Your book has been added to the community shelf!");
      setTitle("");
      setAuthor("");
      setDescription("");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Unable to add book.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 35 }}>
      <View style={s.header}>
        <Text style={s.heading}>Share a Book</Text>
        <Text style={s.subtitle}>Give your books a second life.</Text>
      </View>

      <View style={s.banner}>
        <Ionicons name="book" size={48} color={C.gold} />
        <Text style={s.bannerTitle}>Your bookshelf can inspire someone.</Text>
        <Text style={s.bannerText}>Add a book and let another student discover it.</Text>
      </View>

      <View style={s.formCard}>
        <Text style={s.label}>Book Title *</Text>
        <View style={s.inputBox}>
          <Ionicons name="book-outline" size={20} color={C.muted} />
          <TextInput
            style={s.input}
            placeholder="Enter book title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={C.muted}
          />
        </View>

        <Text style={s.label}>Author *</Text>
        <View style={s.inputBox}>
          <Ionicons name="person-outline" size={20} color={C.muted} />
          <TextInput
            style={s.input}
            placeholder="Enter author name"
            value={author}
            onChangeText={setAuthor}
            placeholderTextColor={C.muted}
          />
        </View>

        <Text style={s.label}>Description</Text>
        <View style={[s.inputBox, s.descriptionBox]}>
          <TextInput
            style={s.descriptionInput}
            placeholder="Write a short description..."
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor={C.muted}
          />
        </View>

        <TouchableOpacity
          style={[s.button, saving && { opacity: 0.6 }]}
          onPress={addBook}
          disabled={saving}
        >
          <Ionicons name="add-circle-outline" size={21} color="white" />
          <Text style={s.buttonText}>
            {saving ? "Adding Book..." : "Add to Community Shelf"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.cream, padding: 18 },
  header: { marginTop: 12, marginBottom: 20 },
  heading: { fontSize: 29, fontWeight: "bold", color: C.navy },
  subtitle: { color: C.muted, marginTop: 5 },
  banner: { backgroundColor: C.navy, borderRadius: 20, padding: 24, alignItems: "center", marginBottom: 22 },
  bannerTitle: { color: C.white, fontSize: 19, fontWeight: "bold", textAlign: "center", marginTop: 12 },
  bannerText: { color: "#DCE5F1", textAlign: "center", marginTop: 8, fontSize: 13 },
  formCard: { backgroundColor: C.white, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: C.border },
  label: { color: C.navy, fontWeight: "bold", marginBottom: 9, marginTop: 13 },
  inputBox: { height: 53, borderWidth: 1, borderColor: C.border, borderRadius: 12, flexDirection: "row", alignItems: "center", paddingHorizontal: 13, backgroundColor: "#FFFEFC" },
  input: { flex: 1, marginLeft: 10, color: C.text },
  descriptionBox: { height: 110, alignItems: "flex-start", paddingTop: 12 },
  descriptionInput: { flex: 1, width: "100%", color: C.text, textAlignVertical: "top" },
  button: { backgroundColor: C.blue, height: 54, borderRadius: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 25 },
  buttonText: { color: C.white, fontWeight: "bold", fontSize: 15 }
});
