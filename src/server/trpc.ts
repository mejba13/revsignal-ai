import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import type { Session } from 'next-auth';

/**
 * Authenticated user type
 */
export type AuthenticatedUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  organizationId: string;
  role: string;
};

/**
 * Context type for tRPC procedures
 */
export type Context = {
  db: typeof db;
  session: Session | null;
};

/**
 * Authenticated context type
 */
export type AuthenticatedContext = Context & {
  session: Session;
  user: AuthenticatedUser;
};

/**
 * Create context for each request
 */
export const createContext = async (): Promise<Context> => {
  const session = await getServerSession(authOptions);

  return {
    db,
    session,
  };
};

/**
 * Initialize tRPC
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

/**
 * Middleware to check if user is authenticated
 */
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.session.user as AuthenticatedUser,
    },
  });
});

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure.use(isAuthenticated);

/**
 * Middleware to check if user has specific role
 */
const hasRole = (allowedRoles: string[]) =>
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to perform this action',
      });
    }

    const user = ctx.session.user as AuthenticatedUser;

    if (!allowedRoles.includes(user.role)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
        user,
      },
    });
  });

/**
 * Admin procedure - requires admin role
 */
export const adminProcedure = t.procedure.use(hasRole(['ADMIN']));

/**
 * Manager procedure - requires manager or admin role
 */
export const managerProcedure = t.procedure.use(hasRole(['ADMIN', 'MANAGER']));
