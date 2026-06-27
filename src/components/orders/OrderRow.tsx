import { Package2, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { orderStatusMeta, priorityMeta, formatRelativeTime, cn } from '@/lib/utils'
import type { Order } from '@/types'
import { useMarkDelivered, useGenerateSuggestion } from '@/hooks/useOrders'
import { useToast } from '@/components/ui/Toast'

interface OrderRowProps {
  order: Order
}

export function OrderRow({ order }: OrderRowProps) {
  const statusMeta = orderStatusMeta(order.status)
  const pMeta = priorityMeta(order.priority)
  const { mutate: deliver, isPending: delivering } = useMarkDelivered()
  const { mutate: suggest, isPending: suggesting } = useGenerateSuggestion()
  const { toast } = useToast()

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-5 py-3.5 border-b border-border-subtle last:border-0',
        'hover:bg-surface-700/40 transition-colors duration-100 group',
        order.status === 'REASSIGNMENT_PENDING' && 'bg-amber-500/3'
      )}
    >
      {/* Icon */}
      <div className={cn(
        'w-7 h-7 rounded flex items-center justify-center shrink-0',
        order.status === 'REASSIGNMENT_PENDING' ? 'bg-amber-500/10' : 'bg-surface-600'
      )}>
        <Package2 size={13} className={order.status === 'REASSIGNMENT_PENDING' ? 'text-amber-400' : 'text-slate-500'} />
      </div>

      {/* Description + agent */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 truncate leading-snug">{order.description}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] font-mono text-slate-600">{order.id}</span>
          <span className="text-slate-700">·</span>
          <span className="text-[11px] text-slate-600">{order.assignedAgentName}</span>
          {order.pickupZone && order.dropoffZone && (
            <>
              <span className="text-slate-700">·</span>
              <span className="text-[11px] text-slate-600 flex items-center gap-1">
                {order.pickupZone} <ArrowRight size={9} className="text-slate-700" /> {order.dropoffZone}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Priority */}
      <span className={cn('text-[11px] font-mono font-medium shrink-0', pMeta.color)}>
        {pMeta.label.toUpperCase()}
      </span>

      {/* Status */}
      <Badge
        variant={
          order.status === 'ASSIGNED' ? 'blue'
          : order.status === 'REASSIGNMENT_PENDING' ? 'amber'
          : order.status === 'REASSIGNED' ? 'emerald'
          : 'slate'
        }
      >
        {statusMeta.label}
      </Badge>

      {/* Time */}
      <span className="text-[11px] text-slate-600 font-mono shrink-0 hidden xl:block">
        {formatRelativeTime(order.createdAt)}
      </span>

      {/* Actions */}
      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {order.status === 'ASSIGNED' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                suggest(
                  { orderId: order.id, triggerReason: 'INITIAL' },
                  {
                    onSuccess: () => toast('success', `Suggestion generated for ${order.id}.`),
                    onError: (e) => toast('error', e.message),
                  }
                )
              }
              loading={suggesting}
            >
              <Sparkles size={11} />
              Suggest
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                deliver(order.id, {
                  onSuccess: () => toast('success', `${order.id} marked delivered.`),
                  onError: (e) => toast('error', e.message),
                })
              }
              loading={delivering}
            >
              <CheckCircle2 size={11} />
              Deliver
            </Button>
          </>
        )}
      </div>
    </div>
  )
}