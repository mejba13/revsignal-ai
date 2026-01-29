import { router } from '../trpc';
import { usersRouter } from './users';
import { dealsRouter } from './deals';
import { dashboardRouter } from './dashboard';
import { integrationsRouter } from './integrations';
import { aiRouter } from './ai';

/**
 * Main application router
 * All sub-routers are merged here
 */
export const appRouter = router({
  users: usersRouter,
  deals: dealsRouter,
  dashboard: dashboardRouter,
  integrations: integrationsRouter,
  ai: aiRouter,
});

/**
 * Export type definition of the API
 */
export type AppRouter = typeof appRouter;
