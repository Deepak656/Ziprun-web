@echo off
setlocal enabledelayedexpansion

echo ============================================
echo  ZipRun Frontend Setup Script
echo ============================================
echo.

REM ─── Step 1: Create project via Vite ────────────────────────────────────────
echo [1/5] Scaffolding Vite + React + TypeScript project...
call npm create vite@latest ziprun-frontend -- --template react-ts
if errorlevel 1 (
    echo ERROR: Vite scaffold failed. Make sure Node.js 18+ is installed.
    pause
    exit /b 1
)

cd ziprun-frontend
echo Done. Entered ziprun-frontend\
echo.

REM ─── Step 2: Install dependencies ───────────────────────────────────────────
echo [2/5] Installing dependencies...
call npm install react-router-dom @tanstack/react-query axios clsx date-fns lucide-react
call npm install -D tailwindcss postcss autoprefixer
call npm install -D @types/react @types/react-dom
echo Done.
echo.

REM ─── Step 3: Init Tailwind ───────────────────────────────────────────────────
echo [3/5] Initialising Tailwind CSS...
call npx tailwindcss init -p
echo Done.
echo.

REM ─── Step 4: Create folder structure ────────────────────────────────────────
echo [4/5] Creating folder structure...

mkdir src\components\ui
mkdir src\components\layout
mkdir src\components\agents
mkdir src\components\orders
mkdir src\components\suggestions
mkdir src\components\dashboard
mkdir src\hooks
mkdir src\lib
mkdir src\types
mkdir src\pages
mkdir public

echo Done.
echo.

REM ─── Step 5: Create all empty files ─────────────────────────────────────────
echo [5/5] Creating all source files...

REM Config files (root)
type nul > vite.config.ts
type nul > tailwind.config.js
type nul > tsconfig.json
type nul > tsconfig.node.json
type nul > postcss.config.js

REM public
type nul > public\favicon.svg
type nul > index.html

REM src root
type nul > src\main.tsx
type nul > src\App.tsx
type nul > src\index.css
type nul > src\vite-env.d.ts

REM types
type nul > src\types\index.ts

REM lib
type nul > src\lib\api.ts
type nul > src\lib\utils.ts

REM hooks
type nul > src\hooks\useAgents.ts
type nul > src\hooks\useOrders.ts
type nul > src\hooks\useSuggestions.ts

REM UI components
type nul > src\components\ui\Badge.tsx
type nul > src\components\ui\Button.tsx
type nul > src\components\ui\Card.tsx
type nul > src\components\ui\Spinner.tsx
type nul > src\components\ui\EmptyState.tsx
type nul > src\components\ui\Toast.tsx

REM Layout components
type nul > src\components\layout\AppLayout.tsx
type nul > src\components\layout\Sidebar.tsx
type nul > src\components\layout\PageHeader.tsx

REM Agent components
type nul > src\components\agents\AgentCard.tsx
type nul > src\components\agents\AgentStatusDot.tsx

REM Order components
type nul > src\components\orders\OrderRow.tsx
type nul > src\components\orders\CreateOrderModal.tsx

REM Suggestion components
type nul > src\components\suggestions\SuggestionCard.tsx

REM Dashboard components
type nul > src\components\dashboard\StatCard.tsx
type nul > src\components\dashboard\AgentLoadBar.tsx

REM Pages
type nul > src\pages\DashboardPage.tsx
type nul > src\pages\AgentsPage.tsx
type nul > src\pages\OrdersPage.tsx
type nul > src\pages\SuggestionsPage.tsx

echo Done.
echo.
echo ============================================
echo  All files and folders created successfully
echo  Next: paste the code into each file, then
echo  run:  npm run dev
echo ============================================
pause