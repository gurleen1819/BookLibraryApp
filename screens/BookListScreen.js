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
      {/* <Text style={styles.header}>Book Library</Text> */}
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
          <TouchableOpacity style={styles.bookItem} onPress={() => navigation.navigate('BookDetail', { book: item })}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.author}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  searchBar: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10 },
  bookItem: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  image: { width: 50, height: 70, marginRight: 10 },
  title: { fontWeight: 'bold', fontSize: 16 },
});
