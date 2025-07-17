import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BookDetailScreen({ route }) {
  const { book } = route.params;
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const loadBorrowedBooks = async () => {
      const data = await AsyncStorage.getItem('borrowedBooks');
      setBorrowedBooks(data ? JSON.parse(data) : []);
    };
    loadBorrowedBooks();
  }, []);

  const isBorrowed = borrowedBooks.some(b => b.id === book.id);

  const borrowBook = async () => {
    if (borrowedBooks.length >= 3) {
      Alert.alert('Limit Reached', 'You cannot borrow more than 3 books at a time.');
      return;
    }
    if (isBorrowed) {
      Alert.alert('Already Borrowed', `${book.title} is already in your borrowed list.`);
      return;
    }
    const updatedBooks = [...borrowedBooks, book];
    setBorrowedBooks(updatedBooks);
    await AsyncStorage.setItem('borrowedBooks', JSON.stringify(updatedBooks));
    Alert.alert('Success', `${book.title} has been borrowed.`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image source={{ uri: book.image }} style={styles.image} />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>

       <View style={styles.metaInfo}>
  {book.year ? <Text>📅 Year: {book.year}</Text> : null}
  {book.pages ? <Text>📖 Pages: {book.pages}</Text> : null}
  {book.genre ? <Text>🏷 Genre: {book.genre}</Text> : null}
</View>


        <Text style={styles.desc}>{book.description}</Text>
      </ScrollView>

      <TouchableOpacity
        style={[styles.borrowButton, isBorrowed && { backgroundColor: 'gray' }]}
        onPress={borrowBook}
        disabled={isBorrowed}
      >
        <Ionicons name="book-outline" size={20} color="#fff" />
        <Text style={styles.borrowText}>{isBorrowed ? 'Borrowed' : 'Borrow Book'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  image: { width: '100%', height: 250, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  author: { fontSize: 16, textAlign: 'center', color: '#555' },
  metaInfo: { marginTop: 15, paddingHorizontal: 20 },
  desc: { margin: 15, fontSize: 16, color: '#444', lineHeight: 22 },
  borrowButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  borrowText: { color: '#fff', fontSize: 18, marginLeft: 8 }
});
