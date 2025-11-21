import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { router } from 'expo-router';
import { PhoneAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { BookOpen, Lock, Mail, Phone } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function LoginScreen() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Use the Firebase Config we already set up
  const recaptchaVerifier = useRef(null);
  // !IMPORTANT! You need to ensure your appdevminiproject.firebaseapp.com is a valid domain for reCAPTCHA in Firebase Console -> Authentication -> Settings -> Authorized Domains
  const firebaseConfig = auth.app.options; 

  // --- Email Login ---
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)/home'); // CHANGED: Go to Tabs now!
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Phone Login Step 1: Send SMS ---
  const sendVerification = async () => {
    if (!phone) return Alert.alert("Error", "Enter phone number like +15555555555");
    setLoading(true);
    try {
        const phoneProvider = new PhoneAuthProvider(auth);
        const id = await phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier.current!);
        setVerificationId(id);
        Alert.alert("Code Sent", "Check your SMS!");
    } catch (err: any) {
        Alert.alert("Error", err.message);
    } finally {
        setLoading(false);
    }
  };

  // --- Phone Login Step 2: Confirm Code ---
  const confirmCode = async () => {
    if (!verificationCode || !verificationId) return;
    setLoading(true);
    try {
        const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
        await signInWithCredential(auth, credential);
        router.replace('/(tabs)/home'); // CHANGED: Go to Tabs now!
    } catch (err: any) {
        Alert.alert("Error", "Invalid code");
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      
      <View style={styles.logoContainer}>
        <BookOpen size={50} color="#4F46E5" />
      </View>
      <Text style={styles.title}>BookSuggestions</Text>
      <Text style={styles.subtitle}>Your next favorite book awaits.</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, authMethod === 'email' && styles.activeTab]} 
          onPress={() => setAuthMethod('email')}
        >
          <Text style={[styles.tabText, authMethod === 'email' && styles.activeTabText]}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, authMethod === 'phone' && styles.activeTab]} 
          onPress={() => setAuthMethod('phone')}
        >
          <Text style={[styles.tabText, authMethod === 'phone' && styles.activeTabText]}>Phone</Text>
        </TouchableOpacity>
      </View>

      {authMethod === 'email' ? (
        <>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Email Address" value={email} onChangeText={setEmail} autoCapitalize="none" />
          </View>
          <View style={styles.inputContainer}>
            <Lock size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleEmailLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In with Email</Text>}
          </TouchableOpacity>
        </>
      ) : (
        <>
          {!verificationId ? (
              // STEP 1: PHONE INPUT
              <>
                <View style={styles.inputContainer}>
                    <Phone size={20} color="#9CA3AF" style={styles.icon} />
                    <TextInput style={styles.input} placeholder="+91 00000 00000" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                </View>
                <TouchableOpacity style={styles.button} onPress={sendVerification} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Verification Code</Text>}
                </TouchableOpacity>
              </>
          ) : (
              // STEP 2: CODE INPUT
              <>
                <View style={styles.inputContainer}>
                    <Lock size={20} color="#9CA3AF" style={styles.icon} />
                    <TextInput style={styles.input} placeholder="123456" value={verificationCode} onChangeText={setVerificationCode} keyboardType="number-pad" />
                </View>
                <TouchableOpacity style={styles.button} onPress={confirmCode} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify Code</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setVerificationId(null)} style={{marginTop: 20}}>
                     <Text style={{color: 'blue', textAlign: 'center'}}>Use different number</Text>
                </TouchableOpacity>
              </>
          )}
        </>
      )}

      <TouchableOpacity onPress={() => router.push('/register')} style={{ marginTop: 24 }}>
        <Text style={styles.linkText}>New here? <Text style={{fontWeight: 'bold'}}>Create an account</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  logoContainer: { alignSelf: 'center', backgroundColor: '#EEF2FF', padding: 20, borderRadius: 50, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#1F2937' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#6B7280', marginBottom: 32 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { fontWeight: '600', color: '#6B7280' },
  activeTabText: { color: '#4F46E5' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginBottom: 16, paddingHorizontal: 16 },
  icon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16 },
  button: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkText: { color: '#4F46E5', textAlign: 'center' }
});