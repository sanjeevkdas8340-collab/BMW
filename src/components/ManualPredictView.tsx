import React from 'react';
import { SizeType } from '../types';
import { WinGoBall } from './WinGoBall';
import { Zap, Sparkles, Lock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { playClickSound, playLockSound } from '../utils/sound';

interface ManualPredictViewProps {
  selectedSize: SizeType;
  onSelectSize: (size: SizeType) => void;
  onLock: () => void;
  isLocked: boolean;
  currentPeriod: string;
}

export const ManualPredictView: React.FC<ManualPredictViewProps> = ({
  selectedSize,
  onSelectSize,
  onLock,
  isLocked,
  currentPeriod,
}) => {
  return (
    <div className="space-y-4">
      {/* Title Header */}
      <div className="rounded-3xl p-5 bg-gradient-to-b from-[#0f172a] to-[#070b16] border border-cyan-500/40 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h2 className="font-['Orbitron'] font-black text-xs text-white tracking-wider uppercase">
            MANUAL CASINO PREDICTION ZONE
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Select your target side (BIG or SMALL) and inspect individual lottery balls. The 2-Level AI verifies your pick against live patterns and the 1000-result archive.
        </p>

        {/* Big / Small Choice Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => {
              playClickSound();
              onSelectSize('BIG');
            }}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 active:scale-95 ${
              selectedSize === 'BIG'
                ? 'bg-gradient-to-b from-rose-950/80 to-slate-900 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)] text-rose-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 font-['Orbitron'] font-black text-base sm:text-lg">
              <ArrowUpRight className="w-5 h-5 text-rose-400" />
              <span>BIG (5-9)</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Balls: 5, 6, 7, 8, 9</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onSelectSize('SMALL');
            }}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 active:scale-95 ${
              selectedSize === 'SMALL'
                ? 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.5)] text-cyan-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 font-['Orbitron'] font-black text-base sm:text-lg">
              <ArrowDownRight className="w-5 h-5 text-cyan-400" />
              <span>SMALL (0-4)</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Balls: 0, 1, 2, 3, 4</span>
          </button>
        </div>

        {/* Casino WinGo Balls Full Grid (0 to 9) */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-4">
          <span className="text-[10px] font-['Orbitron'] font-bold text-slate-400 uppercase tracking-widest block text-center mb-3">
            ALL CASINO WINGO LOTTERY BALLS (0 - 9)
          </span>

          <div className="grid grid-cols-5 gap-2.5 justify-items-center">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <div key={num} className="flex flex-col items-center gap-1">
                <WinGoBall
                  number={num}
                  size="md"
                  showBadge={true}
                  animate={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lock Selected Prediction Button */}
        <button
          onClick={() => {
            playLockSound();
            onLock();
          }}
          disabled={isLocked}
          className={`w-full py-4 rounded-2xl font-['Orbitron'] font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
            isLocked
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-rose-600 hover:from-cyan-400 hover:to-rose-500 text-white cursor-pointer active:scale-98 shadow-[0_6px_24px_rgba(0,229,255,0.4)]'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>{isLocked ? `LOCKED FOR PERIOD ${currentPeriod}` : `PREDICT & LOCK (${selectedSize})`}</span>
        </button>
      </div>
    </div>
  );
};
