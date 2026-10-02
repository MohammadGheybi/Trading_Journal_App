import React from 'react';
import { MISTAKES } from '@/lib/journal/constants';
import { groupStats, rangeBucket } from '@/lib/journal/stats';
import BreakdownView from './BreakdownView';
import DescriptiveNote from './DescriptiveNote';
import { SCORE_BUCKETS } from './PsychologyTab';

const COUNT_ORDER = ['0 mistakes', '1 mistake', '2 mistakes', '3+ mistakes'];
const countLabel = (n) => (n === 0 ? '0 mistakes' : n === 1 ? '1 mistake' : n === 2 ? '2 mistakes' : '3+ mistakes');

export default function MistakesTab({ trades }) {
  const byMistake = groupStats(trades, (t) => (
    Array.isArray(t.selectedMistakes) && t.selectedMistakes.length
      ? t.selectedMistakes
      : MISTAKES.filter((m) => t[m.key]).map((m) => m.label)
  ));
  const byCount = groupStats(trades, (t) => countLabel(t.behavioralMistakeCount), COUNT_ORDER);
  const byExecution = groupStats(trades, (t) => rangeBucket(t.executionQuality, SCORE_BUCKETS), SCORE_BUCKETS.map((b) => b.label));
  return (
    <div className="space-y-5">
      <DescriptiveNote />
      <BreakdownView title="By behavioral mistake" tooltip="Trades flagged with each mistake. One trade can carry several flags." rows={byMistake} keyLabel="Mistake" labelWidth={190} />
      <BreakdownView title="By mistake count" tooltip="Behavioral mistake count per trade." rows={byCount} keyLabel="Mistakes" />
      <BreakdownView title="By execution quality" tooltip="Self-rated execution quality (1–10) grouped into ranges." rows={byExecution} keyLabel="Execution" />
    </div>
  );
}