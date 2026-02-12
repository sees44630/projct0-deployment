'use client';

import { useMemo } from 'react';
import { RARITY_COLORS } from '@/lib/utils';
import type { RarityTier } from '@/store';

interface RadarChartProps {
  stats: {
    quality: number;
    rarity: number;
    comfort: number;
    style: number;
    value: number;
  };
  rarityTier: RarityTier;
  size?: number;
}

const LABELS = ['Quality', 'Rarity', 'Comfort', 'Style', 'Value'];

export default function RadarChart({
  stats,
  rarityTier,
  size = 200,
}: RadarChartProps) {
  const color = RARITY_COLORS[rarityTier];
  const center = size / 2;
  const maxRadius = size / 2 - 30;
  const values = [stats.quality, stats.rarity, stats.comfort, stats.style, stats.value];
  const sides = values.length;
  const angleStep = (2 * Math.PI) / sides;

  // Generate polygon points for a given radius
  const polygonPoints = useMemo(() => {
    return (radius: number) =>
      Array.from({ length: sides }, (_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
      }).join(' ');
  }, [center, sides, angleStep]);

  // Data polygon
  const dataPoints = useMemo(() => {
    return values
      .map((v, i) => {
        const radius = (v / 100) * maxRadius;
        const angle = i * angleStep - Math.PI / 2;
        return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
      })
      .join(' ');
  }, [values, center, maxRadius, angleStep]);

  // Label positions
  const labelPositions = useMemo(() => {
    return LABELS.map((label, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = maxRadius + 22;
      return {
        label,
        x: center + labelRadius * Math.cos(angle),
        y: center + labelRadius * Math.sin(angle),
        value: values[i],
      };
    });
  }, [center, maxRadius, angleStep, values]);

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => (
          <polygon
            key={scale}
            points={polygonPoints(maxRadius * scale)}
            fill="none"
            stroke="rgba(0,212,255,0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {Array.from({ length: sides }, (_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + maxRadius * Math.cos(angle)}
              y2={center + maxRadius * Math.sin(angle)}
              stroke="rgba(0,212,255,0.15)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data area */}
        <polygon
          points={dataPoints}
          fill={`${color.color}22`}
          stroke={color.color}
          strokeWidth="2"
          style={{
            filter: `drop-shadow(0 0 6px ${color.glow})`,
          }}
        />

        {/* Data points */}
        {values.map((v, i) => {
          const radius = (v / 100) * maxRadius;
          const angle = i * angleStep - Math.PI / 2;
          return (
            <circle
              key={i}
              cx={center + radius * Math.cos(angle)}
              cy={center + radius * Math.sin(angle)}
              r="4"
              fill={color.color}
              stroke="white"
              strokeWidth="1"
              style={{
                filter: `drop-shadow(0 0 4px ${color.color})`,
              }}
            />
          );
        })}

        {/* Labels */}
        {labelPositions.map(({ label, x, y, value }) => (
          <g key={label}>
            <text
              x={x}
              y={y - 6}
              textAnchor="middle"
              className="fill-text-secondary text-[9px]"
              style={{ fontFamily: 'var(--font-stats)' }}
            >
              {label.toUpperCase()}
            </text>
            <text
              x={x}
              y={y + 8}
              textAnchor="middle"
              className="text-[11px] font-bold"
              fill={color.color}
              style={{ fontFamily: 'var(--font-stats)' }}
            >
              {value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
