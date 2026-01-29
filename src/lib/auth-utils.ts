import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './auth';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  return session.user;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect('/dashboard');
  }

  return user;
}
