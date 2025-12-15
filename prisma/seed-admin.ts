import 'dotenv/config';
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

if (!process.env.DIRECT_URL) {
  throw new Error('DIRECT_URL environment variable is not set. Please check your .env file.');
}

const dbUrl = process.env.DIRECT_URL;

const match = dbUrl.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+?)(\?|$)/);

if (!match) {
  throw new Error('Invalid DIRECT_URL format');
}

const [, user, password, host, port, database] = match;

const pool = new Pool({
  host,
  port: parseInt(port),
  database: database.split('?')[0],
  user,
  password,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting admin seed...');

  const existingAdmin = await prisma.user.findFirst({
    where: { role: UserRole.ADMIN },
  });

  if (existingAdmin) {
    console.log('⚠️  Admin user already exists:', existingAdmin.email);
    console.log('Skipping admin creation.');
    return;
  }

  const adminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@theorydeck.com',
      name: 'Admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${adminPassword}`);
  console.log(`Name: ${admin.name}`);
  console.log(`Role: ${admin.role}`);
  console.log(`ID: ${admin.id}`);
  console.log('');
  console.log('⚠️  ВАЖНО: Смените пароль после первого входа!');
}

main()
  .catch((e) => {
    console.error('❌ Admin seed failed:', e);
    console.error('Full error:', e.stack);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });