// ─── Enums ────────────────────────────────────────────────────────────────────

export type AgentStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE'
export type OrderStatus = 'ASSIGNED' | 'REASSIGNMENT_PENDING' | 'REASSIGNED' | 'DELIVERED'
export type SuggestionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'
export type SuggestionDecision = 'ACCEPT' | 'REJECT'
export type TriggerReason = 'INITIAL' | 'AGENT_OFFLINE'
export type RoutingStrategyType = 'AI' | 'RULE'
export type WeightClass = 'LIGHT' | 'HEAVY'
export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'PREMIUM'

// ─── API Wrapper ───────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

export interface ErrorResponse {
  status: number
  error: string
  message: string
  path: string
  timestamp: string
}

// ─── Agent ────────────────────────────────────────────────────────────────────

export interface Agent {
  id: string
  name: string
  status: AgentStatus
  activeOrderCount: number
  currentZone: string | null
  maxCapacity: number | null
  supportedWeightClasses: WeightClass[]
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface Order {
  id: string
  description: string
  assignedAgentId: string
  assignedAgentName: string
  status: OrderStatus
  pickupZone: string | null
  dropoffZone: string | null
  weightClass: WeightClass | null
  priority: Priority
  slaDeadline: string | null
  createdAt: string
}

// ─── Suggestion ───────────────────────────────────────────────────────────────

export interface Suggestion {
  id: string
  orderId: string
  orderDescription: string
  recommendedAgentId: string
  recommendedAgentName: string
  confidence: number
  reasoning: string
  strategy: RoutingStrategyType
  triggerReason: TriggerReason
  status: SuggestionStatus
  fallbackUsed: boolean
  createdAt: string
  reviewedAt: string | null
}

// ─── Requests ─────────────────────────────────────────────────────────────────

export interface CreateOrderRequest {
  description: string
  assignedAgentId: string
}

export interface UpdateAgentStatusRequest {
  status: AgentStatus
}

export interface UpdateSuggestionRequest {
  decision: SuggestionDecision
}