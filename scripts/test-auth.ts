import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@revsignal.ai' }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  console.log('User found:', user.email);
  console.log('Password hash exists:', !!user.passwordHash);
  console.log('Hash preview:', user.passwordHash?.substring(0, 20) + '...');

  const testPassword = 'admin123';
  if (user.passwordHash) {
    const isValid = await bcrypt.compare(testPassword, user.passwordHash);
    console.log('Password "admin123" valid:', isValid);
  }

  await prisma.$disconnect();
  await pool.end();
}

test();
