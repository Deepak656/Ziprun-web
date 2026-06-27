import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'success' | 'outline'
  size?: 'sm' | 'md'
  loading?: boolean
  children: React.ReactNode
}

const variantStyles: Record<string, string> = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white border-transparent',
  ghost:   'bg-transparent hover:bg-surface-600 text-slate-400 hover:text-slate-200 border-transparent',
  danger:  'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20 hover:border-rose-500/40',
  success: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40',
  outline: 'bg-transparent hover:bg-surface-600 text-slate-300 border-border-default hover:border-border-strong',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

export function Button({
  variant = 'outline',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center gap-2 rounded font-medium border transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/40',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={12} className="animate-spin shrink-0" />}
      {children}
    </button>
  )
}