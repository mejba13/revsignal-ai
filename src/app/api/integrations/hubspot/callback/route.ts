import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { exchangeCodeForTokens } from '@/lib/integrations/config';
import { encrypt } from '@/lib/integrations/encryption';

/**
 * GET /api/integrations/hubspot/callback
 * Handles HubSpot OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('HubSpot OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(
          `/dashboard/settings/integrations?error=${encodeURIComponent(errorDescription || error)}`,
          request.url
        )
      );
    }

    // Verify state parameter
    const storedState = request.cookies.get('oauth_state')?.value;
    const organizationId = request.cookies.get('oauth_org_id')?.value;

    if (!state || state !== storedState) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/settings/integrations?error=Invalid+state+parameter',
          request.url
        )
      );
    }

    if (!organizationId) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/settings/integrations?error=Session+expired',
          request.url
        )
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/settings/integrations?error=No+authorization+code',
          request.url
        )
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens('hubspot', code);

    // Encrypt tokens before storing
    const encryptedAccessToken = encrypt(tokens.accessToken);
    const encryptedRefreshToken = tokens.refreshToken
      ? encrypt(tokens.refreshToken)
      : null;

    // Upsert integration record
    await db.integration.upsert({
      where: {
        organizationId_provider: {
          organizationId,
          provider: 'HUBSPOT',
        },
      },
      create: {
        organizationId,
        provider: 'HUBSPOT',
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt: tokens.expiresAt,
        status: 'CONNECTED',
        settings: {},
      },
      update: {
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt: tokens.expiresAt,
        status: 'CONNECTED',
        syncError: null,
        deletedAt: null,
      },
    });

    // Clear OAuth cookies
    const response = NextResponse.redirect(
      new URL(
        '/dashboard/settings/integrations?success=HubSpot+connected+successfully',
        request.url
      )
    );

    response.cookies.delete('oauth_state');
    response.cookies.delete('oauth_org_id');

    return response;
  } catch (error) {
    console.error('HubSpot callback error:', error);
    return NextResponse.redirect(
      new URL(
        `/dashboard/settings/integrations?error=${encodeURIComponent('Failed to connect HubSpot')}`,
        request.url
      )
    );
  }
}
