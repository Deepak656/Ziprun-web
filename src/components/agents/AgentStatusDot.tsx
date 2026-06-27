import { cn, agentStatusMeta } from '@/lib/utils'
import type { AgentStatus } from '@/types'

export function AgentStatusDot({ status }: { status: AgentStatus }) {
  const meta = agentStatusMeta(status)
  return (
    <span className="relative flex items-center justify-center w-2.5 h-2.5">
      {status === 'AVAILABLE' && (
        <span className={cn('absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping-slow', meta.dot)} />
      )}
      <span className={cn('relative inline-flex rounded-full w-2 h-2', meta.dot)} />
    </span>
  )
}