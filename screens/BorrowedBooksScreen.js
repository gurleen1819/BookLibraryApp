import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function BorrowedBooksScreen() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  const loadBooks = async () => {
    try {
      const data = await AsyncStorage.getItem('borrowedBooks');
      setBorrowedBooks(data ? JSON.parse(data) : []);
    } catch (error) {
      console.error('Error loading borrowed books:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  const returnBook = async (id) => {
    Alert.alert(
      'Return Book',
      'Are you sure you want to return this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Return',
          onPress: async () => {
            try {
              const updatedBooks = borrowedBooks.filter(book => book.id !== id);
              setBorrowedBooks(updatedBooks);
              await AsyncStorage.setItem('borrowedBooks', JSON.stringify(updatedBooks));
            } catch (error) {
              Alert.alert('Error', 'Failed to return book. Please try again.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Borrowed Books</Text>
      {borrowedBooks.length === 0 ? (
        <Text style={styles.emptyText}>You have no borrowed books.</Text>
      ) : (
        <FlatList
          data={borrowedBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookCard}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>{item.author}</Text>
                <View style={styles.metaInfo}>
                  {item.year && <Text>📅 Year: {item.year}</Text>}
                  {item.pages && <Text>📖 Pages: {item.pages}</Text>}
                  {item.genre && <Text>🏷 Genre: {item.genre}</Text>}
                </View>
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
    alignItems: 'center',
  },
  image: { width: 60, height: 90, borderRadius: 5, marginRight: 10 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 3 },
  author: { fontSize: 14, color: '#555', marginBottom: 5 },
  metaInfo: { marginBottom: 10 },
  returnButton: {
    backgroundColor: '#e53935',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
