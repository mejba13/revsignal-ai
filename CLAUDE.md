# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RevSignal AI is a Predictive Revenue Intelligence Platform that transforms CRM data into deal predictions, risk alerts, and revenue forecasts. Built with Next.js 15, TypeScript, and PostgreSQL.

## Development Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack (http://localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm typecheck        # TypeScript type checking

# Database
pnpm db:generate      # Generate Prisma client after schema changes
pnpm db:push          # Push schema to database (development)
pnpm db:migrate       # Run migrations (production)
pnpm db:studio        # Open Prisma Studio for data browsing
```

## Architecture Overview

### API Layer (tRPC)

All API routes use tRPC with type-safe procedures. The main router is at `src/server/routers/index.ts`:

```
appRouter
├── users         # User management, invites, profile
├── deals         # Deal CRUD, search, filtering
├── dashboard     # Pipeline metrics, summaries
├── integrations  # CRM connection management
└── ai            # Deal scoring, score history
```

**Procedure Types** (defined in `src/server/trpc.ts`):
- `publicProcedure` - No auth required
- `protectedProcedure` - Requires authenticated session
- `adminProcedure` - Requires ADMIN role
- `managerProcedure` - Requires ADMIN or MANAGER role

### Authentication

NextAuth.js with JWT strategy (`src/lib/auth.ts`):
- Google OAuth and email/password credentials
- Session includes: `userId`, `organizationId`, `role`
- Prisma adapter stores accounts/sessions

### Database (Prisma)

Schema at `prisma/schema.prisma`. Core models:
- `Organization` - Multi-tenant root (max 10 users, 500 deals in MVP)
- `User` - Roles: ADMIN, MANAGER, MEMBER, VIEWER
- `Deal` - Core entity with `aiScore`, `riskLevel`, `forecastCategory`
- `Integration` - CRM connections (Salesforce or HubSpot, not both)
- `DealScore` - Score history with factor breakdowns

After schema changes, run `pnpm db:generate` before using the client.

### CRM Integrations

Located in `src/lib/integrations/`:
- `salesforce-client.ts` - OAuth 2.0 flow, deal/account/contact sync
- `hubspot-client.ts` - Private app auth, CRM data sync
- `encryption.ts` - Token encryption/decryption

OAuth callbacks at `/api/integrations/{provider}/callback`.

### AI Scoring

Located in `src/lib/ai/`:
- `openai.ts` - GPT-4 client configuration
- `prompts.ts` - System prompts for deal analysis
- `scoring-service.ts` - `scoreDeal()` and `scoreOrganizationDeals()`

Scores 0-100 based on: engagement, velocity, stakeholders, recency, deal strength.

## Key Patterns

### tRPC Client Usage

```typescript
// In React components
import { trpc } from '@/hooks/use-trpc';
const { data } = trpc.deals.list.useQuery({ limit: 10 });
const mutation = trpc.ai.scoreDeal.useMutation();
```

### Path Alias

Use `@/` for imports from `src/`:
```typescript
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
```

### Styling

- Tailwind CSS 4 with Shadcn/ui components
- Dashboard uses dark theme (`#030014` background)
- Primary purple: `#7D40FF`
- Fonts: Red Hat Display (headings), Outfit (body)

## File Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Public auth pages (login, register)
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes (tRPC, auth, integrations)
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # Shadcn/ui primitives
│   ├── landing/           # Landing page sections
│   └── providers/         # Context providers (session, trpc)
├── lib/
│   ├── ai/                # AI scoring service
│   ├── integrations/      # CRM clients
│   ├── auth.ts            # NextAuth config
│   ├── db.ts              # Prisma client
│   └── trpc.ts            # tRPC client setup
├── server/
│   ├── routers/           # tRPC route handlers
│   └── trpc.ts            # tRPC server setup, middleware
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
└── types/                 # TypeScript definitions
```

## Environment Variables

Required for development (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - App URL (http://localhost:3000)
- `NEXTAUTH_SECRET` - Session encryption key
- `OPENAI_API_KEY` - For AI scoring

Optional:
- `GOOGLE_CLIENT_ID/SECRET` - Google OAuth
- `SALESFORCE_CLIENT_ID/SECRET` - Salesforce integration
- `HUBSPOT_CLIENT_ID/SECRET` - HubSpot integration

## MVP Constraints

- Maximum 10 users per organization
- Maximum 500 active deals per organization
- Single CRM integration per org (Salesforce OR HubSpot)
- Web application only (no mobile)
- Email-based authentication (no SSO)

## Reference Documents

For detailed requirements, consult:
- `RevSignal-AI-PRD.docx` - Product requirements, user personas
- `RevSignal-AI-Technical-Implementation.docx` - Full architecture specs
- `RevSignal-AI-MVP-Scope.docx` - MVP feature scope
