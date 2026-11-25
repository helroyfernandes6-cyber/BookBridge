import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
} from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../../firebase/firebaseConfig";

const COLORS = {
  primary: "#2857A9",
  navy: "#173B65",
  gold: "#E9B96E",
  background: "#F7F3EA",
  white: "#FFFFFF",
  text: "#243247",
  muted: "#788496",
  border: "#E5E1D8",
  shelf: "#B18A50",
};

type Book = {
  id: string;
  title: string;
  author: string;
  description?: string;
  status?: string;
  userId?: string;
};

const bookColors = [
  "#173B65",
  "#2857A9",
  "#8A6545",
  "#526D80",
  "#34495E",
  "#6C5B7B",
];

export default function HomeScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadBooks = async () => {
    try {
      const snapshot = await getDocs(collection(db, "books"));

      const loadedBooks = snapshot.docs
        .map((document) => ({
          id: document.id,
          ...document.data(),
        })) as Book[];

      const availableBooks = loadedBooks.filter(
        (book) => book.status === "Available"
      );

      setBooks(availableBooks);
    } catch (error) {
      console.log("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const categories = [
    { name: "Programming", icon: "code-slash" as const },
    { name: "Engineering", icon: "construct" as const },
    { name: "Mathematics", icon: "calculator" as const },
    { name: "Fiction", icon: "book" as const },
  ];

  const openDiscover = (category?: string) => {
    router.push({
      pathname: "/discover",
      params: category ? { search: category } : {},
    });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <View style={styles.logoContainer}>
            <Ionicons
              name="library"
              size={26}
              color={COLORS.gold}
            />
            <Text style={styles.logo}>BookBridge</Text>
          </View>

          <Text style={styles.headerSubtitle}>
            YOUR CAMPUS BOOK COMMUNITY
          </Text>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <Ionicons
            name="person-outline"
            size={23}
            color={COLORS.navy}
          />
        </TouchableOpacity>
      </View>

      {/* WELCOME BANNER */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerSmall}>
            WELCOME TO BOOKBRIDGE
          </Text>

          <Text style={styles.bannerTitle}>
            Every Book Has{"\n"}Another Story.
          </Text>

          <Text style={styles.bannerDescription}>
            Discover, share and exchange books with fellow students.
          </Text>

          <TouchableOpacity
            style={styles.bannerButton}
            onPress={() => openDiscover()}
          >
            <Text style={styles.bannerButtonText}>
              Explore Books
            </Text>
            <Ionicons
              name="arrow-forward"
              size={17}
              color={COLORS.navy}
            />
          </TouchableOpacity>
        </View>

        <Ionicons
          name="book"
          size={95}
          color="#E9B96E"
          style={styles.bannerIcon}
        />
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={21}
          color={COLORS.muted}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search books or authors..."
          placeholderTextColor={COLORS.muted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => openDiscover(search)}
          returnKeyType="search"
        />

        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={COLORS.muted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* CATEGORIES */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <TouchableOpacity onPress={() => openDiscover()}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.name}
              style={styles.categoryCard}
              onPress={() => openDiscover(category.name)}
            >
              <View style={styles.categoryIcon}>
                <Ionicons
                  name={category.icon}
                  size={23}
                  color={COLORS.gold}
                />
              </View>

              <Text style={styles.categoryName}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* COMMUNITY BOOKSHELF */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Community Bookshelf
            </Text>
            <Text style={styles.sectionSubtitle}>
              Books shared by your fellow students
            </Text>
          </View>

          <TouchableOpacity onPress={() => openDiscover()}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginVertical: 35 }}
          />
        ) : filteredBooks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="library-outline"
              size={48}
              color={COLORS.gold}
            />

            <Text style={styles.emptyTitle}>
              Your shelf is waiting!
            </Text>

            <Text style={styles.emptyText}>
              Be the first to share a book with your campus community.
            </Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/add-book")}
            >
              <Ionicons
                name="add"
                size={19}
                color={COLORS.white}
              />
              <Text style={styles.addButtonText}>
                Add Your First Book
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.booksRow}
          >
            {filteredBooks.map((book, index) => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookCard}
                onPress={() => openDiscover(book.title)}
              >
                <View
                  style={[
                    styles.bookCover,
                    {
                      backgroundColor:
                        bookColors[index % bookColors.length],
                    },
                  ]}
                >
                  <View style={styles.bookGoldBorder}>
                    <Ionicons
                      name="book-outline"
                      size={31}
                      color={COLORS.gold}
                    />

                    <View style={styles.bookLine} />

                    <Text
                      style={styles.bookTitle}
                      numberOfLines={3}
                    >
                      {book.title}
                    </Text>

                    <Text
                      style={styles.bookAuthor}
                      numberOfLines={2}
                    >
                      {book.author}
                    </Text>

                    <View style={styles.bookBottom}>
                      <Text style={styles.bookEdition}>
                        STUDENT EDITION
                      </Text>
                      <Text style={styles.bookShare}>
                        READ • SHARE
                      </Text>
                    </View>
                  </View>
                </View>

                <Text
                  style={styles.cardBookTitle}
                  numberOfLines={1}
                >
                  {book.title}
                </Text>

                <Text
                  style={styles.cardBookAuthor}
                  numberOfLines={1}
                >
                  {book.author}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* WOODEN SHELF */}
        {filteredBooks.length > 0 && (
          <View style={styles.woodenShelf}>
            <View style={styles.shelfTop} />
            <View style={styles.shelfFront} />
          </View>
        )}
      </View>

      {/* SHARE BOOK CARD */}
      <View style={styles.shareCard}>
        <View style={styles.shareIcon}>
          <Ionicons
            name="book"
            size={29}
            color={COLORS.gold}
          />
        </View>

        <View style={styles.shareContent}>
          <Text style={styles.shareTitle}>
            Give Your Books a New Home
          </Text>

          <Text style={styles.shareDescription}>
            Share books you no longer need and help another student learn.
          </Text>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => router.push("/add-book")}
          >
            <Text style={styles.shareButtonText}>
              Share a Book
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Ionicons
          name="library"
          size={19}
          color={COLORS.gold}
        />
        <Text style={styles.footerText}>
          BookBridge — Give Books a Second Life.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={loadBooks}
      >
        <Ionicons
          name="refresh"
          size={16}
          color={COLORS.primary}
        />
        <Text style={styles.refreshText}>Refresh Bookshelf</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  logo: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.navy,
    letterSpacing: 0.3,
  },

  headerSubtitle: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.muted,
    marginTop: 5,
    fontWeight: "700",
  },

  profileButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  banner: {
    marginHorizontal: 20,
    backgroundColor: COLORS.navy,
    borderRadius: 23,
    padding: 23,
    overflow: "hidden",
    minHeight: 220,
    flexDirection: "row",
  },

  bannerContent: {
    flex: 1,
    zIndex: 1,
  },

  bannerSmall: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  bannerTitle: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: "800",
    lineHeight: 34,
    marginTop: 12,
  },

  bannerDescription: {
    color: "#D9E1EC",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 9,
    maxWidth: 220,
  },

  bannerButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 11,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 17,
  },

  bannerButtonText: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: "800",
  },

  bannerIcon: {
    position: "absolute",
    right: 12,
    top: 48,
    opacity: 0.18,
    transform: [{ rotate: "-15deg" }],
  },

  searchContainer: {
    marginHorizontal: 20,
    marginTop: 22,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
  },

  section: {
    marginTop: 27,
    paddingHorizontal: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    color: COLORS.navy,
    fontSize: 19,
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },

  seeAll: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 12,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 11,
  },

  categoryCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  categoryIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    flexShrink: 1,
  },

  booksRow: {
    gap: 15,
    paddingBottom: 8,
  },

  bookCard: {
    width: 145,
  },

  bookCover: {
    height: 205,
    padding: 7,
    borderRadius: 9,
    elevation: 4,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },

  bookGoldBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 5,
    alignItems: "center",
    padding: 9,
    justifyContent: "flex-start",
  },

  bookLine: {
    width: "70%",
    height: 1,
    backgroundColor: COLORS.gold,
    marginTop: 10,
    marginBottom: 10,
  },

  bookTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 18,
  },

  bookAuthor: {
    color: "#E9D9B9",
    fontSize: 9,
    marginTop: 8,
    textAlign: "center",
  },

  bookBottom: {
    marginTop: "auto",
    alignItems: "center",
  },

  bookEdition: {
    color: COLORS.gold,
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1,
  },

  bookShare: {
    color: COLORS.white,
    fontSize: 7,
    marginTop: 5,
    letterSpacing: 1,
  },

  cardBookTitle: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 9,
  },

  cardBookAuthor: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
  },

  woodenShelf: {
    marginTop: 5,
    marginBottom: 10,
  },

  shelfTop: {
    height: 8,
    backgroundColor: "#D3AC75",
    borderRadius: 3,
  },

  shelfFront: {
    height: 13,
    backgroundColor: COLORS.shelf,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  emptyContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyTitle: {
    fontSize: 16,
    color: COLORS.navy,
    fontWeight: "800",
    marginTop: 12,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 7,
  },

  addButton: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 16,
  },

  addButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 12,
  },

  shareCard: {
    marginHorizontal: 20,
    marginTop: 28,
    backgroundColor: COLORS.white,
    borderRadius: 19,
    padding: 17,
    flexDirection: "row",
    gap: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  shareIcon: {
    width: 53,
    height: 53,
    borderRadius: 15,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },

  shareContent: {
    flex: 1,
  },

  shareTitle: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: "800",
  },

  shareDescription: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },

  shareButton: {
    backgroundColor: COLORS.navy,
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 9,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 12,
  },

  shareButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },

  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
    marginTop: 28,
  },

  footerText: {
    color: COLORS.muted,
    fontSize: 10,
  },

  refreshButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 13,
    marginBottom: 35,
  },

  refreshText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },
});