# VTNN Tư Hồ — Project Status

## Overview
Ecommerce website for Vietnamese agricultural supplies (vật tư nông nghiệp).
Similar to vtnnkhuya.com — green & white theme, mobile-first, Vietnamese market.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | SCSS + CSS Modules (`sass` package) |
| Backend | Next.js API Routes |
| Database | PostgreSQL + Prisma ORM 5 |
| Auth | NextAuth.js v5 (beta) — phone-first login |
| Image Storage | Cloudinary (free tier) |
| Cart State | Zustand (persisted to localStorage) |
| Forms | React Hook Form + Zod validation |
| Deployment | Vercel (frontend) + Neon (PostgreSQL, always-on free tier) |

---

## Color Theme

```scss
$primary:       #2E7D32   // Deep forest green
$primary-light: #4CAF50   // Hover states
$primary-dark:  #1B5E20   // Header, footer
$accent:        #8BC34A   // Badges, highlights
$bg-light:      #F1F8E9   // Page background
$danger:        #D32F2F   // Prices, errors
$warning:       #F57F17   // Promotions
```

---

## Hosting (Free Tier)

| Service | Provider | Notes |
|---|---|---|
| Frontend | Vercel | Free, auto SSL, CDN, zero config |
| Database | Neon | Free 0.5GB, **always-on** (never pauses unlike Supabase) |
| Images | Cloudinary | Free ~1,000 product images |
| Domain | Tenten.vn | ~$10/year (.vn domain) |

**Starting cost: ~$10/year (domain only)**

---

## ✅ Completed

### Phase 1 — Foundation
- [x] Next.js 14 project initialized (TypeScript, App Router, src dir)
- [x] SCSS + CSS Modules setup (`_variables.scss`, `_mixins.scss`, `globals.scss`)
- [x] Prisma 5 schema — 13 tables (see Database section below)
- [x] Prisma seed file with sample categories, products, admin user
- [x] NextAuth.js v5 — phone-based login, JWT sessions, role guard middleware
- [x] Zustand cart store (persisted to localStorage)
- [x] `formatPrice`, `calcDiscount`, `slugify`, `generateOrderCode` utilities

### Phase 2 — Storefront
- [x] **Header** — logo, search bar, cart badge, category nav
- [x] **Footer** — brand info, links, contact
- [x] **Homepage** (`/`) — hero banner, trust badges, category grid, featured products, promo banner, new products
- [x] **Product Catalog** (`/san-pham`) — sidebar filters (category, price), sort, pagination, search
- [x] **Product Detail** (`/san-pham/[slug]`) — image gallery, variant selector, quantity control, add to cart / buy now, description & reviews tabs
- [x] **Cart Page** (`/gio-hang`) — item list, quantity control, shipping calculation, order summary
- [x] **Checkout Page** (`/dat-hang`) — shipping form (province/district/ward), payment method selector (COD, bank transfer, VNPay, MoMo), order submission
- [x] **Order Success Page** (`/dat-hang/thanh-cong`) — order confirmation with code

### Phase 3 — Backend APIs
- [x] **POST `/api/orders`** — creates order, reduces stock atomically (Prisma transaction), creates payment record
- [x] **GET/POST `/api/auth/[...nextauth]`** — NextAuth handlers

### Phase 4 — Admin Dashboard
- [x] **Admin Layout** — sidebar nav (Dashboard, Products, Categories, Orders, Customers, Promotions, Banners, Reports)
- [x] **Admin auth guard** — redirects customers, requires admin/staff role
- [x] **Dashboard** (`/admin`) — revenue stats, pending orders count, low-stock alerts, recent orders table
- [x] **Orders** (`/admin/don-hang`) — full order list with status filter, search by code/name/phone
- [x] **Products** (`/admin/san-pham`) — product list with images, pricing, stock, publish status

---

## ❌ Not Yet Done

### Auth Pages
- [ ] Login page (`/dang-nhap`) — phone + password form
- [ ] Register page (`/dang-ky`) — name, phone, password
- [ ] Forgot password / OTP via SMS (ESMS.vn)

### User Account
- [ ] Account overview (`/tai-khoan`)
- [ ] Order history (`/tai-khoan/don-hang`)
- [ ] Order detail + tracking (`/tai-khoan/don-hang/[code]`)
- [ ] Address book (`/tai-khoan/dia-chi`)
- [ ] Profile edit (`/tai-khoan/ho-so`)

### Payments (plan ready, not implemented)
- [ ] **VietQR** — show QR code after bank transfer order (zero integration, just a URL)
  - URL: `https://img.vietqr.io/image/{BIN}-{ACCOUNT}-{TEMPLATE}.png?amount={AMOUNT}&addInfo={CODE}`
- [ ] **VNPay** — redirect + IPN callback (`/api/payments/vnpay/return`)
  - Needs: `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, HMAC-SHA512 signature
- [ ] **MoMo** — redirect + IPN webhook (`/api/payments/momo/ipn`)
  - Needs: `partnerCode`, `accessKey`, `secretKey`, HMAC-SHA256 signature

### Admin — Missing Pages
- [ ] Product create/edit form (`/admin/san-pham/them-moi`, `/admin/san-pham/[id]`)
  - Fields: name, slug, category, brand, description (rich text), variants, images (Cloudinary upload)
- [ ] Category management (`/admin/danh-muc`)
- [ ] Brand management (`/admin/thuong-hieu`)
- [ ] Order detail + status update (`/admin/don-hang/[id]`)
  - Change status: pending → confirmed → processing → shipped → delivered
- [ ] Customer list (`/admin/khach-hang`)
- [ ] Coupon management (`/admin/khuyen-mai`)
- [ ] Banner management (`/admin/banner`)
- [ ] Reports (`/admin/bao-cao`)
  - Revenue chart by day/month (Recharts), export CSV

### Other
- [ ] Cloudinary image upload helper (`/src/lib/cloudinary.ts`)
- [ ] Product search API with autocomplete suggestions
- [ ] SEO — sitemap.xml, robots.txt, structured data (JSON-LD)
- [ ] Customer product reviews — submit form, approval flow
- [ ] Coupon code at checkout — validate + apply discount
- [ ] Vercel deployment + Neon DB setup guide
- [ ] `.env.example` file

---

## Database Schema (13 tables)

```
users              — id, name, phone*, email?, password_hash, role, is_active
addresses          — id, user_id, recipient_name, phone, province, district, ward, street
categories         — id, name, slug*, parent_id (self-ref), sort_order
brands             — id, name, slug*
products           — id, name, slug*, description, category_id, brand_id, is_published, is_featured, seo_*
product_variants   — id, product_id, name, sku*, price(VND), sale_price, stock, is_default
product_images     — id, product_id, variant_id?, url, sort_order, is_primary
orders             — id, code*, user_id?, status, shipping_*(snapshot), subtotal, discount, shipping_fee, total, payment_method, payment_status
order_items        — id, order_id, variant_id?, product_name(snapshot), unit_price(snapshot), quantity
payments           — id, order_id, method, amount, gateway_ref, gateway_response(json), status, paid_at
reviews            — id, product_id, user_id, order_id(verified), rating(1-5), body, is_approved
coupons            — id, code*, type(percent/fixed), value, min_order, max_uses, expires_at
banners            — id, title, image_url, link, position(hero/popup/category_top), is_active
notifications      — id, user_id, type, title, message, is_read
```
*unique fields

---

## Getting Started

### 1. Set up environment variables
Copy `.env` and fill in your values:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### 2. Create Neon database
1. Go to [neon.tech](https://neon.tech) → create free project
2. Copy the connection string → paste into `DATABASE_URL`

### 3. Run migrations & seed
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start development
```bash
npm run dev
```

| URL | Description |
|---|---|
| `http://localhost:3000` | Customer storefront |
| `http://localhost:3000/admin` | Admin dashboard |
| `http://localhost:3000/dang-nhap` | Login |

**Admin account (from seed):**
- Phone: `0900000001`
- Password: `admin123`

### Useful commands
```bash
npm run db:migrate    # Run new migrations
npm run db:seed       # Re-seed sample data
npm run db:studio     # Open Prisma Studio (DB GUI)
npm run build         # Production build check
```

---

## Project Structure

```
src/
├── app/
│   ├── (store)/              # Customer-facing pages
│   │   ├── page.tsx          # Homepage /
│   │   ├── san-pham/         # /san-pham (catalog)
│   │   │   └── [slug]/       # /san-pham/[slug] (detail)
│   │   ├── gio-hang/         # /gio-hang (cart)
│   │   ├── dat-hang/         # /dat-hang (checkout)
│   │   │   └── thanh-cong/   # /dat-hang/thanh-cong (success)
│   │   └── layout.tsx        # Header + Footer wrapper
│   ├── admin/                # Admin dashboard (protected)
│   │   ├── page.tsx          # /admin (dashboard)
│   │   ├── don-hang/         # /admin/don-hang (orders)
│   │   ├── san-pham/         # /admin/san-pham (products)
│   │   └── layout.tsx        # Admin shell + sidebar
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth handlers
│   │   └── orders/           # POST /api/orders
│   └── layout.tsx            # Root layout (globals.scss)
├── components/
│   ├── store/                # Header, Footer, ProductCard
│   └── admin/                # AdminSidebar
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   ├── auth.ts               # NextAuth config
│   └── utils.ts              # formatPrice, calcDiscount, slugify...
├── store/
│   └── cart.ts               # Zustand cart store
├── styles/
│   ├── globals.scss
│   ├── _variables.scss       # Colors, spacing, breakpoints
│   ├── _mixins.scss          # Responsive, flex, btn, input mixins
│   └── components/           # Per-component .module.scss files
├── types/
│   └── next-auth.d.ts        # Session type extensions
└── middleware.ts             # Route protection (admin, tai-khoan)
prisma/
├── schema.prisma             # DB schema (13 models)
└── seed.ts                   # Sample data seed
```
