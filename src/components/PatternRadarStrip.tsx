import React, { useState } from 'react';
import { PatternMatch, SizeType } from '../types';
import { getBallSize } from '../data/seedData';
import { Sparkles, Info, ShieldCheck, AlertTriangle, ChevronRight, X } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface PatternRadarStripProps {
  recentNumbers: number[];
  activePatterns: PatternMatch[];
  currentStreak: number;
  currentSize: SizeType;
  previousStreak: number;
}

interface PatternMeta {
  id: string;
  name: string;
  shortCode: string;
  icon: string;
  type: 'SAFE' | 'TRAP';
  description: string;
  transferRule: string;
  winRate: string;
}

const ALL_PATTERNS_CATALOG: PatternMeta[] = [
  {
    id: 'zigzag',
    name: 'ZIGZAG (1:1) ALTERNATION',
    shortCode: '1:1 ZIG',
    icon: '⚡',
    type: 'SAFE',
    description: 'Alternating sequence between BIG and SMALL (B-S-B-S).',
    transferRule: 'Current is B -> Transfer to S | Current is S -> Transfer to B',
    winRate: '95% - 98%',
  },
  {
    id: 'twins',
    name: 'TWINS (2:2) PAIR RHYTHM',
    shortCode: '2:2 TWIN',
    icon: '♊',
    type: 'SAFE',
    description: 'Even pairs of two (BB - SS - BB - SS).',
    transferRule: '1 ball landed after pair -> Call SAME to complete pair | Pair complete -> FLIP to opposite',
    winRate: '94% - 97%',
  },
  {
    id: 'sbbs',
    name: 'SBB-S ARCH TRAP',
    shortCode: 'SBB-S',
    icon: '🎯',
    type: 'SAFE',
    description: 'Small followed by Two Bigs (S - B - B).',
    transferRule: 'S - B - B formation -> Rule demands SMALL to complete arch trap',
    winRate: '97% - 98%',
  },
  {
    id: 'bssb',
    name: 'BSS-B ARCH TRAP',
    shortCode: 'BSS-B',
    icon: '🎯',
    type: 'SAFE',
    description: 'Big followed by Two Smalls (B - S - S).',
    transferRule: 'B - S - S formation -> Rule demands BIG to complete arch trap',
    winRate: '97% - 98%',
  },
  {
    id: '121',
    name: '1:2:1 SANDWICH FORMATION',
    shortCode: '1:2:1',
    icon: '⏳',
    type: 'SAFE',
    description: 'One single, two opposite, one single (B - SS - B or S - BB - S).',
    transferRule: '1:2 in progress -> Calls first single outcome to complete sandwich',
    winRate: '95% - 97%',
  },
  {
    id: '212',
    name: '2:1:2 STEP RHYTHM',
    shortCode: '2:1:2',
    icon: '🥪',
    type: 'SAFE',
    description: 'Two first, one middle, two finish (BB - S - BB or SS - B - SS).',
    transferRule: '2:1:1 in progress -> Calls same outcome to complete 2nd pair',
    winRate: '96% - 97%',
  },
  {
    id: 'dragon_run',
    name: 'DRAGON MOMENTUM (4+ STREAK)',
    shortCode: 'DRAGON',
    icon: '🐉',
    type: 'SAFE',
    description: 'Unbroken run of 4 or more identical consecutive outcomes.',
    transferRule: 'Stay with the running side until genuine structural break',
    winRate: '93% - 99%',
  },
  {
    id: 'triple_inflection',
    name: '3-STREAK INFLECTION (BBB / SSS)',
    shortCode: '3-TRAP',
    icon: '🔬',
    type: 'TRAP',
    description: 'Exactly 3 consecutive Bigs or Smalls at crucial crossroad.',
    transferRule: '1000-scan dominant side predicted, but volatile crossroad: SKIP ADVISORY',
    winRate: '56% / 44% Volatile',
  },
  {
    id: 'interrupted_dragon',
    name: 'INTERRUPTED DRAGON (PULLBACK)',
    shortCode: 'DRG-BREAK',
    icon: '⚡',
    type: 'TRAP',
    description: 'Dragon of 3+ snapped by 1 single opposite ball (Pullback trap).',
    transferRule: '1000 scan dominant side predicted, but fake break risk: SKIP ADVISORY',
    winRate: 'High Variance Node',
  },
];

export const PatternRadarStrip: React.FC<PatternRadarStripProps> = ({
  recentNumbers,
  activePatterns,
  currentStreak,
  currentSize,
  previousStreak,
}) => {
  const [selectedPattern, setSelectedPattern] = useState<PatternMeta | null>(null);

  const sizes = recentNumbers.map(getBallSize);

  // Determine which patterns are actively firing or forming
  function getPatternState(p: PatternMeta): 'ACTIVE' | 'FORMING' | 'IDLE' {
    if (p.id === 'triple_inflection' && currentStreak === 3) return 'ACTIVE';
    if (p.id === 'interrupted_dragon' && previousStreak >= 3 && currentStreak === 1) return 'ACTIVE';
    if (p.id === 'dragon_run' && currentStreak >= 4) return 'ACTIVE';

    if (p.id === 'sbbs') {
      if (sizes.length >= 3 && sizes[0] === 'BIG' && sizes[1] === 'BIG' && sizes[2] === 'SMALL') return 'ACTIVE';
      if (sizes.length >= 2 && sizes[0] === 'BIG' && sizes[1] === 'SMALL') return 'FORMING';
    }
    if (p.id === 'bssb') {
      if (sizes.length >= 3 && sizes[0] === 'SMALL' && sizes[1] === 'SMALL' && sizes[2] === 'BIG') return 'ACTIVE';
      if (sizes.length >= 2 && sizes[0] === 'SMALL' && sizes[1] === 'BIG') return 'FORMING';
    }
    if (p.id === 'zigzag') {
      let alt = 0;
      for (let i = 0; i < Math.min(sizes.length - 1, 6); i++) {
        if (sizes[i] !== sizes[i + 1]) alt++;
        else break;
      }
      if (alt >= 2 && currentStreak === 1) return 'ACTIVE';
      if (alt === 1 && currentStreak === 1) return 'FORMING';
    }
    if (p.id === 'twins') {
      if (activePatterns.some(m => m.name.includes('TWIN (2:2)'))) return 'ACTIVE';
    }
    if (p.id === '121') {
      if (activePatterns.some(m => m.name.includes('1:2:1'))) return 'ACTIVE';
    }
    if (p.id === '212') {
      if (activePatterns.some(m => m.name.includes('2:1:2'))) return 'ACTIVE';
    }

    return 'IDLE';
  }

  return (
    <div className="relative rounded-3xl p-3.5 bg-gradient-to-b from-[#0c1424] to-[#060a14] border border-cyan-500/30 shadow-lg overflow-hidden">
      {/* Animated Radar Laser Beam */}
      <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none animate-laserSweep opacity-60" />

      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-['Orbitron'] font-black text-xs text-white tracking-wider flex items-center gap-1">
            <span>PATTERN TRANSFER MATRIX</span>
            <Sparkles className="w-3 h-3 text-cyan-300" />
          </span>
        </div>
        <span className="text-[9px] font-['Orbitron'] font-bold text-cyan-300/80 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
          TAP PATTERN FOR RULE
        </span>
      </div>

      {/* Horizontal Scrollable Pattern Radar Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {ALL_PATTERNS_CATALOG.map((pat) => {
          const state = getPatternState(pat);
          const isTrap = pat.type === 'TRAP';

          let stateClasses = 'bg-slate-900/70 border-slate-800 text-slate-400 opacity-60';
          if (state === 'ACTIVE') {
            stateClasses = isTrap
              ? 'bg-rose-950/90 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.5)] animate-pulse opacity-100'
              : 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse opacity-100';
          } else if (state === 'FORMING') {
            stateClasses = 'bg-amber-950/80 border-amber-500/70 text-amber-300 opacity-90';
          }

          return (
            <button
              key={pat.id}
              onClick={() => {
                playClickSound();
                setSelectedPattern(pat);
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-['Orbitron'] font-bold flex items-center gap-1.5 flex-shrink-0 transition-all cursor-pointer hover:opacity-100 hover:scale-102 ${stateClasses}`}
            >
              <span>{pat.icon}</span>
              <span>{pat.shortCode}</span>
              {state === 'ACTIVE' && (
                <span
                  className={`text-[8px] px-1 py-0.2 rounded font-black ${
                    isTrap ? 'bg-rose-600 text-white' : 'bg-emerald-500 text-black'
                  }`}
                >
                  LIVE
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Pattern Rule Modal */}
      {selectedPattern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl p-5 bg-gradient-to-b from-[#0f172a] via-[#090e1c] to-[#050813] border-2 border-cyan-500/60 shadow-[0_0_40px_rgba(0,229,255,0.3)] relative">
            <button
              onClick={() => {
                playClickSound();
                setSelectedPattern(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{selectedPattern.icon}</span>
              <div>
                <h3 className="font-['Orbitron'] font-black text-sm text-white">
                  {selectedPattern.name}
                </h3>
                <span
                  className={`text-[9px] font-['Orbitron'] font-black px-2 py-0.5 rounded-full inline-block mt-0.5 uppercase ${
                    selectedPattern.type === 'SAFE'
                      ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-300'
                      : 'bg-rose-950 border border-rose-500/60 text-rose-300'
                  }`}
                >
                  {selectedPattern.type === 'SAFE' ? '🎯 NORMAL PATTERN (PLAY)' : '⚠️ TRAP NODE (SKIP)'}
                </span>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-['Orbitron'] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  PATTERN MECHANIC:
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {selectedPattern.description}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/40">
                <span className="text-[10px] font-['Orbitron'] font-bold text-cyan-400 block mb-1 uppercase tracking-wider">
                  EXACT TRANSFER RULE:
                </span>
                <p className="text-cyan-200 leading-relaxed font-semibold">
                  {selectedPattern.transferRule}
                </p>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 font-bold">1000-Period Win Conviction:</span>
                <span className="font-['Orbitron'] font-black text-amber-400">
                  {selectedPattern.winRate}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                setSelectedPattern(null);
              }}
              className="w-full mt-4 py-2.5 rounded-xl font-['Orbitron'] font-bold text-xs uppercase bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white cursor-pointer"
            >
              GOT IT · CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
