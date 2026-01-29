/**
 * CRM Integration Configuration
 */

export const CRM_CONFIG = {
  salesforce: {
    name: 'Salesforce',
    authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
    tokenUrl: 'https://login.salesforce.com/services/oauth2/token',
    revokeUrl: 'https://login.salesforce.com/services/oauth2/revoke',
    scopes: ['api', 'refresh_token', 'offline_access'],
    clientId: process.env.SALESFORCE_CLIENT_ID ?? '',
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET ?? '',
    redirectUri: `${process.env.NEXTAUTH_URL}/api/integrations/salesforce/callback`,
  },
  hubspot: {
    name: 'HubSpot',
    authUrl: 'https://app.hubspot.com/oauth/authorize',
    tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
    scopes: [
      'crm.objects.deals.read',
      'crm.objects.deals.write',
      'crm.objects.contacts.read',
      'crm.objects.contacts.write',
      'crm.objects.companies.read',
      'crm.objects.companies.write',
      'crm.objects.owners.read',
    ],
    clientId: process.env.HUBSPOT_CLIENT_ID ?? '',
    clientSecret: process.env.HUBSPOT_CLIENT_SECRET ?? '',
    redirectUri: `${process.env.NEXTAUTH_URL}/api/integrations/hubspot/callback`,
  },
} as const;

export type CrmProvider = keyof typeof CRM_CONFIG;

/**
 * Generate OAuth authorization URL
 */
export function getAuthUrl(provider: CrmProvider, state: string): string {
  const config = CRM_CONFIG[provider];

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    state,
    scope: config.scopes.join(' '),
  });

  return `${config.authUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  provider: CrmProvider,
  code: string
): Promise<{
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  instanceUrl?: string;
}> {
  const config = CRM_CONFIG[provider];

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    code,
  });

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
    expiresAt: data.expires_in
      ? new Date(Date.now() + data.expires_in * 1000)
      : null,
    instanceUrl: data.instance_url, // Salesforce specific
  };
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(
  provider: CrmProvider,
  refreshToken: string
): Promise<{
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
}> {
  const config = CRM_CONFIG[provider];

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: refreshToken,
  });

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresAt: data.expires_in
      ? new Date(Date.now() + data.expires_in * 1000)
      : null,
  };
}
