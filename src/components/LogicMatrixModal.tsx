import React, { useState, useMemo } from 'react';
import { LogicCategory, LogicConsensusSummary, LogicRuleResult } from '../types';
import { X, Search, Cpu, ShieldCheck, Flame, Zap, BarChart2, Filter, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface LogicMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  consensus: LogicConsensusSummary;
  currentPeriod: string;
}

const CATEGORY_LABELS: { key: 'ALL' | LogicCategory; label: string; icon: string }[] = [
  { key: 'ALL', label: 'ALL LOGICS (225)', icon: '⚡' },
  { key: 'PATTERN', label: 'PATTERNS (40)', icon: '🎯' },
  { key: 'OSCILLATOR', label: 'OSCILLATORS (30)', icon: '📊' },
  { key: 'TREND_MA', label: 'MOVING AVGS (25)', icon: '📈' },
  { key: 'HARMONIC_PARITY', label: 'HARMONICS & SUM (30)', icon: '⚖️' },
  { key: 'COLOR_VIOLET', label: 'COLOR & VIOLET (30)', icon: '🟣' },
  { key: 'MARKOV_BAYES', label: 'MARKOV & BAYES (30)', icon: '🔬' },
  { key: 'HISTORICAL_1000', label: '1000-ROUND DATA (25)', icon: '🏛️' },
  { key: 'ANTI_LOSS_ARMOR', label: 'ANTI-LOSS ARMOR (15)', icon: '🛡️' },
];

export const LogicMatrixModal: React.FC<LogicMatrixModalProps> = ({
  isOpen,
  onClose,
  consensus,
  currentPeriod,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | LogicCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogics = useMemo(() => {
    let list = consensus.allLogics || [];
    if (selectedCategory !== 'ALL') {
      list = list.filter((r) => r.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.code.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [consensus.allLogics, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const isBigConsensus = consensus.consensusSide === 'BIG';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#0b1324] via-[#070b16] to-[#04060c] border border-cyan-500/50 shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Orbitron'] font-black text-sm sm:text-base text-white tracking-wide">
                  220+ QUANTUM LOGIC ENGINE
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-['Orbitron'] font-black bg-emerald-950 border border-emerald-500/60 text-emerald-300">
                  {consensus.totalLogics} LOGICS LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-['Rajdhani'] font-medium">
                Period #{currentPeriod} · Multi-Model Consensus & Minimum-Loss Defense Matrix
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Consensus Voting Dashboard */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-slate-950 via-[#0a1120] to-slate-950 border-b border-slate-800 shrink-0 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {/* Big Votes Card */}
            <div className={`p-2.5 rounded-2xl border text-center transition-all ${
              isBigConsensus
                ? 'bg-emerald-950/70 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="text-[9px] font-['Orbitron'] font-bold text-slate-400 uppercase">BIG VOTES</div>
              <div className="text-lg sm:text-xl font-['Orbitron'] font-black text-emerald-400 mt-0.5">
                {consensus.bigVotes}
              </div>
              <div className="text-[8px] font-bold text-emerald-300/80 uppercase">
                {Math.round((consensus.bigVotes / (consensus.totalLogics || 1)) * 100)}% WEIGHT
              </div>
            </div>

            {/* Dominant Consensus Card */}
            <div className="p-2.5 rounded-2xl border border-cyan-500/60 bg-gradient-to-b from-cyan-950/80 to-blue-950/80 text-center shadow-[0_0_20px_rgba(0,229,255,0.25)]">
              <div className="text-[9px] font-['Orbitron'] font-bold text-cyan-300 uppercase">DOMINANT WIN SIGNAL</div>
              <div className="text-xl sm:text-2xl font-['Orbitron'] font-black text-white mt-0.5 flex items-center justify-center gap-1">
                <span>{consensus.consensusSide}</span>
                <span className="text-xs text-amber-400">({consensus.consensusPct}%)</span>
              </div>
              <span className="px-2 py-0.2 rounded-full text-[8px] font-['Orbitron'] font-black bg-cyan-400 text-slate-950 uppercase inline-block">
                {consensus.strengthGrade}
              </span>
            </div>

            {/* Small Votes Card */}
            <div className={`p-2.5 rounded-2xl border text-center transition-all ${
              !isBigConsensus
                ? 'bg-rose-950/70 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="text-[9px] font-['Orbitron'] font-bold text-slate-400 uppercase">SMALL VOTES</div>
              <div className="text-lg sm:text-xl font-['Orbitron'] font-black text-rose-400 mt-0.5">
                {consensus.smallVotes}
              </div>
              <div className="text-[8px] font-bold text-rose-300/80 uppercase">
                {Math.round((consensus.smallVotes / (consensus.totalLogics || 1)) * 100)}% WEIGHT
              </div>
            </div>
          </div>

          {/* Voting Consensus Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-['Orbitron'] font-bold">
              <span className="text-emerald-400 flex items-center gap-1">
                <span>🟢 BIG: {consensus.bigVotes} LOGICS</span>
              </span>
              <span className="text-cyan-300 font-black">
                CONSENSUS DELTA: +{consensus.weightedMargin} PTS
              </span>
              <span className="text-rose-400 flex items-center gap-1">
                <span>🔴 SMALL: {consensus.smallVotes} LOGICS</span>
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                style={{ width: `${(consensus.bigVotes / (consensus.bigVotes + consensus.smallVotes || 1)) * 100}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-rose-700 transition-all duration-500"
                style={{ width: `${(consensus.smallVotes / (consensus.bigVotes + consensus.smallVotes || 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Capital Loss Shield Indicator */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px]">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Anti-Drawdown Armor (Kam Se Kam Loss):</span>
            </span>
            <span className="px-2 py-0.5 rounded-md font-['Orbitron'] font-black text-[9px] bg-emerald-950 border border-emerald-500/60 text-emerald-300">
              L1-L2 CAP ACTIVE (NO L4)
            </span>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 shrink-0 space-y-2">
          {/* Horizontal Scrollable Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
            {CATEGORY_LABELS.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  playClickSound();
                  setSelectedCategory(cat.key);
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-['Orbitron'] font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 220+ logics by code (e.g. L005), name (Zigzag, RSI, Violet), or rule..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500/80 text-xs text-slate-200 placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Scrollable Logic Rule Cards List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="text-[10px] font-['Orbitron'] text-slate-400 flex items-center justify-between pb-1">
            <span>SHOWING {filteredLogics.length} OF {consensus.totalLogics} LOGICS</span>
            <span className="text-cyan-400">SORTED BY QUANTUM WEIGHT</span>
          </div>

          {filteredLogics.map((rule) => {
            const isVoteBig = rule.vote === 'BIG';
            const isVoteSmall = rule.vote === 'SMALL';

            return (
              <div
                key={rule.id}
                className="p-3 rounded-2xl bg-gradient-to-r from-[#0c1424] to-[#070b16] border border-slate-800/90 hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                {/* Left info: Code, Name, Category, Reason */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-['Orbitron'] font-black bg-cyan-950 border border-cyan-500/60 text-cyan-300">
                      {rule.code}
                    </span>
                    <span className="font-['Orbitron'] font-bold text-xs text-white">
                      {rule.name}
                    </span>
                    <span className="text-[9px] font-['Orbitron'] text-slate-500 uppercase">
                      [{rule.category}]
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                    {rule.reason}
                  </p>
                </div>

                {/* Right info: Vote Badge, Confidence & Weight */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60">
                  <span
                    className={`px-3 py-1 rounded-xl text-[10px] font-['Orbitron'] font-black tracking-wider uppercase flex items-center gap-1 shadow-sm ${
                      isVoteBig
                        ? 'bg-emerald-950/90 border border-emerald-500 text-emerald-300'
                        : isVoteSmall
                        ? 'bg-rose-950/90 border border-rose-500 text-rose-300'
                        : 'bg-slate-900 border border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>VOTE:</span>
                    <span>{rule.vote}</span>
                  </span>

                  <div className="flex items-center gap-2 text-[9px] font-['Orbitron'] text-slate-400">
                    <span className="text-amber-400 font-bold">{rule.confidence}% ACC</span>
                    <span>·</span>
                    <span className="text-cyan-300 font-bold">{rule.weight}X WT</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/70 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>225 Algorithmic Logics Consensus Active</span>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl font-['Orbitron'] font-black text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer shadow-md"
          >
            CLOSE MATRIX
          </button>
        </div>
      </div>
    </div>
  );
};
