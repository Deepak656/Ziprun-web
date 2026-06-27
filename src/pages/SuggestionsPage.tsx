import { useState } from 'react'
import { BrainCircuit } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SuggestionCard } from '@/components/suggestions/SuggestionCard'
import { PageSpinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useSuggestions } from '@/hooks/useSuggestions'
import type { SuggestionStatus } from '@/types'
import { cn } from '@/lib/utils'

const FILTERS: { label: string; value: SuggestionStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
]

export function SuggestionsPage() {
  const [filter, setFilter] = useState<SuggestionStatus | undefined>('PENDING')
  const { data: all, isLoading }   = useSuggestions()
  const { data: pending }          = useSuggestions('PENDING')

  const displayed = filter ? all?.filter((s) => s.status === filter) : all

  const agenticCount = pending?.filter((s) => s.triggerReason === 'AGENT_OFFLINE').length ?? 0

  return (
    <div className="px-7 pb-10">
      <PageHeader
        title="AI Suggestions"
        subtitle="Reassignment recommendations from the routing engine"
      />

      {/* Agentic alert banner */}
      {agenticCount > 0 && (
        <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-amber-500/8 border border-amber-500/25 rounded-lg animate-slide-in">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping-slow" />
          <div>
            <p className="text-sm font-medium text-amber-300">
              {agenticCount} agentic re-plan{agenticCount > 1 ? 's' : ''} waiting for review
            </p>
            <p className="text-xs text-amber-500/70 mt-0.5">
              These were triggered automatically when an agent went offline
            </p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 bg-surface-800 border border-border-subtle rounded-lg p-1 w-fit">
        {FILTERS.map(({ label, value }) => {
          const count = value ? all?.filter((s) => s.status === value).length : all?.length
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
                  value === 'PENDING' && (count ?? 0) > 0 ? 'text-amber-400' : 'text-slate-700'
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
      ) : displayed?.length === 0 ? (
        <EmptyState
          icon={<BrainCircuit size={28} />}
          title="No suggestions"
          description={
            filter === 'PENDING'
              ? 'No suggestions waiting for review. Set an agent offline to trigger the agentic re-plan loop.'
              : 'No suggestions match this filter.'
          }
        />
      ) : (
        <div className="space-y-3">
          {displayed?.map((s) => <SuggestionCard key={s.id} suggestion={s} />)}
        </div>
      )}
    </div>
  )
}