import React from 'react';

export type HostessVariant = 'hostess' | 'winner' | 'concierge' | 'advisor';

interface CasinoHostessAvatarProps {
  variant?: HostessVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  glowColor?: 'cyan' | 'amber' | 'rose' | 'emerald' | 'purple';
  showBadge?: boolean;
  className?: string;
}

export const CasinoHostessAvatar: React.FC<CasinoHostessAvatarProps> = ({
  variant = 'hostess',
  size = 'md',
  speechBubble,
  glowColor = 'cyan',
  showBadge = true,
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const glowClass = {
    cyan: 'shadow-[0_0_20px_rgba(0,229,255,0.45)] border-cyan-400/50',
    amber: 'shadow-[0_0_20px_rgba(245,158,11,0.5)] border-amber-400/60',
    rose: 'shadow-[0_0_20px_rgba(244,63,94,0.5)] border-rose-400/60',
    emerald: 'shadow-[0_0_20px_rgba(16,185,129,0.5)] border-emerald-400/60',
    purple: 'shadow-[0_0_20px_rgba(168,85,247,0.5)] border-purple-400/60',
  }[glowColor];

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Avatar Container with Glass Bezel */}
      <div
        className={`relative ${sizeMap[size]} rounded-2xl p-0.5 bg-gradient-to-b from-[#1a2744] via-[#0d1627] to-[#060a14] border ${glowClass} overflow-hidden shrink-0 flex items-center justify-center animate-cyberFloat`}
      >
        {/* Subtle Ambient Background Mesh */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-rose-500/20 pointer-events-none" />

        {/* High-Fidelity Vector SVG Casino Hostess / Croupier */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skin Tone Gradient */}
            <linearGradient id="skinGrad" x1="50" y1="20" x2="50" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFE0BD" />
              <stop offset="1" stopColor="#F5C6A5" />
            </linearGradient>

            {/* Hair Gradient */}
            <linearGradient id="hairGrad" x1="30" y1="10" x2="70" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E1E2E" />
              <stop offset="0.6" stopColor="#2A1B3D" />
              <stop offset="1" stopColor="#442055" />
            </linearGradient>

            {/* Tuxedo Velvet Gradient */}
            <linearGradient id="tuxGrad" x1="50" y1="60" x2="50" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B132B" />
              <stop offset="0.5" stopColor="#1C2541" />
              <stop offset="1" stopColor="#070B19" />
            </linearGradient>

            {/* Gold Lapel Trim */}
            <linearGradient id="goldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047" />
              <stop offset="0.5" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>

            {/* Cyber Cyan Neon Accent */}
            <linearGradient id="cyanNeon" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22D3EE" />
              <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>

            {/* Ruby Rose Accent */}
            <linearGradient id="roseAccent" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FB7185" />
              <stop offset="1" stopColor="#E11D48" />
            </linearGradient>
          </defs>

          {/* Background Ambient Halo */}
          <circle cx="50" cy="45" r="42" fill="url(#cyanNeon)" opacity="0.1" />

          {/* Hair - Back Flow */}
          <path
            d="M26 42C24 55 24 70 28 85C32 87 36 82 35 72C33 60 34 50 35 44Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M74 42C76 55 76 70 72 85C68 87 64 82 65 72C67 60 66 50 65 44Z"
            fill="url(#hairGrad)"
          />

          {/* Neck & Shoulders */}
          <path d="M44 54H56V66H44V54Z" fill="url(#skinGrad)" />

          {/* Luxury Casino Tuxedo / Vest */}
          <path
            d="M22 100C22 78 30 68 44 64L50 78L56 64C70 68 78 78 78 100H22Z"
            fill="url(#tuxGrad)"
          />

          {/* Gold Lapels */}
          <path d="M44 64L35 78L45 100H49L41 78L48 68L44 64Z" fill="url(#goldGrad)" />
          <path d="M56 64L65 78L55 100H51L59 78L52 68L56 64Z" fill="url(#goldGrad)" />

          {/* White Dress Shirt & Casino Bowtie */}
          <polygon points="46,65 54,65 50,75" fill="#FFFFFF" />
          <polygon points="45,69 55,69 50,73" fill="url(#roseAccent)" />
          <circle cx="50" cy="71" r="1.5" fill="#FDE047" />

          {/* Head & Face */}
          <path
            d="M33 36C33 24 40 16 50 16C60 16 67 24 67 36C67 47 59 56 50 56C41 56 33 47 33 36Z"
            fill="url(#skinGrad)"
          />

          {/* Hair - Front Bangs & Chic Modern Styling */}
          <path
            d="M31 34C31 22 39 14 50 14C61 14 69 22 69 34C69 37 66 38 65 32C63 24 57 20 50 20C42 20 37 25 35 32C34 38 31 37 31 34Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M34 26C38 30 44 32 50 31C56 30 63 26 66 22C61 18 55 16 49 16C42 16 37 19 34 26Z"
            fill="url(#hairGrad)"
          />

          {/* Gold VIP Hairpin / Tiara Jewel */}
          <circle cx="64" cy="22" r="3.2" fill="url(#goldGrad)" />
          <polygon points="64,17 65.5,21 69,22 65.5,23 64,27 62.5,23 59,22 62.5,21" fill="#FFF" />

          {/* Cyberpunk Ear-Cuff / Comm Headset */}
          <path d="M67 35C69 35 70 38 70 41C70 43 68 45 67 45" stroke="#22D3EE" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="70" cy="41" r="1.5" fill="#22D3EE" />

          {/* Elegant Eyes & Lashes */}
          <path d="M39 36C41 34 44 34 46 36" stroke="#2D150B" strokeWidth="1.6" strokeLinecap="round" />
          <ellipse cx="42.5" cy="38" rx="2.5" ry="3" fill="#6B21A8" />
          <circle cx="43.5" cy="37" r="1" fill="#FFFFFF" />
          <circle cx="41.5" cy="39" r="0.5" fill="#22D3EE" />

          <path d="M54 36C56 34 59 34 61 36" stroke="#2D150B" strokeWidth="1.6" strokeLinecap="round" />
          <ellipse cx="57.5" cy="38" rx="2.5" ry="3" fill="#6B21A8" />
          <circle cx="58.5" cy="37" r="1" fill="#FFFFFF" />
          <circle cx="56.5" cy="39" r="0.5" fill="#22D3EE" />

          {/* Soft Cheeks Blush */}
          <circle cx="38" cy="42" r="2.5" fill="#FB7185" opacity="0.4" />
          <circle cx="62" cy="42" r="2.5" fill="#FB7185" opacity="0.4" />

          {/* Cute Nose & Confident Smile */}
          <path d="M49 41L50 43L51 41" stroke="#E1A17C" strokeWidth="1" strokeLinecap="round" />
          {variant === 'winner' ? (
            <path d="M45 47C47 51 53 51 55 47" fill="#E11D48" stroke="#BE123C" strokeWidth="1" strokeLinecap="round" />
          ) : (
            <path d="M46 47C48 49.5 52 49.5 54 47" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" />
          )}

          {/* Variant-Specific Accents */}
          {variant === 'winner' && (
            <g>
              {/* Golden Victory Sparkles */}
              <polygon points="20,20 22,25 27,27 22,29 20,34 18,29 13,27 18,25" fill="#FDE047" />
              <polygon points="80,24 81.5,28 85,29.5 81.5,31 80,35 78.5,31 75,29.5 78.5,28" fill="#FDE047" />
              {/* Golden Casino Chip Held */}
              <circle cx="28" cy="74" r="8" fill="url(#goldGrad)" stroke="#FFFFFF" strokeWidth="1" />
              <text x="28" y="77" fontSize="7" fontWeight="bold" fill="#000" textAnchor="middle">VIP</text>
            </g>
          )}

          {variant === 'concierge' && (
            <g>
              {/* Cyber Monocle / Scanner HUD */}
              <circle cx="57.5" cy="38" r="5" stroke="#22D3EE" strokeWidth="1.2" strokeDasharray="2,1" fill="#22D3EE" fillOpacity="0.15" />
              <line x1="62.5" y1="38" x2="68" y2="35" stroke="#22D3EE" strokeWidth="1" />
            </g>
          )}

          {variant === 'advisor' && (
            <g>
              {/* Neural Data Grid Micro Sparkles */}
              <circle cx="78" cy="65" r="4.5" fill="#10B981" />
              <text x="78" y="67.5" fontSize="5" fontWeight="bold" fill="#000" textAnchor="middle">₹</text>
            </g>
          )}
        </svg>

        {/* Live Status Indicator Dot */}
        {showBadge && (
          <span className="absolute bottom-0.5 right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-900" />
          </span>
        )}
      </div>

      {/* Optional Speech Bubble */}
      {speechBubble && (
        <div className="ml-2.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-slate-900/95 to-slate-950/95 border border-cyan-500/40 text-[10px] font-['Orbitron'] font-bold text-cyan-200 tracking-wide shadow-lg backdrop-blur-md relative max-w-[200px] animate-fadeIn">
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[6px] border-r-cyan-500/40" />
          <span className="text-amber-400 mr-1">亗</span>
          {speechBubble}
        </div>
      )}
    </div>
  );
};
