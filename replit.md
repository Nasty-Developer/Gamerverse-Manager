# GamerVerse

The ultimate AI-powered gaming discovery platform — "Google for Games". Search, explore, compare, and discover games using natural language. Check PC compatibility, read reviews, save favorites, and get personalized recommendations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/gamerverse run dev` — run the frontend (port assigned dynamically)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `RAWG_API_KEY`, `CLERK_SECRET_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + Clerk auth proxy middleware
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite + Wouter routing + Framer Motion + Tailwind CSS + shadcn/ui
- Auth: Clerk (ClerkProvider wraps app, proxy through `/api/__clerk`)
- Game data: RAWG API

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-client-react/src/generated/` — generated React Query hooks + Zod schemas (run codegen to update)
- `lib/db/src/schema/` — Drizzle ORM schema (favorites, reviews, recently_viewed)
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/gamerverse/src/pages/` — all frontend page components (home, search, discover, game-detail, pc-check, profile)
- `artifacts/gamerverse/src/components/` — shared components (game-card, layout, navbar)

## Architecture decisions

- **RAWG API as data source**: All game data (search, trending, genres, platforms, screenshots) fetched live from RAWG via our API server which proxies and enriches responses.
- **Algorithmic recommendations only**: No OpenAI or LLM APIs — recommendations are purely RAWG-based filtering by genre/tags from user favorites.
- **Contract-first API**: OpenAPI spec defines all endpoints; Orval generates React Query hooks and Zod schemas automatically. Never write fetch logic manually.
- **Clerk auth via proxy**: ClerkProvider uses `/api/__clerk` proxy URL so auth works seamlessly in the Replit environment.
- **GameSummary imported from @workspace/api-client-react**: The generated `GameSummary` type is the single source of truth — never define local variants.

## Product

- **Homepage**: Cinematic hero with animated search bar, trending/new/top-rated game grids, genre cards, featured collections, gaming news
- **Search**: NLP intent parsing ("best open world RPGs", "games for low-end PC") with genre/platform filter sidebar
- **Discover**: Full catalog browse with genre/platform/ordering filters and pagination
- **Game Detail**: Hero banner, ratings, metacritic badge, gallery, similar games, PC check CTA, description, platforms/developers
- **PC Check**: Hardware compatibility checker — input CPU/GPU/RAM, get can_run/may_run/not_recommended verdict
- **Profile**: Favorites grid, recently viewed history, AI-style recommendations based on favorite genres

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm run typecheck:libs` before leaf package typechecks if you change anything in `lib/`
- `GameSummary` type must be imported from `@workspace/api-client-react`, never redefined locally
- `SelectItem` from Radix UI cannot have `value=""` — use `"all"` as the placeholder value and handle in logic
- RAWG API occasionally returns 502 errors — the app handles these gracefully with error states
- Clerk dev instance warning is expected in development — not an error

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- RAWG API docs: https://api.rawg.io/docs/
