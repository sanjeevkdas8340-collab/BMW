import React, { useState } from 'react';

interface LogoEmblemProps {
  size?: 'nav' | 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  glow?: boolean;
}

const sizeMap = {
  nav: 'w-9 h-9',
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  hero: 'w-32 h-32',
};

export const LogoEmblem: React.FC<LogoEmblemProps> = ({
  size = 'md',
  className = '',
  glow = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const dim = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full flex-shrink-0 select-none ${dim} ${className}`}
      style={{
        boxShadow: glow
          ? '0 0 24px rgba(0, 229, 255, 0.5), 0 0 45px rgba(255, 39, 64, 0.4), inset 0 0 14px rgba(255, 255, 255, 0.3)'
          : undefined,
      }}
    >
      {/* Outer Dual-Dragon Energy Border (Left Cyan / Right Crimson) */}
      <div
        className="absolute -inset-0.5 rounded-full p-[2px] pointer-events-none"
        style={{
          background: 'conic-gradient(from 180deg, #00e5ff 0deg, #1e6fff 90deg, #ff2740 180deg, #e930c8 270deg, #00e5ff 360deg)',
          filter: 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.6))',
        }}
      />

      <div className="relative w-full h-full rounded-full overflow-hidden bg-[#060a16] border border-cyan-400/40 flex items-center justify-center">
        {!imgError ? (
          <img
            src="76f3b932-904a-4ae9-907a-3d826e5f7560.png"
            alt="BMW Oblivion V2 Emblem"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          /* High-Fidelity Dual-Dragon BMW Oblivion V2 SVG Emblem Fallback */
          <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="58" fill="#060913" />
            <circle cx="60" cy="60" r="56" stroke="url(#dragonRing)" strokeWidth="3" />
            
            {/* Left Dragon Fire Glow (Red) */}
            <path d="M12 70 Q 25 35 48 48 Q 28 65 35 90 Z" fill="url(#fireDragon)" opacity="0.85" />
            {/* Right Dragon Lightning Glow (Cyan) */}
            <path d="M108 70 Q 95 35 72 48 Q 92 65 85 90 Z" fill="url(#iceDragon)" opacity="0.85" />

            {/* BMW Center Roundel */}
            <circle cx="60" cy="38" r="16" fill="#0a1020" stroke="#aab6c8" strokeWidth="1.5" />
            <path d="M60 22 A16 16 0 0 1 76 38 L60 38 Z" fill="#00e5ff" />
            <path d="M60 54 A16 16 0 0 1 44 38 L60 38 Z" fill="#00e5ff" />
            <path d="M44 38 A16 16 0 0 1 60 22 L60 38 Z" fill="#e2e8f0" />
            <path d="M76 38 A16 16 0 0 1 60 54 L60 38 Z" fill="#e2e8f0" />
            
            {/* Royal Crown on Top */}
            <path d="M48 20 L53 11 L60 16 L67 11 L72 20 Z" fill="#ffb703" stroke="#ffd166" strokeWidth="1" />
            <circle cx="60" cy="14" r="1.5" fill="#ffffff" />

            {/* Golden 3D Text: BMW OBLIVION */}
            <text x="60" y="70" textAnchor="middle" fill="url(#goldText)" fontFamily="Orbitron, sans-serif" fontSize="11" fontWeight="900" letterSpacing="0.8">
              BMW
            </text>
            <text x="60" y="83" textAnchor="middle" fill="#ffffff" fontFamily="Orbitron, sans-serif" fontSize="10.5" fontWeight="900" letterSpacing="1.2">
              OBLIVION
            </text>
            
            {/* V2 Badge */}
            <rect x="44" y="88" width="32" height="12" rx="6" fill="#ff2740" stroke="#00e5ff" strokeWidth="1" />
            <text x="60" y="97.5" textAnchor="middle" fill="#ffffff" fontFamily="Orbitron, sans-serif" fontSize="8.5" fontWeight="900">
              V2
            </text>

            {/* Bottom Slogan */}
            <text x="60" y="110" textAnchor="middle" fill="#fcd34d" fontFamily="Rajdhani, sans-serif" fontSize="6.5" fontWeight="800" letterSpacing="1">
              PREDICT PLAY WIN
            </text>

            <defs>
              <linearGradient id="dragonRing" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="50%" stopColor="#ffb703" />
                <stop offset="100%" stopColor="#ff2740" />
              </linearGradient>
              <linearGradient id="fireDragon" x1="0" y1="0" x2="60" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff0055" />
                <stop offset="100%" stopColor="#ff7700" />
              </linearGradient>
              <linearGradient id="iceDragon" x1="120" y1="0" x2="60" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <linearGradient id="goldText" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
    </div>
  );
};
