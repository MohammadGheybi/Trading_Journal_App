import React from 'react';
import { PRE_EMOTIONS, POST_EMOTIONS } from '@/lib/journal/constants';
import { groupStats, rangeBucket } from '@/lib/journal/stats';
import BreakdownView from './BreakdownView';
import DescriptiveNote from './DescriptiveNote';

export const SCORE_BUCKETS = [
  { label: '1–3 · Low', min: 1, max: 3 }, { label: '4–6 · Mid', min: 4, max: 6 },
  { label: '7–8 · High', min: 7, max: 8 }, { label: '9–10 · Peak', min: 9, max: 10 },
];
const ORDER = SCORE_BUCKETS.map((b) => b.label);

export default function PsychologyTab({ trades }) {
  const labels = (trade, key, legacy) => (Array.isArray(trade[key]) ? trade[key] : legacy.filter((item) => trade[item.key]).map((item) => item.label));
  const pre = groupStats(trades, (t) => labels(t, 'selectedFeelingsBefore', PRE_EMOTIONS));
  const post = groupStats(trades, (t) => labels(t, 'selectedFeelingsAfter', POST_EMOTIONS));
  const confidence = groupStats(trades, (t) => rangeBucket(t.setupConfidence, SCORE_BUCKETS), ORDER);
  const energy = groupStats(trades, (t) => rangeBucket(t.energyReadiness, SCORE_BUCKETS), ORDER);
  return (
    <div className="space-y-5">
      <DescriptiveNote />
      <BreakdownView title="By pre-trade emotion" tooltip="Each selected emotion counts the trade once. Trades with several emotions appear in several rows." rows={pre} keyLabel="Emotion" />
      <BreakdownView title="By setup confidence" tooltip="Setup confidence score (1–10) grouped into ranges." rows={confidence} keyLabel="Confidence" />
      <BreakdownView title="By energy / readiness" tooltip="Energy score (1–10) grouped into ranges." rows={energy} keyLabel="Energy" />
      <BreakdownView title="By post-trade emotion" tooltip="How you felt after closing, alongside the outcome." rows={post} keyLabel="Emotion" />
    </div>
  );
}