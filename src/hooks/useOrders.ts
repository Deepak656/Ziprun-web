import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/lib/api'
import type { OrderStatus, CreateOrderRequest } from '@/types'

export const ORDERS_KEY = ['orders'] as const

export function useOrders(status?: OrderStatus) {
  return useQuery({
    queryKey: [...ORDERS_KEY, status],
    queryFn: () => ordersApi.getAll(status),
    refetchInterval: 5_000,
    staleTime: 2_000,
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateOrderRequest) => ordersApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDERS_KEY })
    },
  })
}

export function useMarkDelivered() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orderId: string) => ordersApi.markDelivered(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDERS_KEY })
    },
  })
}

export function useGenerateSuggestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      orderId,
      triggerReason,
      offlineAgentId,
    }: {
      orderId: string
      triggerReason: 'INITIAL' | 'AGENT_OFFLINE'
      offlineAgentId?: string
    }) => ordersApi.generateSuggestion(orderId, triggerReason, offlineAgentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suggestions'] })
      qc.invalidateQueries({ queryKey: ORDERS_KEY })
    },
  })
}