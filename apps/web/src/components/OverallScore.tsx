'use client';

export function OverallScore({ score }: { score: number }) {
  const color =
    score >= 70 ? 'text-green-600' :
    score >= 45 ? 'text-amber-600' :
    'text-red-500';

  const label =
    score >= 70 ? 'Good' :
    score >= 45 ? 'Moderate' :
    'Poor';

  const ring =
    score >= 70 ? 'stroke-green-500' :
    score >= 45 ? 'stroke-amber-500' :
    'stroke-red-500';

  const circumference = 2 * Math.PI * 22;
  const dashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 52 52" className="w-16 h-16 -rotate-90">
          <circle cx="26" cy="26" r="22" fill="none" stroke="#e5e7eb" strokeWidth="4" />
          <circle
            cx="26" cy="26" r="22"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            className={`transition-all duration-700 ${ring}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-sm font-bold leading-none ${color}`}>{score}</span>
        </div>
      </div>
      <span className={`text-xs font-semibold mt-1 ${color}`}>{label}</span>
    </div>
  );
}

