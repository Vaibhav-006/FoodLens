import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
const GREEN = '#00c853';

export default function ProductScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'nutrition' | 'ingredients'>('nutrition');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/barcode/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barcode }),
        });
        const json = await res.json();
        if (json.success) setData(json.data);
        else setError(json.error);
      } catch {
        setError('Could not connect to backend server.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [barcode]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={GREEN} />
        <Text style={styles.loadingText}>Analysing product...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 44 }}>🔍</Text>
        <Text style={styles.errorTitle}>Product Not Found</Text>
        <Text style={styles.errorSub}>{error ?? 'Could not resolve this barcode.'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Scan Another Product</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { product, nutrientScores, overallScore } = data;
  const isGood = overallScore >= 60;
  const isOk = overallScore >= 45 && overallScore < 60;
  const scoreLabel = isGood ? 'Excellent' : isOk ? 'Moderate' : 'Poor';
  const scoreColor = isGood ? '#00c853' : isOk ? '#d97706' : '#dc2626';

  const DAILY_LIMITS: Record<string, number> = {
    totalFat: 65,
    saturatedFat: 20,
    transFat: 2,
    totalSugar: 50,
    addedSugar: 25,
    sodium: 2000,
    protein: 50,
    dietaryFibre: 30,
    calories: 2000,
  };

  const getBarWidth = (nutrient: string, val: number | null, dvPercent: number | null) => {
    if (val === null || val === undefined || val <= 0) return '0%';
    const target = DAILY_LIMITS[nutrient] || 100;
    const pct = dvPercent !== null && dvPercent !== undefined ? dvPercent : Math.round((val / target) * 100);
    return `${Math.min(100, Math.max(4, pct))}%`;
  };

  const negatives = nutrientScores.filter((s: any) =>
    ['totalFat', 'saturatedFat', 'transFat', 'totalSugar', 'addedSugar', 'sodium'].includes(s.nutrient)
  );

  const positives = nutrientScores.filter((s: any) =>
    ['protein', 'dietaryFibre'].includes(s.nutrient)
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Top Hero Product Card */}
        <View style={styles.heroCard}>
          <View style={styles.imageBox}>
            {product.imageUrl ? (
              <Image source={{ uri: product.imageUrl }} style={styles.prodImg} resizeMode="contain" />
            ) : (
              <Text style={{ fontSize: 32 }}>🍿</Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.prodName} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.prodBrand}>{product.brand ?? 'Packaged Food'}</Text>

            <View style={styles.scoreRow}>
              <Text style={[styles.scoreVal, { color: scoreColor }]}>
                Score: {overallScore}/100
              </Text>
              <View style={[styles.scoreBadge, { backgroundColor: isGood ? '#dcfce7' : isOk ? '#fef3c7' : '#fee2e2' }]}>
                <Text style={[styles.scoreBadgeText, { color: scoreColor }]}>{scoreLabel}</Text>
              </View>
            </View>

            <View style={styles.pillsRow}>
              <Text style={styles.microPill}>Cal: {product.nutritionPer100g.calories ?? '—'}</Text>
              <Text style={styles.microPill}>Prot: {product.nutritionPer100g.protein ?? '—'}g</Text>
            </View>
          </View>
        </View>

        {/* Segmented Switcher */}
        <View style={styles.segmentBar}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'nutrition' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('nutrition')}
          >
            <Text style={[styles.segmentText, activeTab === 'nutrition' && styles.segmentTextActive]}>
              Nutrition
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'ingredients' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('ingredients')}
          >
            <Text style={[styles.segmentText, activeTab === 'ingredients' && styles.segmentTextActive]}>
              Ingredients ({product.ingredients.length})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'nutrition' ? (
          <>
            {/* Negatives Section (Red header) */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.statusDot, { backgroundColor: '#ef4444' }]} />
                <Text style={styles.sectionHeading}>NEGATIVES / HEALTH WATCH</Text>
              </View>

              {negatives.map((s: any) => (
                <View key={s.nutrient} style={styles.meterRow}>
                  <View style={styles.meterTextRow}>
                    <Text style={styles.meterLabel}>{s.label}</Text>
                    <Text style={styles.meterVal}>{s.valuePer100g ?? 0} {s.unit}</Text>
                  </View>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.fill,
                        {
                          width: getBarWidth(s.nutrient, s.valuePer100g, s.dailyValuePercent),
                          backgroundColor: s.trafficLight === 'red' ? '#ef4444' : s.trafficLight === 'amber' ? '#f59e0b' : GREEN,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Positives Section (Green header) */}
            <View style={[styles.sectionCard, { marginTop: 12 }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.statusDot, { backgroundColor: GREEN }]} />
                <Text style={styles.sectionHeading}>POSITIVES / NUTRITION VALUE</Text>
              </View>

              {positives.map((s: any) => (
                <View key={s.nutrient} style={styles.meterRow}>
                  <View style={styles.meterTextRow}>
                    <Text style={styles.meterLabel}>{s.label}</Text>
                    <Text style={styles.meterVal}>{s.valuePer100g ?? 0} {s.unit}</Text>
                  </View>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.fill,
                        {
                          width: getBarWidth(s.nutrient, s.valuePer100g, s.dailyValuePercent),
                          backgroundColor: GREEN,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Alternative Products */}
            <View style={{ marginTop: 16 }}>
              <Text style={styles.altTitle}>HEALTHIER ALTERNATIVES</Text>
              <TouchableOpacity
                style={styles.altCard}
                onPress={() => router.push('/product/028400064057')}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.altName}>Lay's Baked Herb & Onion</Text>
                  <Text style={styles.altSub}>Health Score: 82/100 · Cal: 430 kcal</Text>
                </View>
                <Text style={styles.altTag}>Better Choice →</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* Ingredients Tab */
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>INGREDIENTS & ADDITIVES</Text>
            {product.ingredients.map((ing: any, i: number) => (
              <View key={i} style={styles.ingItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ingName}>{ing.name || ing.originalText}</Text>
                  {ing.profile?.purpose && (
                    <Text style={styles.ingPurpose}>{ing.profile.purpose}</Text>
                  )}
                </View>
                {ing.profile?.riskLevel && (
                  <View style={[styles.riskTag, {
                    backgroundColor: ing.profile.riskLevel === 'low' ? '#dcfce7' : ing.profile.riskLevel === 'moderate' ? '#fef3c7' : '#fee2e2'
                  }]}>
                    <Text style={{
                      fontSize: 10, fontWeight: '700',
                      color: ing.profile.riskLevel === 'low' ? '#15803d' : ing.profile.riskLevel === 'moderate' ? '#b45309' : '#b91c1c'
                    }}>
                      {ing.profile.riskLevel.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 13, color: '#64748b' },
  errorTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginTop: 12 },
  errorSub: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 6 },
  backBtn: { marginTop: 20, backgroundColor: GREEN, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  backBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  heroCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
  },
  imageBox: {
    width: 72, height: 72, borderRadius: 18, backgroundColor: '#f8fafc',
    alignItems: 'center', justifyContent: 'center', p: 4,
  },
  prodImg: { width: '100%', height: '100%' },
  prodName: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  prodBrand: { fontSize: 11, color: '#64748b', marginTop: 2 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  scoreVal: { fontSize: 12, fontWeight: '800' },
  scoreBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  scoreBadgeText: { fontSize: 10, fontWeight: '700' },
  pillsRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  microPill: {
    fontSize: 10, backgroundColor: '#f1f5f9', color: '#475569',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },

  segmentBar: {
    flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 20,
    padding: 3, marginVertical: 14,
  },
  segmentBtn: { flex: 1, paddingVertical: 8, borderRadius: 16, alignItems: 'center' },
  segmentBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  segmentText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  segmentTextActive: { color: '#0f172a' },

  sectionCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 16,
    borderWidth: 1, borderColor: '#f1f5f9',
  },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: '#334155', letterSpacing: 0.5 },

  meterRow: { marginBottom: 12 },
  meterTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  meterLabel: { fontSize: 12, fontWeight: '600', color: '#334155' },
  meterVal: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  track: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },

  altTitle: { fontSize: 11, fontWeight: '800', color: '#64748b', marginBottom: 8, letterSpacing: 0.5 },
  altCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 12,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9',
  },
  altName: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  altSub: { fontSize: 10, color: '#64748b', marginTop: 2 },
  altTag: { fontSize: 11, fontWeight: '700', color: GREEN },

  ingItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#f8fafc',
  },
  ingName: { fontSize: 12, fontWeight: '700', color: '#1e293b' },
  ingPurpose: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  riskTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
});
