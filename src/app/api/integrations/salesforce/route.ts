import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAuthUrl } from '@/lib/integrations/config';
import crypto from 'crypto';

/**
 * GET /api/integrations/salesforce
 * Initiates Salesforce OAuth flow
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate state parameter for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');

    // Store state in a cookie for verification
    const response = NextResponse.redirect(getAuthUrl('salesforce', state));

    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });

    // Store organization ID for callback
    response.cookies.set('oauth_org_id', session.user.organizationId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Salesforce OAuth init error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    );
  }
}
