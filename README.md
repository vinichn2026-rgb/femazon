# Femazon — Luxury Indian Couture & Designer Marketplace

Femazon is a unified luxury e-commerce platform blending premium fashion, curated designer collections, women-focused at-home services, and AI-powered styling for the modern woman.

---

## 🌟 Latest Updates & Features

### 1. Automatic Vendor Approval Email Integration
- **Server-Side Trigger**: When an Admin approves a vendor registration in the Admin Dashboard (`/admin`), the backend automatically dispatches a branded luxury approval email to the vendor's verified registered address.
- **Dynamic Content**: Dynamically populates vendor name, shop name, registration ID, and direct login URL (`/vendor/login`).
- **Resilient Multi-Provider Email Service**: Native support for **Resend** (`EMAIL_API_KEY`), **Google Apps Script** (`GOOGLE_SCRIPT_URL`), and **SMTP** (`nodemailer`), with automatic database logging of delivery timestamps and errors.
- **Duplicate Prevention**: Subsequent approval requests detect existing email status and prevent duplicate notifications.

### 2. Common Vendor Portal & Multi-Tenant Isolation
- **Common Vendor Login**: `/vendor/login`
- **Common Vendor Dashboard**: `/vendor/dashboard`
- **Strict Server-Side Security**: Verifies vendor role and approval status (`APPROVED`) before granting access to dashboard or API endpoints. Suspended or pending vendors are restricted.
- **Multi-Tenant Data Isolation**: Vendors only access and manage their own products, inventory, and order items.

### 3. Dynamic Public Vendor Shop Pages
- **Dynamic Storefronts**: `/shops/[slug]` (e.g. `/shops/jewellery-shop`, `/shops/priya-boutique`).
- **PostgreSQL Driven**: Generates public storefronts dynamically by unique vendor slug or ID.
- **Approval Filtering**: Excludes suspended vendors and displays only approved products (`approvalStatus: 'APPROVED'`).

### 4. Standardized Layout Spacing & Padding
- **Global Layout Standard**: `max-w-[1400px] mx-auto px-4 sm:px-6` applied consistently across all 48 pages (Header, Catalog, Product Details, Category/Dresses, Cart, Checkout, Account views, Services, Virtual Try-On, AI Concierge, Admin & Vendor Dashboards).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database (Supabase or standard Postgres)

### Installation
```bash
# Clone the repository
git clone https://github.com/vinichn2026-rgb/femazon.git
cd femazon

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate
```

### Environment Configuration
Copy `.env.example` to `.env` and configure your credentials:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Email Provider (Resend recommended)
EMAIL_PROVIDER="resend"
EMAIL_API_KEY="re_..."
EMAIL_FROM="Femazon <onboarding@resend.dev>"
SUPPORT_EMAIL="support@femazon.com"
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Key Application Routes

| Route | Description |
| :--- | :--- |
| `/` | Luxury Home Page & Hero Carousel |
| `/shop` | Full Product Catalog & Filter Drawer |
| `/shops/[slug]` | Dynamic Public Vendor Boutique Storefront |
| `/vendor/login` | Common Vendor Partner Login Portal |
| `/vendor/dashboard` | Common Vendor Inventory & Orders Dashboard |
| `/seller/register` | Become a Seller Registration Form |
| `/admin` | Admin Management Dashboard |
| `/services` | At-Home Women's Services & Booking |
| `/vton` | Virtual Try-On Experience |
| `/ai-wardrobe` | AI-Powered Digital Wardrobe Assistant |

---

## 🧪 Testing

Run the automated integration test suite:
```bash
npx tsx scripts/test-vendor-approval-email.ts
```

---

## 📄 License
Private & Proprietary — Femazon Luxury Couture Inc.
