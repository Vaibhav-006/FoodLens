import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// Mock/Recent scans state for mobile demo
const SAMPLE_HISTORY = [
  { barcode: '028400064057', name: "Lay's Classic Potato Chips", brand: "Lay's", score: 42, date: 'Today, 2:30 PM' },
  { barcode: '044000030148', name: 'Oreo Chocolate Sandwich Cookies', brand: 'Nabisco', score: 38, date: 'Yesterday' },
  { barcode: '8901058511875', name: 'Maggi 2-Minute Noodles Masala', brand: 'Nestle', score: 45, date: '2 days ago' },
];

export default function HistoryTab() {
  const [history] = useState(SAMPLE_HISTORY);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={{ padding: 16 }}>
        <Text style={styles.title}>📜 Scan History</Text>
        <Text style={styles.subtitle}>Recently scanned snacks and foods</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.barcode}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => {
          const scoreColor = item.score >= 60 ? '#16a34a' : item.score >= 45 ? '#d97706' : '#dc2626';
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/product/${item.barcode}`)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productBrand}>{item.brand}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
                <Text style={[styles.scoreText, { color: scoreColor }]}>{item.score}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>🔍</Text>
            <Text style={styles.emptyTitle}>No scans yet</Text>
            <Text style={styles.emptySub}>Scan a barcode in the Scan tab to get started</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  productName: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  productBrand: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  dateText: { fontSize: 11, color: '#9ca3af', marginTop: 6 },
  scoreBadge: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginLeft: 12,
  },
  scoreText: { fontSize: 14, fontWeight: '800' },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 60, padding: 24 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#374151' },
  emptySub: { fontSize: 13, color: '#9ca3af', marginTop: 4, textAlign: 'center' },
});

