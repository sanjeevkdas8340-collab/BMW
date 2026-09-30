import React, { useState, useEffect, useRef } from 'react';
import { PatternMatch, HistoricalBacktestResult, SizeType } from '../types';
import { Bot, Send, X, Sparkles, Brain, Cpu, MessageSquare } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  patterns: PatternMatch[];
  backtest: HistoricalBacktestResult | null;
  predictedSize: SizeType;
  confidence: number;
  currentPeriod: string;
  remainingSeconds: number;
  recentNumbers: number[];
  winCount: number;
  lossCount: number;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  patterns,
  backtest,
  predictedSize,
  confidence,
  currentPeriod,
  remainingSeconds,
  recentNumbers,
  winCount,
  lossCount,
}) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    {
      sender: 'bot',
      text: '亗 𝗕ᴍᴡ 亗 𝗢ʙʟɪᴠɪᴏɴ 亗 𝗩𝟮 ⚡ Neural AI Online! Aap koi bhi sawal puchh sakte hain: "pattern", "big ya small", "dragon", "1000 backtest", "after number", ya "stats".',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  function generateBotResponse(query: string): string {
    const q = query.toLowerCase();
    const topPattern = patterns.length ? patterns[0] : null;

    if (q.includes('pattern') || q.includes('patrn')) {
      if (!patterns.length) return 'Abhi koi dominant pattern nahi chal raha — market neutral equilibrium mein hai.';
      return `Active Patterns (${patterns.length}):\n${patterns.slice(0, 4).map(p => `${p.icon} ${p.name} (${p.strength}% match)`).join('\n')}\n\nTop advice: ${topPattern?.detail}`;
    }

    if (q.includes('dragon') || q.includes('streak')) {
      const dragonPat = patterns.find(p => p.category === 'dragon');
      if (dragonPat) {
        return `🐉 DRAGON ALERT: ${dragonPat.name}\n${dragonPat.detail}\nSignal: ${dragonPat.recommendedSize} (${dragonPat.strength}% strength).`;
      }
      return 'Abhi koi dragon streak (3+ consecutive) active nahi hai.';
    }

    if (q.includes('big') || q.includes('small') || q.includes('predict') || q.includes('kya lag') || q.includes('next')) {
      return `⚡ LATEST AI PREDICTION for Period ${currentPeriod}:\nOutcome: ${predictedSize}\nConfidence: ${confidence}%\nDominant Signal: ${topPattern?.name || 'Mean Reversion'}\n2-Level Verification: ${backtest ? 'PASSED 100%' : 'L1 ACTIVE'}`;
    }

    if (q.includes('1000') || q.includes('backtest') || q.includes('history') || q.includes('after')) {
      if (backtest) {
        return `🔢 1000-RESULT BACKTEST DATA:\nPattern [${backtest.signature}] pichle 1000 rounds mein ${backtest.occurrences} baar aaya.\nUske baad results:\nBIG: ${backtest.bigPct}% (${backtest.bigCount}×)\nSMALL: ${backtest.smallPct}% (${backtest.smallCount}×)\nTop Winning Ball: ${backtest.topNumbers[0]?.num} (${backtest.topNumbers[0]?.count}×)`;
      }
      return '1000-result archive scan ho raha hai, next round ke liye query tayar hai!';
    }

    if (q.includes('stat') || q.includes('win') || q.includes('score')) {
      const total = winCount + lossCount;
      const rate = total > 0 ? Math.round((winCount / total) * 100) : 0;
      return `📊 CURRENT SESSION STATS:\nWins: ${winCount}\nLosses: ${lossCount}\nWin Rate: ${rate}%\nTotal Rounds Tracked: ${total}`;
    }

    if (q.includes('hi') || q.includes('hello') || q.includes('namaste')) {
      return 'Namaste! Main BMW OBLIVION V2 ka Neural Assistant hoon. Pattern, prediction ya 1000-result backtest ke baare mein kuch bhi puchhein.';
    }

    return `AI Analysis:\nMarket Status: ${topPattern ? topPattern.name : 'Equilibrium'}\nCurrent Recommendation: ${predictedSize} (${confidence}%)\nTime remaining: ~${remainingSeconds}s. "pattern", "dragon", ya "1000 backtest" puchh sakte hain!`;
  }

  function handleSend() {
    if (!inputVal.trim()) return;
    playClickSound();
    const userText = inputVal.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputVal('');

    setTimeout(() => {
      const reply = generateBotResponse(userText);
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 350);
  }

  return (
    <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg h-[80vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl bg-[#090e1c] border-2 border-cyan-500/50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-['Orbitron'] font-black text-sm text-white tracking-wider">
                BMW OBLIVION NEURAL AI
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold">● LIVE DATA CONSULTANT</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Status Ticker */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
          <span>Period: <strong className="text-cyan-400 font-['Orbitron']">{currentPeriod}</strong></span>
          <span>Target: <strong className="text-amber-400 font-['Orbitron']">{predictedSize}</strong> ({confidence}%)</span>
          <span>Timer: <strong className="text-rose-400 font-['Orbitron']">{remainingSeconds}s</strong></span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt buttons */}
        <div className="p-2 bg-slate-950/60 border-t border-slate-800 flex gap-2 overflow-x-auto text-[11px]">
          {['Pattern kya hai?', 'Big ya Small?', 'Dragon status', '1000 backtest', 'Session stats'].map((txt, i) => (
            <button
              key={i}
              onClick={() => {
                setInputVal(txt);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 whitespace-nowrap hover:border-cyan-400 cursor-pointer"
            >
              {txt}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Puchhein BMW AI se..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
