# RevSignal AI

<div align="center">

![RevSignal AI](https://img.shields.io/badge/RevSignal-AI-7D40FF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTMgM3YxOGgxOCIvPjxwYXRoIGQ9Im0xOSA5LTUgNS00LTQtMyAzIi8+PC9zdmc+)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

**Predictive Revenue Intelligence Platform**

*Transform CRM data into deal predictions, risk alerts, and revenue forecasts*

[Live Demo](#) | [Documentation](#) | [Report Bug](https://github.com/mejba13/revsignal-ai/issues)

</div>

---

## Overview

RevSignal AI is a cutting-edge predictive revenue intelligence platform designed for B2B SaaS sales teams. It leverages AI-powered analytics to transform raw CRM data into actionable insights, helping sales leaders make data-driven decisions with confidence.

<img width="1813" height="1438" alt="CleanShot 2026-01-29 at 2  27 36" src="https://github.com/user-attachments/assets/bc98b3d5-b387-46d1-92eb-d11db908cbd9" />

### Key Capabilities

- **AI-Powered Deal Scoring** - 0-100 score with win probability predictions
- **Risk Detection** - Automated alerts for stalled, slipping, and at-risk deals
- **Revenue Forecasting** - Intelligent pipeline forecasting with breakdown analysis
- **CRM Integration** - Seamless sync with Salesforce and HubSpot
- **Real-time Dashboard** - Pipeline visualization and key metrics at a glance

---

## Features

### Deal Intelligence
| Feature | Description |
|---------|-------------|
| **Smart Scoring** | GPT-4 powered scoring analyzing 7 key deal factors |
| **Risk Levels** | Automated Low/Medium/High risk classification |
| **Factor Breakdown** | Understand exactly why deals are scored the way they are |
| **Score History** | Track score changes over time |

### Pipeline Management
| Feature | Description |
|---------|-------------|
| **Pipeline Board** | Kanban-style deal management |
| **List View** | Sortable, filterable deal tables |
| **Search & Filters** | Find deals instantly |
| **Stage Tracking** | Monitor deal progression |

### Analytics Dashboard
| Feature | Description |
|---------|-------------|
| **Pipeline Summary** | Total value, win rate, at-risk revenue |
| **Stage Breakdown** | Revenue by pipeline stage |
| **Top Deals** | Focus on high-value opportunities |
| **At-Risk Alerts** | Never miss a slipping deal |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS 4, Shadcn/ui |
| **State Management** | TanStack Query (server), Zustand (client) |
| **API** | tRPC |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | NextAuth.js |
| **Cache** | Redis (Upstash) |
| **AI/ML** | OpenAI GPT-4 API |
| **Background Jobs** | Trigger.dev |
| **Hosting** | Vercel (app), Supabase/Neon (database) |
| **Email** | Resend |
| **Monitoring** | Sentry |
| **Analytics** | PostHog |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16+
- Redis (for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mejba13/revsignal-ai.git
   cd revsignal-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your `.env.local`**
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/revsignal"

   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # OpenAI
   OPENAI_API_KEY="sk-..."

   # CRM Integrations
   SALESFORCE_CLIENT_ID="..."
   SALESFORCE_CLIENT_SECRET="..."
   HUBSPOT_CLIENT_ID="..."
   HUBSPOT_CLIENT_SECRET="..."

   # Redis
   UPSTASH_REDIS_REST_URL="..."
   UPSTASH_REDIS_REST_TOKEN="..."
   ```

5. **Initialize the database**
   ```bash
   pnpm db:push
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

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

---

## Project Structure

```
/src
  /app                 # Next.js 15 app router
  /components          # React components
    /ui                # Shadcn/ui components
    /features          # Feature-specific components
    /landing           # Landing page components
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

---

## Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary Purple | `#7D40FF` | CTAs, active states, key metrics |
| Accent Lavender | `#C6CFFF` | Secondary elements, hover states |
| Background | `#FAFAFA` | Page/card backgrounds |
| Text Primary | `#0A0A0A` | Headings, body text |
| Success | `#10B981` | Positive indicators |
| Warning | `#F59E0B` | At-risk indicators |
| Error | `#EF4444` | Critical alerts |

### Typography

- **Headings**: Red Hat Display (700/600 weight)
- **Body**: Outfit (400 weight)

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Page Load (LCP) | < 2.5 seconds |
| API Response (P95) | < 500ms |
| AI Scoring Time | < 3 seconds/deal |
| CRM Sync Latency | < 5 minutes |
| Uptime | 99.5% |

---

## MVP Constraints

- Maximum 10 users per organization
- Maximum 500 active deals per organization
- Salesforce OR HubSpot integration (not both simultaneously)
- Web application only
- Email-based authentication (no SSO in MVP)

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

Format: `<type>(<scope>): <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

---

## License

This project is proprietary software. All rights reserved.

---

## Developed By

<div align="center">

<img width="380" height="420" alt="engr-mejba-ahmed" src="https://github.com/user-attachments/assets/83e72c39-5eaa-428a-884b-cb4714332487" />


### **Engr Mejba Ahmed**

**AI Developer | Software Engineer | Entrepreneur**

[![Portfolio](https://img.shields.io/badge/Portfolio-mejba.me-10B981?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.mejba.me)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/mejba)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mejba13)

</div>

---

## Hire / Work With Me

I build AI-powered applications, mobile apps, and enterprise solutions. Let's bring your ideas to life!

| Platform | Description | Link |
|----------|-------------|------|
| **Fiverr** | Custom builds, integrations, performance optimization | [fiverr.com/s/EgxYmWD](https://www.fiverr.com/s/EgxYmWD) |
| **Mejba Personal Portfolio** | Full portfolio & contact | [mejba.me](https://www.mejba.me) |
| **Ramlit Limited** | Software development company | [ramlit.com](https://www.ramlit.com) |
| **ColorPark Creative Agency** | UI/UX & creative solutions | [colorpark.io](https://www.colorpark.io) |
| **xCyberSecurity** | Global cybersecurity services | [xcybersecurity.io](https://www.xcybersecurity.io) |
