import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { CloudRain, Coffee, Compass, LogOut, Smile, Star, Zap } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig'; // Note the ../.. path change!

const moods = [
  { id: 'happy', label: 'Feel Good', query: 'subject:humor subject:comedy', icon: Smile, color: '#FEF3C7', iconColor: '#D97706' },
  { id: 'sad', label: 'Melancholy', query: 'subject:poetry subject:drama', icon: CloudRain, color: '#DBEAFE', iconColor: '#2563EB' },
  { id: 'adventure', label: 'Adventurous', query: 'subject:adventure subject:travel', icon: Compass, color: '#D1FAE5', iconColor: '#059669' },
  { id: 'relaxed', label: 'Relaxed', query: 'subject:cooking subject:hobbies', icon: Coffee, color: '#FFEDD5', iconColor: '#EA580C' },
  { id: 'curious', label: 'Curious', query: 'subject:science subject:history', icon: Zap, color: '#F3E8FF', iconColor: '#7C3AED' },
  { id: 'thrilled', label: 'Thrilled', query: 'subject:mystery subject:thriller', icon: Star, color: '#FEE2E2', iconColor: '#DC2626' },
];

export default function HomeScreen() {
  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Reader!</Text>
          <Text style={styles.title}>How are you feeling?</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutBtn}>
          <LogOut size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/book-list', params: { query: mood.query, label: mood.label } })}
          >
            <View style={[styles.iconBox, { backgroundColor: mood.color }]}>
              <mood.icon size={32} color={mood.iconColor} />
            </View>
            <Text style={styles.cardLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#F9FAFB', paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'start', marginBottom: 32 },
  greeting: { fontSize: 16, color: '#6B7280', marginBottom: 4 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  logoutBtn: { padding: 10, backgroundColor: '#FEF2F2', borderRadius: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', padding: 20, borderRadius: 20, marginBottom: 16, alignItems: 'center', backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  iconBox: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardLabel: { fontSize: 16, fontWeight: '600', color: '#374151' },
});