export type SizeType = 'BIG' | 'SMALL';
export type ColorType = 'GREEN' | 'RED' | 'VIOLET';
export type OutcomeType = 'win' | 'loss' | 'jackpot';

export type LogicCategory =
  | 'PATTERN'
  | 'OSCILLATOR'
  | 'TREND_MA'
  | 'HARMONIC_PARITY'
  | 'COLOR_VIOLET'
  | 'MARKOV_BAYES'
  | 'HISTORICAL_1000'
  | 'ANTI_LOSS_ARMOR';

export interface LogicRuleResult {
  id: number;
  code: string;
  name: string;
  category: LogicCategory;
  vote: 'BIG' | 'SMALL' | 'NEUTRAL';
  confidence: number;
  weight: number;
  reason: string;
}

export interface LogicConsensusSummary {
  totalLogics: number;
  bigVotes: number;
  smallVotes: number;
  neutralVotes: number;
  consensusSide: SizeType;
  consensusPct: number;
  weightedMargin: number;
  strengthGrade: 'AAA+ ALPHA (99%)' | 'AA HIGH (92%)' | 'A DEFENSIVE (85%)' | 'SKIP AMBIGUOUS';
  lossShieldActive: boolean;
  topLogics: LogicRuleResult[];
  allLogics: LogicRuleResult[];
}

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
  level?: number;
}

export interface PatternMatch {
  name: string;
  icon: string;
  detail: string;
  strength: number;
  category: 'dragon' | 'twin' | 'zigzag' | 'ladder' | 'revert' | 'cycle' | 'parity' | 'pin' | 'trap' | 'mirror' | 'violet';
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

export interface DeepPatternAnalysis {
  patternType: string;
  depthStages: string[];
  currentStage: string;
  cycleRepetition: number;
  harmonicParity: 'ODD_DOMINANT' | 'EVEN_DOMINANT' | 'BALANCED';
  transitionEntropy: number; // 0 to 100
  historicalMatchRate: number;
  layer1Status: string;
  layer2Status: string;
  layer3Status: string;
}

export interface KeyLicense {
  key: string;
  days: number;
  createdAt: number;
  used: boolean;
  activatedAt: number | null;
  expiresAt: number | null;
}
