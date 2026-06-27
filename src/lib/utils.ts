import { clsx, type ClassValue } from 'clsx'
import { formatDistanceToNow, format } from 'date-fns'
import type { AgentStatus, OrderStatus, SuggestionStatus, Priority } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatRelativeTime(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'MMM d, HH:mm')
  } catch {
    return dateStr
  }
}

export function agentStatusMeta(status: AgentStatus) {
  const map = {
    AVAILABLE: { label: 'Available', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400' },
    BUSY:      { label: 'Busy',      color: 'text-amber-400',   bg: 'bg-amber-500/10',   dot: 'bg-amber-400' },
    OFFLINE:   { label: 'Offline',   color: 'text-slate-500',   bg: 'bg-slate-500/10',   dot: 'bg-slate-500' },
  }
  return map[status]
}

export function orderStatusMeta(status: OrderStatus) {
  const map = {
    ASSIGNED:              { label: 'Assigned',           color: 'text-blue-400',    bg: 'bg-blue-500/10' },
    REASSIGNMENT_PENDING:  { label: 'Needs Reassignment', color: 'text-amber-400',   bg: 'bg-amber-500/10' },
    REASSIGNED:            { label: 'Reassigned',         color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    DELIVERED:             { label: 'Delivered',          color: 'text-slate-500',   bg: 'bg-slate-500/10' },
  }
  return map[status]
}

export function suggestionStatusMeta(status: SuggestionStatus) {
  const map = {
    PENDING:  { label: 'Pending Review', color: 'text-amber-400',   bg: 'bg-amber-500/10' },
    ACCEPTED: { label: 'Accepted',       color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    REJECTED: { label: 'Rejected',       color: 'text-rose-400',    bg: 'bg-rose-500/10' },
  }
  return map[status]
}

export function priorityMeta(priority: Priority) {
  const map = {
    LOW:     { label: 'Low',     color: 'text-slate-500' },
    NORMAL:  { label: 'Normal',  color: 'text-slate-400' },
    HIGH:    { label: 'High',    color: 'text-amber-400' },
    PREMIUM: { label: 'Premium', color: 'text-rose-400' },
  }
  return map[priority] ?? map.NORMAL
}

export function confidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-emerald-400'
  if (confidence >= 0.5) return 'text-amber-400'
  return 'text-rose-400'
}