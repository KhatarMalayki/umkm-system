# 🛠️ Panduan Setup Lokal UMKM System

Dokumen ini menjelaskan cara setup dan menjalankan sistem UMKM secara lokal untuk development.

---

## Prerequisites

Pastikan Anda sudah install:

- **Node.js** v18+ (https://nodejs.org)
- **pnpm** v9+ (https://pnpm.io)
- **MySQL** v8+ (https://www.mysql.com)
- **Git** (https://git-scm.com)

Verifikasi instalasi:
```bash
node --version
pnpm --version
mysql --version
git --version
```

---

## 1. Clone Repository

```bash
git clone https://github.com/KhatarMalayki/umkm-system.git
cd umkm-system
```

---

## 2. Install Dependencies

```bash
pnpm install
```

---

## 3. Setup Database

### Create Database & User

```bash
# Login ke MySQL
mysql -u root -p

# Jalankan SQL commands
CREATE DATABASE umkm_system;
CREATE USER 'umkm_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON umkm_system.* TO 'umkm_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Setup Environment Variables

Buat file `.env.local` di root project:

```env
DATABASE_URL=mysql://umkm_user:password123@localhost:3306/umkm_system
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_TITLE=UMKM Store
NODE_ENV=development
```

### Run Migrations

```bash
# Generate migration files
pnpm drizzle-kit generate

# Run migrations
pnpm drizzle-kit migrate
```

### Seed Database (Optional)

```bash
# Insert data dummy
node server/seed-db.mjs
```

---

## 4. Run Development Server

```bash
# Terminal 1: Start dev server
pnpm dev
```

Server akan berjalan di: **http://localhost:3000**

---

## 5. Build untuk Production

```bash
# Build frontend dan backend
pnpm build

# Start production server
pnpm start
```

---

## 6. Testing

```bash
# Run unit tests
pnpm test

# Run tests dengan watch mode
pnpm test --watch
```

---

## Project Structure

```
umkm-system/
├── client/                 # Frontend React + Vite
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities (cart, etc)
│   │   ├── App.tsx        # Main router
│   │   └── main.tsx       # Entry point
│   └── public/            # Static files
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database queries
│   ├── seed-db.mjs        # Data seeding script
│   └── _core/             # Framework internals
├── drizzle/               # Database schema & migrations
│   ├── schema.ts          # Table definitions
│   └── migrations/        # SQL migration files
├── shared/                # Shared constants & types
├── HOSTING.md             # Deployment guide
├── SETUP.md               # This file
└── package.json           # Dependencies
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm test` | Run unit tests |
| `pnpm check` | Type check dengan TypeScript |
| `pnpm format` | Format code dengan Prettier |
| `pnpm drizzle-kit generate` | Generate migration files |
| `pnpm drizzle-kit migrate` | Run database migrations |

---

## Features Overview

### Landing Page (Pembeli)
- **URL:** http://localhost:3000
- Katalog produk dengan filter kategori
- Keranjang belanja dengan qty pecahan (1/4, 1/2, 3/4 kg, dll)
- Checkout dengan form pembeli
- Invoice/tagihan yang bisa di-print

### Admin Panel
- **URL:** http://localhost:3000/admin
- Dashboard dengan statistik
- Manajemen produk (CRUD)
- Manajemen diskon
- Manajemen order/tagihan masuk

---

## Database Schema

### Tables

**users**
- User authentication & roles (admin/user)

**products**
- Katalog produk dengan harga, stok, satuan

**orders**
- Order/tagihan dari pembeli

**order_items**
- Detail item dalam setiap order

**discounts**
- Diskon produk (persentase atau nominal)

---

## Troubleshooting

### Error: "Cannot find module 'mysql2'"
```bash
# Reinstall dependencies
pnpm install
```

### Error: "ECONNREFUSED" (Database Connection)
```bash
# Cek MySQL running
sudo systemctl status mysql

# Start MySQL jika belum
sudo systemctl start mysql

# Verify connection string di .env.local
```

### Error: "Port 3000 already in use"
```bash
# Gunakan port berbeda
PORT=3001 pnpm dev
```

### Database Migration Error
```bash
# Reset database
mysql -u umkm_user -p umkm_system < /dev/null

# Jalankan migration ulang
pnpm drizzle-kit migrate
```

---

## Development Tips

### Hot Module Replacement (HMR)
- Frontend changes akan auto-reload
- Backend changes memerlukan restart server

### Database Queries
- Gunakan query helpers di `server/db.ts`
- Hindari raw SQL queries

### tRPC Procedures
- Define di `server/routers.ts`
- Call dari frontend dengan `trpc.*.useQuery/useMutation`

### Component Development
- Gunakan shadcn/ui components
- Tailwind CSS untuk styling
- Responsive design dengan mobile-first approach

---

## Performance Tips

1. **Optimize Images**
   - Gunakan format WebP
   - Compress sebelum upload

2. **Database Indexing**
   - Add indexes untuk frequently queried fields
   - Monitor slow queries

3. **Caching**
   - Leverage browser caching
   - Implement server-side caching jika perlu

---

## Security Checklist

- [ ] JWT_SECRET sudah strong (min 32 chars)
- [ ] Database password sudah strong
- [ ] Tidak commit `.env.local` ke repository
- [ ] CORS sudah dikonfigurasi dengan benar
- [ ] Input validation di semua forms
- [ ] SQL injection protection (Drizzle ORM handles this)

---

## Next Steps

1. Customize branding (logo, warna, font)
2. Tambahkan payment gateway integration
3. Setup email notifications
4. Deploy ke production
5. Monitor dengan analytics

---

## Resources

- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Drizzle ORM:** https://orm.drizzle.team
- **tRPC:** https://trpc.io
- **shadcn/ui:** https://ui.shadcn.com

---

**Last Updated:** April 2026
**Version:** 1.0.0
