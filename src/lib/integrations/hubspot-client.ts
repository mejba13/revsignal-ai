import { db } from '@/lib/db';
import { decrypt } from './encryption';
import { refreshAccessToken } from './config';

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

interface HubSpotPaginatedResult<T> {
  results: T[];
  paging?: {
    next?: {
      after: string;
    };
  };
}

interface HubSpotCompany {
  id: string;
  properties: {
    name?: string;
    domain?: string;
    industry?: string;
    numberofemployees?: string;
    annualrevenue?: string;
    hs_lastmodifieddate?: string;
  };
}

interface HubSpotContact {
  id: string;
  properties: {
    email?: string;
    firstname?: string;
    lastname?: string;
    jobtitle?: string;
    phone?: string;
    hs_lastmodifieddate?: string;
    associatedcompanyid?: string;
  };
}

interface HubSpotDeal {
  id: string;
  properties: {
    dealname?: string;
    description?: string;
    amount?: string;
    dealstage?: string;
    pipeline?: string;
    closedate?: string;
    createdate?: string;
    hs_lastmodifieddate?: string;
    hubspot_owner_id?: string;
    hs_deal_stage_probability?: string;
  };
}

interface HubSpotOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export class HubSpotClient {
  private accessToken: string;
  private integrationId: string;
  private organizationId: string;

  constructor(accessToken: string, integrationId: string, organizationId: string) {
    this.accessToken = accessToken;
    this.integrationId = integrationId;
    this.organizationId = organizationId;
  }

  static async fromIntegration(integrationId: string): Promise<HubSpotClient> {
    const integration = await db.integration.findUnique({
      where: { id: integrationId },
    });

    if (!integration || integration.provider !== 'HUBSPOT') {
      throw new Error('HubSpot integration not found');
    }

    let accessToken = decrypt(integration.accessToken);

    // Check if token needs refresh
    if (integration.tokenExpiresAt && new Date() >= integration.tokenExpiresAt) {
      if (!integration.refreshToken) {
        throw new Error('HubSpot token expired and no refresh token available');
      }

      const refreshToken = decrypt(integration.refreshToken);
      const tokens = await refreshAccessToken('hubspot', refreshToken);
      accessToken = tokens.accessToken;

      // Update tokens in database
      await db.integration.update({
        where: { id: integrationId },
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken || integration.refreshToken,
          tokenExpiresAt: tokens.expiresAt,
        },
      });
    }

    return new HubSpotClient(accessToken, integrationId, integration.organizationId);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${HUBSPOT_API_BASE}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HubSpot API error: ${error}`);
    }

    return response.json();
  }

  async getCompanies(lastSyncAt?: Date): Promise<HubSpotCompany[]> {
    const properties = ['name', 'domain', 'industry', 'numberofemployees', 'annualrevenue', 'hs_lastmodifieddate'];
    let endpoint = `/crm/v3/objects/companies?limit=100&properties=${properties.join(',')}`;

    if (lastSyncAt) {
      const filterGroups = [{
        filters: [{
          propertyName: 'hs_lastmodifieddate',
          operator: 'GTE',
          value: lastSyncAt.getTime().toString(),
        }],
      }];
      endpoint = `/crm/v3/objects/companies/search`;
      const result = await this.request<HubSpotPaginatedResult<HubSpotCompany>>(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          filterGroups,
          properties,
          limit: 100,
        }),
      });
      return result.results;
    }

    const result = await this.request<HubSpotPaginatedResult<HubSpotCompany>>(endpoint);
    return result.results;
  }

  async getContacts(lastSyncAt?: Date): Promise<HubSpotContact[]> {
    const properties = ['email', 'firstname', 'lastname', 'jobtitle', 'phone', 'hs_lastmodifieddate', 'associatedcompanyid'];
    let endpoint = `/crm/v3/objects/contacts?limit=100&properties=${properties.join(',')}`;

    if (lastSyncAt) {
      endpoint = `/crm/v3/objects/contacts/search`;
      const result = await this.request<HubSpotPaginatedResult<HubSpotContact>>(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          filterGroups: [{
            filters: [{
              propertyName: 'hs_lastmodifieddate',
              operator: 'GTE',
              value: lastSyncAt.getTime().toString(),
            }],
          }],
          properties,
          limit: 100,
        }),
      });
      return result.results;
    }

    const result = await this.request<HubSpotPaginatedResult<HubSpotContact>>(endpoint);
    return result.results;
  }

  async getDeals(lastSyncAt?: Date): Promise<HubSpotDeal[]> {
    const properties = ['dealname', 'description', 'amount', 'dealstage', 'pipeline', 'closedate', 'createdate', 'hs_lastmodifieddate', 'hubspot_owner_id', 'hs_deal_stage_probability'];
    let endpoint = `/crm/v3/objects/deals?limit=100&properties=${properties.join(',')}`;

    if (lastSyncAt) {
      endpoint = `/crm/v3/objects/deals/search`;
      const result = await this.request<HubSpotPaginatedResult<HubSpotDeal>>(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          filterGroups: [{
            filters: [{
              propertyName: 'hs_lastmodifieddate',
              operator: 'GTE',
              value: lastSyncAt.getTime().toString(),
            }],
          }],
          properties,
          limit: 100,
        }),
      });
      return result.results;
    }

    const result = await this.request<HubSpotPaginatedResult<HubSpotDeal>>(endpoint);
    return result.results;
  }

  async getOwners(): Promise<HubSpotOwner[]> {
    const result = await this.request<{ results: HubSpotOwner[] }>('/crm/v3/owners');
    return result.results;
  }

  async getDealPipelines(): Promise<{ id: string; label: string; stages: { id: string; label: string }[] }[]> {
    const result = await this.request<{ results: { id: string; label: string; stages: { id: string; label: string }[] }[] }>('/crm/v3/pipelines/deals');
    return result.results;
  }
}

export async function syncHubSpot(integrationId: string): Promise<{
  accounts: number;
  contacts: number;
  deals: number;
  errors: string[];
}> {
  const client = await HubSpotClient.fromIntegration(integrationId);
  const integration = await db.integration.findUnique({
    where: { id: integrationId },
  });

  if (!integration) {
    throw new Error('Integration not found');
  }

  const lastSyncAt = integration.lastSyncAt ?? undefined;
  const errors: string[] = [];
  let accountCount = 0;
  let contactCount = 0;
  let dealCount = 0;

  // Create sync log
  const syncLog = await db.syncLog.create({
    data: {
      integrationId,
      syncType: lastSyncAt ? 'incremental' : 'full',
      status: 'RUNNING',
    },
  });

  try {
    // Get pipelines for stage mapping
    const pipelines = await client.getDealPipelines();
    const stageMap = new Map<string, string>();
    for (const pipeline of pipelines) {
      for (const stage of pipeline.stages) {
        stageMap.set(stage.id, stage.label);
      }
    }

    // Sync Owners first (for owner mapping)
    const owners = await client.getOwners();
    const ownerMap = new Map<string, string>();

    for (const owner of owners) {
      const existingUser = await db.user.findFirst({
        where: {
          organizationId: integration.organizationId,
          email: owner.email.toLowerCase(),
        },
      });

      if (existingUser) {
        await db.user.update({
          where: { id: existingUser.id },
          data: { crmUserId: owner.id },
        });
        ownerMap.set(owner.id, existingUser.id);
      }
    }

    // Sync Companies (Accounts)
    const companies = await client.getCompanies(lastSyncAt);
    for (const company of companies) {
      try {
        if (!company.properties.name) continue;

        await db.account.upsert({
          where: {
            organizationId_crmSource_crmId: {
              organizationId: integration.organizationId,
              crmSource: 'HUBSPOT',
              crmId: company.id,
            },
          },
          create: {
            organizationId: integration.organizationId,
            crmId: company.id,
            crmSource: 'HUBSPOT',
            name: company.properties.name,
            domain: company.properties.domain ?? null,
            industry: company.properties.industry ?? null,
            employeeCount: company.properties.numberofemployees
              ? parseInt(company.properties.numberofemployees)
              : null,
            annualRevenue: company.properties.annualrevenue
              ? parseFloat(company.properties.annualrevenue)
              : null,
            syncedAt: new Date(),
          },
          update: {
            name: company.properties.name,
            domain: company.properties.domain ?? null,
            industry: company.properties.industry ?? null,
            employeeCount: company.properties.numberofemployees
              ? parseInt(company.properties.numberofemployees)
              : null,
            annualRevenue: company.properties.annualrevenue
              ? parseFloat(company.properties.annualrevenue)
              : null,
            syncedAt: new Date(),
          },
        });
        accountCount++;
      } catch (err) {
        errors.push(`Company ${company.properties.name}: ${err}`);
      }
    }

    // Sync Contacts
    const contacts = await client.getContacts(lastSyncAt);
    for (const contact of contacts) {
      try {
        if (!contact.properties.email) continue;

        // Find account if exists
        let accountId: string | null = null;
        if (contact.properties.associatedcompanyid) {
          const account = await db.account.findFirst({
            where: {
              organizationId: integration.organizationId,
              crmSource: 'HUBSPOT',
              crmId: contact.properties.associatedcompanyid,
            },
          });
          accountId = account?.id ?? null;
        }

        await db.contact.upsert({
          where: {
            organizationId_crmSource_crmId: {
              organizationId: integration.organizationId,
              crmSource: 'HUBSPOT',
              crmId: contact.id,
            },
          },
          create: {
            organizationId: integration.organizationId,
            accountId,
            crmId: contact.id,
            crmSource: 'HUBSPOT',
            email: contact.properties.email.toLowerCase(),
            firstName: contact.properties.firstname || 'Unknown',
            lastName: contact.properties.lastname || 'Unknown',
            title: contact.properties.jobtitle ?? null,
            phone: contact.properties.phone ?? null,
            syncedAt: new Date(),
          },
          update: {
            accountId,
            email: contact.properties.email.toLowerCase(),
            firstName: contact.properties.firstname || 'Unknown',
            lastName: contact.properties.lastname || 'Unknown',
            title: contact.properties.jobtitle ?? null,
            phone: contact.properties.phone ?? null,
            syncedAt: new Date(),
          },
        });
        contactCount++;
      } catch (err) {
        errors.push(`Contact ${contact.properties.email}: ${err}`);
      }
    }

    // Sync Deals
    const deals = await client.getDeals(lastSyncAt);
    for (const deal of deals) {
      try {
        if (!deal.properties.dealname) continue;

        // Find owner
        let ownerId = deal.properties.hubspot_owner_id
          ? ownerMap.get(deal.properties.hubspot_owner_id)
          : undefined;

        if (!ownerId) {
          // Use first admin as fallback
          const admin = await db.user.findFirst({
            where: {
              organizationId: integration.organizationId,
              role: 'ADMIN',
            },
          });
          ownerId = admin?.id;
        }

        if (!ownerId) {
          errors.push(`Deal ${deal.properties.dealname}: No owner found`);
          continue;
        }

        // Get stage label
        const stageLabel = deal.properties.dealstage
          ? stageMap.get(deal.properties.dealstage) || deal.properties.dealstage
          : 'Unknown';

        // Determine deal status based on stage
        // HubSpot closed stages typically contain 'closed' or 'won' or 'lost'
        let status: 'OPEN' | 'WON' | 'LOST' = 'OPEN';
        const stageLower = stageLabel.toLowerCase();
        if (stageLower.includes('closedwon') || stageLower.includes('closed won')) {
          status = 'WON';
        } else if (stageLower.includes('closedlost') || stageLower.includes('closed lost')) {
          status = 'LOST';
        }

        await db.deal.upsert({
          where: {
            organizationId_crmSource_crmId: {
              organizationId: integration.organizationId,
              crmSource: 'HUBSPOT',
              crmId: deal.id,
            },
          },
          create: {
            organizationId: integration.organizationId,
            accountId: null, // HubSpot associations require separate API calls
            ownerId,
            crmId: deal.id,
            crmSource: 'HUBSPOT',
            name: deal.properties.dealname,
            description: deal.properties.description ?? null,
            amount: deal.properties.amount ? parseFloat(deal.properties.amount) : null,
            stage: stageLabel,
            probability: deal.properties.hs_deal_stage_probability
              ? parseInt(deal.properties.hs_deal_stage_probability)
              : null,
            expectedCloseDate: deal.properties.closedate
              ? new Date(deal.properties.closedate)
              : null,
            actualCloseDate: status !== 'OPEN' && deal.properties.closedate
              ? new Date(deal.properties.closedate)
              : null,
            status,
            stageEnteredAt: new Date(),
            syncedAt: new Date(),
          },
          update: {
            name: deal.properties.dealname,
            description: deal.properties.description ?? null,
            amount: deal.properties.amount ? parseFloat(deal.properties.amount) : null,
            stage: stageLabel,
            probability: deal.properties.hs_deal_stage_probability
              ? parseInt(deal.properties.hs_deal_stage_probability)
              : null,
            expectedCloseDate: deal.properties.closedate
              ? new Date(deal.properties.closedate)
              : null,
            actualCloseDate: status !== 'OPEN' && deal.properties.closedate
              ? new Date(deal.properties.closedate)
              : null,
            status,
            syncedAt: new Date(),
          },
        });
        dealCount++;
      } catch (err) {
        errors.push(`Deal ${deal.properties.dealname}: ${err}`);
      }
    }

    // Update integration and sync log
    await db.integration.update({
      where: { id: integrationId },
      data: {
        lastSyncAt: new Date(),
        status: 'CONNECTED',
        syncError: null,
      },
    });

    await db.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: 'COMPLETED',
        recordsSynced: accountCount + contactCount + dealCount,
        errors: errors.length > 0 ? errors : undefined,
        completedAt: new Date(),
      },
    });

    return { accounts: accountCount, contacts: contactCount, deals: dealCount, errors };
  } catch (error) {
    // Update sync log on failure
    await db.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: 'FAILED',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        completedAt: new Date(),
      },
    });

    await db.integration.update({
      where: { id: integrationId },
      data: {
        status: 'ERROR',
        syncError: error instanceof Error ? error.message : 'Sync failed',
      },
    });

    throw error;
  }
}
