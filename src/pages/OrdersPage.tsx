import { useState } from 'react'
import { Package, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { OrderRow } from '@/components/orders/OrderRow'
import { CreateOrderModal } from '@/components/orders/CreateOrderModal'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useOrders } from '@/hooks/useOrders'
import type { OrderStatus } from '@/types'
import { cn } from '@/lib/utils'

const FILTERS: { label: string; value: OrderStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'Needs Reassignment', value: 'REASSIGNMENT_PENDING' },
  { label: 'Reassigned', value: 'REASSIGNED' },
  { label: 'Delivered', value: 'DELIVERED' },
]

export function OrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | undefined>(undefined)
  const [showModal, setShowModal] = useState(false)
  const { data: orders, isLoading } = useOrders()

  const filtered = orders?.filter((o) => !filter || o.status === filter) ?? []

  return (
    <div className="px-7 pb-10">
      <PageHeader
        title="Order Board"
        subtitle={`${orders?.length ?? 0} orders in system`}
        action={
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            <Plus size={13} />
            New Order
          </Button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 bg-surface-800 border border-border-subtle rounded-lg p-1 w-fit flex-wrap">
        {FILTERS.map(({ label, value }) => {
          const count = value ? orders?.filter((o) => o.status === value).length : orders?.length
          return (
            <button
              key={label}
              onClick={() => setFilter(value)}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-medium transition-all duration-150',
                filter === value
                  ? 'bg-surface-600 text-slate-100'
                  : 'text-slate-500 hover:text-slate-300',
                value === 'REASSIGNMENT_PENDING' && filter === value && 'text-amber-300'
              )}
            >
              {label}
              {count !== undefined && (
                <span className={cn(
                  'ml-1.5 text-[10px] font-mono',
                  value === 'REASSIGNMENT_PENDING' && count > 0 ? 'text-amber-500' : 'text-slate-700'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <Card>
        {/* Table header */}
        <div className="flex items-center gap-4 px-5 py-2.5 border-b border-border-subtle">
          <div className="w-7 shrink-0" />
          <div className="flex-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Description / Route</span>
          </div>
          <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider w-16 shrink-0">Priority</span>
          <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider w-32 shrink-0">Status</span>
          <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider w-20 shrink-0 hidden xl:block">Created</span>
          <div className="w-32 shrink-0" />
        </div>

        {isLoading ? (
          <PageSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Package size={28} />}
            title="No orders"
            description="No orders match the selected filter."
            action={
              <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                <Plus size={12} />
                Create order
              </Button>
            }
          />
        ) : (
          filtered.map((order) => <OrderRow key={order.id} order={order} />)
        )}
      </Card>

      {showModal && <CreateOrderModal onClose={() => setShowModal(false)} />}
    </div>
  )
}