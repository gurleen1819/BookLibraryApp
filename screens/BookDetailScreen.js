import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function BookDetailScreen({ route }) {
  const { book } = route.params;
  const navigation = useNavigation();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBorrowedBooks = async () => {
      try {
        const data = await AsyncStorage.getItem('borrowedBooks');
        setBorrowedBooks(data ? JSON.parse(data) : []);
      } catch (error) {
        console.error('Error loading borrowed books:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBorrowedBooks();
  }, []);

  const isBorrowed = borrowedBooks.some(b => b.id === book.id);

  const borrowBook = async () => {
    try {
      if (borrowedBooks.length >= 3) {
        Alert.alert('Limit Reached', 'You cannot borrow more than 3 books at a time.');
        return;
      }
      if (isBorrowed) {
        Alert.alert('Already Borrowed', `${book.title} is already in your borrowed list.`);
        return;
      }
      if (!book.available) {
        Alert.alert('Not Available', `${book.title} is not available for borrowing.`);
        return;
      }
      const updatedBooks = [...borrowedBooks, book];
      setBorrowedBooks(updatedBooks);
      await AsyncStorage.setItem('borrowedBooks', JSON.stringify(updatedBooks));
      Alert.alert('Success', `${book.title} has been borrowed.`);
      navigation.navigate('Borrowed');
    } catch (error) {
      Alert.alert('Error', 'Failed to borrow book. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading book details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image source={{ uri: book.image }} style={styles.image} />

        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>

        <Text style={[styles.availability, { color: book.available ? 'green' : 'red' }]}>
          {book.available ? 'Available' : 'Not Available'}
        </Text>

        <Text style={styles.borrowedCount}>Borrowed: {borrowedBooks.length}/3</Text>

        <View style={styles.metaInfo}>
          {book.year && (
            <Text style={styles.metaText}>📅 <Text style={styles.bold}>Year:</Text> {book.year}</Text>
          )}
          {book.pages && (
            <Text style={styles.metaText}>📖 <Text style={styles.bold}>Pages:</Text> {book.pages}</Text>
          )}
          {book.genre && (
            <Text style={styles.metaText}>🏷 <Text style={styles.bold}>Genre:</Text> {book.genre}</Text>
          )}
        </View>

        <Text style={styles.desc}>{book.description}</Text>

        <TouchableOpacity
          onPress={() => Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(book.title)} book`)}
        >
          <Text style={styles.learnMore}>Learn More →</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={[styles.borrowButton, (!book.available || isBorrowed) && { backgroundColor: 'gray' }]}
        onPress={borrowBook}
        disabled={!book.available || isBorrowed}
      >
        <Ionicons name="book-outline" size={20} color="#fff" />
        <Text style={styles.borrowText}>{isBorrowed ? 'Borrowed' : 'Borrow Book'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10 },
  image: { width: '100%', height: 250, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginTop: 10, color: '#333' },
  author: { fontSize: 18, textAlign: 'center', color: '#555', marginVertical: 5 },
  availability: { textAlign: 'center', fontSize: 16, marginTop: 5 },
  borrowedCount: { textAlign: 'center', fontSize: 14, color: '#666', marginTop: 5 },
  metaInfo: { marginTop: 15, paddingHorizontal: 20 },
  metaText: { fontSize: 16, marginBottom: 5 },
  bold: { fontWeight: 'bold' },
  desc: { margin: 15, fontSize: 16, color: '#444', lineHeight: 22 },
  learnMore: { color: '#6200ee', textAlign: 'center', marginTop: 10, fontSize: 16 },
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
  },
  borrowText: { color: '#fff', fontSize: 18, marginLeft: 8 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
