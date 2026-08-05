import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import { useAuthStore } from './app/store/authStore';
import { LoginScreen } from './app/screens/LoginScreen';
import { DashboardScreen } from './app/screens/DashboardScreen';
import { CrimesScreen } from './app/screens/CrimesScreen';
import { MapScreen } from './app/screens/MapScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Crimes"
        component={CrimesScreen}
        options={{
          tabBarLabel: 'Crime Feed',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Patrol Map',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>🗺️</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const { isAuthenticated, loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadingText}>Initializing DataPulse Police Core...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12,
  },
});
