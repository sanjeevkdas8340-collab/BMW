import React from 'react';
import { SizeType } from '../types';
import { WinGoBall } from './WinGoBall';
import { DualLevelPrediction } from '../utils/patternEngine';
import { Sparkles, Copy, ShieldCheck, Flame, Zap, Check, Lock, AlertTriangle, Calculator, Layers, Cpu, ChevronRight } from 'lucide-react';
import { playClickSound, playLockSound } from '../utils/sound';

interface PredictionCardProps {
  currentPeriod: string;
  prediction: DualLevelPrediction;
  isLocked: boolean;
  onLockPrediction: () => void;
  autoPredict: boolean;
  onToggleAutoPredict: (val: boolean) => void;
  onCopyPrediction: () => void;
  copyFeedback: boolean;
  onOpenCalculator?: () => void;
  onOpenLogicMatrix?: () => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  currentPeriod,
  prediction,
  isLocked,
  onLockPrediction,
  autoPredict,
  onToggleAutoPredict,
  onCopyPrediction,
  copyFeedback,
  onOpenCalculator,
  onOpenLogicMatrix,
}) => {
  const {
    predictedSize,
    favNumber,
    oppNumber,
    confidence,
    isTwoLevelVerified,
    activePattern,
    regime,
    isSkipRecommended,
    skipReason,
    transferDescription,
    recommendedUnit,
    currentLevel,
    levelMultiplier,
    levelDefenseStatus,
    markovProb,
  } = prediction;
  const isBig = predictedSize === 'BIG';

  return (
    <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#0f172a] via-[#090e1c] to-[#050813] border border-cyan-500/40 shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(0,229,255,0.15)] overflow-hidden">
      {/* High-Power Cyber Laser Scanner Sweep */}
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none animate-laserSweep opacity-80 z-10" />

      {/* Background Soft Glow Highlights */}
      <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-rose-600/15 blur-2xl pointer-events-none" />

      {/* Header bar: Compact single line with uppercase font */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="px-2 py-0.5 rounded-lg text-[9px] font-['Orbitron'] font-black tracking-wider uppercase bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center gap-1 shrink-0">
            <Sparkles className="w-2.5 h-2.5 text-cyan-200" />
            <span>QUANTUM V3</span>
          </span>
          <span className="text-[9px] font-['Orbitron'] font-bold text-cyan-300 uppercase truncate">
            {regime.icon} {regime.name}
          </span>
        </div>

        {/* Martingale Level Indicator (Cap Defense) */}
        <div className="flex items-center gap-1">
          {currentLevel === 1 ? (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-['Orbitron'] font-black tracking-wider uppercase bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center gap-1 shrink-0">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>LEVEL 1 (1X)</span>
            </span>
          ) : currentLevel === 2 ? (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-['Orbitron'] font-black tracking-wider uppercase bg-amber-950/90 border border-amber-400/80 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse flex items-center gap-1 shrink-0">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>LEVEL 2 (3X RECOVERY)</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-['Orbitron'] font-black tracking-wider uppercase bg-rose-950/90 border border-rose-400/80 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse flex items-center gap-1 shrink-0">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>LEVEL {currentLevel} (SHIELD)</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Hero Prediction */}
      <div className="text-center my-3 relative">
        <div className="text-[9px] font-['Orbitron'] font-bold text-slate-400 tracking-widest uppercase mb-1 flex items-center justify-center gap-1.5 whitespace-nowrap">
          <span>RECOMMENDED OUTCOME</span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400 font-black">1.96X ODDS</span>
        </div>

        {/* Outcome Target: Compact, sharp uppercase font (not overly massive) */}
        <div
          className={`inline-block font-['Orbitron'] font-black tracking-wider text-3xl sm:text-4xl uppercase transition-all duration-200 ${
            isBig
              ? 'text-transparent bg-clip-text bg-gradient-to-b from-rose-400 via-amber-300 to-rose-600 drop-shadow-[0_0_16px_rgba(244,63,94,0.6)]'
              : 'text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-sky-200 to-blue-500 drop-shadow-[0_0_16px_rgba(0,229,255,0.6)]'
          }`}
        >
          {predictedSize}
        </div>

        {/* Active Pattern Tag: Single line, uppercase */}
        <div className="mt-1 flex items-center justify-center">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-['Orbitron'] font-bold text-cyan-300 uppercase truncate max-w-full">
            {activePattern ? `${activePattern.icon} ${activePattern.name}` : 'STATISTICAL SCAN'}
          </span>
        </div>

        {/* Action Recommendation Banner (Fixed on one line, compact, uppercase) */}
        <div className="mt-2.5 w-full">
          {isSkipRecommended ? (
            <div className="w-full py-1.5 px-3 rounded-xl bg-amber-950/60 border border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-between gap-2 whitespace-nowrap overflow-hidden">
              <div className="flex items-center gap-2 truncate">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-['Orbitron'] font-black text-[11px] text-amber-300 uppercase tracking-wider">
                  ACTION: SKIP
                </span>
                <span className="text-[8px] font-['Orbitron'] font-black px-1.5 py-0.2 rounded bg-rose-900 text-rose-300 uppercase">
                  HIGH RISK TRAP
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-1.5 font-['Orbitron']">
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-black uppercase">
                  SKIP
                </span>
                <span className="text-[9px] font-bold text-amber-300 uppercase">
                  0X
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full py-1.5 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-between gap-2 whitespace-nowrap overflow-hidden">
              <div className="flex items-center gap-2 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-['Orbitron'] font-black text-[11px] text-emerald-300 uppercase tracking-wider">
                  ACTION: PLAY
                </span>
                <span className="text-[8px] font-['Orbitron'] font-black px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-300 uppercase">
                  LOW RISK (SAFE)
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-1.5 font-['Orbitron']">
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-400 text-black uppercase">
                  PLAY
                </span>
                <span className="text-[9px] font-bold text-emerald-300 uppercase">
                  {recommendedUnit || '1X'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Casino WinGo Balls Display: Favor Ball & Opposite Ball (Compact, sleek) */}
      <div className="grid grid-cols-2 gap-2.5 my-2.5">
        {/* Favor Number Card */}
        <div className="relative p-2.5 rounded-xl bg-[#0b1220] border border-emerald-500/50 text-center flex flex-col items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <div className="absolute inset-0 rounded-xl pointer-events-none animate-quantumShockwave opacity-40" />
          <div className="text-[9px] font-['Orbitron'] font-black tracking-wider text-emerald-400 uppercase flex items-center gap-1 mb-1.5 whitespace-nowrap z-10">
            <Flame className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>FAVOR BALL</span>
          </div>

          <div className="my-0.5 z-10">
            <WinGoBall number={favNumber} size="md" showBadge={true} highlight={true} animate={true} />
          </div>

          <span className="text-[8px] font-['Orbitron'] font-bold text-slate-400 uppercase mt-1 whitespace-nowrap z-10">
            PRIMARY ({isBig ? 'BIG' : 'SMALL'})
          </span>
        </div>

        {/* Opposite Number Card (Jackpot Hedge) */}
        <div className="relative p-2.5 rounded-xl bg-[#0b1220] border border-cyan-500/50 text-center flex flex-col items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <div className="absolute inset-0 rounded-xl pointer-events-none animate-quantumShockwave opacity-40" />
          <div className="text-[9px] font-['Orbitron'] font-black tracking-wider text-cyan-400 uppercase flex items-center gap-1 mb-1.5 whitespace-nowrap z-10">
            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>OPPOSITE (9X)</span>
          </div>

          <div className="my-0.5 z-10">
            <WinGoBall number={oppNumber} size="md" showBadge={true} highlight={false} animate={true} />
          </div>

          <span className="text-[8px] font-['Orbitron'] font-bold text-slate-400 uppercase mt-1 whitespace-nowrap z-10">
            JACKPOT ({isBig ? 'SMALL' : 'BIG'})
          </span>
        </div>
      </div>

      {/* Deep Pattern Analysis (DP Engine) Module */}
      {prediction.deepAnalysis && (
        <div className="my-2 p-2 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-[9px] font-['Orbitron'] space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1 text-cyan-300 font-black">
              <span>🔬 DP ANALYSIS:</span>
              <span className="text-white truncate max-w-[140px]">{prediction.deepAnalysis.patternType}</span>
            </span>
            <span className="text-emerald-400 font-black text-[8px] shrink-0">
              {prediction.deepAnalysis.currentStage}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[8px] text-slate-400 pt-0.5">
            <div>
              <span className="text-slate-500">PARITY: </span>
              <span className="text-white font-bold">{prediction.deepAnalysis.harmonicParity.replace('_', ' ')}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500">ENTROPY: </span>
              <span className={prediction.deepAnalysis.transitionEntropy > 60 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {prediction.deepAnalysis.transitionEntropy}% {prediction.deepAnalysis.transitionEntropy > 60 ? '(HIGH)' : '(STABLE)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 220+ Quantum Logic Engine Consensus Matrix Widget */}
      {prediction.logicConsensus && (
        <div className="my-2 p-2.5 rounded-xl bg-gradient-to-r from-[#0a1426] via-[#060b17] to-[#0a1224] border border-cyan-500/50 shadow-[0_0_15px_rgba(0,229,255,0.18)] text-[9px] font-['Orbitron'] space-y-1.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1.5 text-cyan-300 font-black">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>220+ LOGIC ENGINE CONSENSUS</span>
            </span>
            <button
              onClick={() => {
                playClickSound();
                if (onOpenLogicMatrix) onOpenLogicMatrix();
              }}
              className="px-2 py-0.5 rounded-md font-['Orbitron'] font-black text-[8px] bg-cyan-950 border border-cyan-400/80 text-cyan-300 hover:text-white hover:bg-cyan-900 transition-all flex items-center gap-0.5 cursor-pointer"
            >
              <span>VIEW 225 LOGICS</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[8px] pt-0.5">
            <span className="text-slate-300">
              VOTES: <strong className="text-emerald-400">{prediction.logicConsensus.bigVotes} BIG</strong> vs <strong className="text-rose-400">{prediction.logicConsensus.smallVotes} SMALL</strong>
            </span>
            <span className="px-1.5 py-0.2 rounded font-black text-[8px] bg-slate-900 border border-slate-700 text-amber-300">
              {prediction.logicConsensus.consensusPct}% CONSENSUS ({prediction.logicConsensus.consensusSide})
            </span>
          </div>

          {/* Dual-Color Voting Ratio Bar */}
          <div className="h-1.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex">
            <div
              className="h-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${(prediction.logicConsensus.bigVotes / (prediction.logicConsensus.bigVotes + prediction.logicConsensus.smallVotes || 1)) * 100}%` }}
            />
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${(prediction.logicConsensus.smallVotes / (prediction.logicConsensus.bigVotes + prediction.logicConsensus.smallVotes || 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Level-2 Capping Defense & Markov Engine Protocol */}
      <div className="my-2 p-2.5 rounded-xl bg-gradient-to-r from-[#07101f] via-slate-950 to-[#0c0d1c] border border-cyan-500/40 text-[9px] font-['Orbitron'] space-y-1.5 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
        <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800/80 pb-1">
          <span className="flex items-center gap-1.5 text-cyan-400 font-black">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>LEVEL DEFENSE PROTOCOL</span>
          </span>
          <span className={`px-2 py-0.2 rounded font-black text-[8px] ${
            currentLevel === 1 
              ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400' 
              : 'bg-amber-950 border border-amber-500/80 text-amber-300 animate-pulse'
          }`}>
            {levelDefenseStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[8px] pt-0.5">
          <div className="flex items-center justify-between bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">MARKOV (O3):</span>
            <span className="text-cyan-300 font-black">
              B {markovProb?.bigPct || 50}% · S {markovProb?.smallPct || 50}%
            </span>
          </div>
          <div className="flex items-center justify-between bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">MAX LEVEL:</span>
            <span className="text-emerald-400 font-black">
              L1-L2 CAP (NO L4)
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Copy Prediction & Bet Sizing (Compact, uppercase, single line) */}
      <div className="grid grid-cols-2 gap-2 mt-2.5">
        <button
          onClick={() => {
            playClickSound();
            onCopyPrediction();
          }}
          className={`py-2 px-2.5 rounded-xl font-['Orbitron'] font-black text-[10px] tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shadow-md active:scale-95 ${
            copyFeedback
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
          }`}
        >
          {copyFeedback ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY REPORT</span>
            </>
          )}
        </button>

        {onOpenCalculator && (
          <button
            onClick={() => {
              playClickSound();
              onOpenCalculator();
            }}
            className="py-2 px-2.5 rounded-xl font-['Orbitron'] font-black text-[10px] tracking-wider uppercase bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/40 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shadow-md active:scale-95"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>BET ADVISOR</span>
          </button>
        )}
      </div>

      {/* Neural Confidence Meter: Single line, compact, uppercase */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80">
        <div className="flex justify-between items-center text-[9px] font-['Orbitron'] font-bold uppercase mb-1">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>NEURAL CONFIDENCE</span>
          </span>
          <span className="text-cyan-400 font-black">{confidence}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-900 border border-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Auto-Predict Toggle & Lock Button: Compact, single line, uppercase */}
      <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 whitespace-nowrap">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoPredict}
            onChange={(e) => {
              playClickSound();
              onToggleAutoPredict(e.target.checked);
            }}
            className="sr-only peer"
          />
          <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-emerald-500 relative" />
          <span className="text-[9px] font-['Orbitron'] font-black text-slate-300 uppercase">
            AUTO PREDICT
          </span>
        </label>

        <button
          onClick={() => {
            playLockSound();
            onLockPrediction();
          }}
          disabled={isLocked}
          className={`py-1 px-3 rounded-lg font-['Orbitron'] font-black text-[9px] tracking-wider uppercase transition-all flex items-center gap-1 ${
            isLocked
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-slate-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white cursor-pointer active:scale-95'
          }`}
        >
          <Lock className="w-3 h-3" />
          <span>{isLocked ? 'LOCKED' : 'MANUAL LOCK'}</span>
        </button>
      </div>
    </div>
  );
};
