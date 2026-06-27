import { cn } from '@/lib/utils'
import type { Agent } from '@/types'
import { agentStatusMeta } from '@/lib/utils'

interface AgentLoadBarProps {
  agent: Agent
}

export function AgentLoadBar({ agent }: AgentLoadBarProps) {
  const meta = agentStatusMeta(agent.status)
  const max = agent.maxCapacity ?? 5
  const pct = Math.min((agent.activeOrderCount / max) * 100, 100)

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Status dot */}
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', meta.dot)} />

      {/* Name */}
      <span className="text-xs text-slate-400 w-28 truncate shrink-0">{agent.name}</span>

      {/* Bar */}
      <div className="flex-1 h-1.5 bg-surface-600 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            agent.status === 'OFFLINE' ? 'bg-slate-600'
            : pct >= 90 ? 'bg-rose-500'
            : pct >= 60 ? 'bg-amber-500'
            : 'bg-emerald-500'
          )}
          style={{ width: `${agent.status === 'OFFLINE' ? 0 : pct}%` }}
        />
      </div>

      {/* Count */}
      <span className="text-[11px] font-mono text-slate-600 w-8 text-right shrink-0">
        {agent.activeOrderCount}/{max}
      </span>
    </div>
  )
}