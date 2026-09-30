import React from 'react';
import { Crown, ShieldCheck, Zap, Sparkles, Gem, ArrowRight, ExternalLink, CheckCircle2, Lock } from 'lucide-react';
import { LogoEmblem } from './LogoEmblem';
import { playClickSound } from '../utils/sound';

interface VipViewProps {
  onOpenBetAdvisor: () => void;
  onLockApp: () => void;
}

export const VipView: React.FC<VipViewProps> = ({ onOpenBetAdvisor, onLockApp }) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* VIP Hero Card */}
      <div className="relative rounded-3xl p-5 bg-gradient-to-b from-[#1a1505] via-[#100d02] to-[#080701] border-2 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.25)] overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="font-['Orbitron'] font-black text-sm text-amber-300 tracking-wider uppercase block">
                BMW VIP CLUB
              </span>
              <span className="text-[9px] font-['Orbitron'] font-bold text-amber-400/80 uppercase tracking-widest block">
                ELITE ACCESS TIER
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[9px] font-['Orbitron'] font-black tracking-wider uppercase bg-amber-500 text-black shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>ACTIVE VIP</span>
          </span>
        </div>

        {/* Member Status Badge */}
        <div className="my-3.5 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-['Orbitron'] font-bold text-amber-400 uppercase tracking-wider block">
              VIP ACCOUNT STATUS
            </span>
            <span className="text-xs font-['Orbitron'] font-black text-white uppercase tracking-wider">
              PRIME LIFETIME PASS
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-['Orbitron'] font-bold text-slate-400 uppercase tracking-wider block">
              SECURITY PROTOCOL
            </span>
            <span className="text-xs font-['Orbitron'] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>UNLOCKED</span>
            </span>
          </div>
        </div>

        {/* VIP Benefits List */}
        <div className="space-y-2 font-['Orbitron'] text-[10px]">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between text-slate-200">
            <span className="flex items-center gap-2">
              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold uppercase tracking-wider">99.4% NEURAL ACCURACY SIGNALS</span>
            </span>
            <span className="text-emerald-400 font-black">ENABLED</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between text-slate-200">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-bold uppercase tracking-wider">ANTI-TRAP AUTO PROTECTION</span>
            </span>
            <span className="text-emerald-400 font-black">ACTIVE</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between text-slate-200">
            <span className="flex items-center gap-2">
              <Gem className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="font-bold uppercase tracking-wider">9X JACKPOT NUMBER RADAR</span>
            </span>
            <span className="text-emerald-400 font-black">SYNCED</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between text-slate-200">
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold uppercase tracking-wider">12MS DIRECT API SEED STREAM</span>
            </span>
            <span className="text-emerald-400 font-black">LIVE</span>
          </div>
        </div>

        {/* Quick Action Button to Open Bet Advisor */}
        <button
          onClick={() => {
            playClickSound();
            onOpenBetAdvisor();
          }}
          className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-['Orbitron'] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-transform"
        >
          <span>OPEN VIP BETTING ADVISOR</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Lock App / Key Manager Card */}
      <div className="rounded-2xl p-3.5 bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-['Orbitron'] font-bold text-slate-400 uppercase tracking-wider block">
            APP ACCESS KEY
          </span>
          <span className="text-xs font-['Orbitron'] font-black text-cyan-300 uppercase tracking-wider">
            AUTHENTICATED SESSION
          </span>
        </div>
        <button
          onClick={() => {
            playClickSound();
            onLockApp();
          }}
          className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-['Orbitron'] font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Lock className="w-3 h-3" />
          <span>LOCK APP</span>
        </button>
      </div>
    </div>
  );
};
