export type SizeType = 'BIG' | 'SMALL';
export type ColorType = 'GREEN' | 'RED' | 'VIOLET';
export type OutcomeType = 'win' | 'loss' | 'jackpot';

export interface WinGoResultItem {
  issueNumber: string;
  number: string;
  color?: string;
  premium?: string;
}

export interface PredictionRecord {
  period: string;
  predictedSize: SizeType;
  predictedOpp: number | null;
  predictedFav: number | null;
  actualNumber: number | null;
  result: OutcomeType | null;
  strategy: string;
  sig: string | null;
  verified: boolean;
  demo?: boolean;
  timestamp: number;
}

export interface PatternMatch {
  name: string;
  icon: string;
  detail: string;
  strength: number;
  category: 'dragon' | 'twin' | 'zigzag' | 'ladder' | 'revert' | 'cycle' | 'parity' | 'pin' | 'trap';
  recommendedSize?: SizeType;
}

export interface HistoricalBacktestResult {
  patternName: string;
  signature: string;
  occurrences: number;
  bigCount: number;
  smallCount: number;
  bigPct: number;
  smallPct: number;
  dominantSize: SizeType;
  topNumbers: { num: number; count: number; pct: number }[];
  favNum: number;
  oppNum: number;
  recentExamples: {
    historySeq: string[];
    nextNumber: number;
    nextSize: SizeType;
  }[];
}

export interface MarketRegime {
  name: 'TRENDING' | 'CHOPPY' | 'NEUTRAL';
  icon: string;
  description: string;
}

export interface KeyLicense {
  key: string;
  days: number;
  createdAt: number;
  used: boolean;
  activatedAt: number | null;
  expiresAt: number | null;
}
