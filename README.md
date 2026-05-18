# True Stylez Hair Studio / J The Barber

A premium barber shop website built with Next.js 14, featuring online booking, AI chatbot, and 3D elements.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- GSAP + Framer Motion for animations
- Prisma + PostgreSQL
- NextAuth.js for authentication
- TensorFlow.js for hairstyle recommender

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
DATABASE_URL="your-postgres-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="your-resend-key"
OPENAI_API_KEY="your-openai-key"
ADMIN_EMAIL="admin@truestylez.com"
ADMIN_PASSWORD="your-password"
```

3. Run database migration:
```bash
npx prisma migrate dev
npx prisma db seed
```

4. Run the development server:
```bash
npm run dev
```

## Features
- Hero section with clipper reveal animation
- Multi-step booking widget
- Barber profiles
- Services catalog
- AI chatbot ("The Apprentice")
- AI hairstyle recommender
- 3D barber chair visualization
- Admin dashboard
- Seasonal themes

## Deployment
Deploy to Vercel with the following environment variables set.