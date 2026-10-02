// Central enums & field metadata. Labels are kept here so they can be swapped for i18n keys later.

export const DIRECTIONS = ['Buy', 'Sell'];
export const TIMEFRAMES = ['1M', '5M', '15M', '30M', '1H', '4H', 'Daily', 'Weekly', 'Monthly'];
export const RESULTS = ['Win', 'Loss', 'Breakeven'];

export const SESSIONS = ['Sydney', 'Sydney–Tokyo', 'Tokyo/Asia', 'London', 'London–New York overlap', 'New York'];

export const ENTRY_REASONS = [
  'Weak bullish move', 'Weak bearish move', 'Price pattern', 'Level break',
  'Pullback/Correction', 'News reaction', 'According to strategy', 'Other',
];
export const EXIT_REASONS = [
  'Reached take profit', 'Hit stop loss', 'Closed breakeven', 'Manual decision',
  'Exit signal', 'Fear of reversal', 'Other',
];

export const SL_METHODS = ['Moved to breakeven', 'Trailed behind structure', 'Widened stop', 'Tightened stop', 'Partial close'];
export const TP_METHODS = ['Extended target', 'Reduced target', 'Removed target', 'Scaled out', 'Moved to next level'];
export const CHANGE_OUTCOMES = ['Improved result', 'Worsened result', 'No impact'];

export const PRE_EMOTIONS = [
  { key: 'calmBefore', label: 'Calm' },
  { key: 'confidentBefore', label: 'Confident' },
  { key: 'anxiousBefore', label: 'Anxious' },
  { key: 'fearfulBefore', label: 'Fearful' },
  { key: 'greedyBefore', label: 'Greedy' },
  { key: 'excitedBefore', label: 'Excited' },
  { key: 'hopelessBefore', label: 'Hopeless' },
  { key: 'angerBefore', label: 'Angry' },
  { key: 'irritatedBefore', label: 'Irritated' },
  { key: 'tiredBefore', label: 'Tired' },
];

export const POST_EMOTIONS = [
  { key: 'satisfiedAfter', label: 'Satisfied' },
  { key: 'regretfulAfter', label: 'Regretful' },
  { key: 'happyAfter', label: 'Happy' },
  { key: 'upsetAfter', label: 'Upset' },
  { key: 'angryAfter', label: 'Angry' },
  { key: 'calmAfter', label: 'Calm' },
  { key: 'indifferentAfter', label: 'Indifferent' },
  { key: 'anxiousAfter', label: 'Anxious' },
  { key: 'euphoricAfter', label: 'Euphoric' },
  { key: 'disappointedAfter', label: 'Disappointed' },
];

export const MISTAKES = [
  { key: 'mistakeMovedStopLoss', label: 'Moved stop loss' },
  { key: 'mistakeEarlyExit', label: 'Early exit' },
  { key: 'mistakeLateEntry', label: 'Late entry' },
  { key: 'mistakeBrokePlan', label: 'Broke the plan' },
  { key: 'mistakeOvertrading', label: 'Overtrading' },
  { key: 'mistakeHighRisk', label: 'High risk' },
  { key: 'mistakeIncompleteEntryConfirmation', label: 'Incomplete entry confirmation' },
  { key: 'mistakeRevengeTrading', label: 'Revenge trading' },
  { key: 'mistakeLackOfPatience', label: 'Lack of patience' },
];

export const NUMERIC_FIELDS = ['volumeLots', 'commissionUsd', 'swapUsd', 'stopAmountUsd', 'netPnlUsd'];

export const DEFAULT_SETTINGS = {
  accountName: 'Manual Account',
  initialBalance: 10000,
  currency: 'USD',
  timezone: 'UTC',
  calendarYear: 2026,
  maxDailyPct: 20,
  customSignal1Label: 'Liquidity sweep',
  customSignal2Label: 'HTF alignment',
  entryReasons: [...ENTRY_REASONS],
  exitReasons: [...EXIT_REASONS],
  feelingsBefore: PRE_EMOTIONS.map((item) => item.label),
  feelingsAfter: POST_EMOTIONS.map((item) => item.label),
  motivations: ['According to strategy', 'News', 'Liquidity sweep', 'HTF alignment'],
  mistakes: MISTAKES.map((item) => item.label),
};

export function normalizeSymbol(symbol) {
  return String(symbol || '').trim().toUpperCase().replace(/\.X$/, '');
}

export function emptyTrade(settings = DEFAULT_SETTINGS) {
  const bools = [...PRE_EMOTIONS, ...POST_EMOTIONS, ...MISTAKES].reduce((a, f) => ({ ...a, [f.key]: false }), {});
  return {
    id: null, status: 'complete', accountId: 'manual', source: '', externalId: '',
    entryDate: '', entryTime: '', exitDate: '', exitTime: '',
    symbol: '', direction: 'Buy', timeframe: '1H', managementTimeframe: '', extraTimeframes: [],
    volumeLots: null, commissionUsd: null, swapUsd: null, stopAmountUsd: null, netPnlUsd: null, result: '',
    entryPrice: null, exitPrice: null, stopLossPrice: null, takeProfitPrice: null, closes: [],
    stopLossChanged: false, stopLossChangeMethod: '', stopLossChangeOutcome: '',
    takeProfitChanged: false, takeProfitChangeMethod: '', takeProfitChangeOutcome: '',
    entryReason: '', entryReasonNote: '', exitReason: '', exitReasonNote: '', tradeNotes: '',
    energyReadiness: 5, setupConfidence: 5,
    motivationAccordingToStrategy: false, motivationNews: false,
    motivationCustomSignal1: false, motivationCustomSignal2: false,
    selectedFeelingsBefore: [], selectedFeelingsAfter: [], selectedMotivations: [], selectedMistakes: [],
    customSignal1Label: settings.customSignal1Label, customSignal2Label: settings.customSignal2Label,
    feelingsBeforeTrade: '', feelingsDuringTrade: '',
    executionQuality: 5, lessonsLearned: '', feelingsAfterTrade: '',
    tags: [], images: [],
    ...bools,
  };
}