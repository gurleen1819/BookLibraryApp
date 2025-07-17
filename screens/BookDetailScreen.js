import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const borrowBook = async () => {
    if (borrowedBooks.length >= 3) {
      Alert.alert('Limit Reached', 'You cannot borrow more than 3 books at a time.');
      return;
    }
    const updatedBooks = [...borrowedBooks, book];
    setBorrowedBooks(updatedBooks);
    await AsyncStorage.setItem('borrowedBooks', JSON.stringify(updatedBooks));
    Alert.alert('Success', `${book.title} has been borrowed.`);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: book.image }} style={styles.image} />
      <Text style={styles.title}>{book.title}</Text>
      <Text>{book.author}</Text>
      <Text style={styles.desc}>{book.description}</Text>
      <Button title="Borrow" onPress={borrowBook} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, alignItems: 'center' },
  image: { width: 150, height: 200, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  desc: { marginTop: 10, textAlign: 'center' }
});
