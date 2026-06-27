import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Package, BrainCircuit, Zap } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useSuggestions } from '../../hooks/useSuggestions'

const navItems = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/agents',      icon: Users,           label: 'Agents' },
  { to: '/orders',      icon: Package,         label: 'Orders' },
  { to: '/suggestions', icon: BrainCircuit,    label: 'Suggestions' },
]

export function Sidebar() {
  const { data: pending } = useSuggestions('PENDING')
  const pendingCount = pending?.length ?? 0

  return (
    <aside className="w-56 bg-surface-900 border-r border-border-subtle flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center">
            <Zap size={14} className="text-surface-900 fill-surface-900" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100 leading-none">ZipRun</p>
            <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase mt-0.5">Ops Console</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150',
                isActive
                  ? 'bg-surface-600 text-slate-100 font-medium'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-surface-700'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={15}
                  className={cn(isActive ? 'text-amber-400' : 'text-slate-600')}
                />
                <span className="flex-1">{label}</span>
                {label === 'Suggestions' && pendingCount > 0 && (
                  <span className="bg-amber-500 text-surface-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border-subtle">
        <p className="text-[10px] text-slate-700 font-mono">AI Reassignment Engine</p>
        <p className="text-[10px] text-slate-700 font-mono">Sprint 1 · Zycus Hackathon</p>
      </div>
    </aside>
  )
}