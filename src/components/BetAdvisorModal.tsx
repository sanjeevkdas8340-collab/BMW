import React, { useState } from 'react';
import {
  X,
  Coins,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface BetAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPeriod: string;
  predictedSize: 'BIG' | 'SMALL';
  isSkipRecommended: boolean;
  activePatternName: string | null;
  confidence: number;
}

export const BetAdvisorModal: React.FC<BetAdvisorModalProps> = ({
  isOpen,
  onClose,
  currentPeriod,
  predictedSize,
  isSkipRecommended,
  activePatternName,
  confidence,
}) => {
  const [walletAmount, setWalletAmount] = useState<number>(1000);
  const [inputStr, setInputStr] = useState<string>('1000');

  if (!isOpen) return null;

  const presetAmounts = [200, 500, 1000, 2000, 5000, 10000];

  function handleSelectPreset(amt: number) {
    playClickSound();
    setWalletAmount(amt);
    setInputStr(String(amt));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setInputStr(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setWalletAmount(num);
    }
  }

  // Calculate 6 stages tailored to the entered wallet amount
  // Safe base bet is ~1.5% to 2% of bankroll (minimum ₹10)
  const baseUnit = Math.max(10, Math.floor((walletAmount * 0.015) / 10) * 10 || 10);
  
  // 6-stage progressive recovery amounts
  const stages = [
    { stage: 1, mult: 1, bet: baseUnit, label: 'STAGE 1 (INITIAL)' },
    { stage: 2, mult: 2.2, bet: Math.max(20, Math.round(baseUnit * 2.2)), label: 'STAGE 2 (IF LOSS 1)' },
    { stage: 3, mult: 5, bet: Math.max(50, Math.round(baseUnit * 5)), label: 'STAGE 3 (IF LOSS 2)' },
    { stage: 4, mult: 11, bet: Math.max(110, Math.round(baseUnit * 11)), label: 'STAGE 4 (IF LOSS 3)' },
    { stage: 5, mult: 25, bet: Math.max(250, Math.round(baseUnit * 25)), label: 'STAGE 5 (IF LOSS 4)' },
    { stage: 6, mult: 55, bet: Math.max(550, Math.round(baseUnit * 55)), label: 'STAGE 6 (IF LOSS 5)' },
  ];

  let cumulativeCost = 0;
  const stageData = stages.map((s) => {
    cumulativeCost += s.bet;
    const payout = Math.round(s.bet * 1.96);
    const netProfit = payout - cumulativeCost;
    return {
      ...s,
      cumulativeCost,
      payout,
      netProfit,
    };
  });

  return (
    <div className="fixed inset-0 z-[650] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm sm:max-w-md max-h-[92vh] rounded-3xl bg-gradient-to-b from-[#0e1628] via-[#090e1c] to-[#040711] border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(0,229,255,0.35)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 bg-[#060a14]/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="font-['Orbitron'] font-black text-xs sm:text-sm text-white tracking-wider uppercase block">
                BETTING ADVISOR
              </span>
              <span className="text-[9px] font-['Orbitron'] font-bold text-cyan-400 uppercase tracking-widest block">
                MONEY & TIMING GUIDE
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          {/* STEP 1: Enter Wallet Balance */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between text-[10px] font-['Orbitron'] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>ENTER YOUR BALANCE (₹)</span>
              </span>
              <span className="text-cyan-400 font-black">₹{walletAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-amber-400 font-['Orbitron']">
                ₹
              </span>
              <input
                type="text"
                value={inputStr}
                onChange={handleInputChange}
                placeholder="Enter balance e.g. 1000"
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-['Orbitron'] font-black text-sm tracking-wider focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-6 gap-1">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleSelectPreset(amt)}
                  className={`py-1 rounded-lg text-[9px] font-['Orbitron'] font-bold uppercase transition-all cursor-pointer whitespace-nowrap ${
                    walletAmount === amt
                      ? 'bg-cyan-500 text-black font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  ₹{amt >= 1000 ? `${amt / 1000}K` : amt}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: Live Current Time Advice */}
          <div
            className={`p-3 rounded-2xl border text-center transition-all ${
              isSkipRecommended
                ? 'bg-amber-950/40 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'bg-emerald-950/40 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-['Orbitron'] font-black uppercase tracking-wider mb-1">
              <span className="text-slate-400">PERIOD #{currentPeriod || 'LIVE'}</span>
              <span
                className={`px-2 py-0.5 rounded-full ${
                  isSkipRecommended
                    ? 'bg-rose-900/80 text-rose-300 border border-rose-500/50'
                    : 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/50'
                }`}
              >
                {isSkipRecommended ? '⚠️ HIGH RISK TRAP' : '🛡️ LOW RISK (SAFE)'}
              </span>
            </div>

            <div className="my-1.5">
              {isSkipRecommended ? (
                <div>
                  <div className="text-xs font-['Orbitron'] font-black text-amber-300 tracking-wider uppercase flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>RIGHT NOW: TIME TO SKIP / WAIT</span>
                  </div>
                  <div className="text-[10px] text-amber-200/90 font-bold uppercase mt-1">
                    DO NOT BET ON THIS ROUND · PRESERVE YOUR BALANCE!
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-['Orbitron'] font-black text-emerald-300 tracking-wider uppercase flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>RIGHT NOW: TIME TO BET!</span>
                  </div>
                  <div className="text-xs font-['Orbitron'] font-black text-white mt-1 uppercase flex items-center justify-center gap-1.5">
                    <span>TARGET:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-black">
                      {predictedSize}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span>AMOUNT:</span>
                    <span className="text-amber-300 font-extrabold">₹{stageData[0]?.bet}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[9px] font-['Orbitron'] text-slate-400 uppercase tracking-wider mt-1 truncate">
              PATTERN: {activePatternName || 'STATISTICAL SCAN'} · CONFIDENCE: {confidence}%
            </div>
          </div>

          {/* STEP 3: Stage-wise Bet Amounts (Kitna Kitna Bet Karna Hai) */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] font-['Orbitron'] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>KITNA KA BET KARNA HAI (6 LEVELS)</span>
              </span>
              <span className="text-emerald-400 font-black">1.96X PROFIT</span>
            </div>

            <div className="space-y-1.5 font-['Orbitron']">
              {stageData.slice(0, 5).map((s) => (
                <div
                  key={s.stage}
                  className={`p-2 rounded-xl border flex items-center justify-between text-[10px] ${
                    s.stage === 1
                      ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-[9px] font-black flex items-center justify-center text-cyan-300">
                      {s.stage}
                    </span>
                    <span className="font-bold uppercase tracking-wider">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-300 text-xs">₹{s.bet}</span>
                    <span className="text-[8px] text-emerald-400 font-bold">
                      +{s.netProfit > 0 ? `₹${s.netProfit}` : 'RECOVER'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 4: Kis Time Par Bet Karna Hai (Golden Timing Rules) */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[10px] font-['Orbitron'] space-y-1.5">
            <div className="font-black text-slate-300 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>KIS TIME PAR BET KARNA HAI</span>
            </div>

            <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 uppercase font-bold space-y-1">
              <div className="flex items-center gap-1 text-[9px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">BET WHEN: STATUS IS LOW RISK (PLAY)</span>
              </div>
              <div className="flex items-center gap-1 text-[9px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">BET WHEN: ZIGZAG 1:1, TWINS 2:2, OR 1:2:1 ACTIVE</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 uppercase font-bold space-y-1">
              <div className="flex items-center gap-1 text-[9px]">
                <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="truncate">SKIP WHEN: STATUS IS HIGH RISK TRAP</span>
              </div>
              <div className="flex items-center gap-1 text-[9px]">
                <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="truncate">SKIP WHEN: DRAGON BROKEN BY 1 OPPOSITE BALL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#060a14] flex items-center justify-between">
          <span className="text-[9px] font-['Orbitron'] font-bold text-slate-400 uppercase tracking-widest">
            6-LEVEL BANKROLL PROTECTION
          </span>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="py-1.5 px-4 rounded-xl font-['Orbitron'] font-black text-xs uppercase bg-cyan-500 hover:bg-cyan-400 text-black shadow-md cursor-pointer transition-colors"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};
