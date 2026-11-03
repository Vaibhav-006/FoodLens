'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { Camera, Square, AlertCircle, Scan } from 'lucide-react';

export function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const controlsRef = useRef<IScannerControls | null>(null);
  const router = useRouter();

  const startScan = async () => {
    setError(null);
    setScanning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setPermission('granted');
      stream.getTracks().forEach((t) => t.stop());

      const reader = new BrowserMultiFormatReader();
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result, err) => {
          if (result) {
            const barcode = result.getText();
            setScanning(false);
            controlsRef.current?.stop();
            router.push(`/product/${barcode}`);
          }
          if (err && !(err.name === 'NotFoundException')) {
            console.warn('Decode error:', err);
          }
        }
      );
      controlsRef.current = controls;
    } catch (e: unknown) {
      setScanning(false);
      if (e instanceof Error && e.name === 'NotAllowedError') {
        setPermission('denied');
        setError('Camera permission denied. Please allow camera access in your browser.');
      } else {
        setError('Failed to start camera. Try entering the barcode manually.');
      }
    }
  };

  const stopScan = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setScanning(false);
  };

  useEffect(() => () => { controlsRef.current?.stop(); }, []);

  return (
    <div className="card p-6">
      {!scanning ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Scan className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Scan Snack Barcode</h3>
            <p className="text-xs text-[#4b7a5e] mt-1 max-w-xs mx-auto leading-relaxed">
              Point your camera at the barcode on any Indian food packet to extract nutrition facts.
            </p>
          </div>
          {error && (
            <div className="w-full bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <button onClick={startScan} className="btn-primary w-full max-w-xs mt-2 text-xs py-2.5">
            <Camera className="w-4 h-4" />
            {permission === 'denied' ? 'Camera Blocked — Grant Access' : 'Start Camera Scanner'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-emerald-500/30">
            <video ref={videoRef} className="w-full h-full object-cover" />
            {/* Scan overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-40 border-2 border-emerald-400 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]" />
            </div>
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="bg-black/80 border border-white/10 text-[#86efac] text-xs px-3 py-1 rounded-full backdrop-blur-md">
                Align barcode within the target box
              </span>
            </div>
          </div>
          <button onClick={stopScan} className="btn-secondary w-full text-xs py-2.5">
            <Square className="w-3.5 h-3.5" /> Stop Scanning
          </button>
        </div>
      )}
    </div>
  );
}
