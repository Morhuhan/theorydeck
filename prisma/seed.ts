import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { 
  UserRole,
  TheoryStatus, 
  Stance, 
  CardStatus 
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

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
  console.log('🌱 Starting seed...');

  await prisma.report.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.evidenceCard.deleteMany();
  await prisma.theory.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      role: UserRole.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      role: UserRole.USER,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      name: 'Charlie Davis',
      role: UserRole.USER,
    },
  });

  const theory1 = await prisma.theory.create({
    data: {
      slug: 'ai-will-achieve-agi-by-2030',
      title: 'AI will achieve AGI by 2030',
      claim: 'Artificial General Intelligence (AGI) will be achieved by major AI labs before the end of 2030.',
      tldr: 'With rapid progress in large language models, multimodal AI, and reasoning capabilities, several experts predict AGI could emerge within the next 5-7 years. This theory examines whether current trajectories support this timeline.',
      status: TheoryStatus.ACTIVE,
      realm: 'Technology',
      topic: 'Artificial Intelligence',
      tags: ['AI', 'AGI', 'Future', 'Technology'],
      authorId: user1.id,
    },
  });

  const theory2 = await prisma.theory.create({
    data: {
      slug: 'remote-work-increases-productivity',
      title: 'Remote work increases productivity',
      claim: 'Employees working remotely are more productive than those working in traditional office environments.',
      tldr: 'Multiple studies show mixed results on remote work productivity. While some workers thrive with flexibility, others struggle with isolation and distractions. This theory explores the evidence on both sides.',
      status: TheoryStatus.ACTIVE,
      realm: 'Business',
      topic: 'Work Culture',
      tags: ['Remote Work', 'Productivity', 'Business'],
      authorId: user2.id,
    },
  });

  const theory3 = await prisma.theory.create({
    data: {
      slug: 'mediterranean-diet-reduces-heart-disease',
      title: 'Mediterranean diet significantly reduces heart disease risk',
      claim: 'Following a Mediterranean diet can reduce the risk of cardiovascular disease by 30% or more.',
      tldr: 'The Mediterranean diet, rich in olive oil, fish, vegetables, and whole grains, has been studied extensively for its health benefits. Evidence suggests significant cardiovascular benefits.',
      status: TheoryStatus.ACTIVE,
      realm: 'Health',
      topic: 'Nutrition',
      tags: ['Health', 'Diet', 'Heart Disease', 'Nutrition'],
      authorId: user3.id,
    },
  });

  const card1 = await prisma.evidenceCard.create({
    data: {
      content: 'OpenAI CEO Sam Altman stated in multiple interviews that AGI could be achieved within "a few thousand days" from 2024, suggesting a 2030-2032 timeline.',
      source: 'https://example.com/altman-agi-timeline',
      sourceTitle: 'Sam Altman on AGI Timeline',
      context: 'Interview with major tech publication',
      stance: Stance.FOR,
      status: CardStatus.ACTIVE,
      theoryId: theory1.id,
      authorId: user1.id,
    },
  });

  const card2 = await prisma.evidenceCard.create({
    data: {
      content: 'Current AI models still struggle with basic reasoning tasks that humans find trivial. The gap between narrow AI and general intelligence remains vast.',
      source: 'https://example.com/ai-limitations-2024',
      sourceTitle: 'AI Reasoning Limitations Study',
      context: 'Academic research paper',
      stance: Stance.AGAINST,
      status: CardStatus.ACTIVE,
      theoryId: theory1.id,
      authorId: user2.id,
    },
  });

  const card3 = await prisma.evidenceCard.create({
    data: {
      content: 'DeepMind\'s recent advances in protein folding and mathematical reasoning show exponential progress in AI capabilities over the past 3 years.',
      source: 'https://example.com/deepmind-advances',
      sourceTitle: 'DeepMind Research Breakthroughs',
      stance: Stance.FOR,
      status: CardStatus.ACTIVE,
      theoryId: theory1.id,
      authorId: user3.id,
    },
  });

  const card4 = await prisma.evidenceCard.create({
    data: {
      content: 'A Stanford study of 10,000 workers found that remote employees completed 13% more tasks and reported higher job satisfaction.',
      source: 'https://example.com/stanford-remote-work-study',
      sourceTitle: 'Stanford Remote Work Productivity Study 2023',
      stance: Stance.FOR,
      status: CardStatus.ACTIVE,
      theoryId: theory2.id,
      authorId: user1.id,
    },
  });

  const card5 = await prisma.evidenceCard.create({
    data: {
      content: 'Microsoft internal data showed that remote workers had 40% more meetings and worked longer hours, but actual output measured by completed projects decreased.',
      source: 'https://example.com/microsoft-productivity-analysis',
      sourceTitle: 'Microsoft Workplace Analytics Report',
      stance: Stance.AGAINST,
      status: CardStatus.ACTIVE,
      theoryId: theory2.id,
      authorId: user2.id,
    },
  });

  const card6 = await prisma.evidenceCard.create({
    data: {
      content: 'The PREDIMED study followed 7,447 participants and found a 30% reduction in major cardiovascular events among those following a Mediterranean diet.',
      source: 'https://example.com/predimed-study',
      sourceTitle: 'PREDIMED Clinical Trial Results',
      context: 'Randomized controlled trial published in NEJM',
      stance: Stance.FOR,
      status: CardStatus.ACTIVE,
      theoryId: theory3.id,
      authorId: user3.id,
    },
  });

  await prisma.vote.createMany({
    data: [
      { userId: user1.id, cardId: card1.id, strength: 8 },
      { userId: user2.id, cardId: card1.id, strength: 5 },
      { userId: user3.id, cardId: card1.id, strength: 10 },
      { userId: user1.id, cardId: card2.id, strength: 5 },
      { userId: user2.id, cardId: card2.id, strength: 8 },
      { userId: user3.id, cardId: card2.id, strength: 2 },
      { userId: user1.id, cardId: card3.id, strength: 10 },
      { userId: user2.id, cardId: card3.id, strength: 8 },
      { userId: user1.id, cardId: card4.id, strength: 8 },
      { userId: user2.id, cardId: card4.id, strength: 10 },
      { userId: user3.id, cardId: card4.id, strength: 5 },
      { userId: user1.id, cardId: card5.id, strength: 5 },
      { userId: user3.id, cardId: card5.id, strength: 8 },
      { userId: user1.id, cardId: card6.id, strength: 10 },
      { userId: user2.id, cardId: card6.id, strength: 8 },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log(`Created:`);
  console.log(`- 3 users`);
  console.log(`- 3 theories`);
  console.log(`- 6 evidence cards`);
  console.log(`- 15 votes`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    console.error('Full error:', e.stack);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });