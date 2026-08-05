import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useAuthStore } from '../store/authStore';

export const LoginScreen = () => {
  const [email, setEmail] = useState('officer@ksp.gov.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        {/* Shield Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.shieldIcon}>🛡️</Text>
          </View>
          <Text style={styles.appName}>DATAPULSE</Text>
          <Text style={styles.subtitle}>KSP Crime Analytics & Police Intelligence</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Officer Authentication</Text>

          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Police Official Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="officer@ksp.gov.in"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Badge Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>AUTHENTICATE & LOG IN</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => {
              setEmail('admin@ksp.gov.in');
              setPassword('admin123');
            }}
          >
            <Text style={styles.demoBtnText}>Fill Admin Credentials</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Karnataka State Police • DataPulse v1.0 Mobile</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  shieldIcon: {
    fontSize: 28,
  },
  appName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '600',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  demoBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  demoBtnText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    marginTop: 32,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
});
