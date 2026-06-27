import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agentsApi } from '@/lib/api'
import type { AgentStatus } from '@/types'

export const AGENTS_KEY = ['agents'] as const

export function useAgents(status?: AgentStatus) {
  return useQuery({
    queryKey: [...AGENTS_KEY, status],
    queryFn: () => agentsApi.getAll(status),
    refetchInterval: 5_000,
    staleTime: 2_000,
  })
}

export function useUpdateAgentStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AgentStatus }) =>
      agentsApi.updateStatus(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AGENTS_KEY })
    },
  })
}