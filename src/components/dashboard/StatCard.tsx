import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  accent?: 'amber' | 'blue' | 'emerald' | 'rose' | 'none'
  pulse?: boolean
}

const accentStyles: Record<string, string> = {
  amber:   'text-amber-400',
  blue:    'text-blue-400',
  emerald: 'text-emerald-400',
  rose:    'text-rose-400',
  none:    'text-slate-100',
}

export function StatCard({ label, value, sub, accent = 'none', pulse = false }: StatCardProps) {
  return (
    <div className="bg-surface-800 border border-border-subtle rounded-lg px-5 py-4 shadow-card">
      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-2">{label}</p>
      <p className={cn('text-3xl font-bold font-mono', accentStyles[accent], pulse && 'animate-pulse-amber')}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-slate-600 mt-1">{sub}</p>}
    </div>
  )
}