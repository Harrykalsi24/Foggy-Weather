import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { TrendDataPoint, TrendMetric, TempUnit, ThemeMode } from '../types/weather';

interface TrendsChartProps {
  data: TrendDataPoint[];
  unit: TempUnit;
  theme?: ThemeMode;
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ data, unit, theme = 'dark' }) => {
  const [activeMetric, setActiveMetric] = useState<TrendMetric>('Temperature');
  const [selectedIndex, setSelectedIndex] = useState<number>(3); // Default to Thu

  const isDark = theme === 'dark';
  const metrics: TrendMetric[] = ['Temperature', 'Precipitation', 'Wind', 'Humidity'];

  // Calculate coordinates for SVG
  const width = 480;
  const height = 180;
  const paddingLeft = 36;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 25;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Determine values and ranges based on active metric
  let values: number[] = [];
  let yMin = 0;
  let yMax = 20;
  let unitSuffix = `°${unit}`;

  if (activeMetric === 'Temperature') {
    values = data.map((d) => (unit === 'C' ? d.tempC : d.tempF));
    yMin = unit === 'C' ? 0 : 30;
    yMax = unit === 'C' ? 20 : 70;
    unitSuffix = `°`;
  } else if (activeMetric === 'Precipitation') {
    values = data.map((d) => d.precip);
    yMin = 0;
    yMax = 100;
    unitSuffix = '%';
  } else if (activeMetric === 'Wind') {
    values = data.map((d) => d.wind);
    yMin = 0;
    yMax = 30;
    unitSuffix = ' km/h';
  } else {
    values = data.map((d) => d.humidity);
    yMin = 40;
    yMax = 100;
    unitSuffix = '%';
  }

  // Calculate points
  const points = values.map((val, idx) => {
    const x = paddingLeft + (idx / Math.max(values.length - 1, 1)) * chartW;
    const normalizedY = (val - yMin) / Math.max(yMax - yMin, 1);
    const y = paddingTop + (1 - Math.min(Math.max(normalizedY, 0), 1)) * chartH;
    return { x, y, val, day: data[idx]?.day || 'Day', label: data[idx]?.label || `${data[idx]?.day}` };
  });

  // Construct smooth bezier curve path
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = createSmoothPath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : '';

  // Grid steps (4 steps)
  const gridSteps = [yMax, yMax * 0.75 + yMin * 0.25, yMax * 0.5 + yMin * 0.5, yMax * 0.25 + yMin * 0.75, yMin].map(
    (v) => Math.round(v)
  );

  const selectedPt = points[selectedIndex] || points[0] || { x: 50, y: 50, val: 0, day: '', label: '' };

  return (
    <div
      className={`w-full rounded-2xl backdrop-blur-md border p-4 sm:p-5 shadow-lg flex flex-col justify-between transition-colors duration-300 ${
        isDark
          ? 'bg-[#121a2d]/90 border-slate-800/80 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Top Bar with Title and Metric Tabs */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 pb-2 border-b mb-2 ${
          isDark ? 'border-slate-800/60' : 'border-slate-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <BarChart3 className={`w-4 h-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
          <h2 className={`text-sm font-bold tracking-wide ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Weather Trends
          </h2>
        </div>

        {/* Metric Pill Buttons */}
        <div
          className={`flex items-center p-0.5 rounded-xl border text-xs transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {metrics.map((metric) => {
            const isActive = activeMetric === metric;
            return (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/40'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {metric}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Area gradient */}
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={isDark ? '0.45' : '0.28'} />
              <stop offset="85%" stopColor="#1d4ed8" stopOpacity={isDark ? '0.08' : '0.04'} />
              <stop offset="100%" stopColor={isDark ? '#121a2d' : '#ffffff'} stopOpacity="0" />
            </linearGradient>

            {/* Line glow */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#38bdf8" floodOpacity={isDark ? '0.6' : '0.3'} />
            </filter>
          </defs>

          {/* Horizontal Grid lines and Y labels */}
          {gridSteps.map((val, idx) => {
            const y = paddingTop + (idx / (gridSteps.length - 1)) * chartH;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke={isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'}
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill={isDark ? '#94a3b8' : '#64748b'}
                  fontSize="10"
                  fontFamily="inherit"
                  fontWeight="600"
                >
                  {val}°
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {areaPath && <path d={areaPath} fill="url(#trendGradient)" />}

          {/* Curved Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          )}

          {/* Dotted vertical line for selected point */}
          <line
            x1={selectedPt.x}
            y1={paddingTop}
            x2={selectedPt.x}
            y2={height - paddingBottom}
            stroke={isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.4)'}
            strokeDasharray="2 2"
          />

          {/* X axis Day Labels */}
          {points.map((pt, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <text
                key={idx}
                x={pt.x}
                y={height - 6}
                textAnchor="middle"
                fill={isSelected ? '#0284c7' : isDark ? '#94a3b8' : '#64748b'}
                fontSize="10.5"
                fontWeight={isSelected ? '800' : '600'}
                fontFamily="inherit"
                className="cursor-pointer transition-colors"
                onClick={() => setSelectedIndex(idx)}
              >
                {pt.day}
              </text>
            );
          })}

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <g
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className="cursor-pointer group/dot"
              >
                <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 6 : 4}
                  fill={isDark ? '#0e1726' : '#ffffff'}
                  stroke="#0284c7"
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all duration-200"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 3 : 2}
                  fill={isSelected ? '#0284c7' : isDark ? '#ffffff' : '#0f172a'}
                />
              </g>
            );
          })}

          {/* Active Tooltip Badge */}
          <g
            transform={`translate(${Math.max(Math.min(selectedPt.x, width - 60), 60)}, ${selectedPt.y - 32})`}
            className="pointer-events-none transition-all duration-200"
          >
            <rect
              x="-36"
              y="-12"
              width="72"
              height="28"
              rx="8"
              fill={isDark ? '#090e17' : '#ffffff'}
              stroke={isDark ? '#334155' : '#e2e8f0'}
              strokeWidth="1"
              filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))"
            />
            {/* Value */}
            <text
              x="0"
              y="-1"
              textAnchor="middle"
              fill={isDark ? '#ffffff' : '#0f172a'}
              fontSize="10"
              fontWeight="bold"
            >
              {selectedPt.val}
              {unitSuffix}
            </text>
            {/* Sublabel */}
            <text
              x="0"
              y="10"
              textAnchor="middle"
              fill={isDark ? '#94a3b8' : '#64748b'}
              fontSize="8"
              fontWeight="600"
            >
              {selectedPt.label}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
