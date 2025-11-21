import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { LogOut, Mail, Phone, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';

export default function ProfileScreen() {
  const user = auth.currentUser;

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/');
  };

  // --- Dynamic Logic to determine what to show ---
  let displayLabel = "Account Info";
  let displayValue = "Guest User";
  let DisplayIcon = User; // Default icon

  if (user?.email) {
    displayLabel = "Email Address";
    displayValue = user.email;
    DisplayIcon = Mail;
  } else if (user?.phoneNumber) {
    displayLabel = "Phone Number";
    displayValue = user.phoneNumber;
    DisplayIcon = Phone;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <View style={styles.card}>
        {/* Dynamic Avatar Icon */}
        <View style={styles.avatarContainer}>
            <DisplayIcon size={40} color="#4F46E5" />
        </View>
        
        {/* Dynamic Label & Value */}
        <View style={styles.infoRow}>
            <Text style={styles.label}>{displayLabel}</Text>
            <Text style={styles.value}>{displayValue}</Text>
        </View>
        
        <View style={styles.infoRow}>
            <Text style={styles.label}>User ID</Text>
            <Text style={styles.valueUid}>{user?.uid}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
        <LogOut size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 24 },
  header: { marginBottom: 30 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#1F2937' },
  card: { backgroundColor: '#F9FAFB', padding: 24, borderRadius: 20, marginBottom: 24 },
  avatarContainer: { width: 80, height: 80, backgroundColor: '#EEF2FF', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20, alignSelf: 'center' },
  infoRow: { marginBottom: 16 },
  label: { fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  value: { fontSize: 16, color: '#1F2937', fontWeight: '600' },
  valueUid: { fontSize: 14, color: '#4B5563', fontFamily: 'monospace' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 8, fontSize: 16 }
});