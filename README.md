# Dog Breed API

A simple REST API built with Express, TypeScript, Prisma, and PostgreSQL to manage dog breeds and sub-breeds.

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL

## Setup

1. Clone the repository
```bash
git clone https://github.com/akgone38/hutchison_assignment.git
cd hutchisonAssignment
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dogs_dev"
PORT=3000
NODE_ENV=development
```

4. Run migrations and seed data
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

5. Start the app
```bash
npm run dev
```

The server runs at `http://localhost:3000`.
Also hosted on `https://hutchison-assignment.onrender.com`

## Available Scripts

```bash
npm run dev
npm run build
npm start
npx prisma db seed
```

## API Endpoints

### Get all dogs
```http
GET /api/dogs
```

### Create a dog
```http
POST /api/dogs
Content-Type: application/json
```

```json
{
  "breed": "Golden Retriever",
  "subBreeds": ["Standard", "Miniature"]
}
```

### Update a dog
```http
PUT /api/dogs/:breed
Content-Type: application/json
```

```json
{
  "subBreeds": ["Light Golden", "Dark Golden"]
}
```

### Delete a dog
```http
DELETE /api/dogs/:breed
```

## Project Structure

```text
src/
  config/
  controllers/
  routes/
  services/
prisma/
  schema.prisma
  seed.ts
```

## Notes

- Uses Prisma with PostgreSQL
- Database schema is defined in `prisma/schema.prisma`
- Seed data can be added using `npx prisma db seed`

## License

ISC
