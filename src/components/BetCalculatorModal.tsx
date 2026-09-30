import React, { useState } from 'react';
import { Calculator, X, ShieldAlert, TrendingUp, Check, Coins, ArrowRight, RefreshCw, Zap } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface BetCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictedSize: string;
  favNumber: number;
  oppNumber: number;
}

type StrategyType = '3x' | '2x' | 'fibonacci' | 'custom';

export const BetCalculatorModal: React.FC<BetCalculatorModalProps> = ({
  isOpen,
  onClose,
  predictedSize,
  favNumber,
  oppNumber,
}) => {
  const [baseBet, setBaseBet] = useState<number>(10);
  const [strategy, setStrategy] = useState<StrategyType>('3x');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [hedgeOpposite, setHedgeOpposite] = useState<boolean>(true);

  if (!isOpen) return null;

  // Calculate Bet Progression up to 8 levels
  const calculateProgression = () => {
    const rows = [];
    let cumRisk = 0;

    let fibA = 1;
    let fibB = 1;

    for (let lvl = 1; lvl <= 8; lvl++) {
      let multiplier = 1;
      if (strategy === '3x') {
        multiplier = Math.pow(3, lvl - 1);
      } else if (strategy === '2x') {
        multiplier = Math.pow(2, lvl - 1);
      } else if (strategy === 'fibonacci') {
        if (lvl === 1) multiplier = 1;
        else if (lvl === 2) multiplier = 1;
        else {
          const next = fibA + fibB;
          fibA = fibB;
          fibB = next;
          multiplier = next;
        }
      } else {
        multiplier = lvl * 1.5;
      }

      const primaryBet = Math.round(baseBet * multiplier);
      // 10% Hedge on opposite number to catch 9x Jackpot
      const hedgeBet = hedgeOpposite ? Math.max(1, Math.round(primaryBet * 0.1)) : 0;
      const totalStepCost = primaryBet + hedgeBet;
      cumRisk += totalStepCost;

      // Win payout calculation (1.96x on Big/Small)
      const primaryPayout = Math.round(primaryBet * 1.96);
      const netProfit = primaryPayout - cumRisk;

      // Jackpot payout if Opp hits (9.0x)
      const jackpotPayout = hedgeBet > 0 ? Math.round(hedgeBet * 9.0) : 0;

      rows.push({
        level: lvl,
        primaryBet,
        hedgeBet,
        totalStepCost,
        cumRisk,
        primaryPayout,
        netProfit,
        jackpotPayout,
      });
    }
    return rows;
  };

  const schedule = calculateProgression();
  const currentStepData = schedule[currentLevel - 1] || schedule[0];

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[90vh] rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#0a1122] to-[#060a14] border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(0,229,255,0.3)] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="font-['Orbitron'] font-black text-sm text-white tracking-wider block">
                PRO BET SIZING CALCULATOR
              </span>
              <span className="text-[10px] text-cyan-400 font-bold">
                WIN-GO 1M BANKROLL & RECOVERY PLANNER
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-slate-200 text-xs">
          {/* Active Round Prediction Quick Box */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-rose-950/40 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">TARGET PREDICTION</span>
              <span className="font-['Orbitron'] font-black text-base text-cyan-300">
                {predictedSize}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 font-bold block">RECOMMENDED TARGETS</span>
              <span className="font-['Orbitron'] font-bold text-xs text-white">
                Favor: <span className="text-emerald-400 font-black">{favNumber}</span> · Hedge Opp: <span className="text-cyan-400 font-black">{oppNumber}</span>
              </span>
            </div>
          </div>

          {/* Base Bet Selector */}
          <div>
            <label className="text-[11px] font-['Orbitron'] font-bold text-slate-300 block mb-1.5">
              1. INITIAL BASE BET (₹)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[10, 50, 100, 200, 500].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    playClickSound();
                    setBaseBet(val);
                  }}
                  className={`py-2 rounded-xl font-['Orbitron'] font-bold text-xs transition-all cursor-pointer ${
                    baseBet === val
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,229,255,0.4)] border border-cyan-300'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Strategy Mode Selector */}
          <div>
            <label className="text-[11px] font-['Orbitron'] font-bold text-slate-300 block mb-1.5">
              2. RECOVERY STRATEGY
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  setStrategy('3x');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  strategy === '3x'
                    ? 'bg-rose-950/40 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className="font-['Orbitron'] font-black text-xs block text-rose-400">3X MARTINGALE</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">High recovery (1, 3, 9, 27x)</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setStrategy('2x');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  strategy === '2x'
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className="font-['Orbitron'] font-black text-xs block text-cyan-400">2X CLASSIC</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Balanced (1, 2, 4, 8x)</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setStrategy('fibonacci');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  strategy === 'fibonacci'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className="font-['Orbitron'] font-black text-xs block text-emerald-400">FIBONACCI</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Low risk (1, 1, 2, 3, 5x)</span>
              </button>
            </div>
          </div>

          {/* Hedge Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-['Orbitron'] font-bold text-xs text-white block">
                  OPPOSITE BALL JACKPOT HEDGE (9.0X)
                </span>
                <span className="text-[10px] text-slate-400">
                  Allocates 10% on Ball #{oppNumber} to protect against reversals
                </span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={hedgeOpposite}
              onChange={(e) => {
                playClickSound();
                setHedgeOpposite(e.target.checked);
              }}
              className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 cursor-pointer accent-cyan-500"
            />
          </div>

          {/* CURRENT ACTIVE LEVEL CONTROLLER */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-['Orbitron'] font-black text-xs text-cyan-300">
                CURRENT PLAY LEVEL: #{currentLevel}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    playClickSound();
                    setCurrentLevel(1);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500 hover:text-black cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>RESET (WIN)</span>
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setCurrentLevel((prev) => Math.min(prev + 1, 8));
                  }}
                  className="px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-[10px] font-bold text-rose-300 hover:bg-rose-500 hover:text-black cursor-pointer flex items-center gap-1"
                >
                  <ArrowRight className="w-3 h-3" />
                  <span>NEXT STEP (LOSS)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-cyan-500/20">
              <div>
                <span className="text-[9px] text-slate-400 block font-bold">BET ON {predictedSize}</span>
                <span className="font-['Orbitron'] font-black text-sm text-white">
                  ₹{currentStepData.primaryBet}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block font-bold">HEDGE ON #{oppNumber}</span>
                <span className="font-['Orbitron'] font-black text-sm text-cyan-400">
                  ₹{currentStepData.hedgeBet}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block font-bold">NET PROFIT ON WIN</span>
                <span className="font-['Orbitron'] font-black text-sm text-emerald-400">
                  +₹{currentStepData.netProfit}
                </span>
              </div>
            </div>
          </div>

          {/* FULL 8-LEVEL PROGRESSION SCHEDULE TABLE */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-['Orbitron'] font-bold text-slate-300 mb-2">
              <span>8-LEVEL STEP TABLE</span>
              <span className="text-slate-500 text-[9px]">MAX RECOMMENDED: 5 LEVELS</span>
            </div>

            <div className="rounded-xl border border-slate-800 overflow-hidden text-[10px]">
              <div className="grid grid-cols-5 bg-slate-900/90 p-2 font-['Orbitron'] font-bold text-slate-400 border-b border-slate-800">
                <span>LVL</span>
                <span>BET</span>
                <span>HEDGE</span>
                <span>TOTAL RISK</span>
                <span>NET WIN</span>
              </div>

              {schedule.map((row) => (
                <div
                  key={row.level}
                  onClick={() => {
                    playClickSound();
                    setCurrentLevel(row.level);
                  }}
                  className={`grid grid-cols-5 p-2 border-b border-slate-800/50 font-['Orbitron'] font-medium transition-colors cursor-pointer ${
                    row.level === currentLevel
                      ? 'bg-cyan-500/20 text-white font-bold'
                      : row.level > 5
                      ? 'text-rose-400/80 bg-rose-950/10 hover:bg-slate-900/80'
                      : 'text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {row.level === currentLevel && <Check className="w-3 h-3 text-cyan-400" />}
                    <span>L{row.level}</span>
                  </span>
                  <span>₹{row.primaryBet}</span>
                  <span>₹{row.hedgeBet}</span>
                  <span className="text-slate-400">₹{row.cumRisk}</span>
                  <span className="text-emerald-400 font-bold">+₹{row.netProfit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Always set a daily stop-loss limit</span>
          </span>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-['Orbitron'] font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
