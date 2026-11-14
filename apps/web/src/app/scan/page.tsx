'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Zap,
  ArrowLeft,
  Upload,
  SwitchCamera,
  AlertCircle,
  X,
  Sparkles,
  Search,
  CheckCircle2,
  ScanLine,
} from 'lucide-react';
import {
  MultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
  BinaryBitmap,
  HybridBinarizer,
  GlobalHistogramBinarizer,
  HTMLCanvasElementLuminanceSource,
} from '@zxing/library';
import { ProductImage } from '@/components/ProductImage';
import { ScanLoadingOverlay } from '@/components/ScanLoadingOverlay';

const VERIFIED_SNACKS = [
  {
    name: 'Kurkure Masala Munch',
    code: '8901491100519',
    category: 'Namkeen / Crisps',
    img: 'https://images.openfoodfacts.org/images/products/890/149/110/0519/front_en.48.400.jpg',
    icon: '🌶️',
  },
  {
    name: "Lay's Classic Salted Chips",
    code: '8901491001021',
    category: 'Potato Chips',
    img: 'https://images.openfoodfacts.org/images/products/890/149/100/1021/front_en.3.400.jpg',
    icon: '🥔',
  },
  {
    name: "Lay's India's Magic Masala",
    code: '8901491101837',
    category: 'Potato Chips',
    img: 'https://images.openfoodfacts.org/images/products/890/149/110/1837/front_en.26.400.jpg',
    icon: '✨',
  },
  {
    name: "Haldiram's Nagpur Aloo Bhujia",
    code: '8904063200021',
    category: 'Namkeen',
    img: 'https://images.openfoodfacts.org/images/products/890/400/440/0731/front_en.28.400.jpg',
    icon: '🫙',
  },
  {
    name: 'Maggi 2-Minute Noodles Masala',
    code: '8901058511875',
    category: 'Instant Noodles',
    img: 'https://images.openfoodfacts.org/images/products/890/105/885/1328/front_en.17.400.jpg',
    icon: '🍜',
  },
  {
    name: 'Parle-G Original Gluco Biscuits',
    code: '8901719101037',
    category: 'Biscuits',
    img: 'https://images.openfoodfacts.org/images/products/890/171/913/4845/front_en.11.400.jpg',
    icon: '🟡',
  },
  {
    name: 'Britannia Good Day Butter Cookies',
    code: '8901063101238',
    category: 'Butter Cookies',
    img: 'https://images.openfoodfacts.org/images/products/890/106/309/3522/front_en.28.400.jpg',
    icon: '☀️',
  },
  {
    name: 'Thums Up Charged Cola',
    code: '8901764012296',
    category: 'Cold Drink',
    img: 'https://images.openfoodfacts.org/images/products/890/176/401/2296/front_en.12.400.jpg',
    icon: '🥤',
  },
  {
    name: 'Farmley Roasted Makhana Pink Salt',
    code: '8906132470014',
    category: 'Healthy Snacks',
    img: 'https://images.openfoodfacts.org/images/products/890/149/100/1021/front_en.3.400.jpg',
    icon: '🫘',
  },
  {
    name: 'Balaji Wafers Simply Salted',
    code: '8906014460012',
    category: 'Potato Chips',
    img: 'https://images.openfoodfacts.org/images/products/890/601/446/0012/front_en.11.400.jpg',
    icon: '🥔',
  },
];

export default function ScanPage() {
  const [useCamera, setUseCamera] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [selectedSnack, setSelectedSnack] = useState<typeof VERIFIED_SNACKS[0] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingBarcode, setNavigatingBarcode] = useState<string | null>(null);
  const [navigatingName, setNavigatingName] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isNavigatingRef = useRef(false);
  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fullCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const readerRef = useRef<MultiFormatReader | null>(null);
  const nativeDetectorRef = useRef<any>(null);
  const router = useRouter();

  const getHints = useCallback(() => {
    const hints = new Map<DecodeHintType, any>();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.ITF,
      BarcodeFormat.QR_CODE,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);
    return hints;
  }, []);

  const decodeFromCanvas = useCallback((canvas: HTMLCanvasElement): string | null => {
    try {
      if (!readerRef.current) {
        readerRef.current = new MultiFormatReader();
      }
      const reader = readerRef.current;
      const hints = getHints();
      const lumSource = new HTMLCanvasElementLuminanceSource(canvas);

      // 1. Try GlobalHistogramBinarizer (superior for backlit smartphone screens and reflections)
      try {
        const bitmap = new BinaryBitmap(new GlobalHistogramBinarizer(lumSource));
        const res = reader.decode(bitmap, hints);
        if (res && res.getText()) return res.getText().trim();
      } catch {}

      // 2. Try HybridBinarizer (standard for packaging labels)
      try {
        const bitmap = new BinaryBitmap(new HybridBinarizer(lumSource));
        const res = reader.decode(bitmap, hints);
        if (res && res.getText()) return res.getText().trim();
      } catch {}
    } catch {}
    return null;
  }, [getHints]);

  // Enumerate video devices on mount & reset navigation locks
  useEffect(() => {
    isNavigatingRef.current = false;
    setIsNavigating(false);
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoInputs = devices.filter((d) => d.kind === 'videoinput');
          setCameras(videoInputs);
        })
        .catch(() => {});
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try { track.stop(); } catch {}
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        try {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        } catch {}
        videoRef.current.srcObject = null;
      }
    }

    setUseCamera(false);
    setIsStartingCamera(false);
  }, []);

  const handleNavigateToProduct = useCallback((barcode: string, name?: string) => {
    if (isNavigatingRef.current) return;
    const cleaned = barcode?.trim();
    if (!cleaned) return;
    isNavigatingRef.current = true;
    stopCamera();
    setNavigatingBarcode(cleaned);
    setNavigatingName(name || null);
    setIsNavigating(true);

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([60, 40, 60]);
      }
    } catch {}

    const targetUrl = `/product/${cleaned}`;
    router.push(targetUrl);

    // Guaranteed redirect fallback if client transition lags
    const fallbackTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && !window.location.pathname.includes(cleaned)) {
        window.location.href = targetUrl;
      }
    }, 800);

    return () => clearTimeout(fallbackTimer);
  }, [stopCamera, router]);

  const startCameraWithDeviceId = async (deviceId?: string) => {
    setError(null);
    setIsStartingCamera(true);
    isNavigatingRef.current = false;

    // Stop existing scanner session cleanly
    stopCamera();
    setUseCamera(true);

    try {
      if (!videoRef.current) {
        throw new Error('Video element not available');
      }

      const videoElement = videoRef.current;
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      videoElement.srcObject = stream;

      await videoElement.play().catch((err) => console.warn('Video autoPlay prevented:', err));

      // 1. Native BarcodeDetector Engine (Hardware accelerated in Chrome/Edge/Android)
      if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        try {
          nativeDetectorRef.current = new (window as any).BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'],
          });
        } catch {
          nativeDetectorRef.current = null;
        }
      }

      if (!readerRef.current) {
        readerRef.current = new MultiFormatReader();
      }

      // 3. Active Scan Loop
      let scanTick = 0;
      const runScanLoop = async () => {
        if (isNavigatingRef.current || !videoRef.current) return;
        const video = videoRef.current;

        if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
          scanTick++;

          // 1. Try Native BarcodeDetector first
          if (nativeDetectorRef.current) {
            try {
              const barcodes = await nativeDetectorRef.current.detect(video);
              if (barcodes && barcodes.length > 0) {
                const raw = barcodes[0].rawValue?.trim();
                if (raw && !isNavigatingRef.current) {
                  handleNavigateToProduct(raw);
                  return;
                }
              }
            } catch {}
          }

          // 2. Focused Viewfinder Crop (where the user aligns the barcode in the green reticle)
          try {
            if (!cropCanvasRef.current) {
              cropCanvasRef.current = document.createElement('canvas');
            }
            const cropCanvas = cropCanvasRef.current;
            const vw = video.videoWidth;
            const vh = video.videoHeight;

            // Crop central 70% width, 55% height
            const sx = Math.round(vw * 0.15);
            const sy = Math.round(vh * 0.22);
            const sw = Math.round(vw * 0.70);
            const sh = Math.round(vh * 0.55);

            cropCanvas.width = 480;
            cropCanvas.height = Math.round(480 * (sh / sw));

            const cropCtx = cropCanvas.getContext('2d', { willReadFrequently: true });
            if (cropCtx) {
              cropCtx.drawImage(video, sx, sy, sw, sh, 0, 0, cropCanvas.width, cropCanvas.height);
              const decoded = decodeFromCanvas(cropCanvas);
              if (decoded && !isNavigatingRef.current) {
                handleNavigateToProduct(decoded);
                return;
              }
            }
          } catch {}

          // 3. Full Frame Scanner (every alternate tick)
          if (scanTick % 2 === 0) {
            try {
              if (!fullCanvasRef.current) {
                fullCanvasRef.current = document.createElement('canvas');
              }
              const fullCanvas = fullCanvasRef.current;
              const maxDim = 640;
              const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
              fullCanvas.width = Math.round(video.videoWidth * scale);
              fullCanvas.height = Math.round(video.videoHeight * scale);

              const fullCtx = fullCanvas.getContext('2d', { willReadFrequently: true });
              if (fullCtx) {
                fullCtx.drawImage(video, 0, 0, fullCanvas.width, fullCanvas.height);
                const decoded = decodeFromCanvas(fullCanvas);
                if (decoded && !isNavigatingRef.current) {
                  handleNavigateToProduct(decoded);
                  return;
                }
              }
            } catch {}
          }
        }

        if (!isNavigatingRef.current) {
          scanTimerRef.current = setTimeout(runScanLoop, 60);
        }
      };

      // Kick off the scan loop
      scanTimerRef.current = setTimeout(runScanLoop, 150);
    } catch (err: any) {
      console.error('Camera startup error:', err);
      const isPermissionDenied =
        err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError';
      setError(
        isPermissionDenied
          ? 'Camera permission was denied. Please allow camera permissions in your browser URL bar.'
          : 'Could not access camera or webcam. You can also upload a photo of the barcode or choose from verified snacks below.'
      );
      stopCamera();
    } finally {
      setIsStartingCamera(false);
    }
  };

  const startCamera = () => {
    const currentDevice = cameras[currentCameraIndex];
    startCameraWithDeviceId(currentDevice?.deviceId);
  };

  const handleSwitchCamera = () => {
    if (cameras.length <= 1) return;
    const nextIdx = (currentCameraIndex + 1) % cameras.length;
    setCurrentCameraIndex(nextIdx);
    stopCamera();
    setTimeout(() => {
      startCameraWithDeviceId(cameras[nextIdx].deviceId);
    }, 150);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setIsScanningImage(true);

    try {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const decoded = decodeFromCanvas(canvas);
        URL.revokeObjectURL(imageUrl);
        if (decoded) {
          handleNavigateToProduct(decoded);
          return;
        }
      }
      URL.revokeObjectURL(imageUrl);
      setError(
        'No barcode detected in the uploaded photo. Please ensure good lighting and clear focus.'
      );
    } catch {
      setError(
        'Could not decode barcode from this photo. Try another angle or enter the barcode number below.'
      );
    } finally {
      setIsScanningImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = manualCode.trim();
    if (cleaned.length >= 8) {
      handleNavigateToProduct(cleaned);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4b7a5e] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 sm:gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="sm:hidden">FMCG Radar</span>
          <span className="hidden sm:inline">Indian FMCG Barcode Engine</span>
        </span>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex items-start justify-between gap-3 text-amber-200 text-xs shadow-sm">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300">Camera Notification</p>
              <p className="text-amber-200/90 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-amber-400 hover:text-amber-200 p-1 rounded-lg hover:bg-amber-500/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Viewfinder Workspace */}
        <div className="lg:col-span-7 card p-4 sm:p-8 flex flex-col items-center">
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-5 gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Food Scanner Viewfinder</h2>
              <p className="text-xs text-[#4b7a5e]">Hold barcode or snack package steadily in frame</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Switch Camera if multiple available */}
              {cameras.length > 1 && useCamera && (
                <button
                  onClick={handleSwitchCamera}
                  title="Switch Camera"
                  className="btn-secondary text-xs px-2.5 py-2 flex items-center justify-center gap-1.5"
                >
                  <SwitchCamera className="w-3.5 h-3.5" />
                  <span>Flip</span>
                </button>
              )}

              {/* Upload Barcode Image Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanningImage}
                title="Upload photo of barcode"
                className="btn-secondary text-xs px-3 py-2 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isScanningImage ? 'Scanning...' : 'Upload Photo'}</span>
              </button>
            </div>
          </div>

          {/* Viewfinder Frame with 4 Green Brackets & Glowing Scanline */}
          <div
            className="relative w-full max-w-[440px] aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center shadow-inner"
            style={{
              background: '#070b09',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 0 30px rgba(34,197,94,0.06)',
            }}
          >
            {/* 4 Corner Green Brackets */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-7 h-7 sm:w-9 sm:h-9 border-t-4 border-l-4 border-[#22c55e] rounded-tl-xl sm:rounded-tl-2xl pointer-events-none z-30 drop-shadow-[0_0_8px_#22c55e]" />
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-9 sm:h-9 border-t-4 border-r-4 border-[#22c55e] rounded-tr-xl sm:rounded-tr-2xl pointer-events-none z-30 drop-shadow-[0_0_8px_#22c55e]" />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-7 h-7 sm:w-9 sm:h-9 border-b-4 border-l-4 border-[#22c55e] rounded-bl-xl sm:rounded-bl-2xl pointer-events-none z-30 drop-shadow-[0_0_8px_#22c55e]" />
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-7 h-7 sm:w-9 sm:h-9 border-b-4 border-r-4 border-[#22c55e] rounded-br-xl sm:rounded-br-2xl pointer-events-none z-30 drop-shadow-[0_0_8px_#22c55e]" />

            {/* Glowing Green Laser Scanline (active when camera is running) */}
            {useCamera && (
              <div className="absolute left-6 right-6 top-10 h-1 bg-gradient-to-r from-transparent via-[#22c55e] to-transparent shadow-[0_0_20px_#22c55e] z-20 animate-scanline pointer-events-none" />
            )}

            {/* Live Camera Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                useCamera ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none -z-10'
              }`}
            />

            {/* Active Camera Indicator Pill */}
            {useCamera && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-emerald-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Live Barcode Radar
                </span>
              </div>
            )}

            {/* Inactive Standby State */}
            {!useCamera && (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 select-none bg-gradient-to-b from-transparent to-black/40 relative">
                {selectedSnack ? (
                  <>
                    <button
                      onClick={() => setSelectedSnack(null)}
                      title="Clear Selection"
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors z-20"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2 sm:p-2.5 flex items-center justify-center overflow-hidden mb-2 sm:mb-2.5 bg-white/[0.04] border border-white/10 shadow-lg">
                      <ProductImage
                        src={selectedSnack.img}
                        alt={selectedSnack.name}
                        fallbackIcon={selectedSnack.icon}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white px-2 line-clamp-1">{selectedSnack.name}</h4>
                    <p className="text-[10px] sm:text-[11px] text-[#4b7a5e] font-mono mt-0.5">
                      Code: {selectedSnack.code}
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-400 mt-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      Verified Demo Snack Selected
                    </span>
                  </>
                ) : (
                  <>
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 bg-emerald-500/10 border border-emerald-500/25 shadow-[0_0_30px_rgba(34,197,94,0.12)]">
                      <ScanLine className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 stroke-[1.75]" />
                      <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/30 animate-ping" style={{ animationDuration: '3s' }} />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white px-2">Ready to Scan</h4>
                    <p className="text-[11px] sm:text-xs text-[#86efac]/80 mt-1 max-w-xs leading-relaxed px-2">
                      Position any packaged food barcode steadily inside the green viewfinder reticle.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Quick Action Button for Selected / Scanned Snack */}
          <div className="w-full max-w-[440px] mt-4">
            {selectedSnack ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleNavigateToProduct(selectedSnack.code, selectedSnack.name)}
                  className="btn-primary flex-1 py-3 text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Zap className="w-4 h-4" />
                  <span className="truncate">Analyse &ldquo;{selectedSnack.name}&rdquo;</span>
                </button>
                <button
                  onClick={() => setSelectedSnack(null)}
                  title="Deselect"
                  className="btn-secondary px-3 py-3"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={useCamera ? stopCamera : startCamera}
                disabled={isStartingCamera}
                className="btn-primary w-full py-3 text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Camera className="w-4 h-4" />
                <span>
                  {isStartingCamera ? 'Connecting Camera...' : useCamera ? 'Stop Live Camera' : 'Open Live Camera Scanner'}
                </span>
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="w-full max-w-[440px] my-4 sm:my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4b7a5e]">
              Or type barcode directly
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="w-full max-w-[440px]">
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. 8901491100519 (Kurkure)"
                className="flex-1 rounded-xl px-3.5 py-2.5 text-base sm:text-xs font-mono text-white placeholder-[#2d5236] bg-white/[0.04] border border-white/10 focus:outline-none focus:border-emerald-500/50"
              />
              <button
                type="submit"
                disabled={manualCode.trim().length < 8}
                className="btn-primary text-xs px-4 py-2.5 disabled:opacity-40 active:scale-95"
              >
                Lookup
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Verified Snacks & Next Steps */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          {/* Quick Select Packets */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white">Verified Indian Snacks</h3>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 sm:px-2.5 py-0.5 rounded-full">
                10 Instant Demos
              </span>
            </div>
            <p className="text-xs text-[#4b7a5e] mb-3 sm:mb-4">Click any snack to preview or analyze immediately:</p>

            <div className="space-y-2 max-h-[340px] sm:max-h-[380px] overflow-y-auto no-scrollbar pr-1">
              {VERIFIED_SNACKS.map((snack) => (
                <button
                  key={snack.code}
                  onClick={() => {
                    setSelectedSnack(snack);
                    stopCamera();
                  }}
                  className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between gap-3 active:scale-[0.98] transition-all ${
                    selectedSnack?.code === snack.code && !useCamera
                      ? 'border-emerald-500/40 bg-emerald-500/10 shadow-md shadow-emerald-500/10'
                      : 'border-white/[0.06] hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden bg-white/[0.04]">
                      <ProductImage
                        src={snack.img}
                        alt={snack.name}
                        fallbackIcon={snack.icon}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{snack.name}</p>
                      <p className="text-[10px] text-[#4b7a5e] font-mono truncate">
                        {snack.category} · {snack.code}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 flex-shrink-0">
                    Preview →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Next Steps Guide */}
          <div className="card p-4 sm:p-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              How PackTruth Works
            </h3>
            <ul className="space-y-3 text-xs text-[#86efac]/90">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </span>
                <span>
                  <strong className="text-white">Scan Barcode</strong>: Position any Indian snack barcode within the green brackets or upload a photo.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </span>
                <span>
                  <strong className="text-white">INS Additive Intelligence</strong>: PackTruth decodes chemical codes (e.g. INS 150d, INS 627, INS 338) and flags health impacts.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </span>
                <span>
                  <strong className="text-white">FSSAI & Nutrient Traffic Lights</strong>: Clear red/yellow/green indicators for sugar, palm oil, saturated fat, and sodium.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fullscreen High-Tech Scanner Loading Screen on Barcode Decode / Navigation */}
      {isNavigating && (
        <ScanLoadingOverlay
          barcode={navigatingBarcode}
          productName={navigatingName}
        />
      )}
    </div>
  );
}
