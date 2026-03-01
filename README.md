# BhojonBox

BhojonBox is a food-ordering web app connecting customers with local food providers. The frontend is a Next.js app deployed on Vercel and the backend is an Express + TypeScript API deployed on Render.

Live sites
- Client (Vercel): https://bhojonbox-client.vercel.app
- Server (Render): https://bhojonbox-server.onrender.com

Features
- Browse meals and providers
- Add to cart and place orders
- Provider dashboard to manage menu and orders
- Customer dashboard to view orders and add reviews
- Admin dashboard to manage users, providers and content
- JWT-based auth stored in an HttpOnly cookie for secure sessions

Technology stack
- Client: Next.js, React, TypeScript
- Server: Node.js, Express, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Deployment: Vercel (client) and Render (server)

Short setup & usage

Prerequisites
- Node.js (16+), npm (or pnpm)
- PostgreSQL database (local or hosted)

Client (run locally)

```bash
cd bhojonbox_client
npm install
npm run dev
```

Server (run locally)

```bash
cd bhojonbox_server
npm install
# create .env with DATABASE_URL, JWT_SECRET, FRONTEND_URL, NODE_ENV
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```