import { LayoutDashboard, BookOpen, CalendarDays, LineChart, Globe2, Wallet, FileDown, Settings } from 'lucide-react';

export const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/analytics', label: 'Analytics', icon: LineChart },
  { to: '/sessions', label: 'Sessions', icon: Globe2 },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/report', label: 'Report', icon: FileDown },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const MOBILE_PRIMARY = NAV.slice(0, 4);

export function pageTitle(pathname) {
  if (pathname === '/journal/new') return 'New trade';
  if (/^\/journal\/[^/]+\/edit$/.test(pathname)) return 'Edit trade';
  if (/^\/journal\/[^/]+$/.test(pathname)) return 'Trade details';
  return NAV.find((n) => pathname.startsWith(n.to))?.label || 'Crimson Ledger';
}