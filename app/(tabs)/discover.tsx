
import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection, getDocs,
  serverTimestamp
} from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export default function DiscoverScreen() {
  const [search, setSearch] = useState("");
  const [apiBooks, setApiBooks] = useState<any[]>([]);
  const [communityBooks, setCommunityBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCommunityBooks = async () => {
    try {
      const snapshot = await getDocs(collection(db, "books"));
      const books = snapshot.docs
        .map((item: any) => ({ id: item.id, ...item.data() }))
        .filter((book: any) =>
          book.status === "Available" &&
          book.userId !== auth.currentUser?.uid
        );

      setCommunityBooks(books);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCommunityBooks();
  }, []);

  const searchBooks = async () => {
    if (!search.trim()) {
      setApiBooks([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(search)}&limit=12`
      );
      const data = await response.json();
      setApiBooks(data.docs || []);
    } catch {
      Alert.alert("Error", "Unable to search books. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (book: any) => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Login required", "Please login first.");
      router.replace("/login");
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        bookId: book.id,
        bookTitle: book.title,
        ownerId: book.userId,
        ownerEmail: book.userEmail || "",
        requesterId: user.uid,
        requesterEmail: user.email || user.phoneNumber || "",
        status: "Pending",
        createdAt: serverTimestamp()
      });

      Alert.alert("Request sent", "Your book request has been sent!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not send request.");
    }
  };

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <Text style={s.heading}>Discover</Text>
        <Text style={s.subtitle}>Find your next favourite book</Text>
      </View>

      <View style={s.searchBox}>
        <Ionicons name="search" size={21} color={C.muted} />
        <TextInput
          style={s.searchInput}
          placeholder="Search books, authors..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={searchBooks}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={searchBooks}>
          <Ionicons name="arrow-forward-circle" size={28} color={C.blue} />
        </TouchableOpacity>
      </View>

      <Text style={s.sectionTitle}>Community Books</Text>

      {communityBooks.length === 0 ? (
        <View style={s.emptyCard}>
          <Ionicons name="book-outline" size={35} color={C.gold} />
          <Text style={s.emptyText}>No available books from other students yet.</Text>
        </View>
      ) : (
        communityBooks.map((book) => (
          <View key={book.id} style={s.bookCard}>
            <View style={s.bookIcon}>
              <Ionicons name="book" size={30} color={C.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.bookTitle}>{book.title}</Text>
              <Text style={s.bookAuthor}>by {book.author || "Unknown author"}</Text>
              <Text style={s.bookDescription} numberOfLines={2}>
                {book.description || "A book shared by a student."}
              </Text>
              <TouchableOpacity
                style={s.requestButton}
                onPress={() => sendRequest(book)}
              >
                <Text style={s.requestText}>Request Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <Text style={s.sectionTitle}>Open Library Results</Text>

      {loading && <ActivityIndicator color={C.blue} size="large" />}

      {apiBooks.map((book, index) => (
        <View key={`${book.key}-${index}`} style={s.apiCard}>
          <Ionicons name="library-outline" size={25} color={C.blue} />
          <View style={{ flex: 1 }}>
            <Text style={s.bookTitle}>{book.title}</Text>
            <Text style={s.bookAuthor}>
              {book.author_name?.[0] || "Author unavailable"}
            </Text>
            <Text style={s.bookDescription}>
              {book.first_publish_year || "Publication year unavailable"}
            </Text>
          </View>
        </View>
      ))}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.cream, padding: 18 },
  header: { marginTop: 12, marginBottom: 20 },
  heading: { fontSize: 29, fontWeight: "bold", color: C.navy },
  subtitle: { color: C.muted, marginTop: 5, fontSize: 14 },
  searchBox: {
    flexDirection: "row", alignItems: "center", backgroundColor: C.white,
    borderRadius: 16, paddingHorizontal: 15, height: 55, marginBottom: 25,
    borderWidth: 1, borderColor: C.border
  },
  searchInput: { flex: 1, marginHorizontal: 10, color: C.text },
  sectionTitle: { fontSize: 19, fontWeight: "bold", color: C.navy, marginBottom: 13, marginTop: 8 },
  bookCard: {
    backgroundColor: C.white, borderRadius: 18, padding: 15,
    marginBottom: 13, flexDirection: "row", gap: 14,
    borderWidth: 1, borderColor: C.border
  },
  bookIcon: {
    width: 58, height: 75, borderRadius: 10, backgroundColor: C.navy,
    alignItems: "center", justifyContent: "center"
  },
  bookTitle: { fontSize: 16, fontWeight: "bold", color: C.text },
  bookAuthor: { color: C.muted, marginTop: 4, fontSize: 13 },
  bookDescription: { color: C.muted, marginTop: 6, fontSize: 12 },
  requestButton: {
    backgroundColor: C.blue, paddingVertical: 9, paddingHorizontal: 15,
    borderRadius: 10, alignSelf: "flex-start", marginTop: 10
  },
  requestText: { color: C.white, fontWeight: "bold", fontSize: 12 },
  apiCard: {
    backgroundColor: C.white, padding: 16, borderRadius: 15,
    marginBottom: 10, flexDirection: "row", gap: 14, alignItems: "center",
    borderWidth: 1, borderColor: C.border
  },
  emptyCard: {
    backgroundColor: C.white, padding: 25, borderRadius: 16,
    alignItems: "center", marginBottom: 20
  },
  emptyText: { color: C.muted, textAlign: "center", marginTop: 10 }
});
