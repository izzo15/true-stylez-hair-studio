import { cn } from '@/lib/utils';

const BTN_BASE = 'rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-800';

export const BTN_PRIMARY = cn(BTN_BASE, 'bg-neon-blue/20 border border-neon-blue/50 text-white hover:bg-neon-blue/30 focus-visible:ring-neon-blue');
export const BTN_OUTLINE = cn(BTN_BASE, 'bg-transparent border border-neon-blue/30 text-neon-blue/90 hover:bg-neon-blue/10 focus-visible:ring-neon-blue');
export const BTN_SECONDARY = cn(BTN_BASE, 'bg-neon-purple/15 border border-neon-purple/40 text-neon-purple hover:bg-neon-purple/25 focus-visible:ring-neon-purple');
