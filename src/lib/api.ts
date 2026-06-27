import axios from 'axios'
import type {
  Agent,
  Order,
  Suggestion,
  ApiResponse,
  UpdateAgentStatusRequest,
  UpdateSuggestionRequest,
  CreateOrderRequest,
  AgentStatus,
  OrderStatus,
  SuggestionStatus,
} from '@/types'

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ?? err.message ?? 'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

// ─── Agents ───────────────────────────────────────────────────────────────────

export const agentsApi = {
  getAll: (status?: AgentStatus) =>
    client
      .get<ApiResponse<Agent[]>>('/agents', { params: status ? { status } : {} })
      .then((r) => r.data.data),

  getById: (id: string) =>
    client.get<ApiResponse<Agent>>(`/agents/${id}`).then((r) => r.data.data),

  updateStatus: (id: string, body: UpdateAgentStatusRequest) =>
    client
      .patch<ApiResponse<Agent>>(`/agents/${id}/status`, body)
      .then((r) => r.data.data),
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ordersApi = {
  getAll: (status?: OrderStatus) =>
    client
      .get<ApiResponse<Order[]>>('/orders', { params: status ? { status } : {} })
      .then((r) => r.data.data),

  getById: (id: string) =>
    client.get<ApiResponse<Order>>(`/orders/${id}`).then((r) => r.data.data),

  create: (body: CreateOrderRequest) =>
    client.post<ApiResponse<Order>>('/orders', body).then((r) => r.data.data),

  markDelivered: (id: string) =>
    client.patch<ApiResponse<Order>>(`/orders/${id}/deliver`).then((r) => r.data.data),

  generateSuggestion: (orderId: string, triggerReason: 'INITIAL' | 'AGENT_OFFLINE', offlineAgentId?: string) =>
    client
      .post<ApiResponse<Suggestion>>(`/orders/${orderId}/suggest`, {
        triggerReason,
        offlineAgentId,
      })
      .then((r) => r.data.data),
}

// ─── Suggestions ──────────────────────────────────────────────────────────────

export const suggestionsApi = {
  getAll: (status?: SuggestionStatus) =>
    client
      .get<ApiResponse<Suggestion[]>>('/suggestions', {
        params: status ? { status } : {},
      })
      .then((r) => r.data.data),

  review: (id: string, body: UpdateSuggestionRequest) =>
    client
      .patch<ApiResponse<Suggestion>>(`/suggestions/${id}`, body)
      .then((r) => r.data.data),
}