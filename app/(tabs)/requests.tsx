
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text, TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";

const C = {
  navy: "#173B65", blue: "#2857A9", gold: "#E9B96E",
  cream: "#F7F3EA", white: "#FFFFFF", text: "#243247",
  muted: "#788496", green: "#27845B", red: "#D9534F",
  border: "#E5E1D8"
};

export default function RequestsScreen() {
  const [tab, setTab] = useState("received");
  const [received, setReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const receivedQuery = query(
        collection(db, "requests"),
        where("ownerId", "==", user.uid)
      );

      const sentQuery = query(
        collection(db, "requests"),
        where("requesterId", "==", user.uid)
      );

      const [receivedSnapshot, sentSnapshot] = await Promise.all([
        getDocs(receivedQuery),
        getDocs(sentQuery)
      ]);

      setReceived(receivedSnapshot.docs.map((item: any) => ({
        id: item.id, ...item.data()
      })));

      setSent(sentSnapshot.docs.map((item: any) => ({
        id: item.id, ...item.data()
      })));
    } catch (error: any) {
      Alert.alert("Error", error.message || "Unable to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateRequest = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "requests", id), { status });
      Alert.alert("Updated", `Request ${status.toLowerCase()}.`);
      await loadRequests();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Unable to update request.");
    }
  };

  const currentList = tab === "received" ? received : sent;

  const renderRequest = ({ item }: any) => (
    <View style={s.card}>
      <View style={s.iconBox}>
        <Ionicons name="book" size={27} color={C.gold} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={s.bookTitle}>{item.bookTitle || "Book request"}</Text>
        <Text style={s.email}>
          {tab === "received"
            ? `From: ${item.requesterEmail || "Student"}`
            : `To: ${item.ownerEmail || "Book owner"}`}
        </Text>

        <Text style={[
          s.status,
          item.status === "Accepted" && { color: C.green },
          item.status === "Rejected" && { color: C.red }
        ]}>
          {item.status || "Pending"}
        </Text>

        {tab === "received" && item.status === "Pending" && (
          <View style={s.actions}>
            <TouchableOpacity
              style={s.acceptButton}
              onPress={() => updateRequest(item.id, "Accepted")}
            >
              <Text style={s.actionText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.rejectButton}
              onPress={() => updateRequest(item.id, "Rejected")}
            >
              <Text style={s.actionText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.heading}>Book Requests</Text>
        <Text style={s.subtitle}>Keep track of your book exchanges.</Text>
      </View>

      <View style={s.tabs}>
        <TouchableOpacity
          style={[s.tab, tab === "received" && s.activeTab]}
          onPress={() => setTab("received")}
        >
          <Text style={[s.tabText, tab === "received" && s.activeTabText]}>
            Received ({received.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.tab, tab === "sent" && s.activeTab]}
          onPress={() => setTab("sent")}
        >
          <Text style={[s.tabText, tab === "sent" && s.activeTab && s.activeTabText]}>
            Sent ({sent.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={C.blue} size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={currentList}
          keyExtractor={(item) => item.id}
          renderItem={renderRequest}
          contentContainerStyle={{ paddingBottom: 30 }}
          onRefresh={loadRequests}
          refreshing={loading}
          ListEmptyComponent={
            <View style={s.empty}>
              <Ionicons name="mail-open-outline" size={48} color={C.gold} />
              <Text style={s.emptyTitle}>No requests yet</Text>
              <Text style={s.emptyText}>Your book exchange requests will appear here.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.cream, padding: 18 },
  header: { marginTop: 12, marginBottom: 22 },
  heading: { fontSize: 28, fontWeight: "bold", color: C.navy },
  subtitle: { color: C.muted, marginTop: 5 },
  tabs: { flexDirection: "row", backgroundColor: "#EAE5DB", padding: 5, borderRadius: 13, marginBottom: 20 },
  tab: { flex: 1, padding: 12, alignItems: "center", borderRadius: 10 },
  activeTab: { backgroundColor: C.navy },
  tabText: { color: C.muted, fontWeight: "bold", fontSize: 13 },
  activeTabText: { color: C.white },
  card: {
    backgroundColor: C.white, padding: 16, borderRadius: 17,
    flexDirection: "row", gap: 13, marginBottom: 13,
    borderWidth: 1, borderColor: C.border
  },
  iconBox: { width: 52, height: 58, backgroundColor: C.navy, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  bookTitle: { color: C.text, fontSize: 16, fontWeight: "bold" },
  email: { color: C.muted, fontSize: 12, marginTop: 5 },
  status: { color: C.gold, fontWeight: "bold", fontSize: 12, marginTop: 8 },
  actions: { flexDirection: "row", gap: 9, marginTop: 12 },
  acceptButton: { backgroundColor: C.green, paddingVertical: 8, paddingHorizontal: 17, borderRadius: 8 },
  rejectButton: { backgroundColor: C.red, paddingVertical: 8, paddingHorizontal: 17, borderRadius: 8 },
  actionText: { color: C.white, fontWeight: "bold", fontSize: 12 },
  empty: { alignItems: "center", marginTop: 75, padding: 20 },
  emptyTitle: { color: C.navy, fontWeight: "bold", fontSize: 18, marginTop: 14 },
  emptyText: { color: C.muted, textAlign: "center", marginTop: 7 }
});
