# ZipRun Ops Console — Frontend

React 18 + Vite + TypeScript + Tailwind CSS

## Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

Requires the Spring Boot backend running on http://localhost:8080.

## Stack

- React 18 + TypeScript
- Vite (dev server with proxy to :8080)
- TanStack Query v5 (data fetching, auto-polling every 4-5s)
- React Router v6
- Tailwind CSS v3
- Axios
- Lucide React icons

## Features

- Live Dashboard — stats, agent load bars, pending suggestions prioritised by urgency
- Agents page — status filter tabs, capacity bars, mark offline to trigger agentic loop
- Orders page — full board with status filters, create order modal, deliver action
- Suggestions page — agentic re-plans highlighted with amber glow, AI reasoning expanded by default, Accept/Reject controls
- Toast notifications for every action
- Auto-refresh via TanStack Query polling (no manual refresh needed)
- Vite proxy — no CORS issues in development

## Demo flow (for walkthrough)

1. Open Dashboard — see live agent load
2. Go to Agents — click "Go Offline" on AGT-005
3. Watch Dashboard — amber suggestions appear within 5 seconds (async re-plan)
4. Click a suggestion — see AI reasoning, confidence score, AGENT_OFFLINE badge
5. Accept — order moves to REASSIGNED, agent load updates