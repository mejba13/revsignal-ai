import { db } from '@/lib/db';
import { decrypt } from './encryption';
import { refreshAccessToken } from './config';

const SALESFORCE_API_VERSION = 'v59.0';

interface SalesforceQueryResult<T> {
  totalSize: number;
  done: boolean;
  nextRecordsUrl?: string;
  records: T[];
}

interface SalesforceAccount {
  Id: string;
  Name: string;
  Website?: string;
  Industry?: string;
  NumberOfEmployees?: number;
  AnnualRevenue?: number;
  LastModifiedDate: string;
}

interface SalesforceContact {
  Id: string;
  AccountId?: string;
  Email: string;
  FirstName: string;
  LastName: string;
  Title?: string;
  Phone?: string;
  LastModifiedDate: string;
}

interface SalesforceOpportunity {
  Id: string;
  AccountId?: string;
  OwnerId: string;
  Name: string;
  Description?: string;
  Amount?: number;
  StageName: string;
  Probability?: number;
  CloseDate: string;
  IsClosed: boolean;
  IsWon: boolean;
  LastModifiedDate: string;
  CreatedDate: string;
}

interface SalesforceUser {
  Id: string;
  Email: string;
  FirstName: string;
  LastName: string;
}

export class SalesforceClient {
  private accessToken: string;
  private instanceUrl: string;
  private integrationId: string;
  private organizationId: string;

  constructor(
    accessToken: string,
    instanceUrl: string,
    integrationId: string,
    organizationId: string
  ) {
    this.accessToken = accessToken;
    this.instanceUrl = instanceUrl;
    this.integrationId = integrationId;
    this.organizationId = organizationId;
  }

  static async fromIntegration(integrationId: string): Promise<SalesforceClient> {
    const integration = await db.integration.findUnique({
      where: { id: integrationId },
    });

    if (!integration || integration.provider !== 'SALESFORCE') {
      throw new Error('Salesforce integration not found');
    }

    let accessToken = decrypt(integration.accessToken);
    const instanceUrl = (integration.settings as { instance_url?: string })?.instance_url;

    if (!instanceUrl) {
      throw new Error('Salesforce instance URL not found');
    }

    // Check if token needs refresh
    if (integration.tokenExpiresAt && new Date() >= integration.tokenExpiresAt) {
      if (!integration.refreshToken) {
        throw new Error('Salesforce token expired and no refresh token available');
      }

      const refreshToken = decrypt(integration.refreshToken);
      const tokens = await refreshAccessToken('salesforce', refreshToken);
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

    return new SalesforceClient(
      accessToken,
      instanceUrl,
      integrationId,
      integration.organizationId
    );
  }

  private async query<T>(soql: string): Promise<SalesforceQueryResult<T>> {
    const url = `${this.instanceUrl}/services/data/${SALESFORCE_API_VERSION}/query?q=${encodeURIComponent(soql)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Salesforce API error: ${error}`);
    }

    return response.json();
  }

  async getAccounts(lastSyncAt?: Date): Promise<SalesforceAccount[]> {
    let soql = `SELECT Id, Name, Website, Industry, NumberOfEmployees, AnnualRevenue, LastModifiedDate FROM Account`;

    if (lastSyncAt) {
      soql += ` WHERE LastModifiedDate > ${lastSyncAt.toISOString()}`;
    }

    soql += ' ORDER BY LastModifiedDate DESC LIMIT 500';

    const result = await this.query<SalesforceAccount>(soql);
    return result.records;
  }

  async getContacts(lastSyncAt?: Date): Promise<SalesforceContact[]> {
    let soql = `SELECT Id, AccountId, Email, FirstName, LastName, Title, Phone, LastModifiedDate FROM Contact WHERE Email != null`;

    if (lastSyncAt) {
      soql += ` AND LastModifiedDate > ${lastSyncAt.toISOString()}`;
    }

    soql += ' ORDER BY LastModifiedDate DESC LIMIT 500';

    const result = await this.query<SalesforceContact>(soql);
    return result.records;
  }

  async getOpportunities(lastSyncAt?: Date): Promise<SalesforceOpportunity[]> {
    let soql = `SELECT Id, AccountId, OwnerId, Name, Description, Amount, StageName, Probability, CloseDate, IsClosed, IsWon, LastModifiedDate, CreatedDate FROM Opportunity`;

    if (lastSyncAt) {
      soql += ` WHERE LastModifiedDate > ${lastSyncAt.toISOString()}`;
    }

    soql += ' ORDER BY LastModifiedDate DESC LIMIT 500';

    const result = await this.query<SalesforceOpportunity>(soql);
    return result.records;
  }

  async getUsers(): Promise<SalesforceUser[]> {
    const soql = `SELECT Id, Email, FirstName, LastName FROM User WHERE IsActive = true`;
    const result = await this.query<SalesforceUser>(soql);
    return result.records;
  }
}

export async function syncSalesforce(integrationId: string): Promise<{
  accounts: number;
  contacts: number;
  deals: number;
  errors: string[];
}> {
  const client = await SalesforceClient.fromIntegration(integrationId);
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
    // Sync Users first (for owner mapping)
    const sfUsers = await client.getUsers();
    const userMap = new Map<string, string>();

    for (const sfUser of sfUsers) {
      const existingUser = await db.user.findFirst({
        where: {
          organizationId: integration.organizationId,
          email: sfUser.Email.toLowerCase(),
        },
      });

      if (existingUser) {
        await db.user.update({
          where: { id: existingUser.id },
          data: { crmUserId: sfUser.Id },
        });
        userMap.set(sfUser.Id, existingUser.id);
      }
    }

    // Sync Accounts
    const accounts = await client.getAccounts(lastSyncAt);
    for (const sfAccount of accounts) {
      try {
        await db.account.upsert({
          where: {
            organizationId_crmSource_crmId: {
              organizationId: integration.organizationId,
              crmSource: 'SALESFORCE',
              crmId: sfAccount.Id,
            },
          },
          create: {
            organizationId: integration.organizationId,
            crmId: sfAccount.Id,
            crmSource: 'SALESFORCE',
            name: sfAccount.Name,
            domain: sfAccount.Website ?? null,
            industry: sfAccount.Industry ?? null,
            employeeCount: sfAccount.NumberOfEmployees ?? null,
            annualRevenue: sfAccount.AnnualRevenue ?? null,
            syncedAt: new Date(),
          },
          update: {
            name: sfAccount.Name,
            domain: sfAccount.Website ?? null,
            industry: sfAccount.Industry ?? null,
            employeeCount: sfAccount.NumberOfEmployees ?? null,
            annualRevenue: sfAccount.AnnualRevenue ?? null,
            syncedAt: new Date(),
          },
        });
        accountCount++;
      } catch (err) {
        errors.push(`Account ${sfAccount.Name}: ${err}`);
      }
    }

    // Sync Contacts
    const contacts = await client.getContacts(lastSyncAt);
    for (const sfContact of contacts) {
      try {
        // Find account if exists
        let accountId: string | null = null;
        if (sfContact.AccountId) {
          const account = await db.account.findFirst({
            where: {
              organizationId: integration.organizationId,
              crmSource: 'SALESFORCE',
              crmId: sfContact.AccountId,
            },
          });
          accountId = account?.id ?? null;
        }

        await db.contact.upsert({
          where: {
            organizationId_crmSource_crmId: {
              organizationId: integration.organizationId,
              crmSource: 'SALESFORCE',
              crmId: sfContact.Id,
            },
          },
          create: {
            organizationId: integration.organizationId,
            accountId,
            crmId: sfContact.Id,
            crmSource: 'SALESFORCE',
            email: sfContact.Email.toLowerCase(),
            firstName: sfContact.FirstName,
            lastName: sfContact.LastName,
            title: sfContact.Title ?? null,
            phone: sfContact.Phone ?? null,
            syncedAt: new Date(),
          },
          update: {
            accountId,
            email: sfContact.Email.toLowerCase(),
            firstName: sfContact.FirstName,
            lastName: sfContact.LastName,
            title: sfContact.Title ?? null,
            phone: sfContact.Phone ?? null,
            syncedAt: new Date(),
          },
        });
        contactCount++;
      } catch (err) {
        errors.push(`Contact ${sfContact.Email}: ${err}`);
      }
    }

    // Sync Opportunities (Deals)
    const opportunities = await client.getOpportunities(lastSyncAt);
    for (const opp of opportunities) {
      try {
        // Find account
        let accountId: string | null = null;
        if (opp.AccountId) {
          const account = await db.account.findFirst({
            where: {
              organizationId: integration.organizationId,
              crmSource: 'SALESFORCE',
              crmId: opp.AccountId,
            },
          });
          accountId = account?.id ?? null;
        }

        // Find owner
        let ownerId = userMap.get(opp.OwnerId);
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
          errors.push(`Deal ${opp.Name}: No owner found`);
          continue;
        }

        // Determine deal status
        let status: 'OPEN' | 'WON' | 'LOST' = 'OPEN';
        if (opp.IsClosed) {
          status = opp.IsWon ? 'WON' : 'LOST';
        }

        await db.deal.upsert({
          where: {
            organizationId_crmSource_crmId: {
              organizationId: integration.organizationId,
              crmSource: 'SALESFORCE',
              crmId: opp.Id,
            },
          },
          create: {
            organizationId: integration.organizationId,
            accountId,
            ownerId,
            crmId: opp.Id,
            crmSource: 'SALESFORCE',
            name: opp.Name,
            description: opp.Description ?? null,
            amount: opp.Amount ?? null,
            stage: opp.StageName,
            probability: opp.Probability ?? null,
            expectedCloseDate: new Date(opp.CloseDate),
            actualCloseDate: opp.IsClosed ? new Date(opp.CloseDate) : null,
            status,
            stageEnteredAt: new Date(),
            syncedAt: new Date(),
          },
          update: {
            accountId,
            name: opp.Name,
            description: opp.Description ?? null,
            amount: opp.Amount ?? null,
            stage: opp.StageName,
            probability: opp.Probability ?? null,
            expectedCloseDate: new Date(opp.CloseDate),
            actualCloseDate: opp.IsClosed ? new Date(opp.CloseDate) : null,
            status,
            syncedAt: new Date(),
          },
        });
        dealCount++;
      } catch (err) {
        errors.push(`Deal ${opp.Name}: ${err}`);
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
        status: errors.length > 0 ? 'COMPLETED' : 'COMPLETED',
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
