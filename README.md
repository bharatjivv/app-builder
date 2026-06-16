# App Graph Builder

A ReactFlow-based visual graph builder for managing and inspecting application service nodes.

## Features

- **ReactFlow canvas** with drag, select, delete (Delete/Backspace), zoom/pan
- **Service node inspector** with tabs, synced slider/input, status control
- **TanStack Query** for mock API data fetching (MSW-intercepted)
- **Zustand** state management for selected app/node, mobile panel, inspector tab
- **shadcn/ui** components throughout
- **Responsive** — right panel becomes a slide-over drawer on small screens

## Setup

**Requirements:** Node.js 18+ and npm/pnpm/yarn

```bash
# Install dependencies
npm install

# Initialize the MSW service worker (required for mock API)
npx msw init public/ --save

# Start the dev server
npm run dev
```

The app runs at http://localhost:5173

## Other scripts

```bash
npm run build      # Production build
npm run preview    # Preview the production build
npm run typecheck  # TypeScript check
```

## Key decisions

- **MSW (Mock Service Worker)** intercepts `/mock/apps` and `/mock/apps/:appId/graph` in the browser — no real backend needed
- **Zustand** handles all UI state; TanStack Query handles server/async state
- **ReactFlow** node data is updated immutably via `setNodes` — inspector edits flow back into the graph
- **shadcn/ui** components are inlined under `src/components/ui` — no extra config needed

## Known limitations

- Mock data is in-memory; refreshing resets all edits
- The "Simulate error" toggle in the top bar triggers a 500 from the mock API to test error states
