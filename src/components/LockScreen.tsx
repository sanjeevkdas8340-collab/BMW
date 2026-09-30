import React, { useState, useEffect } from 'react';
import { LogoEmblem } from './LogoEmblem';
import { KeyLicense } from '../types';
import { playClickSound, playLockSound } from '../utils/sound';
import { Key, ShieldAlert, CheckCircle2, Lock, Copy, X, Sparkles, Clock, Trash2 } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
  isLocked: boolean;
}

const ADMIN_SECRET = 'BMW X PAPA';

function keyChecksum(body: string): string {
  const KS = 'BMWXPAPA77#1';
  const t = body + KS;
  let h = 5381;
  let g = 5387;
  for (let i = 0; i < t.length; i++) {
    h = ((h << 5) + h + t.charCodeAt(i)) >>> 0;
    g = (g * 33 + t.charCodeAt(i)) % 99991;
  }
  const c = (h % 9973 + g % 9887) % 10000;
  return String(c).padStart(4, '0');
}

export function parseKey(raw: string): { key: string; days: number } | null {
  const k = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const m = k.match(/^BMW(?:(\d{1,4})DAY|LIFE)(\d{12})$/);
  if (!m) return null;
  const body = k.slice(0, k.length - 4);
  if (keyChecksum(body) !== k.slice(-4)) return null;
  const days = m[1] ? parseInt(m[1], 10) : 0;
  if (m[1] && (days < 1 || days > 3650)) return null;
  return { key: k, days };
}

export function formatKeyWithDashes(k: string): string {
  const clean = String(k || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const m = clean.match(/^(BMW(?:\d{1,4}DAY|LIFE))(\d{12})$/);
  if (!m) return clean;
  const d = m[2];
  return `${m[1]}-${d.slice(0, 4)}-${d.slice(4, 8)}-${d.slice(8, 12)}`;
}

export function generatePortableKey(days: number): string {
  const code = days === 0 ? 'LIFE' : `${days}DAY`;
  let rnd = '';
  for (let i = 0; i < 8; i++) {
    rnd += Math.floor(Math.random() * 10);
  }
  const body = `BMW${code}${rnd}`;
  return body + keyChecksum(body);
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, isLocked }) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeKeyData, setActiveKeyData] = useState<KeyLicense | null>(null);

  // Admin Panel states
  const [selectedAdminDays, setSelectedAdminDays] = useState<number>(7);
  const [isCustomDays, setIsCustomDays] = useState(false);
  const [customDaysVal, setCustomDaysVal] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [keyList, setKeyList] = useState<KeyLicense[]>([]);

  // Check stored active key
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bmw_active_key');
      if (stored) {
        const parsed = JSON.parse(stored) as KeyLicense;
        if (parsed.expiresAt === null || parsed.expiresAt > Date.now()) {
          setActiveKeyData(parsed);
          onUnlock();
        } else {
          localStorage.removeItem('bmw_active_key');
        }
      }
      loadAdminKeys();
    } catch {}
  }, []);

  function loadAdminKeys() {
    try {
      const stored = localStorage.getItem('bmw_all_keys');
      if (stored) {
        setKeyList(JSON.parse(stored));
      }
    } catch {}
  }

  function handleUnlockAttempt() {
    playClickSound();
    const clean = inputValue.trim().toUpperCase();

    // Admin secret trigger (entered twice)
    if (clean === ADMIN_SECRET) {
      const nextCount = adminClicks + 1;
      setAdminClicks(nextCount);
      if (nextCount >= 2) {
        setAdminClicks(0);
        setShowAdmin(true);
        setErrorMessage('');
        setSuccessMessage('👑 ADMIN PANEL UNLOCKED');
        return;
      }
      setErrorMessage('⛔ INVALID KEY — ACCESS DENIED');
      triggerShake();
      return;
    }
    setAdminClicks(0);

    // Master VIP Passkeys for instant access
    if (clean === 'BMW' || clean === 'BMWVIP' || clean === 'BMW777' || clean === 'BMWLIFE' || clean === 'VIP') {
      const now = Date.now();
      const license: KeyLicense = {
        key: clean,
        days: 0,
        createdAt: now,
        used: true,
        activatedAt: now,
        expiresAt: null,
      };
      localStorage.setItem('bmw_active_key', JSON.stringify(license));
      setActiveKeyData(license);
      setSuccessMessage('🔓 VIP ACCESS UNLOCKED!');
      playLockSound();
      setTimeout(() => {
        onUnlock();
      }, 500);
      return;
    }

    const parsed = parseKey(clean);
    if (!parsed) {
      setErrorMessage('⛔ INVALID KEY — ENTER BMWVIP OR 16-DIGIT KEY');
      triggerShake();
      return;
    }

    const now = Date.now();
    const expiresAt = parsed.days === 0 ? null : now + parsed.days * 86400000;
    const license: KeyLicense = {
      key: parsed.key,
      days: parsed.days,
      createdAt: now,
      used: true,
      activatedAt: now,
      expiresAt,
    };

    localStorage.setItem('bmw_active_key', JSON.stringify(license));
    setActiveKeyData(license);
    setSuccessMessage(parsed.days === 0 ? '🔓 PERMANENT ACCESS UNLOCKED!' : `🔓 UNLOCKED FOR ${parsed.days} DAYS!`);
    playLockSound();

    setTimeout(() => {
      onUnlock();
    }, 600);
  }

  function triggerShake() {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }

  function handleAdminGenerate() {
    let days = selectedAdminDays;
    if (isCustomDays) {
      const parsedDays = parseInt(customDaysVal, 10);
      if (!parsedDays || parsedDays < 1) {
        setErrorMessage('PLEASE ENTER VALID NUMBER OF DAYS (> 0)');
        return;
      }
      days = parsedDays;
    }

    const newKey = generatePortableKey(days);
    const newLicense: KeyLicense = {
      key: newKey,
      days,
      createdAt: Date.now(),
      used: false,
      activatedAt: null,
      expiresAt: null,
    };

    const updated = [newLicense, ...keyList];
    setKeyList(updated);
    localStorage.setItem('bmw_all_keys', JSON.stringify(updated));
    setGeneratedKey(newKey);
    playLockSound();
  }

  function copyToClipboard(text: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  function deleteAdminKey(keyToDelete: string) {
    const updated = keyList.filter(k => k.key !== keyToDelete);
    setKeyList(updated);
    localStorage.setItem('bmw_all_keys', JSON.stringify(updated));
  }

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#030611]/90 backdrop-blur-xl">
      {/* Background Animated Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-rose-500/15 blur-3xl pointer-events-none animate-pulse" />

      <div
        className={`relative w-full max-w-sm rounded-3xl p-6 sm:p-7 text-center bg-gradient-to-b from-[#0e1629]/95 to-[#060a14]/98 border border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,229,255,0.2)] ${
          isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
        }`}
      >
        {/* Emblem Logo */}
        <div className="mb-4 flex justify-center">
          <LogoEmblem size="lg" glow={true} />
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-black font-['Orbitron'] tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-rose-400 bg-clip-text text-transparent">
          亗 𝗕ᴍᴡ 亗 𝗢ʙʟɪ𝗩ɪ𝗢ɴ 亗 𝗩𝟮 亗
        </h1>
        <p className="text-[11px] font-bold text-slate-400 tracking-widest mt-1 uppercase">
          Predict Play and Win · Neural Casino Engine
        </p>

        {/* Status Prompt */}
        <div className="mt-5 p-3 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
          <Key className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>ENTER ACCESS LICENSE KEY</span>
        </div>

        {/* Input */}
        <div className="mt-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlockAttempt()}
            placeholder="BMWVIP OR 16-DIGIT KEY"
            className="w-full text-center px-4 py-3 rounded-xl font-['Orbitron'] font-bold text-xs tracking-widest uppercase bg-slate-950/90 border-2 border-cyan-500/40 text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Unlock Button */}
        <button
          onClick={handleUnlockAttempt}
          className="mt-3 w-full py-3 rounded-xl font-['Orbitron'] font-black text-xs tracking-wider uppercase text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-rose-600 hover:from-cyan-400 hover:to-rose-500 active:scale-98 shadow-[0_4px_20px_rgba(30,111,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>LOGIN & UNLOCK</span>
        </button>

        {/* Quick 1-Tap Unlock */}
        <button
          onClick={() => {
            playClickSound();
            const now = Date.now();
            const license: KeyLicense = {
              key: 'BMWVIP',
              days: 0,
              createdAt: now,
              used: true,
              activatedAt: now,
              expiresAt: null,
            };
            localStorage.setItem('bmw_active_key', JSON.stringify(license));
            setActiveKeyData(license);
            setSuccessMessage('🔓 VIP ACCESS GRANTED!');
            playLockSound();
            setTimeout(() => {
              onUnlock();
            }, 500);
          }}
          className="mt-2 w-full py-2.5 rounded-xl font-['Orbitron'] font-black text-[10px] tracking-wider uppercase text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/50 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>⚡ QUICK 1-TAP UNLOCK (VIP)</span>
        </button>

        {/* Existing Active Key Continue (if any) */}
        {activeKeyData && (
          <button
            onClick={onUnlock}
            className="mt-2 w-full py-2.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Key Loaded · Click to Resume</span>
          </button>
        )}

        {/* Status message */}
        {errorMessage && (
          <div className="mt-3 text-xs font-bold text-rose-400 flex items-center justify-center gap-1.5 animate-fadeIn">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mt-3 text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="mt-5 text-[10px] text-slate-500 tracking-wider">
          2-LEVEL VERIFIED · 1000 RESULT LIVE ARCHIVE · CASINO BALLS
        </div>
      </div>

      {/* ================= ADMIN MODAL ================= */}
      {showAdmin && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 bg-gradient-to-b from-[#0f172a] to-[#070d19] border border-cyan-500/50 shadow-2xl">
            <button
              onClick={() => setShowAdmin(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <LogoEmblem size="sm" />
              <h2 className="text-lg font-black font-['Orbitron'] text-cyan-400 mt-2">
                👑 ADMIN KEY GENERATOR
              </h2>
              <p className="text-xs text-slate-400">Generate valid keys for any device</p>
            </div>

            {/* Days picker */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { label: '3 Days', d: 3 },
                { label: '7 Days', d: 7 },
                { label: '30 Days', d: 30 },
                { label: 'Lifetime', d: 0 },
              ].map((item) => (
                <button
                  key={item.d}
                  onClick={() => {
                    setIsCustomDays(false);
                    setSelectedAdminDays(item.d);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-['Orbitron'] font-bold border transition-all ${
                    !isCustomDays && selectedAdminDays === item.d
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.6)]'
                      : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Custom days input option */}
            <div className="mb-4">
              <button
                onClick={() => setIsCustomDays(!isCustomDays)}
                className="text-xs font-semibold text-cyan-400 hover:underline mb-2 block"
              >
                {isCustomDays ? '✓ Custom Days Mode' : '+ Set Custom Number of Days'}
              </button>
              {isCustomDays && (
                <input
                  type="number"
                  placeholder="Enter days (e.g. 15, 60, 365)"
                  value={customDaysVal}
                  onChange={(e) => setCustomDaysVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/50 text-white text-xs font-['Orbitron']"
                />
              )}
            </div>

            {/* Generate Action */}
            <button
              onClick={handleAdminGenerate}
              className="w-full py-3 rounded-xl font-['Orbitron'] font-black text-xs uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>GENERATE 16-DIGIT KEY</span>
            </button>

            {/* Generated Key Display */}
            {generatedKey && (
              <div className="mt-4 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/60 text-center animate-fadeIn">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                  NEW KEY CREATED
                </span>
                <div className="font-['Orbitron'] font-black text-sm text-white tracking-widest select-all">
                  {formatKeyWithDashes(generatedKey)}
                </div>
                <button
                  onClick={() => {
                    copyToClipboard(formatKeyWithDashes(generatedKey));
                    alert('Copied to clipboard!');
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold font-['Orbitron'] hover:bg-cyan-400 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY KEY</span>
                </button>
              </div>
            )}

            {/* Keys History */}
            <div className="mt-5 border-t border-slate-800 pt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>SAVED KEYS ({keyList.length})</span>
              </span>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-left">
                {keyList.map((k) => (
                  <div
                    key={k.key}
                    className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-['Orbitron'] font-bold text-slate-200 text-[11px] tracking-wider">
                        {formatKeyWithDashes(k.key)}
                      </div>
                      <span className="text-[9px] text-cyan-400 font-semibold">
                        {k.days === 0 ? 'PERMANENT' : `${k.days} Days`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyToClipboard(formatKeyWithDashes(k.key))}
                        className="p-1.5 text-slate-400 hover:text-cyan-300"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteAdminKey(k.key)}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
