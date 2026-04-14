# 🍱 BhojonBox — Discover & Order Delicious Meals

A full-stack food ordering web application where customers can browse menus, place orders, and track delivery — while providers manage their restaurants and admins oversee the platform.

🌐 **Live Demo:** [https://bhojonbox-client.vercel.app](https://bhojonbox-client.vercel.app) &nbsp;|&nbsp; 
🖥️ **API:** [https://bhojonbox-server.onrender.com](https://bhojonbox-server.onrender.com)

Source code
- Client repo: https://github.com/AbuBakkarSiddique007/bhojonbox_client.git
- Server repo: https://github.com/AbuBakkarSiddique007/bhojonbox_server.git

---

## ✨ Features

### 🌍 Public
- Browse all available meals and food providers
- Filter meals by category, price range, and search
- **AI-Powered Search Suggestions**: Real-time, intelligent recommendations as you type
- View individual meal details and provider profiles

### 👤 Customer
- Register & login with role selection
- **BhojonConcierge AI**: Dedicated personal assistant for meal recommendations
- Add meals to cart (multi-restaurant support)
- Place orders with delivery address — Cash on Delivery
- Track real-time order status
- Leave reviews on delivered meals
- Manage personal profile

### 🍳 Provider
- Register as a food vendor/restaurant
- Full menu management — add, edit, delete meals
- Toggle meal availability
- View and manage incoming orders
- Update order status step by step

### 🛡️ Admin
- Platform-wide dashboard with live stats
- View, search, and filter all users
- Suspend or activate user accounts
- Change user roles (Customer ↔ Provider)
- View all orders across the platform
- Manage food categories (CRUD)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript,Shadcn, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Auth** | JWT stored in HttpOnly cookie |
| **AI / LLM** | Groq (Llama 3.3/3.1) |
| **Deployment** | Vercel (client) · Render (server) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database (local or hosted)
- npm or pnpm

---

### 1. Clone the repositories

You can clone both repos (client and server) separately:

```bash
# Client
git clone https://github.com/AbuBakkarSiddique007/bhojonbox_client.git

# Server
git clone https://github.com/AbuBakkarSiddique007/bhojonbox_server.git
```

---

### 2. Backend Setup

```bash
cd bhojonbox_server
npm install
```

Create a `.env` file in `bhojonbox_server/`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/BhojonBox"
JWT_SECRET="your_super_secret_key"
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
PORT=5000
```

Run database migrations and seed admin (development):

```bash
cd bhojonbox_server
npx prisma migrate dev --name init
npx prisma generate
# run the project seed script
npm run seed
```

Start the server in development:

```bash
npm run dev
# Runs on http://localhost:5000 (by default)
```

---

### 3. Frontend Setup

```bash
cd bhojonbox_client
npm install
```

Client configuration

The client reads the API base URL from `bhojonbox_client/src/config.ts`. Edit that file if you need to point the client to a different backend URL (for local dev use `http://localhost:5000/api`, for production use `https://bhojonbox-server.onrender.com/api`).

Start the client development server:

```bash
cd bhojonbox_client
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Register (CUSTOMER or PROVIDER) |
| POST | `/auth/login` | — | Login, sets HttpOnly cookie |
| GET | `/auth/me` | ✅ | Get current user |
| POST | `/auth/logout` | ✅ | Clear auth cookie |
| PUT | `/auth/profile` | ✅ | Update profile |

### Providers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/providers` | — | List all providers (public) |
| GET | `/providers/me/profile` | ✅ | Get own provider profile (PROVIDER) |
| PUT | `/providers/me/profile` | ✅ | Update own provider profile (PROVIDER) |
| GET | `/providers/:id` | — | Get single provider by ID (public) |

### Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | — | List all categories (public) |
| GET | `/categories/:id` | — | Get single category (public) |
| POST | `/categories` | ✅ | Create a new category (ADMIN) |
| PUT | `/categories/:id` | ✅ | Update a category (ADMIN) |
| DELETE | `/categories/:id` | ✅ | Delete a category (ADMIN) |

### Meals
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/meals` | — | List all meals (with filters) |
| GET | `/meals/:id` | — | Get meal details |
| GET | `/meals/provider/my-meals` | PROVIDER | Get own meals |
| POST | `/meals` | PROVIDER | Create meal |
| PUT | `/meals/:id` | PROVIDER | Update meal |
| DELETE | `/meals/:id` | PROVIDER | Delete meal |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | CUSTOMER | Place new order |
| GET | `/orders/my-orders` | CUSTOMER | Get order history |
| PATCH | `/orders/:id/cancel` | CUSTOMER | Cancel order (PLACED only) |
| GET | `/orders/provider/orders` | PROVIDER | Get incoming orders |
| PATCH | `/orders/:id/status` | PROVIDER | Advance order status |
| GET | `/orders/:id` | Any | Get order details |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews/meal/:mealId` | — | Get reviews for a meal |
| POST | `/reviews` | CUSTOMER | Create review (delivered orders only) |
| PUT | `/reviews/:id` | CUSTOMER | Update own review |
| DELETE | `/reviews/:id` | CUSTOMER/ADMIN | Delete review |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/dashboard` | ADMIN | Platform stats |
| GET | `/admin/users` | ADMIN | List all users |
| PATCH | `/admin/users/:id/toggle-status` | ADMIN | Suspend / activate user |
| PATCH | `/admin/users/:id/role` | ADMIN | Change user role |
| GET | `/admin/orders` | ADMIN | All platform orders |

---

## 📊 Order Status Flow

```
PLACED ──► PREPARING ──► READY ──► DELIVERED
  │
  └──► CANCELLED  (customer cancels while PLACED)
```

| Status | Who Updates |
|--------|-------------|
| PLACED | Created on order |
| PREPARING | Provider |
| READY | Provider |
| DELIVERED | Provider |
| CANCELLED | Customer (PLACED only) |

---

## 🗺️ Pages & Routes

### Public
| Route | Description |
|-------|-------------|
| `/` | Homepage — Hero, Categories, Featured Meals, How It Works |
| `/meals` | Browse all meals with filters |
| `/meals/:id` | Meal detail — add to cart, reviews |
| `/providers` | All providers listing |
| `/providers/:id` | Provider profile with menu |
| `/login` | Login form |
| `/register` | Register with role selection |

### Customer (Private)
| Route | Description |
|-------|-------------|
| `/cart` | Shopping cart |
| `/checkout` | Delivery address & place order |
| `/orders` | My order history |
| `/orders/:id` | Order detail with progress tracker |
| `/profile` | Edit personal info |

### Provider (Private)
| Route | Description |
|-------|-------------|
| `/provider/dashboard` | Stats + recent orders |
| `/provider/menu` | Add / edit / delete meals |
| `/provider/orders` | Incoming orders + update status |

### Admin (Private)
| Route | Description |
|-------|-------------|
| `/admin` | Platform dashboard with stats |
| `/admin/users` | Manage all users |
| `/admin/orders` | View all orders |
| `/admin/categories` | CRUD food categories |

---

## 👥 Roles & Permissions

| Role | Registration | Capabilities |
|------|-------------|--------------|
| **Customer** | Self-register | Browse, cart, orders, reviews, profile |
| **Provider** | Self-register | Menu CRUD, view & update orders, store profile |
| **Admin** | Seeded in DB | Full platform access, cannot be suspended |

---

## 📦 Deployment

### Frontend — Vercel

1. Push `bhojonbox_client/` to GitHub (repo: https://github.com/AbuBakkarSiddique007/bhojonbox_client.git)
2. Import the repo in [Vercel](https://vercel.com) and set the root directory to the repo root (or `/` if the repo is for the client only)
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://bhojonbox-server.onrender.com/api`

### Backend — Render

1. Push `bhojonbox_server/` to GitHub (repo: https://github.com/AbuBakkarSiddique007/bhojonbox_server.git)
2. Create a **Web Service** on [Render](https://render.com)
3. Recommended build command (uses project's helper script to include dev deps):

```
npm run render-build && npx prisma migrate deploy
```

4. Start command: `npm start`
5. Add environment variables on Render: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL=https://bhojonbox-client.vercel.app`, `NODE_ENV=production`

---