
const API_URL = "https://openlibrary.org/search.json";

export async function searchBooks(query: string) {
  try {
    const response = await fetch(
      `${API_URL}?q=${encodeURIComponent(query)}&limit=20`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const data = await response.json();

    return data.docs.map((book: any) => ({
      id: book.key,
      title: book.title,
      author: book.author_name?.[0] || "Unknown Author",
      year: book.first_publish_year || "Unknown",
      cover: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null
    }));
  } catch (error) {
    console.log("Book API Error:", error);
    return [];
  }
}
