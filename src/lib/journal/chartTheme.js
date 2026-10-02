export const C = {
  profit: '#6FA583',
  loss: '#E06A6A',
  sand: '#B38F6F',
  crimson: '#710014',
  crimsonSoft: '#D14D62',
  pearl: '#F2F1ED',
  muted: '#A9A59C',
  grid: '#2A2A2A',
};

export const axisProps = {
  stroke: '#3a3a3a',
  tick: { fill: '#A9A59C', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
  tickLine: false,
  axisLine: false,
};

export const pnlColor = (v) => (v > 0 ? C.profit : v < 0 ? C.loss : C.sand);