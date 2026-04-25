import 'dotenv/config';

export default {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || "", 
  },
  migrations: {
    // We use tsx here instead of ts-node!
    seed: 'npx tsx prisma/seed.ts',
  },
};