import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: {
      name: 'Demo Company',
      slug: 'demo-company',
      domain: 'demo.revsignal.ai',
      subscriptionTier: 'PROFESSIONAL',
      subscriptionStatus: 'ACTIVE',
      settings: {
        defaultCurrency: 'USD',
        fiscalYearStart: 1,
      },
    },
  });

  console.log('✅ Organization created:', organization.name);

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@revsignal.ai' },
    update: {},
    create: {
      organizationId: organization.id,
      email: 'admin@revsignal.ai',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      timezone: 'America/New_York',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create manager user
  const managerPasswordHash = await bcrypt.hash('manager123', 12);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@revsignal.ai' },
    update: {},
    create: {
      organizationId: organization.id,
      email: 'manager@revsignal.ai',
      passwordHash: managerPasswordHash,
      firstName: 'Sales',
      lastName: 'Manager',
      role: 'MANAGER',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      timezone: 'America/New_York',
    },
  });

  console.log('✅ Manager user created:', manager.email);

  // Create sample accounts
  const accounts = await Promise.all([
    prisma.account.upsert({
      where: {
        organizationId_crmSource_crmId: {
          organizationId: organization.id,
          crmSource: 'SALESFORCE',
          crmId: 'acc-001',
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        crmId: 'acc-001',
        crmSource: 'SALESFORCE',
        name: 'Acme Corporation',
        domain: 'acme.com',
        industry: 'Technology',
        employeeCount: 500,
        annualRevenue: 50000000,
        healthScore: 85,
      },
    }),
    prisma.account.upsert({
      where: {
        organizationId_crmSource_crmId: {
          organizationId: organization.id,
          crmSource: 'SALESFORCE',
          crmId: 'acc-002',
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        crmId: 'acc-002',
        crmSource: 'SALESFORCE',
        name: 'TechStart Inc',
        domain: 'techstart.io',
        industry: 'Software',
        employeeCount: 150,
        annualRevenue: 15000000,
        healthScore: 72,
      },
    }),
    prisma.account.upsert({
      where: {
        organizationId_crmSource_crmId: {
          organizationId: organization.id,
          crmSource: 'SALESFORCE',
          crmId: 'acc-003',
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        crmId: 'acc-003',
        crmSource: 'SALESFORCE',
        name: 'Global Enterprises',
        domain: 'globalent.com',
        industry: 'Manufacturing',
        employeeCount: 2000,
        annualRevenue: 200000000,
        healthScore: 65,
      },
    }),
  ]);

  console.log('✅ Sample accounts created:', accounts.length);

  // Create sample contacts
  const contacts = await Promise.all([
    prisma.contact.upsert({
      where: {
        organizationId_crmSource_crmId: {
          organizationId: organization.id,
          crmSource: 'SALESFORCE',
          crmId: 'con-001',
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        accountId: accounts[0].id,
        crmId: 'con-001',
        crmSource: 'SALESFORCE',
        email: 'john.doe@acme.com',
        firstName: 'John',
        lastName: 'Doe',
        title: 'VP of Engineering',
        role: 'decision_maker',
        engagementScore: 90,
      },
    }),
    prisma.contact.upsert({
      where: {
        organizationId_crmSource_crmId: {
          organizationId: organization.id,
          crmSource: 'SALESFORCE',
          crmId: 'con-002',
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        accountId: accounts[0].id,
        crmId: 'con-002',
        crmSource: 'SALESFORCE',
        email: 'jane.smith@acme.com',
        firstName: 'Jane',
        lastName: 'Smith',
        title: 'Engineering Manager',
        role: 'champion',
        engagementScore: 95,
      },
    }),
    prisma.contact.upsert({
      where: {
        organizationId_crmSource_crmId: {
          organizationId: organization.id,
          crmSource: 'SALESFORCE',
          crmId: 'con-003',
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        accountId: accounts[1].id,
        crmId: 'con-003',
        crmSource: 'SALESFORCE',
        email: 'mike.johnson@techstart.io',
        firstName: 'Mike',
        lastName: 'Johnson',
        title: 'CTO',
        role: 'decision_maker',
        engagementScore: 78,
      },
    }),
  ]);

  console.log('✅ Sample contacts created:', contacts.length);

  // Create sample deals with various stages and scores
  const deals = await Promise.all([
    // High-value deal in negotiation
    prisma.deal.upsert({
      where: {
        organizationId_crmSource_crmId: {
          organizationId: organization.id,
          crmSource: 'SALESFORCE',
          crmId: 'deal-001',
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        accountId: accounts[0].id,
        ownerId: admin.id,
        crmId: 'deal-001',
        crmSource: 'SALESFORCE',
        name: 'Acme Enterprise License',
        description: 'Annual enterprise license for 500 seats',
        amount: 150000,
        currency: 'USD',
        stage: 'Negotiation',
        stageEnteredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        probability: 75,
        aiScore: 82,
        aiWinProbability: 0.78,
        aiScoreFactors: {
          engagement: 85,
          velocity: 80,
          stakeholders: 90,
          recency: 75,
          deal_strength: 80,
        },
        riskLevel: 'LOW',
        forecastCategory: 'COMMIT',
        expectedCloseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
        daysInStage: 5,
        lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    }),
    // Medium deal at risk
    prisma.deal.upsert({
      where: {
        organizationId_crmSource_crmId: {
          organizationId: organization.id,
          crmSource: 'SALESFORCE',
          crmId: 'deal-002',
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        accountId: accounts[1].id,
        ownerId: manager.id,
        crmId: 'deal-002',
        crmSource: 'SALESFORCE',
        name: 'TechStart Growth Plan',
        description: 'Annual growth tier subscription',
        amount: 45000,
        currency: 'USD',
        stage: 'Proposal',
        stageEnteredAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        probability: 40,
        aiScore: 45,
        aiWinProbability: 0.38,
        aiScoreFactors: {
          engagement: 40,
          velocity: 30,
          stakeholders: 50,
          recency: 45,
          deal_strength: 60,
        },
        riskLevel: 'HIGH',
        riskFactors: ['Stalled in stage for 21 days', 'Low engagement score', 'No activity in 14 days'],
        forecastCategory: 'PIPELINE',
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'STALLED',
        daysInStage: 21,
        lastActivityAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    }),
    // New discovery deal
    prisma.deal.upsert({
      where: {
        organizationId_crmSource_crmId: {
          organizationId: organization.id,
          crmSource: 'SALESFORCE',
          crmId: 'deal-003',
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        accountId: accounts[2].id,
        ownerId: admin.id,
        crmId: 'deal-003',
        crmSource: 'SALESFORCE',
        name: 'Global Enterprises Platform',
        description: 'Multi-year platform license',
        amount: 500000,
        currency: 'USD',
        stage: 'Discovery',
        stageEnteredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        probability: 20,
        aiScore: 65,
        aiWinProbability: 0.55,
        aiScoreFactors: {
          engagement: 70,
          velocity: 85,
          stakeholders: 60,
          recency: 90,
          deal_strength: 40,
        },
        riskLevel: 'MEDIUM',
        forecastCategory: 'BEST_CASE',
        expectedCloseDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
        daysInStage: 3,
        lastActivityAt: new Date(),
      },
    }),
    // Closed won deal
    prisma.deal.upsert({
      where: {
        organizationId_crmSource_crmId: {
          organizationId: organization.id,
          crmSource: 'SALESFORCE',
          crmId: 'deal-004',
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        accountId: accounts[0].id,
        ownerId: manager.id,
        crmId: 'deal-004',
        crmSource: 'SALESFORCE',
        name: 'Acme Professional Services',
        description: 'Implementation services package',
        amount: 75000,
        currency: 'USD',
        stage: 'Closed Won',
        stageEnteredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        probability: 100,
        aiScore: 95,
        aiWinProbability: 1.0,
        forecastCategory: 'COMMIT',
        expectedCloseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        actualCloseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'WON',
        daysInStage: 0,
      },
    }),
    // Qualification stage deal
    prisma.deal.upsert({
      where: {
        organizationId_crmSource_crmId: {
          organizationId: organization.id,
          crmSource: 'SALESFORCE',
          crmId: 'deal-005',
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        accountId: accounts[1].id,
        ownerId: admin.id,
        crmId: 'deal-005',
        crmSource: 'SALESFORCE',
        name: 'TechStart Pilot Program',
        description: 'Pilot program for 50 users',
        amount: 15000,
        currency: 'USD',
        stage: 'Qualification',
        stageEnteredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        probability: 30,
        aiScore: 58,
        aiWinProbability: 0.52,
        aiScoreFactors: {
          engagement: 60,
          velocity: 55,
          stakeholders: 45,
          recency: 70,
          deal_strength: 60,
        },
        riskLevel: 'MEDIUM',
        forecastCategory: 'PIPELINE',
        expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
        daysInStage: 7,
        lastActivityAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log('✅ Sample deals created:', deals.length);

  // Create deal-contact relationships
  await Promise.all([
    prisma.dealContact.upsert({
      where: { dealId_contactId: { dealId: deals[0].id, contactId: contacts[0].id } },
      update: {},
      create: { dealId: deals[0].id, contactId: contacts[0].id, role: 'decision_maker', isPrimary: true },
    }),
    prisma.dealContact.upsert({
      where: { dealId_contactId: { dealId: deals[0].id, contactId: contacts[1].id } },
      update: {},
      create: { dealId: deals[0].id, contactId: contacts[1].id, role: 'champion', isPrimary: false },
    }),
    prisma.dealContact.upsert({
      where: { dealId_contactId: { dealId: deals[1].id, contactId: contacts[2].id } },
      update: {},
      create: { dealId: deals[1].id, contactId: contacts[2].id, role: 'decision_maker', isPrimary: true },
    }),
  ]);

  console.log('✅ Deal-contact relationships created');

  // Create sample activities
  await Promise.all([
    prisma.activity.create({
      data: {
        organizationId: organization.id,
        dealId: deals[0].id,
        userId: admin.id,
        type: 'MEETING',
        subject: 'Contract Review Call',
        description: 'Reviewed final contract terms with legal team',
        outcome: 'Positive - moving to signature',
        durationMinutes: 60,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.activity.create({
      data: {
        organizationId: organization.id,
        dealId: deals[0].id,
        userId: admin.id,
        type: 'EMAIL',
        subject: 'Proposal Follow-up',
        description: 'Sent updated pricing proposal with volume discount',
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.activity.create({
      data: {
        organizationId: organization.id,
        dealId: deals[2].id,
        userId: admin.id,
        type: 'CALL',
        subject: 'Discovery Call',
        description: 'Initial discovery call with CTO and engineering leads',
        outcome: 'Strong interest - scheduling demo',
        durationMinutes: 45,
        completedAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Sample activities created');

  // Create forecast record
  const quarterStart = new Date();
  quarterStart.setMonth(Math.floor(quarterStart.getMonth() / 3) * 3, 1);
  quarterStart.setHours(0, 0, 0, 0);

  const quarterEnd = new Date(quarterStart);
  quarterEnd.setMonth(quarterEnd.getMonth() + 3);
  quarterEnd.setDate(0);

  await prisma.forecast.upsert({
    where: { id: 'forecast-q1' },
    update: {},
    create: {
      id: 'forecast-q1',
      organizationId: organization.id,
      periodType: 'quarterly',
      periodStart: quarterStart,
      periodEnd: quarterEnd,
      quota: 500000,
      commitAmount: 225000,
      bestCaseAmount: 710000,
      pipelineAmount: 785000,
      aiPredictedAmount: 285000,
      aiConfidence: 0.72,
      aiConfidenceInterval: { low: 210000, high: 360000 },
      closedWonAmount: 75000,
    },
  });

  console.log('✅ Forecast record created');

  console.log('\n========================================');
  console.log('🎉 Database seeded successfully!\n');
  console.log('📧 Admin Login Credentials:');
  console.log('   Email:    admin@revsignal.ai');
  console.log('   Password: admin123');
  console.log('\n📧 Manager Login Credentials:');
  console.log('   Email:    manager@revsignal.ai');
  console.log('   Password: manager123');
  console.log('========================================\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
