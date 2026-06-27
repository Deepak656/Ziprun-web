import { MapPin, Package, Zap } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AgentStatusDot } from './AgentStatusDot'
import { agentStatusMeta, cn } from '@/lib/utils'
import type { Agent, AgentStatus } from '@/types'
import { useUpdateAgentStatus } from '@/hooks/useAgents'
import { useToast } from '@/components/ui/Toast'

interface AgentCardProps {
  agent: Agent
}

const statusCycle: Partial<Record<AgentStatus, AgentStatus>> = {
  AVAILABLE: 'BUSY',
  BUSY: 'AVAILABLE',
}

const loadPercent = (agent: Agent) => {
  if (!agent.maxCapacity) return null
  return Math.round((agent.activeOrderCount / agent.maxCapacity) * 100)
}

export function AgentCard({ agent }: AgentCardProps) {
  const meta    = agentStatusMeta(agent.status)
  const { mutate, isPending } = useUpdateAgentStatus()
  const { toast } = useToast()

  const nextStatus = statusCycle[agent.status]

  const handleMarkOffline = () => {
    mutate(
      { id: agent.id, status: 'OFFLINE' },
      {
        onSuccess: () => toast('success', `${agent.name} marked offline. Re-planning triggered.`),
        onError: (e) => toast('error', e.message),
      }
    )
  }

  const handleToggle = () => {
    if (!nextStatus) return
    mutate(
      { id: agent.id, status: nextStatus },
      {
        onSuccess: () => toast('success', `${agent.name} is now ${nextStatus.toLowerCase()}.`),
        onError: (e) => toast('error', e.message),
      }
    )
  }

  const pct = loadPercent(agent)

  return (
    <Card hoverable glow={agent.status === 'OFFLINE' ? 'none' : undefined} className="animate-fade-in">
      <CardBody className="space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <AgentStatusDot status={agent.status} />
            <div>
              <p className="text-sm font-semibold text-slate-100 leading-tight">{agent.name}</p>
              <p className="text-[11px] font-mono text-slate-600">{agent.id}</p>
            </div>
          </div>
          <Badge
            variant={
              agent.status === 'AVAILABLE' ? 'emerald'
              : agent.status === 'BUSY' ? 'amber'
              : 'slate'
            }
          >
            {meta.label}
          </Badge>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface-700 rounded px-3 py-2">
            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-wider mb-1">Active Orders</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-slate-100 font-mono">{agent.activeOrderCount}</span>
              {agent.maxCapacity && (
                <span className="text-xs text-slate-600">/ {agent.maxCapacity}</span>
              )}
            </div>
          </div>
          <div className="bg-surface-700 rounded px-3 py-2">
            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-wider mb-1">Zone</p>
            <div className="flex items-center gap-1.5">
              <MapPin size={11} className="text-slate-600 shrink-0" />
              <span className="text-xs text-slate-300 truncate">
                {agent.currentZone ?? 'Unassigned'}
              </span>
            </div>
          </div>
        </div>

        {/* Capacity bar */}
        {pct !== null && (
          <div>
            <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-1">
              <span>CAPACITY</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1 bg-surface-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  pct >= 90 ? 'bg-rose-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        {agent.status !== 'OFFLINE' && (
          <div className="flex gap-2 pt-1">
            {nextStatus && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggle}
                loading={isPending}
                className="flex-1"
              >
                <Package size={11} />
                Set {nextStatus.charAt(0) + nextStatus.slice(1).toLowerCase()}
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              onClick={handleMarkOffline}
              loading={isPending}
              className="flex-1"
            >
              <Zap size={11} />
              Go Offline
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  )
}