import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage }   from '@/pages/DashboardPage'
import { AgentsPage }      from '@/pages/AgentsPage'
import { OrdersPage }      from '@/pages/OrdersPage'
import { SuggestionsPage } from '@/pages/SuggestionsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="agents"      element={<AgentsPage />} />
        <Route path="orders"      element={<OrdersPage />} />
        <Route path="suggestions" element={<SuggestionsPage />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}