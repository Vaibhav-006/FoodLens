import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API = (process.env.EXPO_PUBLIC_API_URL || 'https://foodlens-qg92.onrender.com').replace(/\/+$/, '');

const TRAFFIC_COLOR: Record<string, string> = {
  green: '#dcfce7',
  amber: '#fef9c3',
  red: '#fee2e2',
};

const TRAFFIC_TEXT: Record<string, string> = {
  green: '#15803d',
  amber: '#b45309',
  red: '#b91c1c',
};

export default function CompareTab() {
  const [barcode1, setBarcode1] = useState('');
  const [barcode2, setBarcode2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCompare = async () => {
    const b1 = barcode1.trim();
    const b2 = barcode2.trim();

    if (b1.length < 8 || b2.length < 8) {
      Alert.alert('Invalid Barcodes', 'Please enter two valid barcodes to compare.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API}/api/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcodes: [b1, b2] }),
      });

      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      } else {
        Alert.alert('Comparison Failed', json.error || 'Failed to compare products');
      }
    } catch {
      Alert.alert('Error', 'Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>⚖️ Compare Products</Text>
        <Text style={styles.subtitle}>Enter 2 product barcodes to compare nutrition side-by-side</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Product 1 Barcode</Text>
          <TextInput
            style={styles.input}
            value={barcode1}
            onChangeText={setBarcode1}
            placeholder="e.g. 028400064057 (Lay's)"
            keyboardType="numeric"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Product 2 Barcode</Text>
          <TextInput
            style={styles.input}
            value={barcode2}
            onChangeText={setBarcode2}
            placeholder="e.g. 044000030148 (Oreo)"
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.compareBtn, loading && { opacity: 0.7 }]}
            onPress={handleCompare}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.compareBtnText}>⚖️ Compare Products</Text>
            )}
          </TouchableOpacity>
        </View>

        {result && (
          <View style={[styles.card, { marginTop: 16 }]}>
            <Text style={styles.resultTitle}>Comparison Results</Text>
            
            {/* Headers */}
            <View style={styles.productRow}>
              {result.products.map((p: any) => {
                const isWinner = p.id === result.winner;
                const score = result.overallScores[p.id];
                return (
                  <View key={p.id} style={styles.productCol}>
                    {isWinner && <Text style={styles.winnerBadge}>🏆 Healthier</Text>}
                    <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                    <Text style={styles.productBrand}>{p.brand ?? 'Generic'}</Text>
                    <Text style={[styles.overallScore, { color: score >= 60 ? '#16a34a' : '#d97706' }]}>
                      {score} <Text style={{ fontSize: 11, color: '#9ca3af' }}>/ 100</Text>
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Nutrients table */}
            <View style={{ marginTop: 16 }}>
              {['calories', 'totalFat', 'saturatedFat', 'totalSugar', 'sodium', 'protein'].map((nutrient) => {
                const p1Score = result.nutrientScores[result.products[0]?.id]?.find((s: any) => s.nutrient === nutrient);
                const p2Score = result.nutrientScores[result.products[1]?.id]?.find((s: any) => s.nutrient === nutrient);

                return (
                  <View key={nutrient} style={styles.nutrientRow}>
                    <Text style={styles.nutrientLabel}>{p1Score?.label || nutrient}</Text>
                    <View style={styles.scoresRow}>
                      <View style={[styles.tag, { backgroundColor: TRAFFIC_COLOR[p1Score?.trafficLight || 'green'] }]}>
                        <Text style={[styles.tagText, { color: TRAFFIC_TEXT[p1Score?.trafficLight || 'green'] }]}>
                          {p1Score?.valuePer100g ?? '—'} {p1Score?.unit}
                        </Text>
                      </View>
                      <View style={[styles.tag, { backgroundColor: TRAFFIC_COLOR[p2Score?.trafficLight || 'green'] }]}>
                        <Text style={[styles.tagText, { color: TRAFFIC_TEXT[p2Score?.trafficLight || 'green'] }]}>
                          {p2Score?.valuePer100g ?? '—'} {p2Score?.unit}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 4, marginBottom: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
    fontFamily: 'monospace', backgroundColor: '#f9fafb',
  },
  compareBtn: {
    backgroundColor: '#16a34a', borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginTop: 16,
  },
  compareBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  resultTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  productRow: { flexDirection: 'row', gap: 12 },
  productCol: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, alignItems: 'center' },
  winnerBadge: {
    backgroundColor: '#dcfce7', color: '#15803d', fontSize: 11,
    fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginBottom: 6,
  },
  productName: { fontSize: 13, fontWeight: '700', color: '#1f2937', textAlign: 'center' },
  productBrand: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  overallScore: { fontSize: 20, fontWeight: '800', marginTop: 8 },
  nutrientRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  nutrientLabel: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
  scoresRow: { flexDirection: 'row', gap: 12 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, minWidth: 70, alignItems: 'center' },
  tagText: { fontSize: 11, fontWeight: '700' },
});

