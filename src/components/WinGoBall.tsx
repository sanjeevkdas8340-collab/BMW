import React from 'react';
import { getBallColor, getBallSize } from '../data/seedData';

interface WinGoBallProps {
  number: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showBadge?: boolean;
  highlight?: boolean;
  className?: string;
  animate?: boolean;
}

const sizeConfig = {
  xs: {
    dim: 'w-6 h-6',
    text: 'text-[11px]',
    badge: 'text-[8px] px-1 -bottom-1',
  },
  sm: {
    dim: 'w-8 h-8',
    text: 'text-sm',
    badge: 'text-[9px] px-1.5 -bottom-1.5',
  },
  md: {
    dim: 'w-10 h-10',
    text: 'text-base',
    badge: 'text-[9px] px-1.5 -bottom-1.5',
  },
  lg: {
    dim: 'w-12 h-12 sm:w-14 sm:h-14',
    text: 'text-xl sm:text-2xl',
    badge: 'text-[10px] px-2 -bottom-2',
  },
  xl: {
    dim: 'w-16 h-16',
    text: 'text-2xl sm:text-3xl',
    badge: 'text-xs px-2.5 -bottom-2.5',
  },
  hero: {
    dim: 'w-20 h-20 sm:w-22 sm:h-22',
    text: 'text-3xl sm:text-4xl',
    badge: 'text-xs px-3 -bottom-2.5',
  },
};

export const WinGoBall: React.FC<WinGoBallProps> = ({
  number,
  size = 'md',
  showBadge = false,
  highlight = false,
  className = '',
  animate = false,
}) => {
  const safeNum = Math.abs(Math.floor(number)) % 10;
  const color = getBallColor(safeNum);
  const ballSize = getBallSize(safeNum);
  const cfg = sizeConfig[size];

  // Refined 3D sphere gradient and lighting
  let sphereBackground = '';
  let borderGlow = '';
  let glowColor = '';

  if (safeNum === 0) {
    // 0 is authentic half Red / half Violet split
    sphereBackground = 'linear-gradient(135deg, #ef4444 0%, #dc2626 48%, #8b5cf6 52%, #7c3aed 100%)';
    borderGlow = 'rgba(239, 68, 68, 0.6) rgba(139, 92, 246, 0.6)';
    glowColor = 'rgba(239, 68, 68, 0.4), 0 0 16px rgba(139, 92, 246, 0.4)';
  } else if (safeNum === 5) {
    // 5 is authentic half Green / half Violet split
    sphereBackground = 'linear-gradient(135deg, #10b981 0%, #059669 48%, #8b5cf6 52%, #7c3aed 100%)';
    borderGlow = 'rgba(16, 185, 129, 0.6) rgba(139, 92, 246, 0.6)';
    glowColor = 'rgba(16, 185, 129, 0.4), 0 0 16px rgba(139, 92, 246, 0.4)';
  } else if (color === 'GREEN') {
    // 1, 3, 7, 9 - High-End Casino Emerald 3D Sphere
    sphereBackground = 'radial-gradient(circle at 32% 28%, #6ee7b7 0%, #10b981 30%, #047857 70%, #064e3b 100%)';
    borderGlow = 'rgba(52, 211, 153, 0.7)';
    glowColor = 'rgba(16, 185, 129, 0.5)';
  } else {
    // 2, 4, 6, 8 - High-End Casino Crimson Ruby 3D Sphere
    sphereBackground = 'radial-gradient(circle at 32% 28%, #fda4af 0%, #f43f5e 30%, #be123c 70%, #881337 100%)';
    borderGlow = 'rgba(251, 113, 133, 0.7)';
    glowColor = 'rgba(244, 63, 94, 0.5)';
  }

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Outer Pulse Glow Halo for Highlighted Balls */}
      {highlight && (
        <div
          className="absolute -inset-1 rounded-full animate-ping opacity-35 blur-[1px] pointer-events-none"
          style={{ background: color === 'GREEN' ? '#10b981' : '#f43f5e' }}
        />
      )}

      {/* 3D Casino Lottery Sphere with Refined Specular Curvature */}
      <div
        className={`relative ${cfg.dim} rounded-full flex items-center justify-center font-['Orbitron'] font-black text-white ${cfg.text} transition-transform duration-200 ${
          animate ? 'hover:scale-105 active:scale-95' : ''
        }`}
        style={{
          background: sphereBackground,
          boxShadow: `0 4px 14px rgba(0,0,0,0.6), 0 0 14px ${glowColor}, inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -3px 6px rgba(0,0,0,0.5)`,
          border: '1px solid rgba(255,255,255,0.4)',
        }}
      >
        {/* Top-Left Crisp Curved Gloss Highlight */}
        <div
          className="absolute top-1 left-1.5 right-1.5 h-[40%] rounded-t-full pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.08) 85%, transparent 100%)',
          }}
        />

        {/* Pinpoint Specular Glare Reflection */}
        <div className="absolute top-[20%] left-[24%] w-[18%] h-[18%] rounded-full bg-white opacity-90 blur-[0.2px] pointer-events-none" />

        {/* Ambient Bottom Bounce Lighting */}
        <div
          className="absolute bottom-1 left-2 right-2 h-[20%] rounded-b-full pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(ellipse at bottom, rgba(255,255,255,0.4) 0%, transparent 80%)',
          }}
        />

        {/* Crisp Center Number */}
        <span
          className="relative z-10 leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tight font-black"
          style={{
            textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 4px rgba(255,255,255,0.3)',
          }}
        >
          {safeNum}
        </span>
      </div>

      {/* Compact Single-line BIG / SMALL Badge */}
      {showBadge && (
        <span
          className={`absolute ${cfg.badge} rounded-full font-['Orbitron'] font-black tracking-wider uppercase shadow-md border z-20 whitespace-nowrap ${
            ballSize === 'BIG'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-300'
              : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-300'
          }`}
        >
          {ballSize}
        </span>
      )}
    </div>
  );
};
