'use client';

import type { NutrientScore } from '@foodlens/core';

const TRAFFIC_CLASSES = {
  green: 'traffic-green',
  amber: 'traffic-amber',
  red: 'traffic-red',
};

const TRAFFIC_EMOJI = { green: '🟢', amber: '🟡', red: '🔴' };

function formatNutrient(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const num = Number(val);
  if (num >= 100) return Math.round(num).toString();
  return Number(num.toFixed(1)).toString();
}

export function NutritionPanel({ scores }: { scores: NutrientScore[] }) {
  const highlighted = ['calories', 'totalFat', 'saturatedFat', 'transFat', 'totalSugar', 'sodium'];
  const top = scores.filter((s) => highlighted.includes(s.nutrient));
  const rest = scores.filter((s) => !highlighted.includes(s.nutrient));

  return (
    <div className="card">
      <h2 className="text-base font-bold text-gray-800 mb-4">📊 Nutrition Facts <span className="text-gray-400 font-normal text-sm">per 100g</span></h2>

      {/* Traffic light highlights */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {top.map((s) => (
          <div
            key={s.nutrient}
            className={`rounded-xl p-3 text-center ${TRAFFIC_CLASSES[s.trafficLight]}`}
          >
            <div className="text-xs font-medium opacity-80">{s.label}</div>
            <div className="text-lg font-bold mt-0.5">
              {s.valuePer100g !== null ? formatNutrient(s.valuePer100g) : '—'}
              <span className="text-xs font-normal ml-0.5">{s.unit}</span>
            </div>
            <div className="text-xs mt-0.5">{TRAFFIC_EMOJI[s.trafficLight]}</div>
          </div>
        ))}
      </div>

      {/* Full table */}
      <div className="divide-y divide-gray-100">
        {[...top, ...rest].map((s) => (
          <div key={s.nutrient} className="flex items-center justify-between py-2.5">
            <span className="text-sm text-gray-700">{s.label}</span>
            <div className="flex items-center gap-3">
              {s.dailyValuePercent !== null && (
                <span className="text-xs text-gray-400">{s.dailyValuePercent}% DV</span>
              )}
              <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-lg ${TRAFFIC_CLASSES[s.trafficLight]}`}>
                {s.valuePer100g !== null ? `${formatNutrient(s.valuePer100g)} ${s.unit}` : 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        🟢 Low · 🟡 Medium · 🔴 High — based on FSSAI / WHO guidelines
      </p>
    </div>
  );
}

