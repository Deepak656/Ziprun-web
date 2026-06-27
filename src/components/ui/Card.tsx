import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  glow?: 'amber' | 'blue' | 'none'
}

export function Card({ children, className, hoverable = false, glow = 'none' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface-800 border border-border-subtle rounded-lg shadow-card',
        hoverable && 'transition-all duration-200 hover:border-border-default hover:shadow-card-hover',
        glow === 'amber' && 'border-amber-500/30 shadow-glow-amber',
        glow === 'blue'  && 'border-blue-500/20 shadow-glow-blue',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-5 py-4 border-b border-border-subtle', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}