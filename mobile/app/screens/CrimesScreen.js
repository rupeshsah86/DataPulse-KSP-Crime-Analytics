import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { mobileCrimeService } from '../services/api';
import { CrimeCard } from '../components/CrimeCard';

export const CrimesScreen = () => {
  const [crimes, setCrimes] = useState([]);
  const [filteredCrimes, setFilteredCrimes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const categories = ['ALL', 'ROBBERY', 'THEFT', 'CYBER_CRIME', 'MURDER', 'BURGLARY', 'FRAUD'];

  const fetchCrimes = async () => {
    setLoading(true);
    try {
      const data = await mobileCrimeService.getCrimes();
      setCrimes(data);
      applyFilters(data, search, selectedCat);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrimes();
  }, []);

  const applyFilters = (data, query, cat) => {
    let result = [...data];
    if (query) {
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(query.toLowerCase()) ||
          c.district?.toLowerCase().includes(query.toLowerCase()) ||
          c.category?.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (cat !== 'ALL') {
      result = result.filter((c) => c.category === cat);
    }
    setFilteredCrimes(result);
  };

  const handleSearchChange = (text) => {
    setSearch(text);
    applyFilters(crimes, text, selectedCat);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCat(cat);
    applyFilters(crimes, search, cat);
  };

  const handleCaptureEvidence = () => {
    Alert.alert(
      '📸 Camera Evidence Capture',
      'Camera hardware integration initialized. Take photo of crime scene evidence to attach to FIR log.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crime Incident Registry</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search crime title, district, FIR #..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={handleSearchChange}
        />

        {/* Category Pills */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.pillsContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.pill,
                selectedCat === item && styles.activePill,
              ]}
              onPress={() => handleCategorySelect(item)}
            >
              <Text
                style={[
                  styles.pillText,
                  selectedCat === item && styles.activePillText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Capture Evidence Floating Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.captureBtn}
          onPress={handleCaptureEvidence}
          activeOpacity={0.85}
        >
          <Text style={styles.captureBtnText}>📸 Capture Crime Evidence Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Crimes List */}
      <FlatList
        data={filteredCrimes}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={fetchCrimes}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <CrimeCard crime={item} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No crime records matching search criteria.</Text>
          </View>
        }
      />
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
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  pillsContainer: {
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1E293B',
  },
  activePill: {
    backgroundColor: '#2563EB',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  activePillText: {
    color: '#FFFFFF',
  },
  actionBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  captureBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  captureBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 40,
    padding: 20,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});
