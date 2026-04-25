import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Get the connection string from your environment variables
const connectionString = process.env.DATABASE_URL;

// 2. Initialize a standard pg database connection pool
const pool = new Pool({ connectionString });

// 3. Wrap the pg pool in Prisma's adapter
const adapter = new PrismaPg(pool);

// 4. Instantiate the Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;