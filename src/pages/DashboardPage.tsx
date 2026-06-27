import { ShieldAlert, Package2, Users, CheckCircle2, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { AgentLoadBar } from '@/components/dashboard/AgentLoadBar'
import { SuggestionCard } from '@/components/suggestions/SuggestionCard'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { PageSpinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { useAgents } from '@/hooks/useAgents'
import { useOrders } from '@/hooks/useOrders'
import { useSuggestions } from '@/hooks/useSuggestions'
import { useQueryClient } from '@tanstack/react-query'

export function DashboardPage() {
  const { data: agents, isLoading: loadingAgents }         = useAgents()
  const { data: orders, isLoading: loadingOrders }         = useOrders()
  const { data: pending, isLoading: loadingSuggestions }   = useSuggestions('PENDING')
  const qc = useQueryClient()

  const agenticSuggestions = pending?.filter((s) => s.triggerReason === 'AGENT_OFFLINE') ?? []
  const manualSuggestions  = pending?.filter((s) => s.triggerReason === 'INITIAL') ?? []

  const stats = {
    available:  agents?.filter((a) => a.status === 'AVAILABLE').length ?? 0,
    offline:    agents?.filter((a) => a.status === 'OFFLINE').length ?? 0,
    pending:    orders?.filter((o) => o.status === 'REASSIGNMENT_PENDING').length ?? 0,
    delivered:  orders?.filter((o) => o.status === 'DELIVERED').length ?? 0,
  }

  const refreshAll = () => qc.invalidateQueries()

  return (
    <div className="px-7 pb-10">
      <PageHeader
        title="Operations Dashboard"
        subtitle="Live fleet status · auto-refreshes every 4 seconds"
        action={
          <Button variant="ghost" size="sm" onClick={refreshAll}>
            <RefreshCw size={12} />
            Refresh
          </Button>
        }
      />

      {/* Stats strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        <StatCard label="Agents Available" value={stats.available} accent="emerald" />
        <StatCard
          label="Pending Suggestions"
          value={pending?.length ?? 0}
          accent={pending?.length ? 'amber' : 'none'}
          pulse={(pending?.length ?? 0) > 0}
          sub={agenticSuggestions.length > 0 ? `${agenticSuggestions.length} from auto re-plan` : undefined}
        />
        <StatCard
          label="Needs Reassignment"
          value={stats.pending}
          accent={stats.pending > 0 ? 'rose' : 'none'}
        />
        <StatCard label="Delivered Today" value={stats.delivered} accent="none" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: pending suggestions */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <ShieldAlert size={14} className="text-amber-400" />
              Pending Review
              {pending && pending.length > 0 && (
                <span className="bg-amber-500 text-surface-900 text-[10px] font-bold rounded-full px-1.5 py-0.5 font-mono">
                  {pending.length}
                </span>
              )}
            </h2>
          </div>

          {loadingSuggestions ? (
            <PageSpinner />
          ) : pending?.length === 0 ? (
            <Card>
              <EmptyState
                icon={<CheckCircle2 size={28} />}
                title="All clear"
                description="No suggestions waiting for review. The agentic re-plan loop is standing by."
              />
            </Card>
          ) : (
            <>
              {/* Agentic re-plans first — they're urgent */}
              {agenticSuggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-amber-500/70 uppercase tracking-widest px-1">
                    Auto Re-plan · Agent went offline
                  </p>
                  {agenticSuggestions.map((s) => (
                    <SuggestionCard key={s.id} suggestion={s} />
                  ))}
                </div>
              )}
              {manualSuggestions.length > 0 && (
                <div className="space-y-2 mt-3">
                  {agenticSuggestions.length > 0 && (
                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest px-1">
                      Manual Requests
                    </p>
                  )}
                  {manualSuggestions.map((s) => (
                    <SuggestionCard key={s.id} suggestion={s} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: agent load */}
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Users size={14} className="text-slate-500" />
                Agent Load
              </h2>
            </CardHeader>
            <CardBody className="py-3">
              {loadingAgents ? (
                <PageSpinner />
              ) : (
                <div className="divide-y divide-border-subtle">
                  {agents?.map((a) => <AgentLoadBar key={a.id} agent={a} />)}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Recent orders needing action */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Package2 size={14} className="text-slate-500" />
                Needs Reassignment
              </h2>
            </CardHeader>
            <CardBody className="py-2 space-y-0">
              {loadingOrders ? (
                <PageSpinner />
              ) : (
                <>
                  {orders
                    ?.filter((o) => o.status === 'REASSIGNMENT_PENDING')
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-border-subtle last:border-0">
                        <div>
                          <p className="text-xs text-slate-300 truncate max-w-[160px]">{order.description}</p>
                          <p className="text-[11px] font-mono text-slate-600">{order.id}</p>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5">
                          Pending
                        </span>
                      </div>
                    ))
                  }
                  {orders?.filter((o) => o.status === 'REASSIGNMENT_PENDING').length === 0 && (
                    <p className="text-xs text-slate-600 py-3 text-center">No orders pending reassignment</p>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}