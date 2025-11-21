import { router, useLocalSearchParams } from 'expo-router';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { Book, ChevronLeft, ExternalLink, Heart, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function BookDetailScreen() {
  const { book } = useLocalSearchParams();
  const bookData = typeof book === 'string' ? JSON.parse(book) : null;
  const info = bookData?.volumeInfo;
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if already favorited on load
  useEffect(() => {
    const checkFavorite = async () => {
      if (!auth.currentUser || !bookData?.id) return;
      const docRef = doc(db, 'users', auth.currentUser.uid, 'favorites', bookData.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setIsFavorite(true);
    };
    checkFavorite();
  }, []);

  const toggleFavorite = async () => {
    if (!auth.currentUser) return;
    const docRef = doc(db, 'users', auth.currentUser.uid, 'favorites', bookData.id);
    
    if (isFavorite) {
      await deleteDoc(docRef);
      setIsFavorite(false);
      Alert.alert("Removed", "Removed from favorites");
    } else {
      await setDoc(docRef, bookData);
      setIsFavorite(true);
      Alert.alert("Saved", "Added to favorites!");
    }
  };

  if (!info) return null;
  const image = info.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/150';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <View style={styles.imageContainer}>
           <Image source={{ uri: image }} style={styles.backdrop} blurRadius={10} />
           <Image source={{ uri: image }} style={styles.mainImage} resizeMode="contain" />
           <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <ChevronLeft color="#fff" size={28} />
           </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
             <Text style={styles.title}>{info.title}</Text>
             <TouchableOpacity onPress={toggleFavorite} style={styles.favBtn}>
                <Heart size={28} color={isFavorite ? "#EF4444" : "#9CA3AF"} fill={isFavorite ? "#EF4444" : "none"} />
             </TouchableOpacity>
          </View>
          <Text style={styles.author}>{info.authors?.[0]}</Text>

          <View style={styles.stats}>
            <View style={styles.pill}>
              <Book size={14} color="#4B5563" />
              <Text style={[styles.pillText, {marginLeft: 4}]}>{info.categories?.[0] || 'Fiction'}</Text>
            </View>
            <View style={styles.pill}>
              <Star size={14} color="#D97706" fill="#D97706" />
              <Text style={styles.pillText}> {info.averageRating || 'N/A'}</Text>
            </View>
          </View>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.description}>{info.description?.replace(/<[^>]+>/g, '') || 'No description available.'}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.previewBtn}
          onPress={() => info.previewLink && Linking.openURL(info.previewLink)}
        >
          <Text style={styles.btnText}>Preview on Google Books</Text>
          <ExternalLink size={18} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: { height: 300, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  backdrop: { ...StyleSheet.absoluteFillObject, opacity: 0.3 },
  mainImage: { width: 140, height: 220, borderRadius: 8 },
  backButton: { position: 'absolute', top: 50, left: 20, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)' },
  content: { padding: 24, paddingBottom: 100 },
  titleRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 4 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#1F2937', flex: 1 },
  favBtn: { padding: 5 },
  author: { fontSize: 16, textAlign: 'center', color: '#6B7280', marginBottom: 20 },
  stats: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  pill: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  pillText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#111' },
  description: { fontSize: 15, lineHeight: 24, color: '#4B5563' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#F3F4F6' },
  previewBtn: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});