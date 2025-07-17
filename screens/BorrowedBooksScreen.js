import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet } from 'react-native';
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
      <FlatList
        data={borrowedBooks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View>
              <Text>{item.title}</Text>
              <Button title="Return" onPress={() => returnBook(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  bookItem: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  image: { width: 50, height: 70, marginRight: 10 }
});
