import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { mobileCrimeService } from '../services/api';
import { CrimeCard } from '../components/CrimeCard';
import { useAuthStore } from '../store/authStore';

export const DashboardScreen = ({ navigation }) => {
  const [crimes, setCrimes] = useState([]);
  const [stats, setStats] = useState({ totalCrimes: 39, criticalCrimes: 8, resolutionRate: 10.3 });
  const [refreshing, setRefreshing] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const crimesData = await mobileCrimeService.getCrimes();
      setCrimes(crimesData);
      const statsData = await mobileCrimeService.getStats();
      setStats(statsData);
    } catch (e) {
      console.error('Error loading mobile dashboard data', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
      >
        {/* Header Officer Card */}
        <View style={styles.officerCard}>
          <View style={styles.officerRow}>
            <View>
              <Text style={styles.greeting}>COMMAND DASHBOARD</Text>
              <Text style={styles.officerName}>{user?.firstName || 'Officer'} {user?.lastName || 'Sah'}</Text>
              <Text style={styles.badgeText}>OFFICER • BADGE #KSP-8842</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutText}>EXIT</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.districtRow}>
            <Text style={styles.districtLabel}>📍 District: Bangalore Urban</Text>
            <View style={styles.livePulse}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveText}>LIVE FEED ACTIVE</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { borderColor: '#EF4444' }]}>
            <Text style={styles.statVal}>{stats.totalCrimes || 39}</Text>
            <Text style={styles.statLabel}>Total Crimes</Text>
          </View>

          <View style={[styles.statBox, { borderColor: '#F59E0B' }]}>
            <Text style={[styles.statVal, { color: '#DC2626' }]}>{stats.criticalCrimes || 8}</Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>

          <View style={[styles.statBox, { borderColor: '#10B981' }]}>
            <Text style={[styles.statVal, { color: '#059669' }]}>{stats.resolutionRate || 10.3}%</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        {/* Quick Patrol Shortcut */}
        <TouchableOpacity
          style={styles.patrolBanner}
          onPress={() => navigation.navigate('Map')}
          activeOpacity={0.85}
        >
          <Text style={styles.patrolTitle}>⚡ Predictive Patrol Dispatch</Text>
          <Text style={styles.patrolSubtitle}>Open GPS map & NetworkX optimized route</Text>
        </TouchableOpacity>

        {/* Recent Crime Feed */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Incident Feed</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Crimes')}>
            <Text style={styles.viewAllText}>View All ({crimes.length})</Text>
          </TouchableOpacity>
        </View>

        {crimes.slice(0, 5).map((crime) => (
          <CrimeCard
            key={crime.id}
            crime={crime}
            onPress={() => navigation.navigate('Crimes')}
          />
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
  scrollContent: {
    paddingBottom: 24,
  },
  officerCard: {
    backgroundColor: '#0F172A',
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  officerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1,
  },
  officerName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
  },
  districtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  districtLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  livePulse: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#22C55E',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  patrolBanner: {
    backgroundColor: '#4F46E5',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
  },
  patrolTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  patrolSubtitle: {
    color: '#C7D2FE',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
});
