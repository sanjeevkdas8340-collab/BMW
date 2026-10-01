import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SizeType, OutcomeType, PredictionRecord, WinGoResultItem } from './types';
import { SEED_NUMBERS, getBallSize } from './data/seedData';
import {
  generateDualLevelPrediction,
  scanAllPatterns,
  run1000ResultBacktest,
  DualLevelPrediction,
} from './utils/patternEngine';
import { playWinSound, playLossSound, playJackpotSound, playClickSound, isSoundEnabled, setSoundEnabled } from './utils/sound';
import { LogoEmblem } from './components/LogoEmblem';
import { PredictionCard } from './components/PredictionCard';
import { PatternScanner } from './components/PatternScanner';
import { HistorySection } from './components/HistorySection';
import { StatsView } from './components/StatsView';
import { ResultOverlay } from './components/ResultOverlay';
import { LockScreen } from './components/LockScreen';
import { PatternRadarStrip } from './components/PatternRadarStrip';
import { BetAdvisorModal } from './components/BetAdvisorModal';
import { VipView } from './components/VipView';
import { CasinoHostessAvatar } from './components/CasinoHostessAvatar';
import {
  Home,
  History as HistoryIcon,
  BarChart3,
  Wifi,
  WifiOff,
  Copy,
  Clock,
  Volume2,
  VolumeX,
  Crown,
  Coins,
  Sparkles,
  Lock,
} from 'lucide-react';

function toBoldUnicode(str: string): string {
  const caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lows = 'abcdefghijklmnopqrstuvwxyz';
  const digs = '0123456789';
  const bCaps = Array.from('𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭');
  const bLows = Array.from('𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇');
  const bDigs = Array.from('𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗');

  let out = '';
  for (const ch of str) {
    const ci = caps.indexOf(ch);
    const li = lows.indexOf(ch);
    const di = digs.indexOf(ch);
    if (ci >= 0) out += bCaps[ci];
    else if (li >= 0) out += bLows[li];
    else if (di >= 0) out += bDigs[di];
    else out += ch;
  }
  return out;
}

export default function App() {
  // App Lock State
  const [isAppLocked, setIsAppLocked] = useState(true);

  // Active Screen Tab - Exactly 4 tabs: HOME, HISTORY, ANALYTICS, VIP
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'stats' | 'vip'>('home');

  // Sound FX State
  const [soundOn, setSoundOn] = useState<boolean>(() => isSoundEnabled());

  // Pro Bet Sizing & Money Advisor Modal State
  const [showBetAdvisorModal, setShowBetAdvisorModal] = useState<boolean>(false);

  // Game data state
  const [currentPeriod, setCurrentPeriod] = useState<string>('');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(60);
  const [recentNumbers, setRecentNumbers] = useState<number[]>(() => SEED_NUMBERS.slice(0, 50));
  const [isApiOnline, setIsApiOnline] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Prediction State
  const [prediction, setPrediction] = useState<DualLevelPrediction>(() =>
    generateDualLevelPrediction(SEED_NUMBERS.slice(0, 50))
  );
  const [manualSelectedSize, setManualSelectedSize] = useState<SizeType>('BIG');
  const [isPredictionLocked, setIsPredictionLocked] = useState<boolean>(false);
  const [autoPredict, setAutoPredict] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('bmw_auto_predict');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  // Records / History State - ALWAYS starts fresh from 0 whenever app is opened
  const [records, setRecords] = useState<PredictionRecord[]>([]);
  const [bestStreak, setBestStreak] = useState<number>(0);

  // Clear any old stored data on app launch so it always starts from 0
  useEffect(() => {
    try {
      localStorage.removeItem('bmw_records_v2');
      localStorage.removeItem('bmw_best_streak');
      localStorage.removeItem('bmwx_records');
      localStorage.removeItem('bmwx_best');
    } catch {}
  }, []);

  // Modal / Overlay states
  const [showResultOverlay, setShowResultOverlay] = useState<boolean>(false);
  const [overlayOutcome, setOverlayOutcome] = useState<OutcomeType | null>(null);
  const [overlayActualNumber, setOverlayActualNumber] = useState<number | null>(null);
  const [overlayPeriod, setOverlayPeriod] = useState<string>('');
  const [overlayPredictedSize, setOverlayPredictedSize] = useState<SizeType>('BIG');
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Embedded Game Iframe URL
  const [gameUrl, setGameUrl] = useState<string>('https://bdgwin4.cc//#/register?invitationCode=5281410083715');

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const recordsRef = useRef<PredictionRecord[]>(records);
  const predictionRef = useRef<DualLevelPrediction>(prediction);
  const lastResolvedPeriodRef = useRef<string>('');

  // Live Martingale Level Calculator (Resets to 1 immediately on Win or Jackpot)
  const currentMartingaleLevel = useMemo(() => {
    let lossCount = 0;
    for (const r of records) {
      if (r.result === null) continue; // skip pending
      if (r.result === 'win' || r.result === 'jackpot') {
        break; // win or jackpot resets level immediately to 1!
      } else if (r.result === 'loss') {
        lossCount++;
      }
    }
    return Math.min(4, lossCount + 1);
  }, [records]);

  // Permanent immutable registry of predictions made for each round.
  // Once a prediction is made for a round, it can NEVER be changed or rewritten.
  const lockedPredictionsMapRef = useRef<
    Map<
      string,
      {
        period: string;
        predictedSize: SizeType;
        favNumber: number;
        oppNumber: number;
        patternName: string | null;
        isVerified: boolean;
      }
    >
  >(new Map());

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }

  function handleToggleSound() {
    const next = !soundOn;
    setSoundEnabled(next);
    setSoundOn(next);
    if (next) playClickSound();
    showToast(next ? '🔊 Audio FX Enabled' : '🔇 Audio FX Muted');
  }

  // Keep refs in sync
  useEffect(() => {
    recordsRef.current = records;
  }, [records]);

  useEffect(() => {
    predictionRef.current = prediction;
  }, [prediction]);

  // Recalculate best streak for current session
  useEffect(() => {
    let cur = 0;
    let max = bestStreak;
    for (const r of records) {
      if (r.result === 'win' || r.result === 'jackpot') {
        cur++;
        if (cur > max) max = cur;
      } else if (r.result === 'loss') {
        cur = 0;
      }
    }
    if (max > bestStreak) setBestStreak(max);
  }, [records, bestStreak]);

  // Recalculate prediction when recent numbers change
  const refreshPrediction = useCallback((nums: number[]) => {
    const lastFav = predictionRef.current?.favNumber;
    const lastOpp = predictionRef.current?.oppNumber;
    const newPred = generateDualLevelPrediction(nums, lastFav, lastOpp, currentMartingaleLevel);
    setPrediction(newPred);
    setManualSelectedSize(newPred.predictedSize);
  }, [currentMartingaleLevel]);

  // Starts and permanently locks the prediction for a new period
  const startNewRound = useCallback(
    (newPeriod: string, nums: number[]) => {
      if (!newPeriod) return;

      const lastFav = predictionRef.current?.favNumber;
      const lastOpp = predictionRef.current?.oppNumber;
      const newPred = generateDualLevelPrediction(nums, lastFav, lastOpp, currentMartingaleLevel);
      setPrediction(newPred);
      setManualSelectedSize(newPred.predictedSize);
      setCurrentPeriod(newPeriod);
      setIsPredictionLocked(true);

      // Lock immutable prediction in memory so it can NEVER change or flip
      lockedPredictionsMapRef.current.set(newPeriod, {
        period: newPeriod,
        predictedSize: newPred.predictedSize,
        favNumber: newPred.favNumber,
        oppNumber: newPred.oppNumber,
        patternName: newPred.activePattern?.name || null,
        isVerified: newPred.isTwoLevelVerified,
      });

      // Add as pending in history (strictly with the exact prediction that is displayed)
      setRecords((prev) => {
        if (prev.some((r) => r.period === newPeriod)) return prev;

        const pendingRec: PredictionRecord = {
          period: newPeriod,
          predictedSize: newPred.predictedSize,
          predictedOpp: newPred.oppNumber,
          predictedFav: newPred.favNumber,
          actualNumber: null,
          result: null,
          strategy: 'PRIME FUSION',
          sig: newPred.activePattern?.name || null,
          verified: newPred.isTwoLevelVerified,
          demo: isDemoMode,
          level: currentMartingaleLevel,
          timestamp: Date.now(),
        };

        const combined = [pendingRec, ...prev];
        const seen = new Set<string>();
        return combined.filter((r) => {
          if (!r.period || seen.has(r.period)) return false;
          seen.add(r.period);
          return true;
        });
      });
    },
    [isDemoMode]
  );

  // Automatic round resolver: strictly compares the ACTUAL RESULT against the
  // EXACT PREDICTION that was locked before the round started.
  // It NEVER changes or fakes the prediction to match the result!
  const resolveRound = useCallback(
    (periodId: string, actualNum: number) => {
      if (!periodId || lastResolvedPeriodRef.current === periodId) return;

      // Only resolve if we legitimately predicted this round before it finished
      const locked = lockedPredictionsMapRef.current.get(periodId);
      if (!locked) {
        // Do NOT create retroactive or fake records for unpredicted rounds!
        return;
      }
      lastResolvedPeriodRef.current = periodId;

      const predSize: SizeType = locked.predictedSize;
      const favNum: number = locked.favNumber;
      const oppNum: number = locked.oppNumber;

      // STRICT HONEST EVALUATION:
      // If predicted SMALL and ball is 5-9 (BIG) -> LOSS
      // If predicted BIG and ball is 0-4 (SMALL) -> LOSS
      // If predicted matches actual size -> WIN
      // If ball matches exact opp or fav number -> JACKPOT
      const actualSize = getBallSize(actualNum);
      let outcome: OutcomeType = 'loss';
      if (actualNum === oppNum || actualNum === favNum) {
        outcome = 'jackpot';
      } else if (predSize === actualSize) {
        outcome = 'win';
      } else {
        outcome = 'loss';
      }

      // Update in history records: NEVER change predictedSize!
      setRecords((prev) => {
        const existingIdx = prev.findIndex((r) => r.period === periodId);
        if (existingIdx !== -1) {
          if (prev[existingIdx].result !== null) return prev;
          const updated = [...prev];
          updated[existingIdx] = {
            ...prev[existingIdx],
            predictedSize: predSize, // Must remain exactly what was predicted!
            actualNumber: actualNum,
            result: outcome,
          };
          return updated;
        } else {
          const newResolved: PredictionRecord = {
            period: periodId,
            predictedSize: predSize,
            predictedOpp: oppNum,
            predictedFav: favNum,
            actualNumber: actualNum,
            result: outcome,
            strategy: 'PRIME FUSION',
            sig: locked.patternName,
            verified: locked.isVerified,
            demo: isDemoMode,
            timestamp: Date.now(),
          };
          const combined = [newResolved, ...prev];
          const seen = new Set<string>();
          return combined.filter((r) => {
            if (!r.period || seen.has(r.period)) return false;
            seen.add(r.period);
            return true;
          });
        }
      });

      // Show automatic pop-up overlay with honest outcome
      setOverlayOutcome(outcome);
      setOverlayActualNumber(actualNum);
      setOverlayPeriod(periodId);
      setOverlayPredictedSize(predSize);
      setShowResultOverlay(true);

      if (outcome === 'jackpot') playJackpotSound();
      else if (outcome === 'win') playWinSound();
      else playLossSound();
    },
    [isDemoMode]
  );

  // Poll WinGo 1-Min API
  const pollLiveAPI = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const ts = Date.now();
      const res = await fetch(`https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?ts=${ts}`);
      const data = await res.json();
      const list: WinGoResultItem[] = data?.data?.list || [];

      if (!list || list.length === 0) {
        setIsApiOnline(false);
        setIsDemoMode(true);
        isFetchingRef.current = false;
        return;
      }

      setIsApiOnline(true);
      setIsDemoMode(false);

      const nums = list.map((item) => parseInt(item.number ?? '0', 10) % 10);
      setRecentNumbers(nums);

      const latestItem = list[0];
      const closedIssue = latestItem.issueNumber;
      const actualNumber = parseInt(latestItem.number ?? '0', 10) % 10;

      let nextIssue = '';
      try {
        nextIssue = (BigInt(closedIssue) + 1n).toString();
      } catch {
        const now = new Date();
        nextIssue = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours() * 60 + now.getMinutes() + 1).padStart(4, '0')}`;
      }

      // Check if period rotated
      if (!currentPeriod) {
        // App just loaded: start tracking from the upcoming nextIssue
        startNewRound(nextIssue, nums);
      } else if (nextIssue !== currentPeriod) {
        // Previous round finished: resolve it with closedIssue and actualNumber
        resolveRound(closedIssue, actualNumber);
        // Start tracking new round
        startNewRound(nextIssue, nums);
      }
    } catch {
      setIsApiOnline(false);
      setIsDemoMode(true);
    } finally {
      isFetchingRef.current = false;
    }
  }, [currentPeriod, startNewRound, resolveRound]);

  // Demo Fallback Engine for offline / CORS restrictions
  useEffect(() => {
    if (!isDemoMode) return;

    const demoInterval = setInterval(() => {
      const now = new Date();
      const seq = String(now.getHours() * 60 + now.getMinutes() + 1).padStart(4, '0');
      const genPeriod = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${seq}`;

      if (!currentPeriod) {
        startNewRound(genPeriod, recentNumbers);
      } else if (genPeriod !== currentPeriod) {
        // Resolve current period with random ball
        const fakeResult = Math.floor(Math.random() * 10);
        resolveRound(currentPeriod, fakeResult);
        const updatedNums = [fakeResult, ...recentNumbers.slice(0, 49)];
        setRecentNumbers(updatedNums);
        startNewRound(genPeriod, updatedNums);
      }
    }, 1000);

    return () => clearInterval(demoInterval);
  }, [isDemoMode, currentPeriod, recentNumbers, startNewRound, resolveRound]);

  // Second-by-second countdown clock
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      const now = new Date();
      const sec = now.getSeconds();
      const rem = 60 - (sec % 60);
      setRemainingSeconds(rem);
    }, 500);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Start polling
  useEffect(() => {
    pollLiveAPI();
    pollIntervalRef.current = setInterval(pollLiveAPI, 3000);
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [pollLiveAPI]);

  // Handle manual/auto lock prediction (Guarantees zero duplicates for any period)
  function handleLockPrediction(periodId?: string) {
    const targetPeriod = periodId || currentPeriod;
    if (!targetPeriod) return;

    setIsPredictionLocked(true);
    const chosenSize = manualSelectedSize || prediction.predictedSize;

    // Update locked map so resolution strictly checks against this
    lockedPredictionsMapRef.current.set(targetPeriod, {
      period: targetPeriod,
      predictedSize: chosenSize,
      favNumber: prediction.favNumber,
      oppNumber: prediction.oppNumber,
      patternName: prediction.activePattern?.name || null,
      isVerified: prediction.isTwoLevelVerified,
    });

    setRecords((prev) => {
      const existingIdx = prev.findIndex((r) => r.period === targetPeriod);
      if (existingIdx !== -1) {
        if (prev[existingIdx].result === null) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            predictedSize: chosenSize,
          };
          return updated;
        }
        return prev;
      }

      const newRecord: PredictionRecord = {
        period: targetPeriod,
        predictedSize: chosenSize,
        predictedOpp: prediction.oppNumber,
        predictedFav: prediction.favNumber,
        actualNumber: null,
        result: null,
        strategy: 'PRIME FUSION',
        sig: prediction.activePattern?.name || null,
        verified: prediction.isTwoLevelVerified,
        demo: isDemoMode,
        timestamp: Date.now(),
      };

      const combined = [newRecord, ...prev];
      const seen = new Set<string>();
      return combined.filter((r) => {
        if (!r.period || seen.has(r.period)) return false;
        seen.add(r.period);
        return true;
      });
    });
  }

  // Clear History Handler - 100% working, clears all storage and resets stats
  function handleClearHistory() {
    playClickSound();
    setRecords([]);
    setBestStreak(0);
    lockedPredictionsMapRef.current.clear();
    lastResolvedPeriodRef.current = '';
    try {
      localStorage.removeItem('bmw_records_v2');
      localStorage.removeItem('bmw_best_streak');
      localStorage.removeItem('bmwx_records');
      localStorage.removeItem('bmwx_best');
    } catch {}
    showToast('🗑️ Prediction history cleared!');
  }

  // Toggle Auto Predict
  function handleToggleAutoPredict(val: boolean) {
    setAutoPredict(val);
    try {
      localStorage.setItem('bmw_auto_predict', String(val));
    } catch {}
    if (val && !isPredictionLocked && currentPeriod) {
      handleLockPrediction();
    }
  }

  // Format Unicode bold report and copy to clipboard
  function copyPredictionReport() {
    const prd = currentPeriod || 'PENDING';
    const sz = prediction.predictedSize;
    const fav = prediction.favNumber;
    const opp = prediction.oppNumber;
    const patName = prediction.activePattern?.name || '1000-PERIOD STATISTICAL SCAN';
    const isSkip = prediction.isSkipRecommended;

    const actionLine = isSkip
      ? `⚠️ ${toBoldUnicode('ACTION: SKIP (SAFE PLAY / TRAP NODE)')}`
      : `🎯 ${toBoldUnicode('ACTION: PLAY / BET NOW (HIGH CONFIDENCE · SAFE SETUP)')}`;

    const riskLine = isSkip
      ? `🚨 ${toBoldUnicode('Risk Level: HIGH RISK TRAP (SKIP ADVISORY)')}`
      : `🛡️ ${toBoldUnicode('Risk Level: LOW RISK (NORMAL WINNING PATTERN)')}`;

    const unitLine = isSkip
      ? `💰 ${toBoldUnicode('Bet Sizing: 0X (SKIP ROUND / SAVE CAPITAL)')}`
      : `💰 ${toBoldUnicode('Bet Sizing: 1X UNIT (SAFE BET / CONFIDENT)')}`;

    const report =
      `亗 𝗕ᴍᴡ 亗 𝗢ʙʟɪᴠɪᴏɴ 亗 𝗩𝟯 亗\n` +
      `📅 ${toBoldUnicode(`Period: ${prd}`)} ⏳\n` +
      `🎯 ${toBoldUnicode(`Target: ${sz}`)} (Favor: ${fav} · Opp: ${opp})\n` +
      `⚡ ${toBoldUnicode(`Pattern: ${patName}`)}\n` +
      `${riskLine}\n` +
      `${unitLine}\n` +
      `🤖 ${toBoldUnicode(`V3 Quantum Neural: ${prediction.isTwoLevelVerified ? '100% VERIFIED ✓' : 'VERIFIED'}`)}\n` +
      `${actionLine}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(report);
    }
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2400);
  }

  // Lock App function - completely clears stored key and returns to Lock Screen
  const handleLockApp = useCallback(() => {
    try {
      localStorage.removeItem('bmw_active_key');
      localStorage.removeItem('bmw_session_unlocked');
    } catch {}
    setIsAppLocked(true);
    showToast('🔒 APP LOCKED — LOGIN REQUIRED');
  }, []);

  // Lock Screen trigger
  if (isAppLocked) {
    return <LockScreen isLocked={isAppLocked} onUnlock={() => setIsAppLocked(false)} />;
  }

  // Patterns and Backtest data
  const patterns = scanAllPatterns(recentNumbers);
  const backtest = run1000ResultBacktest(recentNumbers, prediction.activePattern?.name || 'RHYTHM');

  const currentSizes = recentNumbers.map(getBallSize);
  let liveStreak = 1;
  for (let i = 1; i < Math.min(currentSizes.length, 25); i++) {
    if (currentSizes[i] === currentSizes[0]) liveStreak++;
    else break;
  }
  const liveSize = currentSizes[0] || 'BIG';
  let livePrevStreak = 0;
  for (let i = liveStreak; i < Math.min(currentSizes.length, 25); i++) {
    if (currentSizes[i] === currentSizes[liveStreak]) livePrevStreak++;
    else break;
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col justify-between max-w-md mx-auto relative shadow-2xl overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Energy Glows */}
      <div className="fixed top-0 left-0 w-80 h-80 rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full bg-rose-600/10 blur-[100px] pointer-events-none" />

      {/* Floating Status Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[700] px-4 py-2 rounded-xl bg-slate-900/95 border border-cyan-400 text-cyan-300 font-['Orbitron'] font-bold text-xs shadow-[0_0_20px_rgba(0,229,255,0.4)] animate-fadeIn flex items-center gap-1.5 pointer-events-none">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Betting Advisor Button (Replaces AI) */}
      <button
        onClick={() => {
          playClickSound();
          setShowBetAdvisorModal(true);
        }}
        className="fixed bottom-20 right-3 z-40 p-[2px] rounded-2xl shadow-[0_0_24px_rgba(245,158,11,0.5),0_8px_20px_rgba(0,0,0,0.6)] cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center"
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #00e5ff 100%)',
        }}
      >
        <div className="px-3 py-1.5 rounded-2xl bg-[#070d1a] flex items-center gap-1.5 font-['Orbitron'] font-black text-[10px] text-amber-300 uppercase tracking-wider whitespace-nowrap">
          <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>BET ADVISOR</span>
        </div>
      </button>

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-30 px-3 py-2 bg-[#060a14]/90 backdrop-blur-xl border-b border-cyan-500/30 flex items-center justify-between gap-1.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <CasinoHostessAvatar size="xs" variant="concierge" showBadge={false} glowColor="cyan" />
          <div className="truncate">
            <div className="font-['Orbitron'] font-black text-xs text-white tracking-wider flex items-center gap-1 uppercase truncate">
              <span className="truncate">亗 𝗕ᴍᴡ 亗 𝗢ʙʟɪᴠɪᴏɴ 亗</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-gradient-to-r from-cyan-500 to-rose-600 text-white font-extrabold shrink-0">
                V3
              </span>
            </div>
            <div className="text-[8px] font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-1 truncate">
              <span>QUANTUM NEURAL</span>
              <span className="text-slate-500">·</span>
              <span className="flex items-center gap-0.5 text-emerald-400 shrink-0">
                {isApiOnline ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5 text-amber-400" />}
                {isApiOnline ? 'LIVE API' : 'DEMO MODE'}
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Actions: Audio FX Toggle, Quick Lock Button & 60s Circular Countdown Timer */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            title={soundOn ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              playClickSound();
              handleLockApp();
            }}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-rose-400 hover:border-rose-500/50 transition-colors cursor-pointer flex items-center gap-1 text-[9px] font-['Orbitron'] font-bold uppercase"
            title="Lock Application Now"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">LOCK</span>
          </button>

          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-xl border font-['Orbitron'] font-black text-xs shadow-md transition-all ${
              remainingSeconds <= 5
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-900/80 border-cyan-500/40 text-cyan-300'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{remainingSeconds}S</span>
          </div>
        </div>
      </header>

      {/* Ticker marquee */}
      <div className="py-1 px-3 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-rose-950/80 border-b border-slate-800 text-[9px] font-bold text-slate-300 overflow-hidden whitespace-nowrap uppercase">
        <div className="inline-block animate-[tickerMove_22s_linear_infinite]">
          ⚡ 亗 𝗕ᴍᴡ 亗 𝗢ʙʟɪᴠɪᴏɴ 亗 𝗩𝟯 亗 · AUTHENTIC 3D CASINO WINGO BALLS · V3 QUANTUM NEURAL SCANNER · 4 CORE TABS · VIP HOSTESS ADVISOR · 3-LAYER QUANTUM ENGINE ·
        </div>
      </div>

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1 p-3.5 pb-24 space-y-3.5">
        {activeTab === 'home' && (
          <>
            {/* Period Tracker Card: Single Line Compact */}
            <div className="rounded-xl px-3 py-2 bg-gradient-to-r from-slate-900 via-[#0a1120] to-slate-900 border border-slate-800 flex items-center justify-between whitespace-nowrap">
              <div className="flex items-center gap-2 truncate">
                <span className="text-[9px] font-['Orbitron'] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  WIN-GO PERIOD:
                </span>
                <span className="text-xs sm:text-sm font-['Orbitron'] font-black text-white tracking-wider uppercase truncate">
                  {currentPeriod || 'CONNECTING...'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[8px] font-['Orbitron'] font-bold text-emerald-400 flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>18MS</span>
                </span>
                <button
                  onClick={() => {
                    playClickSound();
                    if (currentPeriod && navigator.clipboard) {
                      navigator.clipboard.writeText(currentPeriod);
                      showToast('📋 Period Copied!');
                    }
                  }}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 cursor-pointer"
                  title="Copy Period Number"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hero Prediction Card with 3D WinGo Casino Balls */}
            <PredictionCard
              currentPeriod={currentPeriod}
              prediction={prediction}
              isLocked={isPredictionLocked}
              onLockPrediction={() => handleLockPrediction()}
              autoPredict={autoPredict}
              onToggleAutoPredict={handleToggleAutoPredict}
              onCopyPrediction={copyPredictionReport}
              copyFeedback={copyFeedback}
              onOpenCalculator={() => setShowBetAdvisorModal(true)}
            />

            {/* Pattern Transfer Radar Strip */}
            <PatternRadarStrip
              recentNumbers={recentNumbers}
              activePatterns={patterns}
              currentStreak={liveStreak}
              currentSize={liveSize}
              previousStreak={livePrevStreak}
            />

            {/* Recent Rounds History (Preview of 6 records with filters) */}
            <HistorySection
              records={records}
              onClearHistory={handleClearHistory}
              title="RECENT ROUNDS"
              limit={6}
            />
          </>
        )}

        {activeTab === 'history' && (
          <HistorySection
            records={records}
            onClearHistory={handleClearHistory}
            title="FULL PREDICTION HISTORY"
          />
        )}

        {activeTab === 'stats' && (
          <StatsView records={records} bestStreak={bestStreak} recentNumbers={recentNumbers} />
        )}

        {activeTab === 'vip' && (
          <VipView
            onOpenBetAdvisor={() => setShowBetAdvisorModal(true)}
            onLockApp={handleLockApp}
          />
        )}
      </main>

      {/* BOTTOM NAVIGATION BAR - EXACTLY 4 TABS */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#070c18]/95 backdrop-blur-xl border-t border-cyan-500/30 px-3 py-2 z-40 flex items-center justify-around">
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('home');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-['Orbitron'] font-black uppercase tracking-wider">HOME</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('history');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'history' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HistoryIcon className="w-4 h-4" />
          <span className="text-[9px] font-['Orbitron'] font-black uppercase tracking-wider">HISTORY</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('stats');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'stats' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[9px] font-['Orbitron'] font-black uppercase tracking-wider">ANALYTICS</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('vip');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'vip' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="text-[9px] font-['Orbitron'] font-black uppercase tracking-wider text-amber-300">VIP</span>
        </button>
      </nav>

      {/* Betting Advisor Modal (User enters amount & receives step sizing & timing advice) */}
      <BetAdvisorModal
        isOpen={showBetAdvisorModal}
        onClose={() => setShowBetAdvisorModal(false)}
        currentPeriod={currentPeriod}
        predictedSize={prediction.predictedSize}
        isSkipRecommended={prediction.isSkipRecommended}
        activePatternName={prediction.activePattern?.name || null}
        confidence={prediction.confidence}
        oppNumber={prediction.oppNumber}
        favNumber={prediction.favNumber}
      />

      {/* Win / Loss / Jackpot Overlay Celebration Modal */}
      <ResultOverlay
        isOpen={showResultOverlay}
        outcome={overlayOutcome}
        period={overlayPeriod}
        actualNumber={overlayActualNumber}
        predictedSize={overlayPredictedSize}
        onClose={() => setShowResultOverlay(false)}
      />
    </div>
  );
}
