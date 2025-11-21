import { router } from 'expo-router';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Heart, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- REAL-TIME LISTENER ---
  useEffect(() => {
    if (!auth.currentUser) return;

    // This "listens" to the database. 
    // Whenever a book is added/removed anywhere in the app, this runs automatically.
    const q = query(collection(db, 'users', auth.currentUser.uid, 'favorites'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBooks = snapshot.docs.map(doc => doc.data());
      setFavorites(fetchedBooks);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to favorites:", error);
      setLoading(false);
    });

    // Cleanup listener when screen closes
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: any) => {
    const info = item.volumeInfo;
    const image = info.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/150';

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push({ pathname: '/(tabs)/book-detail', params: { book: JSON.stringify(item) } })}
      >
        <Image source={{ uri: image }} style={styles.cover} resizeMode="cover" />
        <View style={styles.info}>
          <Text style={styles.bookTitle} numberOfLines={2}>{info.title}</Text>
          <Text style={styles.bookAuthor}>{info.authors?.[0] || 'Unknown'}</Text>
          <View style={styles.rating}>
             <Star size={14} color="#FBBF24" fill="#FBBF24" />
             <Text style={styles.ratingText}>{info.averageRating || 'N/A'}</Text>
          </View>
        </View>
        
        {/* Visual indicator that it's a favorite */}
        <View style={styles.favIcon}>
            <Heart size={20} color="#EF4444" fill="#EF4444" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
      </View>
      
      {loading ? (
         <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => item.id + index}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 24 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
                <Heart size={48} color="#E5E7EB" />
                <Text style={styles.emptyText}>No favorites yet.</Text>
                <Text style={styles.emptySubText}>Go discover some books!</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  header: { paddingHorizontal: 24, marginBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1F2937' },
  card: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#F3F4F6', elevation: 2 },
  cover: { width: 80, height: 120, backgroundColor: '#E5E7EB' },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  bookAuthor: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, color: '#4B5563', marginLeft: 4, fontWeight: '600' },
  favIcon: { position: 'absolute', top: 10, right: 10 },
  emptyState: { alignItems: 'center', marginTop: 100, gap: 10 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#374151' },
  emptySubText: { color: '#9CA3AF' }
});