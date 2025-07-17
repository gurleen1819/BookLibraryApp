import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BorrowedBooksScreen() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      const data = await AsyncStorage.getItem('borrowedBooks');
      setBorrowedBooks(data ? JSON.parse(data) : []);
    };
    loadBooks();
  }, []);

  const returnBook = async (id) => {
    const updatedBooks = borrowedBooks.filter(book => book.id !== id);
    setBorrowedBooks(updatedBooks);
    await AsyncStorage.setItem('borrowedBooks', JSON.stringify(updatedBooks));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Borrowed Books</Text>
      {borrowedBooks.length === 0 ? (
        <Text style={styles.emptyText}>You have no borrowed books.</Text>
      ) : (
        <FlatList
          data={borrowedBooks}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.bookCard}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity style={styles.returnButton} onPress={() => returnBook(item.id)}>
                  <Text style={styles.buttonText}>Return</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f9f9f9' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#555' },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center'
  },
  image: { width: 60, height: 90, borderRadius: 5, marginRight: 10 },
  info: { flex: 1, justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  returnButton: {
    backgroundColor: '#e53935',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start'
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
