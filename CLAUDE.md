# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RevSignal AI is a Predictive Revenue Intelligence Platform that transforms CRM data into deal predictions, risk alerts, and revenue forecasts. The MVP is a 12-week build targeting B2B SaaS sales teams.

## Reference Documents

Always consult these authoritative sources:
- `RevSignal-AI-PRD.docx` - Product requirements, user personas, design system
- `RevSignal-AI-Technical-Implementation.docx` - Full architecture specs
- `RevSignal-AI-MVP-Scope.docx` - MVP feature scope and constraints

## MVP Constraints

- Maximum 10 users per organization
- Maximum 500 active deals per organization
- Salesforce OR HubSpot integration (not both)
- Web application only (no mobile)
- Email-based authentication only (no SSO)

## Technology Stack (MVP)

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS 4, Shadcn/ui |
| State | TanStack Query (server), Zustand (client) |
| API | tRPC |
| Database | PostgreSQL with Prisma ORM |
| Auth | NextAuth.js |
| Cache | Redis (Upstash) |
| AI/ML | OpenAI GPT-4 API (prompt-based scoring for MVP) |
| Background Jobs | Trigger.dev |
| Hosting | Vercel (app), Supabase or Neon (database) |
| Email | Resend |
| Monitoring | Sentry |
| Analytics | PostHog |

## Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary Purple | #7D40FF | CTAs, active states, key metrics |
| Accent Lavender | #C6CFFF | Secondary elements, hover states |
| Background | #FAFAFA | Page/card backgrounds |
| Text Primary | #0A0A0A | Headings, body text |
| Text Secondary | #525252 | Labels, descriptions |
| Success | #10B981 | Positive indicators |
| Warning | #F59E0B | At-risk indicators |
| Error | #EF4444 | Critical alerts |

### Typography
- **Headings**: Red Hat Display (700/600 weight)
- **Body**: Outfit (400 weight)
- **Base spacing unit**: 4px

### Component Specs
- Border radius: 8px (buttons), 12px (cards), 16px (containers)
- Animation duration: 150ms (hover), 200ms (transitions), 300ms (modals)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

## MVP Database Schema

Core tables for MVP:
- `organizations` - Multi-tenant isolation, subscription tier
- `users` - Auth, roles (admin/member), org association
- `integrations` - OAuth tokens (encrypted), provider settings
- `accounts` - Company accounts from CRM
- `contacts` - Individual contacts
- `deals` - Core entity with `ai_score`, `risk_level`, `forecast_category`
- `deal_scores` - Score history with factors breakdown
- `activities` - Activity timeline from CRM
- `sync_logs` - Integration sync audit trail

## MVP API Routes (tRPC)

| Router | Procedures |
|--------|------------|
| auth | register, login, logout, verifyEmail, resetPassword |
| users | me, update, invite, list, remove |
| integrations | connect, disconnect, status, sync, logs |
| deals | list, get, search, updateForecastCategory |
| scoring | getDealScore, refreshScore, getScoreHistory |
| dashboard | getSummary, getPipelineByStage, getAtRiskDeals, getTopDeals |
| forecast | getCurrent, getBreakdown |

## AI Scoring Model (MVP)

For MVP, use GPT-4 prompt-based scoring (not custom ML models):

| Factor | Weight | Source |
|--------|--------|--------|
| Days in Current Stage | 20% | CRM stage history |
| Activity Recency | 20% | Last activity timestamp |
| Activity Frequency | 15% | Activity count (30 days) |
| Close Date Proximity | 15% | Expected close vs today |
| Deal Amount vs Average | 10% | Org average comparison |
| Contact Count | 10% | Contacts on deal |
| Stage Progression | 10% | Linear vs stalled |

## MVP Features (P0 - Must Have)

1. **Authentication**: Email/password, Google OAuth, email verification, team invites
2. **CRM Integration**: Salesforce OAuth, HubSpot OAuth, deal/account/contact sync
3. **Deal Management**: List view, detail view, pipeline board, search, filters
4. **AI Scoring**: 0-100 score, win probability, factor breakdown, auto-refresh
5. **Risk Detection**: Low/Medium/High levels, stalled detection, slippage alerts
6. **Dashboard**: Pipeline value, win rate, at-risk revenue, pipeline by stage

## Performance Targets

| Metric | MVP Target |
|--------|------------|
| Page Load (LCP) | < 2.5 seconds |
| API Response (P95) | < 500ms |
| AI Scoring Time | < 3 seconds per deal |
| CRM Sync Latency | < 5 minutes |
| Uptime | 99.5% |
| Error Rate | < 1% |

## Code Standards

### TypeScript/JavaScript
- ESLint with Airbnb config + TypeScript
- Prettier: single quotes, 2 spaces, trailing commas
- Strict TypeScript, no `any` without justification
- Functional React components with hooks

### Git Workflow
- `main` - production-ready
- `develop` - integration branch
- `feature/*` - new features
- `bugfix/*` - bug fixes

### Commits
Format: `<type>(<scope>): <description>`
Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore

## Project Structure (Target)

```
/src
  /app                 # Next.js 15 app router
  /components          # React components
    /ui                # Shadcn/ui components
    /features          # Feature-specific components
  /lib                 # Utilities, helpers
  /server              # tRPC routers, server logic
    /routers           # tRPC route handlers
    /services          # Business logic
  /hooks               # Custom React hooks
  /stores              # Zustand stores
  /types               # TypeScript types
/prisma                # Database schema and migrations
/public                # Static assets
```

## AI Scoring Implementation

The AI scoring service is implemented in `/src/lib/ai/`:

- **`openai.ts`** - OpenAI client configuration
- **`prompts.ts`** - GPT-4 system prompts and prompt builders
- **`scoring-service.ts`** - Core scoring logic (scoreDeal, scoreOrganizationDeals)

### tRPC AI Routes (`/src/server/routers/ai.ts`)

| Procedure | Type | Description |
|-----------|------|-------------|
| `scoreDeal` | mutation | Score a single deal |
| `scoreDeals` | mutation | Batch score deals (admin only) |
| `getDealScore` | query | Get AI score for a deal |
| `getScoreHistory` | query | Get score history for a deal |
| `updateDaysInStage` | mutation | Update days in stage (admin only) |
| `scoringStats` | query | Get organization scoring statistics |

### AI Score Factors (GPT-4 analyzed)

| Factor | Range | Description |
|--------|-------|-------------|
| engagement | 0-100 | Email frequency, response times |
| velocity | 0-100 | Stage progression speed |
| stakeholders | 0-100 | Contact involvement and roles |
| recency | 0-100 | Days since last activity |
| deal_strength | 0-100 | Amount, close date alignment |

### Environment Variables

```bash
OPENAI_API_KEY="sk-..."  # Required for AI scoring
```

## Development Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm typecheck        # TypeScript type checking

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio
```

## Development Phases

### Phase 1: Foundation (Weeks 1-4)
- Project setup, CI/CD, database schema
- Authentication system
- Salesforce/HubSpot OAuth and sync

### Phase 2: Core Features (Weeks 5-8)
- Deal list/detail views
- AI scoring engine (GPT-4)
- Risk detection and dashboard

### Phase 3: Polish & Launch (Weeks 9-12)
- Forecast view, settings pages
- Performance optimization
- Beta launch with 10 pilot customers
