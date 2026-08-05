import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';

export const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const hotspots = [
    { id: 1, name: 'MG Road Metro Station Cluster', risk: 88, level: 'CRITICAL', lat: 12.9716, lng: 77.5946 },
    { id: 2, name: 'Indiranagar 100ft Road Zone', risk: 75, level: 'HIGH', lat: 12.9784, lng: 77.6408 },
    { id: 3, name: 'Koramangala 5th Block Hub', risk: 68, level: 'HIGH', lat: 12.9352, lng: 77.6245 },
    { id: 4, name: 'Electronic City Toll Plaza', risk: 62, level: 'MEDIUM', lat: 12.8399, lng: 77.6770 },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const handlePingDispatch = () => {
    Alert.alert(
      '📡 Emergency Officer Ping Sent',
      'Officer GPS coordinates broadcasted to Command Control Center (Bangalore HQ).',
      [{ text: 'Acknowledged' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GIS Crime Map & Officer GPS</Text>
        <Text style={styles.subtitle}>Real-time spatial heatmap & patrol unit tracking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* GPS Location Card */}
        <View style={styles.gpsCard}>
          <View style={styles.gpsHeader}>
            <Text style={styles.gpsTitle}>🛰️ Officer GPS Live Telemetry</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>ACTIVE TRACKING</Text>
            </View>
          </View>

          {location ? (
            <View style={styles.geoRow}>
              <View style={styles.geoCol}>
                <Text style={styles.geoLabel}>LATITUDE</Text>
                <Text style={styles.geoVal}>{location.coords.latitude.toFixed(5)}° N</Text>
              </View>
              <View style={styles.geoCol}>
                <Text style={styles.geoLabel}>LONGITUDE</Text>
                <Text style={styles.geoVal}>{location.coords.longitude.toFixed(5)}° E</Text>
              </View>
              <View style={styles.geoCol}>
                <Text style={styles.geoLabel}>ACCURACY</Text>
                <Text style={styles.geoVal}>{Math.round(location.coords.accuracy || 5)}m</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.loadingGeo}>Acquiring satellite GPS fix...</Text>
          )}

          <TouchableOpacity style={styles.pingBtn} onPress={handlePingDispatch} activeOpacity={0.85}>
            <Text style={styles.pingBtnText}>🚨 BROADCAST EMERGENCY OFFICER LOCATION</Text>
          </TouchableOpacity>
        </View>

        {/* Hotspots Waypoints List */}
        <Text style={styles.sectionTitle}>High-Priority Patrol Waypoints</Text>
        {hotspots.map((h) => (
          <View key={h.id} style={styles.hotspotCard}>
            <View style={styles.hotspotRow}>
              <Text style={styles.hotspotName}>{h.name}</Text>
              <View
                style={[
                  styles.sevBadge,
                  {
                    backgroundColor:
                      h.level === 'CRITICAL' ? '#FEE2E2' : h.level === 'HIGH' ? '#FFEDD5' : '#FEF3C7',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.sevText,
                    {
                      color:
                        h.level === 'CRITICAL' ? '#991B1B' : h.level === 'HIGH' ? '#9A3412' : '#92400E',
                    },
                  ]}
                >
                  {h.level}
                </Text>
              </View>
            </View>

            <View style={styles.coordsRow}>
              <Text style={styles.coordText}>📍 Lat: {h.lat}, Lng: {h.lng}</Text>
              <Text style={styles.riskText}>Risk Score: <Text style={{ fontWeight: '800' }}>{h.risk}%</Text></Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0F172A',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  content: {
    padding: 16,
  },
  gpsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  gpsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gpsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#166534',
  },
  geoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  geoCol: {
    alignItems: 'center',
  },
  geoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  geoVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  loadingGeo: {
    fontSize: 12,
    color: '#64748B',
    marginVertical: 12,
    textAlign: 'center',
  },
  pingBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  pingBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  hotspotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  hotspotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotspotName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  sevBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  sevText: {
    fontSize: 10,
    fontWeight: '800',
  },
  coordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  coordText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  riskText: {
    fontSize: 11,
    color: '#0F172A',
  },
});
