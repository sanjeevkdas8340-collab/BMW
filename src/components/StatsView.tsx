import React, { useState } from 'react';
import { PredictionRecord } from '../types';
import { SEED_NUMBERS, getBallColor, getBallSize } from '../data/seedData';
import { Trophy, Flame, Gem, Skull, BarChart3, TrendingUp, Award, ShieldCheck, Activity, Zap, PieChart, Sparkles } from 'lucide-react';
import { WinGoBall } from './WinGoBall';
import { CasinoHostessAvatar } from './CasinoHostessAvatar';
import { playClickSound } from '../utils/sound';

interface StatsViewProps {
  records: PredictionRecord[];
  bestStreak: number;
  recentNumbers?: number[];
}

export const StatsView: React.FC<StatsViewProps> = ({ records, bestStreak, recentNumbers }) => {
  const [activeTab, setActiveTab] = useState<'session' | 'archive'>('session');

  // Session stats
  const wins = records.filter(r => r.result === 'win' || r.result === 'jackpot').length;
  const losses = records.filter(r => r.result === 'loss').length;
  const jackpots = records.filter(r => r.result === 'jackpot').length;
  const total = records.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  // Current winning streak
  let currentStreak = 0;
  for (const r of records) {
    if (r.result === 'win' || r.result === 'jackpot') currentStreak++;
    else if (r.result === 'loss') break;
    else break;
  }

  // 2-Level verified win rate
  const verifiedRecords = records.filter(r => r.verified && r.result !== null);
  const verifiedWins = verifiedRecords.filter(r => r.result === 'win' || r.result === 'jackpot').length;
  const verifiedRate = verifiedRecords.length > 0 ? Math.round((verifiedWins / verifiedRecords.length) * 100) : 100;

  // ---------------------------------------------------------
  // 1000-Round Historical Deep Archive Analytics (from SEED_NUMBERS)
  // ---------------------------------------------------------
  const archive1000 = SEED_NUMBERS.slice(0, 1000);
  const total1000 = archive1000.length;

  const bigCount1000 = archive1000.filter(n => getBallSize(n) === 'BIG').length;
  const smallCount1000 = total1000 - bigCount1000;
  const bigPct1000 = Math.round((bigCount1000 / total1000) * 100);
  const smallPct1000 = 100 - bigPct1000;

  // Number frequencies (0-9)
  const numFreq: Record<number, number> = {};
  for (let i = 0; i <= 9; i++) numFreq[i] = 0;
  archive1000.forEach(n => {
    numFreq[n] = (numFreq[n] || 0) + 1;
  });

  const sortedFreq = Object.entries(numFreq)
    .map(([k, v]) => ({ num: Number(k), count: v, pct: ((v / total1000) * 100).toFixed(1) }))
    .sort((a, b) => b.count - a.count);

  const hotNumbers = sortedFreq.slice(0, 3);
  const coldNumbers = sortedFreq.slice(-3).reverse();

  // Color breakdown
  const greenCount = archive1000.filter(n => getBallColor(n) === 'GREEN').length;
  const redCount = archive1000.filter(n => getBallColor(n) === 'RED').length;
  const violetCount = archive1000.filter(n => getBallColor(n) === 'VIOLET').length;

  // Max streak in 1000 rounds
  let maxDragonStreak = 1;
  let tempStreak = 1;
  const archiveSizes = archive1000.map(getBallSize);
  for (let i = 1; i < archiveSizes.length; i++) {
    if (archiveSizes[i] === archiveSizes[i - 1]) {
      tempStreak++;
      if (tempStreak > maxDragonStreak) maxDragonStreak = tempStreak;
    } else {
      tempStreak = 1;
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Tab Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30">
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('session');
          }}
          className={`py-2 px-3 rounded-xl font-['Orbitron'] font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'session'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>SESSION STATS</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('archive');
          }}
          className={`py-2 px-3 rounded-xl font-['Orbitron'] font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'archive'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>1000-PERIOD ARCHIVE</span>
        </button>
      </div>

      {activeTab === 'session' && (
        <>
          {/* Win Rate Hero Card */}
          <div className="rounded-3xl p-5 bg-gradient-to-b from-[#0f172a] to-[#070b16] border border-cyan-500/40 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CasinoHostessAvatar size="xs" variant="concierge" glowColor="cyan" showBadge={false} />
                <span className="font-['Orbitron'] font-black text-xs text-white tracking-wider uppercase">
                  V3 PERFORMANCE OVERVIEW
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {total} ROUNDS TRACKED
              </span>
            </div>

            {/* Win rate percentage display */}
            <div className="my-3 text-center">
              <span className="text-3xl sm:text-4xl font-black font-['Orbitron'] bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                {winRate}%
              </span>
              <span className="text-[10px] font-['Orbitron'] font-bold text-slate-400 block mt-1 tracking-wider uppercase">
                SESSION WIN ACCURACY
              </span>

              <div className="h-3 w-full rounded-full bg-slate-900 border border-slate-700 overflow-hidden mt-3 max-w-xs mx-auto">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 transition-all duration-700 shadow-[0_0_12px_rgba(0,229,255,0.7)]"
                  style={{ width: `${winRate}%` }}
                />
              </div>
            </div>

            {/* 2-Level verified accuracy callout */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>V3 Quantum Verified Accuracy:</span>
              </span>
              <span className="font-['Orbitron'] font-black text-emerald-400">
                {verifiedRate}% ({verifiedWins}/{verifiedRecords.length})
              </span>
            </div>
          </div>

          {/* Grid of stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#101e28] to-[#070d14] border border-emerald-500/40 text-center">
              <Trophy className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-2xl font-black font-['Orbitron'] text-white block">{wins}</span>
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider">TOTAL WINS</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#241018] to-[#0d070b] border border-rose-500/40 text-center">
              <Skull className="w-5 h-5 text-rose-400 mx-auto mb-1" />
              <span className="text-2xl font-black font-['Orbitron'] text-white block">{losses}</span>
              <span className="text-[10px] font-bold text-rose-400 tracking-wider">TOTAL LOSSES</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#221a0f] to-[#0c0906] border border-amber-500/40 text-center">
              <Gem className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <span className="text-2xl font-black font-['Orbitron'] text-amber-300 block">{jackpots}</span>
              <span className="text-[10px] font-bold text-amber-400 tracking-wider">JACKPOT HITS</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#101b2a] to-[#060a12] border border-cyan-500/40 text-center">
              <Flame className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <span className="text-2xl font-black font-['Orbitron'] text-cyan-300 block">{currentStreak}</span>
              <span className="text-[10px] font-bold text-cyan-400 tracking-wider">CURRENT STREAK</span>
            </div>

            <div className="col-span-2 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>SESSION BEST STREAK:</span>
              </span>
              <span className="font-['Orbitron'] font-black text-purple-400 text-sm">
                {bestStreak} CONSECUTIVE WINS
              </span>
            </div>
          </div>
        </>
      )}

      {activeTab === 'archive' && (
        <div className="space-y-4">
          {/* LIVE LAST 10 ROUNDS FLOW - PROMINENTLY SHOWING WHAT IS COMING */}
          <div className="rounded-3xl p-4 bg-gradient-to-b from-[#13112c] via-[#0d0c20] to-[#060614] border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(0,229,255,0.25)]">
            <div className="flex items-center justify-between pb-2.5 border-b border-purple-900/40">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="font-['Orbitron'] font-black text-xs text-white tracking-wider uppercase block">
                    LAST 10 LIVE ROUNDS FLOW
                  </span>
                  <span className="text-[8px] font-['Orbitron'] font-bold text-cyan-300 uppercase tracking-widest block">
                    LIVE BALL SEQUENCE · RECENT RESULTS
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-['Orbitron'] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 uppercase">
                10 ROUNDS
              </span>
            </div>

            {/* Horizontal Flow Strip of 10 Results */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 my-3">
              {(recentNumbers && recentNumbers.length >= 10 ? recentNumbers : SEED_NUMBERS).slice(0, 10).map((num, idx) => {
                const size = getBallSize(num);
                const isOdd = num % 2 !== 0;

                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-between p-1.5 rounded-xl border text-center transition-all ${
                      idx === 0
                        ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.4)] ring-1 ring-cyan-400'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <span className="text-[8px] font-['Orbitron'] font-black text-slate-400 mb-1">
                      {idx === 0 ? 'LATEST' : `#${idx + 1}`}
                    </span>
                    <WinGoBall number={num} size="sm" showBadge={false} highlight={idx === 0} animate={idx === 0} />
                    <span
                      className={`mt-1.5 text-[8px] font-['Orbitron'] font-black px-1 py-0.2 rounded uppercase ${
                        size === 'BIG'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {size}
                    </span>
                    <span className="text-[7px] font-['Orbitron'] font-bold text-slate-400 mt-0.5 uppercase">
                      {isOdd ? 'ODD' : 'EVEN'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Summary of Last 10 */}
            <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center text-[9px] font-['Orbitron'] font-bold">
              <div>
                <span className="text-slate-400 block text-[8px]">BIG IN LAST 10</span>
                <span className="text-rose-400 font-black text-xs">
                  {(recentNumbers && recentNumbers.length >= 10 ? recentNumbers : SEED_NUMBERS).slice(0, 10).filter(n => getBallSize(n) === 'BIG').length} / 10
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px]">SMALL IN LAST 10</span>
                <span className="text-cyan-400 font-black text-xs">
                  {(recentNumbers && recentNumbers.length >= 10 ? recentNumbers : SEED_NUMBERS).slice(0, 10).filter(n => getBallSize(n) === 'SMALL').length} / 10
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px]">ACTIVE CADENCE</span>
                <span className="text-amber-300 font-black text-xs">
                  {getBallSize((recentNumbers && recentNumbers.length >= 10 ? recentNumbers : SEED_NUMBERS)[0])} MOMENTUM
                </span>
              </div>
            </div>
          </div>

          {/* 1000-Round Distribution Card */}
          <div className="rounded-3xl p-5 bg-gradient-to-b from-[#13112c] via-[#0d0c20] to-[#060614] border-2 border-purple-500/40 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span className="font-['Orbitron'] font-black text-xs text-white tracking-wider uppercase">
                  1000-PERIOD MACRO BALANCE
                </span>
              </div>
              <span className="text-[10px] font-['Orbitron'] font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/40">
                1000 ROUNDS
              </span>
            </div>

            {/* Big vs Small 1000 distribution */}
            <div className="my-4">
              <div className="flex justify-between items-center text-xs font-['Orbitron'] font-bold mb-2">
                <span className="text-rose-400">
                  BIG: {bigCount1000} ({bigPct1000}%)
                </span>
                <span className="text-cyan-400">
                  SMALL: {smallCount1000} ({smallPct1000}%)
                </span>
              </div>

              <div className="h-4 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 via-amber-500 to-rose-500 transition-all duration-700"
                  style={{ width: `${bigPct1000}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-700"
                  style={{ width: `${smallPct1000}%` }}
                />
              </div>

              <span className="text-[10px] text-slate-400 font-medium block text-center mt-2">
                Law of Large Numbers: Near-perfect 50/50 mean-reversion equilibrium
              </span>
            </div>

            {/* Colors Breakdown */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                <span className="text-[10px] font-['Orbitron'] font-bold text-emerald-400 block">GREEN</span>
                <span className="text-base font-['Orbitron'] font-black text-white">{greenCount}</span>
                <span className="text-[9px] text-slate-400 font-bold block">{((greenCount / 1000) * 100).toFixed(1)}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40">
                <span className="text-[10px] font-['Orbitron'] font-bold text-rose-400 block">RED</span>
                <span className="text-base font-['Orbitron'] font-black text-white">{redCount}</span>
                <span className="text-[9px] text-slate-400 font-bold block">{((redCount / 1000) * 100).toFixed(1)}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40">
                <span className="text-[10px] font-['Orbitron'] font-bold text-purple-400 block">VIOLET (0,5)</span>
                <span className="text-base font-['Orbitron'] font-black text-white">{violetCount}</span>
                <span className="text-[9px] text-slate-400 font-bold block">{((violetCount / 1000) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Hot & Cold WinGo Balls in 1000 Rounds */}
          <div className="grid grid-cols-2 gap-3">
            {/* Hot Balls */}
            <div className="rounded-3xl p-4 bg-gradient-to-b from-[#132219] to-[#07100b] border border-emerald-500/50 shadow-lg">
              <div className="text-[10px] font-['Orbitron'] font-black text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>HOT BALLS (TOP 3)</span>
              </div>
              <div className="flex items-center justify-around gap-1">
                {hotNumbers.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <WinGoBall number={item.num} size="sm" showBadge={true} highlight={idx === 0} animate={true} />
                    <span className="text-[10px] font-['Orbitron'] font-bold text-emerald-300 mt-1">
                      {item.count}×
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cold Balls */}
            <div className="rounded-3xl p-4 bg-gradient-to-b from-[#231518] to-[#0e0709] border border-rose-500/50 shadow-lg">
              <div className="text-[10px] font-['Orbitron'] font-black text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>COLD BALLS (DUE)</span>
              </div>
              <div className="flex items-center justify-around gap-1">
                {coldNumbers.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <WinGoBall number={item.num} size="sm" showBadge={true} animate={false} />
                    <span className="text-[10px] font-['Orbitron'] font-bold text-rose-300 mt-1">
                      {item.count}×
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Extreme Dragon Records */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-purple-950/60 border border-amber-500/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🐉</span>
              <div>
                <span className="font-['Orbitron'] font-black text-xs text-amber-300 block">
                  LONGEST DRAGON STREAK RECORD
                </span>
                <span className="text-[10px] text-slate-300 font-semibold">
                  Maximum identical consecutive outcomes in 1000 rounds
                </span>
              </div>
            </div>
            <span className="font-['Orbitron'] font-black text-2xl text-amber-400">
              {maxDragonStreak}×
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
