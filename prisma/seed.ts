import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';

// 1. Prisma 7 requires the pg adapter to initialize the client
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');
  
  // 2. Modern ESM way to read a file (since __dirname doesn't exist in ESM)
  const fileUrl = new URL('./dogs.json', import.meta.url);
  const rawData = fs.readFileSync(fileUrl, 'utf-8');
  const dogsData: Record<string, string[]> = JSON.parse(rawData);

  // 3. Loop and insert
  for (const [breedName, subBreedsArray] of Object.entries(dogsData)) {
    await prisma.dog.upsert({
      where: { breed: breedName },
      update: {}, 
      create: {
        breed: breedName,
        subBreeds: subBreedsArray,
      },
    });
    console.log(`Added breed: ${breedName}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });