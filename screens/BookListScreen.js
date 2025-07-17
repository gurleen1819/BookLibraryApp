import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, 'books'));
      const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(booksData);
      setFilteredBooks(booksData);
    };
    fetchBooks();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search books..."
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredBooks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bookCard}
            onPress={() => navigation.navigate('BookDetail', { book: item })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.author}>{item.author}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No books found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f9f9f9' },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
  },
  image: { width: 60, height: 90, borderRadius: 6, marginRight: 15 },
  info: { flex: 1 },
  title: { fontWeight: 'bold', fontSize: 17, marginBottom: 4 },
  author: { color: '#555', fontSize: 14 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#777' },
});
