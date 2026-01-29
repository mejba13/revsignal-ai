import { PrismaAdapter } from '@auth/prisma-adapter';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { db } from './db';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as NextAuthOptions['adapter'],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          include: { organization: true },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        if (user.status === 'SUSPENDED') {
          throw new Error('Your account has been suspended');
        }

        // Update last login
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.avatarUrl,
          organizationId: user.organizationId,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, create organization if needed
      if (account?.provider === 'google' && user.email) {
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create new organization and user for OAuth sign-in
          const nameParts = user.name?.split(' ') || ['User'];
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ') || '';
          const slug = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');

          await db.organization.create({
            data: {
              name: `${firstName}'s Workspace`,
              slug: `${slug}-${Date.now()}`,
              domain: user.email.split('@')[1],
              users: {
                create: {
                  email: user.email,
                  firstName,
                  lastName,
                  avatarUrl: user.image,
                  role: 'ADMIN',
                  status: 'ACTIVE',
                  emailVerifiedAt: new Date(),
                },
              },
            },
          });

          // Update the user object with organization info
          const newUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (newUser) {
            (user as any).organizationId = newUser.organizationId;
            (user as any).role = newUser.role;
          }
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.organizationId = (user as any).organizationId;
        token.role = (user as any).role;
      }

      // Handle session update
      if (trigger === 'update' && session) {
        token.organizationId = session.organizationId;
        token.role = session.role;
      }

      // Fetch fresh user data on each request
      if (token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            organizationId: true,
            role: true,
            status: true,
          },
        });

        if (dbUser) {
          token.organizationId = dbUser.organizationId;
          token.role = dbUser.role;

          if (dbUser.status === 'SUSPENDED') {
            return {};
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.organizationId = token.organizationId as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
};
