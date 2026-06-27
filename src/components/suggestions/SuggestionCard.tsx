import { Brain, ShieldAlert, CheckCircle2, XCircle, ChevronDown, ChevronUp, Cpu } from 'lucide-react'
import { useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { confidenceColor, formatRelativeTime, cn } from '@/lib/utils'
import type { Suggestion } from '@/types'
import { useReviewSuggestion } from '@/hooks/useSuggestions'
import { useToast } from '@/components/ui/Toast'

interface SuggestionCardProps {
  suggestion: Suggestion
}

export function SuggestionCard({ suggestion: s }: SuggestionCardProps) {
  const [expanded, setExpanded] = useState(s.status === 'PENDING')
  const { mutate, isPending } = useReviewSuggestion()
  const { toast } = useToast()

  const isAgenticReplan = s.triggerReason === 'AGENT_OFFLINE'
  const isFallback = s.fallbackUsed
  const isPendingStatus = s.status === 'PENDING'

  const handleReview = (decision: 'ACCEPT' | 'REJECT') => {
    mutate(
      { id: s.id, decision },
      {
        onSuccess: () =>
          toast(
            'success',
            decision === 'ACCEPT'
              ? `Order ${s.orderId} reassigned to ${s.recommendedAgentName}.`
              : `Suggestion for ${s.orderId} rejected.`
          ),
        onError: (e) => toast('error', e.message),
      }
    )
  }

  return (
    <Card
      glow={isAgenticReplan && isPendingStatus ? 'amber' : 'none'}
      className={cn('animate-slide-in', isAgenticReplan && isPendingStatus && 'border-amber-500/25')}
    >
      <CardBody className="space-y-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Agentic vs manual badge */}
            {isAgenticReplan ? (
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-amber-500/15 border border-amber-500/25 shrink-0">
                <ShieldAlert size={14} className="text-amber-400" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 shrink-0">
                <Brain size={14} className="text-blue-400" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-slate-500">{s.orderId}</span>
                {isAgenticReplan && (
                  <Badge variant="amber">
                    <ShieldAlert size={9} />
                    Auto Re-plan
                  </Badge>
                )}
                {isFallback && (
                  <Badge variant="slate">
                    <Cpu size={9} />
                    Rule fallback
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-200 mt-0.5 truncate">{s.orderDescription}</p>
            </div>
          </div>

          {/* Status badge + expand toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {s.status === 'ACCEPTED' && <Badge variant="emerald"><CheckCircle2 size={9} />Accepted</Badge>}
            {s.status === 'REJECTED' && <Badge variant="rose"><XCircle size={9} />Rejected</Badge>}
            {s.status === 'PENDING'  && <Badge variant="amber">Pending</Badge>}
            <button
              onClick={() => setExpanded((p) => !p)}
              className="text-slate-600 hover:text-slate-400 transition-colors"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Recommendation row */}
        <div className="flex items-center gap-4 bg-surface-700 rounded px-3 py-2.5">
          <div className="flex-1">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Recommended Agent</p>
            <p className="text-sm font-semibold text-slate-100 mt-0.5">{s.recommendedAgentName}</p>
            <p className="text-[11px] font-mono text-slate-600">{s.recommendedAgentId}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Confidence</p>
            <p className={cn('text-2xl font-bold font-mono mt-0.5', confidenceColor(s.confidence))}>
              {Math.round(s.confidence * 100)}
              <span className="text-sm font-normal">%</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Strategy</p>
            <Badge variant={s.strategy === 'AI' ? 'blue' : 'slate'} className="mt-1">
              {s.strategy === 'AI' ? <Brain size={9} /> : <Cpu size={9} />}
              {s.strategy}
            </Badge>
          </div>
        </div>

        {/* AI Reasoning — expandable */}
        {expanded && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-surface-700/50 border border-border-subtle rounded px-3 py-2.5">
              <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">
                {s.strategy === 'AI' ? 'AI Reasoning' : 'Rule Engine Output'}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">{s.reasoning}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-mono">
                Triggered: <span className="text-slate-500">{s.triggerReason === 'AGENT_OFFLINE' ? 'Agent went offline' : 'Manual request'}</span>
              </span>
              <span className="font-mono">{formatRelativeTime(s.createdAt)}</span>
            </div>

            {/* Accept / Reject */}
            {isPendingStatus && (
              <div className="flex gap-2 pt-1">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleReview('ACCEPT')}
                  loading={isPending}
                  className="flex-1"
                >
                  <CheckCircle2 size={12} />
                  Accept & Reassign
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleReview('REJECT')}
                  loading={isPending}
                  className="flex-1"
                >
                  <XCircle size={12} />
                  Reject
                </Button>
              </div>
            )}

            {s.reviewedAt && (
              <p className="text-[11px] text-slate-600 font-mono text-right">
                Reviewed {formatRelativeTime(s.reviewedAt)}
              </p>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  )
}