import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

const GREEN = '#00c853';

const DEMO_SNACKS = [
  { label: 'Kurkure Masala', code: '8901491100519', icon: '🌶️' },
  { label: "Lay's Magic Masala", code: '8901491101837', icon: '🥔' },
  { label: 'Oreo Vanilla Cookies', code: '044000030148', icon: '🍪' },
  { label: 'Maggi Noodles', code: '8901058511875', icon: '🍜' },
  { label: 'Parle-G Gluco', code: '8901719101037', icon: '☕' },
  { label: 'Good Day Butter', code: '8901063101238', icon: '🧈' },
  { label: "Haldiram's Bhujia", code: '8904063200021', icon: '🥣' },
];

export default function ScanTab() {
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleBarcodeScan = async ({ data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push(`/product/${data}`);
    setTimeout(() => setScanned(false), 2000);
  };

  const handleManualSubmit = () => {
    const cleaned = manualBarcode.trim().replace(/\s/g, '');
    if (cleaned.length < 8) {
      Alert.alert('Invalid Barcode', 'Please enter a valid barcode (8-14 digits)');
      return;
    }
    router.push(`/product/${cleaned}`);
    setManualBarcode('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Mode Switcher */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'scan' && styles.modeBtnActive]}
          onPress={() => setMode('scan')}
        >
          <Text style={[styles.modeBtnText, mode === 'scan' && styles.modeBtnTextActive]}>
            📷 Camera View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'manual' && styles.modeBtnActive]}
          onPress={() => setMode('manual')}
        >
          <Text style={[styles.modeBtnText, mode === 'manual' && styles.modeBtnTextActive]}>
            ⌨️ Enter Barcode
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'scan' ? (
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 24 }}>
          {/* Viewfinder with Corner Brackets */}
          <View style={styles.viewfinderCard}>
            {!permission?.granted ? (
              <View style={styles.permissionBox}>
                <Text style={{ fontSize: 44, marginBottom: 8 }}>📷</Text>
                <Text style={styles.permissionTitle}>Camera Access Required</Text>
                <Text style={styles.permissionSub}>Enable camera to scan barcodes on food packets.</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                  <Text style={styles.permissionBtnText}>Enable Camera</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.cameraBox}>
                <CameraView
                  style={StyleSheet.absoluteFillObject}
                  facing="back"
                  onBarcodeScanned={scanned ? undefined : handleBarcodeScan}
                  barcodeScannerSettings={{
                    barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
                  }}
                />

                {/* 4 Corner Green Brackets */}
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />

                {/* Laser Bar */}
                <View style={styles.laserBar} />
              </View>
            )}
          </View>

          {/* Scanning status */}
          <Text style={styles.scanningText}>🟢 Scanning for barcode...</Text>

          {/* Quick Snack Chips */}
          <Text style={styles.quickTitle}>Quick Scan Verified Snacks:</Text>
          <View style={styles.quickRow}>
            {DEMO_SNACKS.slice(0, 4).map((s) => (
              <TouchableOpacity
                key={s.code}
                style={styles.quickChip}
                onPress={() => router.push(`/product/${s.code}`)}
              >
                <Text style={styles.quickChipText}>{s.icon} {s.label.split(' ')[0]}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Next Steps Guide Box (matches user image Screen 2) */}
          <View style={styles.guideCard}>
            <Text style={styles.guideTitle}>NEXT STEPS</Text>
            <View style={styles.bulletRow}>
              <View style={styles.dot} />
              <Text style={styles.bulletText}>Enable Camera access in settings</Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.dot} />
              <Text style={styles.bulletText}>Place your food product with the barcode at the center</Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.dot} />
              <Text style={styles.bulletText}>PackTruth will handle the rest!</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.manualContainer}>
          <Text style={styles.manualLabel}>Barcode Number</Text>
          <TextInput
            style={styles.manualInput}
            value={manualBarcode}
            onChangeText={setManualBarcode}
            placeholder="e.g. 8901491100519 (Kurkure)"
            keyboardType="numeric"
            maxLength={14}
            returnKeyType="search"
            onSubmitEditing={handleManualSubmit}
          />
          <Text style={styles.manualHint}>Type 8-14 digits from back of package</Text>

          <Text style={styles.demoLabel}>Or select verified snack:</Text>
          <View style={styles.demoGrid}>
            {DEMO_SNACKS.map((p) => (
              <TouchableOpacity
                key={p.code}
                style={[styles.demoCard, manualBarcode === p.code && styles.demoCardActive]}
                onPress={() => setManualBarcode(p.code)}
              >
                <Text style={{ fontSize: 16 }}>{p.icon}</Text>
                <Text style={styles.demoCardText} numberOfLines={1}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.searchBtn, manualBarcode.length < 8 && styles.searchBtnDisabled]}
            onPress={handleManualSubmit}
            disabled={manualBarcode.length < 8}
          >
            <Text style={styles.searchBtnText}>🔍 Analyse Product</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  modeToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 24,
    padding: 3,
  },
  modeBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  modeBtnText: { fontSize: 12, fontWeight: '700', color: '#6b7280' },
  modeBtnTextActive: { color: '#111827' },

  viewfinderCard: {
    width: 290, height: 260, backgroundColor: '#fff',
    borderRadius: 32, padding: 12, marginTop: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
    borderWidth: 1, borderColor: '#f1f5f9',
  },
  cameraBox: { flex: 1, borderRadius: 24, overflow: 'hidden', position: 'relative', backgroundColor: '#000' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: GREEN },
  cornerTL: { top: 12, left: 12, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  cornerTR: { top: 12, right: 12, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  cornerBL: { bottom: 12, left: 12, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 12, right: 12, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  laserBar: {
    position: 'absolute', left: 20, right: 20, top: '45%',
    height: 2, backgroundColor: GREEN, shadowColor: GREEN, shadowRadius: 8, shadowOpacity: 1,
  },

  permissionBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  permissionTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  permissionSub: { fontSize: 11, color: '#6b7280', textAlign: 'center', marginBottom: 12 },
  permissionBtn: { backgroundColor: GREEN, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  permissionBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  scanningText: { fontSize: 12, fontWeight: '700', color: '#374151', marginTop: 14 },
  quickTitle: { fontSize: 11, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 },
  quickRow: { flexDirection: 'row', gap: 8 },
  quickChip: {
    backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0',
  },
  quickChipText: { fontSize: 11, fontWeight: '600', color: '#334155' },

  guideCard: {
    width: 320, backgroundColor: '#fff', borderRadius: 24,
    padding: 16, marginTop: 16, borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 8, elevation: 1,
  },
  guideTitle: { fontSize: 11, fontWeight: '800', color: '#1e293b', letterSpacing: 0.5, marginBottom: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN },
  bulletText: { fontSize: 12, color: '#475569', flex: 1 },

  manualContainer: { padding: 16 },
  manualLabel: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 6 },
  manualInput: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 16, fontFamily: 'monospace', color: '#0f172a',
  },
  manualHint: { fontSize: 11, color: '#94a3b8', marginTop: 4, marginBottom: 16 },
  demoLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8 },
  demoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  demoCard: {
    width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 12,
    borderWidth: 1, borderColor: '#f1f5f9', flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  demoCardActive: { borderColor: GREEN, backgroundColor: '#f0fdf4' },
  demoCardText: { fontSize: 12, fontWeight: '600', color: '#1e293b', flex: 1 },
  searchBtn: {
    backgroundColor: GREEN, borderRadius: 18, paddingVertical: 14,
    alignItems: 'center', marginTop: 24,
  },
  searchBtnDisabled: { opacity: 0.5 },
  searchBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
