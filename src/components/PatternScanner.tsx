import React from 'react';
import { PatternMatch, HistoricalBacktestResult } from '../types';
import { WinGoBall } from './WinGoBall';
import { Radar, History, Activity, Sparkles, Flame, Award, Zap, ShieldCheck } from 'lucide-react';

interface PatternScannerProps {
  recentNumbers: number[];
  patterns: PatternMatch[];
  backtest: HistoricalBacktestResult | null;
}

export const PatternScanner: React.FC<PatternScannerProps> = ({
  recentNumbers,
  patterns,
  backtest,
}) => {
  const last12 = recentNumbers.slice(0, 12).reverse();
  const topPattern = patterns.length ? patterns[0] : null;
  const isDragonPattern = topPattern?.category === 'dragon';

  return (
    <div className="space-y-4">
      {/* 1. Live Pattern Detection Card */}
      <div className="rounded-3xl p-5 bg-gradient-to-b from-[#0f172a] via-[#0a101f] to-[#060a14] border border-cyan-500/40 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-['Orbitron'] font-black text-xs text-white tracking-wider uppercase">
              REAL-TIME DRAGON & PATTERN SCANNER
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 border border-cyan-500/50 text-cyan-300">
            {patterns.length} ACTIVE PATTERNS
          </span>
        </div>

        {/* Top Active Pattern Banner (Dragon Continuation vs Break Scanner) */}
        {topPattern ? (
          <div
            className={`mt-3.5 p-4 rounded-2xl border transition-all ${
              isDragonPattern
                ? 'bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-cyan-950/70 border-amber-400/70 shadow-[0_0_20px_rgba(255,183,3,0.3)] animate-dragonPulse'
                : 'bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-rose-950/60 border-cyan-500/50 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-['Orbitron'] font-black text-xs text-cyan-300 flex items-center gap-1.5">
                <span className="text-lg">{topPattern.icon}</span>
                <span className="text-white">{topPattern.name}</span>
              </span>
              <span className="font-['Orbitron'] font-black text-xs text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{topPattern.strength}% MATCH</span>
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1.5 font-medium leading-relaxed">
              {topPattern.detail}
            </p>
          </div>
        ) : (
          <div className="mt-3 text-xs text-slate-400 text-center py-2">
            Scanning 1000-period dataset for active formations...
          </div>
        )}

        {/* Other Active Pattern Chips */}
        <div className="flex flex-wrap gap-2 mt-3.5">
          {patterns.slice(1, 8).map((p, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl text-[10px] font-['Orbitron'] font-bold tracking-wide bg-slate-900/80 border border-slate-700/80 text-slate-300 flex items-center gap-1"
            >
              <span>{p.icon}</span>
              <span>{p.name.split('(')[0]}</span>
              <span className="text-cyan-400 font-extrabold">{p.strength}%</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. 1000-Result Deep Pattern Backtest Analysis */}
      <div className="rounded-3xl p-5 bg-gradient-to-b from-[#11192e] via-[#0b1020] to-[#060a14] border-2 border-indigo-500/40 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="font-['Orbitron'] font-black text-xs text-white tracking-wider uppercase">
              1000-PERIOD PATTERN BACKTEST
            </span>
          </div>
          <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-500/40 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            <span>1000 ARCHIVE</span>
          </span>
        </div>

        {backtest ? (
          <div className="mt-3.5 space-y-3.5">
            <div className="text-xs text-slate-300">
              Pattern sequence <span className="font-['Orbitron'] font-bold text-cyan-300">[{backtest.signature}]</span> occurred{' '}
              <strong className="text-amber-400 font-['Orbitron']">{backtest.occurrences} times</strong> in the last 1000 rounds.
            </div>

            {/* Outcome probability gauge: What came next in 1000 rounds? */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-['Orbitron'] font-bold mb-2">
                <span className="text-rose-400 flex items-center gap-1">
                  <span>BIG: {backtest.bigPct}%</span>
                  <span className="text-slate-500">({backtest.bigCount}×)</span>
                </span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <span>SMALL: {backtest.smallPct}%</span>
                  <span className="text-slate-500">({backtest.smallCount}×)</span>
                </span>
              </div>

              {/* Dual Bar */}
              <div className="h-3 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-500"
                  style={{ width: `${backtest.bigPct}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${backtest.smallPct}%` }}
                />
              </div>

              <div className="text-[10px] font-semibold text-center text-slate-300 mt-2">
                Historical Follower in 1000 Periods:{' '}
                <span className="font-['Orbitron'] font-black text-amber-300 text-xs">
                  {backtest.dominantSize} ({Math.max(backtest.bigPct, backtest.smallPct)}%)
                </span>
              </div>
            </div>

            {/* Top 3 Following Numbers rendered as Casino WinGo Balls */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] font-['Orbitron'] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>TOP WINNING BALLS AFTER THIS PATTERN (1000 PERIODS)</span>
              </div>

              <div className="flex items-center justify-around gap-2">
                {backtest.topNumbers.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <WinGoBall number={item.num} size="md" showBadge={true} highlight={idx === 0} animate={true} />
                    <span className="text-[10px] font-bold text-slate-300 font-['Orbitron'] mt-1.5">
                      {item.count}× ({item.pct}%)
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold">
                      #{idx + 1} Most Frequent
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 text-xs text-slate-400 text-center py-4">
            Scanning 1000-result archive for live sequence matching...
          </div>
        )}
      </div>

      {/* 3. Live 12-Round Ball Streak (All Casino WinGo Balls) */}
      <div className="rounded-3xl p-5 bg-gradient-to-b from-[#0f172a] to-[#070b16] border border-cyan-500/40 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="font-['Orbitron'] font-black text-xs text-white tracking-wider uppercase">
              RECENT ROUNDS CASINO BALLS
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">LAST 12 ROUNDS</span>
        </div>

        <div className="flex items-center justify-between gap-1 overflow-x-auto py-3 px-1">
          {last12.map((num, idx) => (
            <div key={idx} className="flex flex-col items-center flex-shrink-0">
              <WinGoBall number={num} size="sm" showBadge={true} animate={true} />
              <span className="text-[8px] font-['Orbitron'] text-slate-500 mt-1">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
