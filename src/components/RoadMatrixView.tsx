import React, { useState } from 'react';
import { SizeType } from '../types';
import { getBallColor, getBallSize } from '../data/seedData';
import { Flame, Activity, Sparkles, Eye, Compass, Layers } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface RoadMatrixViewProps {
  recentNumbers: number[];
  currentPeriod?: string;
}

export const RoadMatrixView: React.FC<RoadMatrixViewProps> = ({ recentNumbers }) => {
  const [viewMode, setViewMode] = useState<'road' | 'bead'>('road');

  // Convert recent numbers into Chronological order (oldest to newest)
  // so the road flows naturally from left to right
  const chronoNumbers = [...recentNumbers].reverse();

  // Statistics calculation
  const total = chronoNumbers.length;
  const bigCount = chronoNumbers.filter((n) => getBallSize(n) === 'BIG').length;
  const smallCount = total - bigCount;
  const bigPct = total > 0 ? Math.round((bigCount / total) * 100) : 50;
  const smallPct = 100 - bigPct;

  const oddCount = chronoNumbers.filter((n) => n % 2 !== 0).length;
  const evenCount = total - oddCount;

  // Compute Dragon Road columns (Streak Columns)
  // Each column contains consecutive same-size outcomes (up to 6 rows).
  // If streak exceeds 6, it turns right (dragon tail)
  interface RoadCell {
    size: SizeType;
    number: number;
    isDragonTail?: boolean;
  }

  const columns: (RoadCell | null)[][] = [];
  let currentCol: (RoadCell | null)[] = [];
  let lastSize: SizeType | null = null;

  chronoNumbers.forEach((num) => {
    const size = getBallSize(num);
    if (size !== lastSize) {
      if (currentCol.length > 0) {
        // Pad column to 6 rows
        while (currentCol.length < 6) currentCol.push(null);
        columns.push(currentCol);
      }
      currentCol = [{ size, number: num }];
      lastSize = size;
    } else {
      if (currentCol.length < 6) {
        currentCol.push({ size, number: num });
      } else {
        // Dragon tail (streak > 6): start a new column for the tail
        while (currentCol.length < 6) currentCol.push(null);
        columns.push(currentCol);
        currentCol = [{ size, number: num, isDragonTail: true }];
      }
    }
  });

  if (currentCol.length > 0) {
    while (currentCol.length < 6) currentCol.push(null);
    columns.push(currentCol);
  }

  // Keep latest 14 columns for viewport clarity
  const displayColumns = columns.slice(-14);

  // Compute 6x8 Bead Plate (珠盘路) - Grid of latest 48 balls
  const beadGrid: (number | null)[] = chronoNumbers.slice(-48);
  while (beadGrid.length < 48) beadGrid.unshift(null);

  // Current streak
  let activeStreak = 1;
  const latestSize = getBallSize(recentNumbers[0]);
  for (let i = 1; i < recentNumbers.length; i++) {
    if (getBallSize(recentNumbers[i]) === latestSize) activeStreak++;
    else break;
  }

  return (
    <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#0f172a] via-[#0a1120] to-[#060a14] border border-cyan-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.6)] space-y-4">
      {/* Header bar with Mode Selector */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          <div>
            <span className="font-['Orbitron'] font-black text-xs text-white tracking-wider block">
              DRAGON ROAD MATRIX
            </span>
            <span className="text-[9px] text-slate-400 font-bold">
              ASIAN CASINO BIG-SMALL MOMENTUM GRAPH
            </span>
          </div>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              playClickSound();
              setViewMode('road');
            }}
            className={`px-2.5 py-1 text-[10px] font-['Orbitron'] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'road'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>ROAD</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setViewMode('bead');
            }}
            className={`px-2.5 py-1 text-[10px] font-['Orbitron'] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'bead'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>BEADS</span>
          </button>
        </div>
      </div>

      {/* Live Road Stats Strip */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/80">
          <span className="text-[9px] font-bold text-slate-400 block">BIG / SMALL</span>
          <span className="font-['Orbitron'] font-black text-xs text-white">
            <span className="text-rose-400">{bigCount}B</span> · <span className="text-cyan-400">{smallCount}S</span>
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/80">
          <span className="text-[9px] font-bold text-slate-400 block">ODD / EVEN</span>
          <span className="font-['Orbitron'] font-black text-xs text-white">
            {oddCount} / {evenCount}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/80">
          <span className="text-[9px] font-bold text-slate-400 block">CURRENT STREAK</span>
          <span className="font-['Orbitron'] font-black text-xs text-amber-400 flex items-center justify-center gap-0.5">
            {activeStreak >= 3 && <Flame className="w-3 h-3 text-rose-500 animate-pulse" />}
            <span>{latestSize} ×{activeStreak}</span>
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/80">
          <span className="text-[9px] font-bold text-slate-400 block">DOMINANCE</span>
          <span className={`font-['Orbitron'] font-black text-xs ${bigPct >= 50 ? 'text-rose-400' : 'text-cyan-400'}`}>
            {bigPct >= 50 ? `${bigPct}% BIG` : `${smallPct}% SMALL`}
          </span>
        </div>
      </div>

      {/* MATRIX VIEW CONTAINER */}
      {viewMode === 'road' ? (
        /* Dragon Road (大路) Columns View */
        <div className="p-3 rounded-2xl bg-[#070c18] border border-cyan-500/30 overflow-x-auto shadow-inner">
          <div className="min-w-[280px] flex gap-1.5 justify-end">
            {displayColumns.map((col, cIdx) => (
              <div key={cIdx} className="flex flex-col gap-1.5 flex-shrink-0">
                {col.map((cell, rIdx) => {
                  if (!cell) {
                    return (
                      <div
                        key={rIdx}
                        className="w-6 h-6 rounded-md bg-slate-900/40 border border-slate-800/50 flex items-center justify-center text-[9px] text-slate-800 font-bold"
                      >
                        ·
                      </div>
                    );
                  }

                  const isBig = cell.size === 'BIG';
                  const color = getBallColor(cell.number);

                  return (
                    <div
                      key={rIdx}
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-['Orbitron'] font-black text-[10px] text-white shadow-sm transition-transform hover:scale-110 relative ${
                        isBig
                          ? 'bg-gradient-to-br from-rose-500 to-rose-700 border border-rose-400/80 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                          : 'bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-400/80 shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                      }`}
                      title={`Round Ball: ${cell.number} (${cell.size} · ${color})`}
                    >
                      <span>{isBig ? 'B' : 'S'}</span>
                      {/* Mini color dot for lottery color parity */}
                      <span
                        className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${
                          color === 'GREEN'
                            ? 'bg-emerald-400'
                            : color === 'VIOLET'
                            ? 'bg-purple-400'
                            : 'bg-rose-400'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[9px] text-slate-400 font-bold px-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-rose-500" />
              <span>B = BIG (5-9)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-cyan-500" />
              <span>S = SMALL (0-4)</span>
            </span>
            <span className="text-slate-500">
              Columns turn right on Dragon streaks (Streak &gt; 6)
            </span>
          </div>
        </div>
      ) : (
        /* Bead Plate (珠盘路) Grid View */
        <div className="p-3 rounded-2xl bg-[#070c18] border border-cyan-500/30 overflow-x-auto shadow-inner">
          <div className="grid grid-flow-col grid-rows-6 gap-1.5 min-w-[280px]">
            {beadGrid.map((num, idx) => {
              if (num === null) {
                return (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full bg-slate-900/40 border border-slate-800/40 flex items-center justify-center text-[9px] text-slate-800"
                  >
                    ·
                  </div>
                );
              }

              const isBig = getBallSize(num) === 'BIG';
              const color = getBallColor(num);

              return (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-['Orbitron'] font-black text-[10px] text-white shadow-sm transition-transform hover:scale-110 relative ${
                    isBig
                      ? 'bg-gradient-to-br from-rose-500 to-rose-700 border border-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                      : 'bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-300 shadow-[0_0_8px_rgba(0,229,255,0.3)]'
                  }`}
                  title={`Ball ${num} (${isBig ? 'BIG' : 'SMALL'})`}
                >
                  <span>{num}</span>
                  {/* Color dot */}
                  <span
                    className={`absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full ${
                      color === 'GREEN'
                        ? 'bg-emerald-400'
                        : color === 'VIOLET'
                        ? 'bg-purple-400'
                        : 'bg-rose-400'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[9px] text-slate-400 font-bold px-1">
            <span>6×8 Chronological Bead Plate</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Green</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Red</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Violet (0,5)</span>
            </span>
          </div>
        </div>
      )}

      {/* Pattern Momentum Summary Indicator */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-rose-950/40 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-medium text-[11px]">
            {activeStreak >= 4
              ? `🔥 Extended Dragon Road active on ${latestSize}! Trend suggests staying with momentum.`
              : activeStreak === 3
              ? `⚠️ 3-Streak crossroad on ${latestSize}. Check 1000-period scan before playing.`
              : `⚡ Alternating rhythm active. Fast transition road.`}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/40 text-[9px] font-['Orbitron'] font-black text-cyan-300 flex-shrink-0">
          {total} ROUNDS
        </span>
      </div>
    </div>
  );
};
