# ElectroDrizzle

## A Full-Stack Monorepo to demostrate the use of Drizzle ORM, Next.js, PgLite & ElectricSQL

ElectroDrizzle is a modern, full-stack application demonstrating the power of Drizzle ORM, Next.js, and ElectricSQL in a monorepo setup. It showcases local-first development with offline capabilities, seamless database operations, and a robust API.

## Overview

This project is a monorepo setup using Drizzle ORM, Next.js, and a custom API.
It demonstrates a full-stack application with a PostgreSQL database, ElectricSQL for running PGLite in the browser & syncing it with a remote db

## Project Structure

The project is organized as a monorepo with the following main components:

- `apps/`
  - `api/`: Express.js API server
  - `nextjs/`: Next.js frontend application
- `packages/`
  - `db/`: Database schema and migrations
  - `tsconfig/`: Shared TypeScript configurations

## Key Features

1. **Drizzle ORM**: Used for database operations and schema management.
2. **Next.js Frontend**: React-based frontend with server-side rendering capabilities.
3. **Express.js API**: Custom API for backend operations.
4. **ElectricSQL Integration**: Enables local-first development with offline capabilities.
5. **PostgreSQL Database**: Main database for the application.
6. **Docker Setup**: Includes configurations for PostgreSQL, Redis, and ElectricSQL.

## Getting Started

### Prerequisites

- Node.js (version specified in package.json)
- pnpm (package manager)
- Docker and Docker Compose

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/LeonAlvarez/ElectroDrizzle
   cd drizzle_monorepo
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add necessary variables (refer to `docker-compose.yml` for database-related variables).

4. Start the Docker services:

   ```
   pnpm run docker:up
   ```

5. Run database migrations:

   ```
   pnpm run db:migrate
   ```

6. Seed the database (if needed):
   ```
   pnpm run db:seed
   ```

### Running the Application

1. Start the API server:

   ```
   pnpm run start:api
   ```

2. Start the Next.js frontend:

   ```
   pnpm run start:next
   ```

3. Open `http://localhost:3000` in your browser to view the application.

## Development

- **API Development**: The API is located in `apps/api/`. Use `pnpm run dev` in this directory for development.
- **Frontend Development**: The Next.js app is in `apps/nextjs/`. Use `pnpm run dev` for development mode.
- **Database Changes**: Make schema changes in `packages/db/schema/` and run `pnpm run db:generate` to create new migrations.

## Key Components

### Database (packages/db)

- Schema defined using Drizzle ORM
- Migrations handled by Drizzle Kit
- Includes seeding script for initial data

### API (apps/api)

- Express.js server with Hono framework
- Endpoints for users and posts

### Frontend (apps/nextjs)

- Next.js application with App Router
- Integrates ElectricSQL for local-first capabilities
- Custom components like `PgRepl` for database interaction

## Deployment

- The project is set up to be deployed on Vercel (for Next.js frontend)
- API can be deployed to any Node.js hosting service
- Ensure proper environment variables are set in production

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License - see the `LICENSE` file for details.
