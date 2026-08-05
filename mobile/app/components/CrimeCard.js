import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const getSeverityStyle = (severity) => {
  switch (severity) {
    case 'CRITICAL':
      return { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' };
    case 'HIGH':
      return { bg: '#FFEDD5', text: '#9A3412', border: '#F97316' };
    case 'MEDIUM':
      return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
    default:
      return { bg: '#D1FAE5', text: '#065F46', border: '#10B981' };
  }
};

export const CrimeCard = ({ crime, onPress }) => {
  const sevStyle = getSeverityStyle(crime.severity);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: sevStyle.bg, borderColor: sevStyle.border }]}>
          <Text style={[styles.badgeText, { color: sevStyle.text }]}>{crime.severity || 'MEDIUM'}</Text>
        </View>
        <Text style={styles.crimeNum}>{crime.crimeNumber || `CRIME-${crime.id}`}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>{crime.title}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>📍 {crime.district || 'Bangalore Urban'}</Text>
        <Text style={styles.metaText}>🏷️ {crime.category}</Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {crime.description || 'No detailed incident description recorded.'}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.statusText}>STATUS: <Text style={styles.statusVal}>{crime.status || 'OPEN'}</Text></Text>
        <Text style={styles.dateText}>{crime.crimeDate ? new Date(crime.crimeDate).toLocaleDateString() : 'Today'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  crimeNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  description: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  statusVal: {
    color: '#2563EB',
    fontWeight: '800',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
