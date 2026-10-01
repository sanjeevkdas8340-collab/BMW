import React, { useEffect } from 'react';
import { OutcomeType, SizeType } from '../types';
import { WinGoBall } from './WinGoBall';
import { LogoEmblem } from './LogoEmblem';
import { CasinoHostessAvatar } from './CasinoHostessAvatar';
import { ChevronRight, X, Flame, Sparkles } from 'lucide-react';

interface ResultOverlayProps {
  isOpen: boolean;
  outcome: OutcomeType | null;
  period: string;
  actualNumber: number | null;
  predictedSize: SizeType;
  onClose: () => void;
}

export const ResultOverlay: React.FC<ResultOverlayProps> = ({
  isOpen,
  outcome,
  period,
  actualNumber,
  predictedSize,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !outcome || actualNumber === null) return null;

  const isJackpot = outcome === 'jackpot';
  const isWin = outcome === 'win' || isJackpot;

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* High-Energy Victory Laser Background Halo */}
      {isWin && (
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-amber-500/20 blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Main Compact Popup Card */}
      <div
        className={`relative w-full max-w-xs sm:max-w-sm rounded-2xl p-4 sm:p-5 text-center overflow-hidden border-2 ${
          isWin ? 'animate-victoryBurst' : 'animate-popBounce'
        } ${
          isJackpot
            ? 'bg-gradient-to-b from-[#1c1335] via-[#100b24] to-[#080512] border-amber-400 shadow-[0_0_50px_rgba(255,183,3,0.6)]'
            : isWin
            ? 'bg-gradient-to-b from-[#0e2424] via-[#08181a] to-[#040d0e] border-emerald-400 shadow-[0_0_45px_rgba(16,185,129,0.55)]'
            : 'bg-gradient-to-b from-[#240e15] via-[#18080d] to-[#0e0407] border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.45)]'
        }`}
      >
        {isWin && (
          <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none animate-raysSpin" />
        )}
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-white bg-slate-900/80 z-20 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Top Logo Emblem & Celebration Hostess */}
        <div className="flex justify-center items-center gap-2 mb-2">
          <LogoEmblem size="sm" glow={true} />
          <CasinoHostessAvatar
            variant={isWin ? "winner" : "concierge"}
            size="sm"
            glowColor={isJackpot ? "amber" : isWin ? "emerald" : "rose"}
            speechBubble={isJackpot ? "9X HIT!" : isWin ? "ROUND WON!" : "RECOVERING"}
          />
        </div>

        {/* Hero Title & Outcome Icon: Compact, uppercase */}
        {isJackpot ? (
          <div>
            <div className="text-3xl mb-1">💎</div>
            <h2 className="text-lg font-black font-['Orbitron'] tracking-wider bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent uppercase">
              JACKPOT HIT!
            </h2>
            <p className="text-[9px] font-bold text-amber-200 uppercase tracking-wider mt-0.5">
              9X OPPOSITE BALL MATCH HIT!
            </p>
          </div>
        ) : isWin ? (
          <div>
            <div className="text-3xl mb-1">🏆</div>
            <h2 className="text-lg font-black font-['Orbitron'] tracking-wider bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent uppercase">
              PREDICTION WIN!
            </h2>
            <p className="text-[9px] font-bold text-emerald-200 uppercase tracking-wider mt-0.5">
              TARGET HIT CONFIRMED
            </p>
          </div>
        ) : (
          <div>
            <div className="text-3xl mb-1">⚠️</div>
            <h2 className="text-lg font-black font-['Orbitron'] tracking-wider bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent uppercase">
              ROUND REVERSAL
            </h2>
            <p className="text-[9px] font-bold text-rose-300 uppercase tracking-wider mt-0.5">
              RECOVERY SCAN ACTIVE
            </p>
          </div>
        )}

        {/* Bouncing 3D Casino Lottery Ball Drop Showcase */}
        <div className="my-3 flex flex-col items-center justify-center">
          <span className="text-[9px] font-['Orbitron'] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>WINNING CASINO BALL</span>
          </span>
          <WinGoBall number={actualNumber} size="xl" showBadge={true} highlight={true} animate={false} />
          <div className="mt-2 flex items-center gap-1.5 text-[9px] font-['Orbitron'] font-black uppercase">
            <span className={`px-2 py-0.5 rounded ${actualNumber >= 5 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'}`}>
              {actualNumber >= 5 ? 'BIG' : 'SMALL'}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              {actualNumber % 2 !== 0 ? 'ODD' : 'EVEN'}
            </span>
          </div>
        </div>

        {/* Round Snapshot Grid: Compact single line entries */}
        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-['Orbitron'] text-left mb-2.5 uppercase">
          <div>
            <span className="text-slate-400 text-[8px] block">PERIOD</span>
            <span className="font-bold text-white text-[10px] truncate block">{period}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[8px] block">PREDICTED</span>
            <span className="font-bold text-cyan-300 text-[10px]">{predictedSize}</span>
          </div>
        </div>

        {/* Dragon Strategy Notice: Single line, uppercase */}
        <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[9px] font-['Orbitron'] font-bold text-slate-300 flex items-center justify-center gap-1 uppercase truncate">
          <Flame className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate">
            {isWin ? 'STREAK MAINTAINED · MOMENTUM ACTIVE' : 'RECOVERY SCAN APPLIED'}
          </span>
        </div>

        {/* Next Round Button: Compact, uppercase */}
        <button
          onClick={onClose}
          className={`mt-3 w-full py-2.5 rounded-xl font-['Orbitron'] font-black text-xs tracking-wider uppercase text-white shadow-md cursor-pointer flex items-center justify-center gap-1 active:scale-95 transition-transform ${
            isJackpot
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
              : isWin
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
              : 'bg-gradient-to-r from-rose-600 to-red-600'
          }`}
        >
          <span>CONTINUE</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
