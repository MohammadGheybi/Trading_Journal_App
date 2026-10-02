import { PRE_EMOTIONS, POST_EMOTIONS, MISTAKES } from './constants';

// Field layout shared by the detail view and review step — grouped exactly like the form.
export const FIELD_GROUPS = [
  {
    id: 'financial', title: 'Trade & Financial',
    fields: [
      { key: 'tradeNumber', label: 'Trade #', type: 'derived' },
      { key: 'entryDate', label: 'Entry date', type: 'date' },
      { key: 'entryTime', label: 'Entry time' },
      { key: 'exitDate', label: 'Exit date', type: 'date' },
      { key: 'exitTime', label: 'Exit time' },
      { key: 'symbol', label: 'Symbol' },
      { key: 'direction', label: 'Direction' },
      { key: 'timeframe', label: 'Entry timeframe' },
      { key: 'managementTimeframe', label: 'Management timeframe' },
      { key: 'extraTimeframes', label: 'Other timeframes', type: 'timeframes', wide: true },
      { key: 'volumeLots', label: 'Volume (lots)' },
      { key: 'entryPrice', label: 'Entry price' },
      { key: 'exitPrice', label: 'Exit price' },
      { key: 'stopLossPrice', label: 'Stop loss price' },
      { key: 'takeProfitPrice', label: 'Take profit price' },
      { key: 'closes', label: 'Closes', type: 'closes', wide: true },
      { key: 'commissionUsd', label: 'Commission', type: 'usd' },
      { key: 'swapUsd', label: 'Swap', type: 'usd' },
      { key: 'stopAmountUsd', label: 'Stop amount', type: 'usd' },
      { key: 'netPnlUsd', label: 'Net P&L', type: 'pnl' },
      { key: 'result', label: 'Result', type: 'result' },
    ],
  },
  {
    id: 'risk', title: 'Risk Management',
    fields: [
      { key: 'stopLossChanged', label: 'Stop loss changed', type: 'bool' },
      { key: 'stopLossChangeMethod', label: 'SL change method' },
      { key: 'stopLossChangeOutcome', label: 'SL change outcome' },
      { key: 'takeProfitChanged', label: 'Take profit changed', type: 'bool' },
      { key: 'takeProfitChangeMethod', label: 'TP change method' },
      { key: 'takeProfitChangeOutcome', label: 'TP change outcome' },
    ],
  },
  {
    id: 'reasoning', title: 'Reasoning',
    fields: [
      { key: 'entryReason', label: 'Entry reason' },
      { key: 'entryReasonNote', label: 'Entry reason note', wide: true },
      { key: 'exitReason', label: 'Exit reason' },
      { key: 'exitReasonNote', label: 'Exit reason note', wide: true },
      { key: 'tradeNotes', label: 'Trade notes', wide: true },
    ],
  },
  {
    id: 'before', title: 'Before Trade',
    flagGroups: [{ title: 'Pre-trade emotions', items: PRE_EMOTIONS, selectedKey: 'selectedFeelingsBefore' }],
    fields: [
      { key: 'energyReadiness', label: 'Energy / readiness', type: 'scale' },
      { key: 'setupConfidence', label: 'Setup confidence', type: 'scale' },
      { key: 'selectedMotivations', label: 'Motivation', type: 'labels', wide: true },
      { key: 'feelingsBeforeTrade', label: 'Feelings before trade', wide: true },
      { key: 'feelingsDuringTrade', label: 'Feelings during trade', wide: true },
    ],
  },
  {
    id: 'after', title: 'After Trade',
    flagGroups: [{ title: 'Post-trade emotions', items: POST_EMOTIONS, selectedKey: 'selectedFeelingsAfter' }, { title: 'Behavioral mistakes', items: MISTAKES, selectedKey: 'selectedMistakes', tone: 'loss' }],
    fields: [
      { key: 'executionQuality', label: 'Execution quality', type: 'scale' },
      { key: 'lessonsLearned', label: 'Lessons learned', wide: true },
      { key: 'feelingsAfterTrade', label: 'Feelings after trade', wide: true },
    ],
  },
  {
    id: 'evidence', title: 'Evidence & Tags',
    fields: [{ key: 'tags', label: 'Tags', type: 'tags', wide: true }],
  },
  {
    id: 'derived', title: 'Calculated fields',
    fields: [
      { key: 'accountBalanceAfterTrade', label: 'Balance after trade', type: 'usd' },
      { key: 'marketSession', label: 'Market session', type: 'session' },
      { key: 'behavioralMistakeCount', label: 'Mistake count' },
      { key: 'firstTimeSymbol', label: 'First time symbol', type: 'bool' },
      { key: 'uniqueSymbolOrder', label: 'Unique symbol order' },
      { key: 'holdingDuration', label: 'Holding duration', type: 'duration' },
      { key: 'realizedRR', label: 'Realized R/R', type: 'rr' },
    ],
  },
];