import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { suggestionsApi } from '@/lib/api'
import type { SuggestionStatus, SuggestionDecision } from '@/types'

export const SUGGESTIONS_KEY = ['suggestions'] as const

export function useSuggestions(status?: SuggestionStatus) {
  return useQuery({
    queryKey: [...SUGGESTIONS_KEY, status],
    queryFn: () => suggestionsApi.getAll(status),
    refetchInterval: 4_000,
    staleTime: 1_000,
  })
}

export function useReviewSuggestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: SuggestionDecision }) =>
      suggestionsApi.review(id, { decision }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUGGESTIONS_KEY })
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['agents'] })
    },
  })
}