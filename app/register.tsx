import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ChevronLeft, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created!');
      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <ChevronLeft size={28} color="#374151" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the community of book lovers.</Text>
      
      <View style={styles.inputContainer}>
        <User size={20} color="#9CA3AF" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Full Name" 
        />
      </View>

      <View style={styles.inputContainer}>
        <Mail size={20} color="#9CA3AF" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Email Address" 
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Lock size={20} color="#9CA3AF" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={styles.linkText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 60, left: 24, padding: 8, backgroundColor: '#F3F4F6', borderRadius: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginBottom: 16, paddingHorizontal: 16 },
  icon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16 },
  button: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkText: { textAlign: 'center', color: '#4F46E5', fontWeight: '600' }
});
