# E-Commerce Admin Dashboard

A React 18 + Vite admin dashboard for the E-Commerce .NET Web API backend.

## Tech Stack

- **React 18** + **Vite**
- **React Router v6**
- **TanStack Query v5** — data fetching & caching
- **Axios** — HTTP client with JWT interceptor & auto-refresh
- **Zustand** — global auth state
- **Tailwind CSS v3** — styling
- **Recharts** — charts
- **React Hook Form** + **Zod** — forms & validation
- **Sonner** — toast notifications
- **Lucide React** — icons
- **Radix UI** — accessible primitives

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env

# 3. Start dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the .NET backend API |

## Roles

- **Admin** — full access to Products, Brands, Types, Orders
- **SuperAdmin** — everything Admin has + Users management

## Project Structure

```
src/
├── api/           # axios instance + resource API functions
├── components/    # shared UI components
├── features/      # feature types
├── layouts/       # DashboardLayout, AuthLayout
├── pages/         # route-level page components
├── store/         # Zustand auth store
└── lib/           # utils, constants
```
