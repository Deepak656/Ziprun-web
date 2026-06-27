import { Users } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { AgentCard } from '@/components/agents/AgentCard'
import { PageSpinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAgents } from '@/hooks/useAgents'
import type { AgentStatus } from '@/types'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const FILTERS: { label: string; value: AgentStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Busy', value: 'BUSY' },
  { label: 'Offline', value: 'OFFLINE' },
]

export function AgentsPage() {
  const [filter, setFilter] = useState<AgentStatus | undefined>(undefined)
  const { data: agents, isLoading } = useAgents()

  const filtered = agents?.filter((a) => !filter || a.status === filter) ?? []

  return (
    <div className="px-7 pb-10">
      <PageHeader
        title="Fleet Roster"
        subtitle={`${agents?.length ?? 0} agents · auto-refreshes`}
      />

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-surface-800 border border-border-subtle rounded-lg p-1 w-fit">
        {FILTERS.map(({ label, value }) => {
          const count = value ? agents?.filter((a) => a.status === value).length : agents?.length
          return (
            <button
              key={label}
              onClick={() => setFilter(value)}
              className={cn(
                'px-4 py-1.5 rounded text-xs font-medium transition-all duration-150',
                filter === value
                  ? 'bg-surface-600 text-slate-100'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              {label}
              {count !== undefined && (
                <span className={cn(
                  'ml-1.5 text-[10px] font-mono',
                  filter === value ? 'text-slate-400' : 'text-slate-700'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title="No agents found"
          description="No agents match the selected filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  )
}