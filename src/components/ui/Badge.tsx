import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'amber' | 'blue' | 'emerald' | 'rose' | 'slate'
}

const variantStyles: Record<string, string> = {
  default:  'bg-surface-600 text-slate-300 border-border-default',
  amber:    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  blue:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  emerald:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rose:     'bg-rose-500/10 text-rose-400 border-rose-500/20',
  slate:    'bg-slate-500/10 text-slate-500 border-slate-500/20',
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border font-mono tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}