import React, { useState, useRef } from 'react';
import { LogoEmblem } from './LogoEmblem';
import { Crown, Lock, Volume2, VolumeX, Music, Gamepad2, Play, Pause, Square, ExternalLink, ShieldCheck } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../utils/sound';

interface ProfileViewProps {
  onLockApp: () => void;
  onLaunchGame: (url: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onLockApp, onLaunchGame }) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [gameUrl, setGameUrl] = useState(() => {
    try {
      return localStorage.getItem('bmw_game_url') || 'https://bdgwin4.cc//#/register?invitationCode=5281410083715';
    } catch {
      return 'https://bdgwin4.cc//#/register?invitationCode=5281410083715';
    }
  });

  const [musicFile, setMusicFile] = useState<string | null>(() => {
    try {
      return localStorage.getItem('bmw_music_data') || null;
    } catch {
      return null;
    }
  });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  }

  function handleMusicUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        setMusicFile(dataUrl);
        try {
          localStorage.setItem('bmw_music_data', dataUrl);
        } catch {}
      }
    };
    reader.readAsDataURL(file);
  }

  function playMusic() {
    if (!musicFile) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(musicFile);
      audioRef.current.loop = true;
    }
    audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
  }

  function pauseMusic() {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    }
  }

  function stopMusic() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingMusic(false);
    }
  }

  function handleLaunch() {
    playClickSound();
    if (!gameUrl.trim()) return;
    let url = gameUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    try {
      localStorage.setItem('bmw_game_url', url);
    } catch {}
    onLaunchGame(url);
  }

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="rounded-3xl p-5 bg-gradient-to-b from-[#0f172a] to-[#070b16] border border-cyan-500/40 shadow-xl">
        <div className="flex items-center gap-4">
          <LogoEmblem size="md" glow={true} />
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-['Orbitron'] font-black text-xs">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>PRIME OWNER VIP</span>
            </div>
            <h2 className="text-lg font-black font-['Orbitron'] text-white tracking-wider mt-0.5">
              亗 𝗕ᴍᴡ 亗 𝗢ʙʟɪᴠɪᴏɴ 亗 𝗩𝟮 亗
            </h2>
            <p className="text-[11px] font-bold text-cyan-400 tracking-wide">
              Neural WinGo Casino AI · Engine v2.0
            </p>
          </div>
        </div>

        {/* Lock App Button */}
        <button
          onClick={onLockApp}
          className="mt-4 w-full py-2.5 rounded-xl font-['Orbitron'] font-bold text-xs tracking-wider text-rose-400 bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>LOCK ENGINE WITH KEY</span>
        </button>
      </div>

      {/* Sound & Music Controls */}
      <div className="rounded-3xl p-5 bg-gradient-to-b from-[#0f172a] to-[#070b16] border border-cyan-500/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span className="font-['Orbitron'] font-black text-xs text-white uppercase tracking-wider">
              AUDIO & SOUND EFFECTS
            </span>
          </div>

          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundOn
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Music Player */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
            <Music className="w-3.5 h-3.5 text-cyan-400" />
            <span>BACKGROUND CASINO MUSIC</span>
          </div>

          <input
            type="file"
            accept="audio/*"
            onChange={handleMusicUpload}
            className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-cyan-500 file:text-slate-950 file:cursor-pointer mb-2.5"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={playMusic}
              disabled={!musicFile || isPlayingMusic}
              className="flex-1 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>PLAY</span>
            </button>
            <button
              onClick={pauseMusic}
              disabled={!isPlayingMusic}
              className="flex-1 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <Pause className="w-3 h-3 fill-current" />
              <span>PAUSE</span>
            </button>
            <button
              onClick={stopMusic}
              className="flex-1 py-1.5 rounded-lg bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>STOP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Launcher Card */}
      <div className="rounded-3xl p-5 bg-gradient-to-b from-[#0f172a] to-[#070b16] border border-cyan-500/40 shadow-xl space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Gamepad2 className="w-4 h-4 text-cyan-400" />
          <span className="font-['Orbitron'] font-black text-xs text-white uppercase tracking-wider">
            CASINO GAME LAUNCHER
          </span>
        </div>

        <input
          type="text"
          value={gameUrl}
          onChange={(e) => setGameUrl(e.target.value)}
          placeholder="https://your-game-link.com"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-400"
        />

        <button
          onClick={handleLaunch}
          className="w-full py-3 rounded-xl font-['Orbitron'] font-black text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          <span>LAUNCH GAME SCREEN</span>
        </button>
      </div>
    </div>
  );
};
