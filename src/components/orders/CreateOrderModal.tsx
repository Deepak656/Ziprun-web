import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAgents } from '@/hooks/useAgents'
import { useCreateOrder } from '@/hooks/useOrders'
import { useToast } from '@/components/ui/Toast'
import { agentStatusMeta } from '@/lib/utils'

interface CreateOrderModalProps {
  onClose: () => void
}

export function CreateOrderModal({ onClose }: CreateOrderModalProps) {
  const [description, setDescription] = useState('')
  const [agentId, setAgentId] = useState('')
  const { data: agents } = useAgents()
  const { mutate, isPending } = useCreateOrder()
  const { toast } = useToast()

  const availableAgents = agents?.filter((a) => a.status !== 'OFFLINE') ?? []

  const handleSubmit = () => {
    if (!description.trim() || !agentId) return
    mutate(
      { description: description.trim(), assignedAgentId: agentId },
      {
        onSuccess: (order) => {
          toast('success', `Order ${order.id} created and assigned.`)
          onClose()
        },
        onError: (e) => toast('error', e.message),
      }
    )
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-surface-800 border border-border-default rounded-xl w-full max-w-md mx-4 shadow-card-hover animate-slide-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h2 className="text-sm font-semibold text-slate-100">New Order</h2>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-300 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Electronics — Koramangala to Indiranagar"
              className="w-full bg-surface-700 border border-border-default rounded px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-surface-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
              Assign to Agent
            </label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full bg-surface-700 border border-border-default rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/60 transition-colors"
            >
              <option value="">Select an agent</option>
              {availableAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} — {agentStatusMeta(agent.status).label} ({agent.activeOrderCount} active)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2.5 px-5 py-4 border-t border-border-subtle">
          <Button variant="ghost" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            loading={isPending}
            disabled={!description.trim() || !agentId}
            className="flex-1"
          >
            Create Order
          </Button>
        </div>
      </div>
    </div>
  )
}