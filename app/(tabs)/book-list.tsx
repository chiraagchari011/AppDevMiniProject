import { router, useLocalSearchParams } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { ChevronLeft, Heart, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function BookListScreen() {
  const { query, label } = useLocalSearchParams();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // 1. Fetch Books from Google
  useEffect(() => {
    const rawQuery = query ? String(query) : 'fiction';
    const encodedQuery = encodeURIComponent(rawQuery);

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&maxResults=20`)
      .then(res => res.json())
      .then(data => {
        if (data.items) setBooks(data.items);
        else setBooks([]);
        setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  }, [query]);

  // 2. Listen to Real-time Favorites (To fill the hearts)
  useEffect(() => {
      if (!auth.currentUser) return;
      // Listen to the user's favorites collection
      const unsub = onSnapshot(collection(db, 'users', auth.currentUser.uid, 'favorites'), (snap) => {
          const ids = new Set(snap.docs.map(d => d.id));
          setFavoriteIds(ids);
      });
      return () => unsub();
  }, []);

  // 3. Handle Favorite Toggle
  const toggleFavorite = async (book: any) => {
      if (!auth.currentUser) return;
      const bookId = book.id;
      const ref = doc(db, 'users', auth.currentUser.uid, 'favorites', bookId);

      if (favoriteIds.has(bookId)) {
          await deleteDoc(ref); // Remove if exists
      } else {
          await setDoc(ref, book); // Add if new
      }
  };

  const renderItem = ({ item }: any) => {
    const info = item.volumeInfo || {};
    const isFav = favoriteIds.has(item.id);
    
    let image = 'https://via.placeholder.com/128x190.png?text=No+Cover';
    if (info.imageLinks?.thumbnail) {
        image = info.imageLinks.thumbnail.replace('http:', 'https:');
    }

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push({ 
          pathname: '/(tabs)/book-detail', 
          params: { book: JSON.stringify(item) } 
        })}
      >
        <Image source={{ uri: image }} style={styles.cover} resizeMode="cover" />
        
        <View style={styles.info}>
          <Text style={styles.bookTitle} numberOfLines={2}>{info.title || 'Untitled'}</Text>
          <Text style={styles.bookAuthor}>{info.authors?.[0] || 'Unknown Author'}</Text>
          <View style={styles.rating}>
            <Star size={14} color="#FBBF24" fill="#FBBF24" />
            <Text style={styles.ratingText}>{info.averageRating || 'N/A'}</Text>
          </View>
        </View>

        {/* --- THE HEART BUTTON (Top Right) --- */}
        <TouchableOpacity 
            style={styles.favButton} 
            onPress={() => toggleFavorite(item)}
        >
            <Heart 
                size={24} 
                color={isFav ? "#EF4444" : "#9CA3AF"} 
                fill={isFav ? "#EF4444" : "none"} 
            />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{label || "Recommended"}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item, index) => item.id || String(index)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 10 },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  card: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#F3F4F6', elevation: 2, position: 'relative' },
  cover: { width: 90, height: 130, backgroundColor: '#E5E7EB' },
  info: { flex: 1, padding: 12, paddingRight: 40, justifyContent: 'center' }, // Added paddingRight to avoid text overlapping heart
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
  bookAuthor: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, color: '#4B5563', marginLeft: 4, fontWeight: '600' },
  
  // Absolute Position for the Heart
  favButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 10,
      padding: 5
  }
});