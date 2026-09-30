import React, { useState } from 'react';
import { PredictionRecord } from '../types';
import { WinGoBall } from './WinGoBall';
import { Trash2, History, Download, Clock } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface HistorySectionProps {
  records: PredictionRecord[];
  onClearHistory: () => void;
  title?: string;
  limit?: number;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  records,
  onClearHistory,
  title = 'PREDICTION HISTORY',
  limit,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'win' | 'jackpot' | 'loss' | 'pending'>('all');

  const filteredRecords = records.filter((r) => {
    if (filterMode === 'all') return true;
    if (filterMode === 'win') return r.result === 'win' || r.result === 'jackpot';
    if (filterMode === 'jackpot') return r.result === 'jackpot';
    if (filterMode === 'loss') return r.result === 'loss';
    if (filterMode === 'pending') return r.result === null;
    return true;
  });

  const displayRecords = limit ? filteredRecords.slice(0, limit) : filteredRecords;

  const wins = records.filter((r) => r.result === 'win' || r.result === 'jackpot').length;
  const losses = records.filter((r) => r.result === 'loss').length;
  const jackpots = records.filter((r) => r.result === 'jackpot').length;
  const total = records.filter((r) => r.result !== null).length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  // Export History as CSV
  const exportCSV = () => {
    playClickSound();
    if (records.length === 0) return;

    const headers = 'Period,Predicted_Size,Fav_Number,Opp_Number,Actual_Ball,Outcome,Strategy,Timestamp\n';
    const rows = records
      .map((r) =>
        [
          r.period,
          r.predictedSize,
          r.predictedFav ?? '',
          r.predictedOpp ?? '',
          r.actualNumber ?? '',
          r.result ?? 'PENDING',
          r.strategy,
          new Date(r.timestamp).toISOString(),
        ].join(',')
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bmw_wingo_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl p-3 bg-gradient-to-b from-[#0e1628] via-[#090e1c] to-[#040711] border border-cyan-500/30 shadow-lg space-y-2.5 overflow-hidden w-full">
      {/* Title & Actions Bar: Fixed Single Line */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 whitespace-nowrap">
        <div className="flex items-center gap-1.5 truncate">
          <History className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-['Orbitron'] font-black text-xs text-white uppercase tracking-wider truncate">
            {title}
          </span>
          <span className="px-1.5 py-0.2 rounded-md text-[9px] font-['Orbitron'] font-bold bg-slate-800 text-slate-300 shrink-0">
            {records.length}
          </span>
        </div>

        {/* Export & Clear Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {records.length > 0 && (
            <>
              <button
                onClick={exportCSV}
                className="px-2 py-0.5 rounded-lg text-[9px] font-['Orbitron'] font-bold text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                title="Export history to CSV"
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onClearHistory();
                }}
                className="px-2 py-0.5 rounded-lg text-[9px] font-['Orbitron'] font-bold text-rose-400 hover:text-white bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/50 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                title="Clear all saved history"
              >
                <Trash2 className="w-3 h-3" />
                <span>CLEAR</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mini Stats Single-Line Strip */}
      <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] font-['Orbitron'] font-bold">
        <div className="py-1 px-1.5 rounded-lg bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between">
          <span className="text-slate-400">WIN</span>
          <span className="text-emerald-400 font-black text-[11px]">{wins}</span>
        </div>
        <div className="py-1 px-1.5 rounded-lg bg-slate-900/90 border border-rose-500/30 flex items-center justify-between">
          <span className="text-slate-400">LOSS</span>
          <span className="text-rose-400 font-black text-[11px]">{losses}</span>
        </div>
        <div className="py-1 px-1.5 rounded-lg bg-slate-900/90 border border-amber-500/30 flex items-center justify-between">
          <span className="text-slate-400">9X</span>
          <span className="text-amber-400 font-black text-[11px]">{jackpots}</span>
        </div>
        <div className="py-1 px-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between">
          <span className="text-slate-400">RATE</span>
          <span className="text-cyan-400 font-black text-[11px]">{winRate}%</span>
        </div>
      </div>

      {/* Filter Segmented Chips: Compact Single Line */}
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[9px] font-['Orbitron'] font-bold scrollbar-none">
        {[
          { id: 'all', label: 'ALL' },
          { id: 'win', label: 'WINS' },
          { id: 'loss', label: 'LOSSES' },
          { id: 'jackpot', label: 'JACKPOT' },
          { id: 'pending', label: 'PENDING' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playClickSound();
              setFilterMode(tab.id as typeof filterMode);
            }}
            className={`px-2.5 py-0.5 rounded-lg uppercase transition-all cursor-pointer shrink-0 ${
              filterMode === tab.id
                ? 'bg-cyan-500 text-black font-black'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Legend strip: explains Favor and Opposite ball icons */}
      <div className="flex items-center justify-between text-[8px] font-['Orbitron'] font-bold text-slate-400 px-1 uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <span className="text-amber-400">⭐</span>
          <span>FAV: PRIMARY</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-cyan-400">⚡</span>
          <span>OPP: JACKPOT (9X)</span>
        </span>
      </div>

      {/* Table Column Header */}
      <div className="grid grid-cols-12 gap-1 px-2 py-1 bg-slate-950/60 rounded-lg text-[9px] font-['Orbitron'] font-bold text-slate-400 uppercase tracking-wider border border-slate-800/80">
        <div className="col-span-3 truncate">PERIOD</div>
        <div className="col-span-5 text-center truncate">PREDICT (SZ · FAV · OPP)</div>
        <div className="col-span-2 text-center truncate">BALL</div>
        <div className="col-span-2 text-right truncate">RESULT</div>
      </div>

      {/* Table Body List */}
      {displayRecords.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500 font-['Orbitron']">
          NO RECORDS FOUND
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-0.5">
          {displayRecords.map((item, idx) => {
            const isJackpot = item.result === 'jackpot';
            const isWin = item.result === 'win' || isJackpot;
            const isPending = item.result === null;

            // Compact period display: e.g. last 5-6 digits if long
            const periodDisplay =
              item.period.length > 7 ? `..${item.period.slice(-5)}` : item.period;

            return (
              <div
                key={idx}
                className={`grid grid-cols-12 gap-1 items-center px-2 py-1.5 rounded-xl border text-[10px] font-['Orbitron'] transition-colors ${
                  isPending
                    ? 'bg-slate-900/60 border-slate-800'
                    : isJackpot
                    ? 'bg-amber-950/30 border-amber-500/50'
                    : isWin
                    ? 'bg-emerald-950/25 border-emerald-500/40'
                    : 'bg-rose-950/25 border-rose-500/40'
                }`}
              >
                {/* Col 1: Period */}
                <div className="col-span-3 flex items-center gap-1 truncate font-mono">
                  <span className="font-bold text-slate-200 truncate" title={item.period}>
                    {periodDisplay}
                  </span>
                  {item.verified && (
                    <span className="text-[8px] text-emerald-400 font-black shrink-0" title="Verified">
                      ✓
                    </span>
                  )}
                </div>

                {/* Col 2: Predicted Size, Favor Ball & Opposite Ball */}
                <div className="col-span-5 flex items-center justify-center gap-1 overflow-hidden">
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase shrink-0 ${
                      item.predictedSize === 'BIG'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {item.predictedSize}
                  </span>
                  {item.predictedFav !== null && (
                    <span
                      className="text-[9px] text-emerald-300 font-extrabold px-1 py-0.2 rounded bg-emerald-950/70 border border-emerald-500/30 flex items-center gap-0.5 shrink-0"
                      title={`Favor Ball: ${item.predictedFav}`}
                    >
                      <span className="text-[8px] text-amber-400">⭐</span>
                      <span>{item.predictedFav}</span>
                    </span>
                  )}
                  {item.predictedOpp !== null && (
                    <span
                      className="text-[9px] text-cyan-300 font-extrabold px-1 py-0.2 rounded bg-cyan-950/70 border border-cyan-500/30 flex items-center gap-0.5 shrink-0"
                      title={`Opposite Hedge Ball (9x): ${item.predictedOpp}`}
                    >
                      <span className="text-[8px] text-cyan-400">⚡</span>
                      <span>{item.predictedOpp}</span>
                    </span>
                  )}
                </div>

                {/* Col 3: Actual Winning Ball */}
                <div className="col-span-2 flex items-center justify-center">
                  {item.actualNumber !== null ? (
                    <WinGoBall number={item.actualNumber} size="xs" animate={false} />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  )}
                </div>

                {/* Col 4: Outcome Badge */}
                <div className="col-span-2 flex items-center justify-end">
                  {isPending ? (
                    <span className="text-[8px] font-black text-amber-400 px-1 py-0.5 rounded bg-amber-950/50 border border-amber-500/40 uppercase">
                      WAIT
                    </span>
                  ) : isJackpot ? (
                    <span className="text-[9px] font-black text-amber-300 px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/70 uppercase tracking-wider">
                      9X
                    </span>
                  ) : isWin ? (
                    <span className="text-[9px] font-black text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/70 uppercase tracking-wider">
                      WIN
                    </span>
                  ) : (
                    <span className="text-[9px] font-black text-rose-300 px-1.5 py-0.5 rounded bg-rose-950 border border-rose-500/70 uppercase tracking-wider">
                      LOSS
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
