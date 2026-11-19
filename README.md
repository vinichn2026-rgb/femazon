# 👑 Femazon — Luxury Ethnic & Modern Fashion E-Commerce & Services Platform

![Next.js](https://img.shields.io/badge/Next.js-16.3.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7.9.1-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=flat-square&logo=postgresql)

**Femazon** is an enterprise-grade luxury e-commerce and on-demand lifestyle services platform tailored for South Asian and modern designer fashion. Built with Next.js 16 (App Router), React 19, TypeScript, and Prisma ORM, it brings together curated high-end fashion, an interactive multi-vendor marketplace, bespoke tailoring and styling services, an AI-powered concierge, and virtual try-on experiences.

---

## 🌟 Key Features

### 🛍️ 1. Luxury Shopping & Catalog Experience
- **Curated Collections & Designer Labels**: Dedicated showcases for bridal, ethnic wear, lehengas, sarees, anarkalis, chudithars, modern evening wear, and jewelry.
- **Advanced Filtering & Search**: Filter by category, occasion, silhouette, fabric care, ready-to-ship status, color, and price range.
- **Local Boutique Discovery (`/womens-wear`)**: Browse approved women-led boutiques by city, including Coimbatore and Chennai, alongside the wider product catalog.
- **Gift Discovery (`/gifts`)**: Refine approved product listings by recipient, occasion, budget, category, and seller.
- **Unified Search (`/search`)**: Search products, services, approved boutiques, and approved professionals in one experience.
- **Rich Product Displays**: Multi-image galleries, color swatches with hex-based selectors, per-color size inventories, and real-time stock levels.
- **Cart & Wishlist**: Persistent cart and wishlist synchronization for both guests and authenticated users.
- **Flexible Checkout**: Support for Cash on Delivery (COD) and online payments with itemized order summaries, tax breakdowns, and shipping address management.

### 🪄 2. AI Concierge & Virtual Styling
- **AI Fashion Concierge (`/ai-concierge`)**: Personalized styling advice, outfit recommendations based on event theme, fabric, and color coordination.
- **Virtual Try-On (`/virtual-try-on`)**: Interactive garment visualization preview.
- **Digital Wardrobe (`/wardrobe`)**: Customers can upload their personal wardrobe items and receive smart daily and event-based outfit pairings (`/api/wardrobe/recommend`).

### ✂️ 3. On-Demand Fashion & Beauty Services
- **Service Categories**:
  - Personal Stylist & Wedding Shopping Assistant
  - Custom Tailoring & Sizing Consultations
  - Makeup & Bridal Beauty Artists
- **Provider Directory**: Browse admin-approved professional applications with service areas, experience, pricing, and portfolio links; existing bookable providers also show their available customer ratings and reviews.
- **Interactive Booking Flow (`/services/[slug]/book`)**: Select preferred dates, time slots, service locations, and specific styling notes.
- **End-to-End Booking Lifecycle**: Tracks appointments through `REQUEST_RECEIVED`, `UNDER_REVIEW`, `SUPPORTER_ASSIGNED`, `CONFIRMED`, `IN_PROGRESS`, and `COMPLETED`.

### 🏬 4. Multi-Vendor & Seller Hub
- **Vendor Onboarding (`/seller/register`)**: Dedicated application flow with business details, GST verification, and administrative approval workflow.
- **Partner Registration (`/partner/register`)**: Boutiques, gift sellers, and women professionals can submit business details, locations, pricing, and portfolios for admin review.
- **Seller Dashboard (`/seller/dashboard` & `/vendor/dashboard`)**:
  - Product catalog management with multiple images, variant creation, and pricing.
  - Order fulfillment tracking and shipment status updates.
  - Dedicated public vendor storefront (`/store/[vendorId]`).

### 🛡️ 5. Administrative Command Center (`/admin`)
- **Product Moderation**: Approve, flag, or edit seller products.
- **Vendor Verification**: Review pending vendor applications with one-click approval or rejection.
- **Service & Provider Management**: Create new service categories, manage provider profiles, and reassign appointments.
- **Order & Booking Oversight**: System-wide access to update order logistics, process cancellations, and manage customer communications.

### 👤 6. Customer Account Hub (`/account`)
- **Orders & Tracking**: Real-time status for placed, dispatched, and delivered orders with cancellation support.
- **Service Bookings**: Complete history of booked consultations and beauty/tailoring services.
- **Custom Measurements Profile**: Save bespoke sizing parameters (bust, waist, hips, shoulder, inseam) for seamless custom tailoring orders.
- **Saved Addresses & Wallet**: Fast address management with default tagging and loyalty wallet integration.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, API Routes) |
| **Frontend** | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Icons & UI** | [Lucide React](https://lucide.dev/), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge) |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |
| **Database ORM** | [Prisma ORM v7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (Compatible with Supabase, Neon, AWS RDS) |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) (Credentials, Sessions, Roles) |
| **Notifications & Mail** | Google Apps Script (Gmail API integration for OTP) or SMTP / Nodemailer |

---

## 📁 Project Structure

```text
femazon/
├── assets/                    # Brand assets, vectors, and design resources
├── FEMAZON-PLANS/             # Product Requirement Documents (PRD) & architecture plans
├── prisma/
│   ├── schema.prisma          # Database models, relations, and enums
│   └── migrations/            # SQL migration history
├── public/                    # Static assets, category hero banners, product photography
├── scripts/                   # Data seeding, catalog classification, and port utilities
│   ├── run-with-port.js       # Dynamic free-port finder for Next.js dev/start
│   ├── seed-shop.ts           # Primary database seeder for products and categories
│   ├── seed-accessories.ts    # Seed script for designer jewelry & accessories
│   ├── sync-managed-services.ts # Seed script for services and providers
│   └── classify-catalog.ts    # Automated catalog metadata classifier
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (account)/         # Customer portal: orders, bookings, wardrobe, measurements
│   │   ├── (auth)/            # Authentication flows (login, register, OTP verification)
│   │   ├── admin/             # Admin control panel (dashboard, products, vendors, services)
│   │   ├── ai-concierge/      # AI styling concierge interface
│   │   ├── api/               # REST API endpoints (auth, cart, orders, reviews, services)
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout and payment selection
│   │   ├── curated/           # Curated designer collections showcase
│   │   ├── seller/ & vendor/  # Multi-vendor portals and seller registration
│   │   ├── services/          # Lifestyle & beauty services catalog and booking
│   │   ├── shop/              # Filterable e-commerce catalog and category pages
│   │   ├── store/[vendorId]/  # Public vendor storefronts
│   │   └── virtual-try-on/    # Virtual try-on module
│   ├── components/            # Modular React UI components
│   │   ├── admin/             # Admin data tables, status badges, action controls
│   │   ├── auth/              # Login, register, and OTP verification modals
│   │   ├── cart/              # Cart drawer, price summary, checkout stepper
│   │   ├── home/              # Hero banners, trending rails, category cards
│   │   ├── layout/            # Navbar, footer, MegaMenu navigation, mobile drawer
│   │   ├── services/          # Provider cards, booking calendar, service details
│   │   ├── shop/              # Product cards, filter sidebars, color variant swatches
│   │   └── vton/              # Virtual Try-On canvas and garment controls
│   └── lib/                   # Database client (Prisma), auth options, and shared utilities
├── .env.example               # Environment variables template
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and build scripts
└── tsconfig.json              # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x LTS` (Node.js 22 LTS recommended)
- **Package Manager**: `npm` (v10+)
- **Database**: PostgreSQL (local instance or cloud database such as Supabase / Neon)
- **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/vinichn2026-rgb/femazon.git
cd femazon
```

### Step 2: Install Dependencies
```bash
npm install
```
*(This will automatically trigger `prisma generate` to compile the Prisma client)*.

---

### Step 3: Configure Environment Variables

Create your local `.env` file from the provided example:
```bash
cp .env.example .env
```

Open `.env` and configure your credentials:

```env
# Database (PostgreSQL / Supabase / Neon)
DATABASE_URL="postgresql://postgres:password@localhost:5432/femazon?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/femazon?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-secret-key-here"

# Email Provider Configuration ('google_script' or 'smtp')
EMAIL_PROVIDER="google_script"
EMAIL_FROM="Femazon <vinichn2026@gmail.com>"

# Google Apps Script Web App (Gmail API for OTP)
# Deploy Code.gs as Web App in https://script.google.com and paste exec URL below:
GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/YOUR_EXEC_ID/exec"
GOOGLE_SCRIPT_SECRET="your-script-secret"

# Alternative: SMTP (Optional)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-app-password"
```

---

### Step 4: Synchronize Database Schema

Push the Prisma schema to your PostgreSQL database:
```bash
npx prisma db push
```

*(Optional) Launch Prisma Studio to inspect your database records visually:*
```bash
npx prisma studio
```

---

### Step 5: Seed Sample Catalog Data

Populate your database with curated fashion products, categories, color variants, and default services:

```bash
# Seed standard shop products and categories
npx tsx scripts/seed-shop.ts

# (Optional) Seed lifestyle and tailoring services
npx tsx scripts/sync-managed-services.ts

# (Optional) Seed accessories and jewelry
npx tsx scripts/seed-accessories.ts
```

---

### Step 6: Start the Development Server

Run the development server with automatic free-port detection:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔑 User Roles & Permissions

Femazon implements granular Role-Based Access Control (RBAC):

| Role | Permissions & Access Scope |
|---|---|
| `CUSTOMER` | Browse catalog, save wishlist, manage cart, place orders, book lifestyle/beauty services, manage digital wardrobe, custom measurements, and track orders. |
| `VENDOR` | Access seller dashboard (`/seller/dashboard`), manage products & color variants, review and fulfill orders for their vendor store, view customer inquiries. |
| `ADMIN` | Full platform control (`/admin`): product approval/moderation, vendor vetting, booking management, user management, and service provider configuration. |

---

## 📜 Available NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js development server with automated port conflict resolution |
| `npm run build` | Compiles the production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint checks across the codebase |
| `npx prisma db push` | Pushes the Prisma schema to your active database without migrations |
| `npx prisma migrate dev` | Creates and applies migrations to the database |
| `npx prisma studio` | Opens an interactive web GUI to view and edit database rows |
| `npx tsx scripts/seed-shop.ts` | Seeds standard catalog products, sizes, and categories |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/luxury-feature`)
3. Commit your changes (`git commit -m 'Add luxury feature'`)
4. Push to the branch (`git push origin feature/luxury-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
