import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const GREEN = '#00c853';

const RECOMMENDED_SNACKS = [
  {
    barcode: '028400064057',
    name: "Lay's Classic Salted",
    brand: "Lay's",
    score: 63,
    cal: '536 kcal',
    protein: '7.1g',
    fat: '35.7g',
    img: 'https://images.openfoodfacts.org/images/products/002/840/006/4057/front_en.15.400.jpg',
  },
  {
    barcode: '8901063101238',
    name: 'Britannia Good Day Butter',
    brand: 'Britannia',
    score: 55,
    cal: '492 kcal',
    protein: '7.0g',
    fat: '21.0g',
    img: 'https://images.openfoodfacts.org/images/products/890/106/310/1238/front_en.10.400.jpg',
  },
  {
    barcode: '8906014460012',
    name: 'Balaji Simply Salted',
    brand: 'Balaji',
    score: 68,
    cal: '554 kcal',
    protein: '7.2g',
    fat: '35.0g',
    img: 'https://images.openfoodfacts.org/images/products/890/601/446/0012/front_en.11.400.jpg',
  },
];

const SCAN_HISTORY = [
  {
    barcode: '8901491100519',
    name: 'Kurkure Masala Munch',
    brand: 'Kurkure',
    time: '2 hrs ago',
    score: 45,
    cal: '558',
    protein: '5.8g',
    sugar: '2.1g',
    img: 'https://images.openfoodfacts.org/images/products/890/149/100/1168/front_fr.3.400.jpg',
  },
  {
    barcode: '044000030148',
    name: 'Oreo Vanilla Sandwich Cookies',
    brand: 'Oreo',
    time: 'Yesterday',
    score: 38,
    cal: '483',
    protein: '5.2g',
    sugar: '38.5g',
    img: 'https://images.openfoodfacts.org/images/products/762/230/033/6738/front_fr.40.400.jpg',
  },
  {
    barcode: '8901058511875',
    name: 'Maggi 2-Minute Noodles',
    brand: 'Nestlé',
    time: '2 days ago',
    score: 42,
    cal: '427',
    protein: '8.0g',
    sugar: '2.2g',
    img: 'https://images.openfoodfacts.org/images/products/890/105/885/2893/front_en.13.400.jpg',
  },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    const cleaned = search.trim();
    if (!cleaned) return;
    if (/^\d{8,14}$/.test(cleaned)) {
      router.push(`/product/${cleaned}`);
    } else {
      router.push({ pathname: '/(tabs)/scan', params: { query: cleaned } });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>FE</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>Food Explorer</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.scanQuickBtn}
            onPress={() => router.push('/(tabs)/scan')}
          >
            <Ionicons name="qr-code-outline" size={20} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search food type or barcode..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={() => router.push('/(tabs)/scan')}>
            <Ionicons name="barcode-outline" size={20} color={GREEN} />
          </TouchableOpacity>
        </View>

        {/* Recommended Horizontal Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <Text style={styles.sectionSub}>Healthy Choices</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recScroll}>
          {RECOMMENDED_SNACKS.map((snack) => (
            <TouchableOpacity
              key={snack.barcode}
              style={styles.recCard}
              onPress={() => router.push(`/product/${snack.barcode}`)}
            >
              <View style={styles.recImgBox}>
                <Image source={{ uri: snack.img }} style={styles.recImg} resizeMode="contain" />
              </View>
              <View style={styles.recMeta}>
                <Text style={styles.recBrand}>{snack.brand}</Text>
                <Text style={styles.recName} numberOfLines={1}>{snack.name}</Text>
                <View style={styles.recScoreRow}>
                  <Text style={styles.recScore}>Score: {snack.score}</Text>
                  <Text style={styles.recCal}>{snack.cal}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Scan History Section */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Scan History</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text style={styles.viewAll}>View all &gt;</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyList}>
          {SCAN_HISTORY.map((item) => (
            <TouchableOpacity
              key={item.barcode}
              style={styles.historyCard}
              onPress={() => router.push(`/product/${item.barcode}`)}
            >
              <View style={styles.historyImgBox}>
                <Image source={{ uri: item.img }} style={styles.historyImg} resizeMode="contain" />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.historySub}>{item.brand} · {item.time}</Text>
                <View style={styles.historyPills}>
                  <Text style={styles.pill}>Cal: {item.cal}</Text>
                  <Text style={styles.pill}>Prot: {item.protein}</Text>
                  <Text style={styles.pill}>Sugar: {item.sugar}</Text>
                </View>
              </View>
              <View style={[styles.scoreBubble, { backgroundColor: item.score >= 50 ? '#dcfce7' : '#fee2e2' }]}>
                <Text style={[styles.scoreBubbleText, { color: item.score >= 50 ? '#15803d' : '#b91c1c' }]}>
                  {item.score}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#dcfce7',
    borderWidth: 1.5,
    borderColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '800',
    color: '#15803d',
    fontSize: 14,
  },
  greeting: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  scanQuickBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '700',
    color: GREEN,
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  recScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  recCard: {
    width: 170,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  recImgBox: {
    width: '100%',
    height: 100,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  recImg: {
    width: '85%',
    height: '85%',
  },
  recMeta: {
    gap: 2,
  },
  recBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  recName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  recScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  recScore: {
    fontSize: 11,
    fontWeight: '800',
    color: GREEN,
  },
  recCal: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  historyList: {
    gap: 10,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  historyImgBox: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  historyImg: {
    width: '80%',
    height: '80%',
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  historySub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  historyPills: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  pill: {
    fontSize: 9,
    fontWeight: '600',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scoreBubble: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBubbleText: {
    fontSize: 13,
    fontWeight: '800',
  },
});

