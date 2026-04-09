# 🛍️ UMKM Web System

Sistem web toko online lengkap untuk UMKM dengan Landing Page untuk pembeli dan Admin Panel untuk pengelola. Dibangun dengan teknologi modern dan siap untuk production.

![UMKM Store](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-v18+-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Next.js](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Dokumentasi](#dokumentasi)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## ✨ Fitur Utama

### 🛒 Landing Page (Untuk Pembeli)

- **Katalog Produk** - Tampilan menarik dengan gambar, nama, harga, satuan, dan stok
- **Filter & Search** - Filter berdasarkan kategori (Minuman, Makanan Berat, Barang Grosir)
- **Keranjang Belanja** - Tambah/kurangi/hapus item dengan dukungan qty pecahan (1/4, 1/2, 3/4 kg, dll)
- **Checkout** - Form pembeli dengan pilihan metode pembayaran (COD/Transfer Bank)
- **Invoice/Tagihan** - Halaman invoice yang dapat di-print dan di-download
- **Diskon Otomatis** - Harga otomatis terpotong sesuai diskon yang aktif

### 👨‍💼 Admin Panel (Untuk Pengelola)

- **Dashboard** - Ringkasan statistik (Total Produk, Total Order, Total Diskon Aktif)
- **Manajemen Produk** - CRUD lengkap (Create, Read, Update, Delete) dengan field:
  - Nama produk
  - Harga
  - Satuan dinamis (Pcs, Kg, Liter, dll)
  - Stok
  - Gambar produk
- **Manajemen Diskon** - Atur diskon per produk dengan tipe persentase atau nominal
- **Manajemen Order** - Lihat daftar order masuk dengan detail pembeli dan status pembayaran
- **Konfirmasi Pembayaran** - Approve atau reject pembayaran order

### 💾 Database & Backend

- **MySQL Database** - Schema lengkap untuk produk, order, diskon, dan user
- **tRPC API** - Type-safe API dengan auto-generated types
- **Authentication** - OAuth integration dengan Manus
- **Data Validation** - Input validation di semua endpoints

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library modern
- **Vite** - Build tool super cepat
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library berkualitas tinggi
- **Wouter** - Lightweight router
- **React Hook Form** - Form management

### Backend
- **Express 4** - Minimal web framework
- **tRPC 11** - Type-safe RPC framework
- **Drizzle ORM** - Type-safe database ORM
- **MySQL 8** - Database relasional

### Development
- **TypeScript 5.9** - Type safety
- **Vitest** - Unit testing framework
- **Prettier** - Code formatter
- **ESLint** - Code linter

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- pnpm v9+
- MySQL 8+

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/KhatarMalayki/umkm-system.git
   cd umkm-system
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Setup Database**
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE umkm_system;"
   
   # Run migrations
   pnpm drizzle-kit migrate
   
   # (Optional) Seed data dummy
   node server/seed-db.mjs
   ```

4. **Setup Environment Variables**
   ```bash
   # Copy .env.example ke .env.local
   cp .env.example .env.local
   
   # Edit .env.local dengan database credentials Anda
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

   Server akan berjalan di: **http://localhost:3000**

---

## 📁 Project Structure

```
umkm-system/
├── client/                          # Frontend React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page dengan katalog
│   │   │   ├── Checkout.tsx        # Halaman checkout
│   │   │   ├── Invoice.tsx         # Halaman invoice/tagihan
│   │   │   ├── AdminDashboard.tsx  # Admin dashboard
│   │   │   ├── AdminProducts.tsx   # Manajemen produk
│   │   │   ├── AdminOrders.tsx     # Manajemen order
│   │   │   └── AdminDiscounts.tsx  # Manajemen diskon
│   │   ├── components/
│   │   │   ├── ProductCard.tsx     # Komponen kartu produk
│   │   │   └── CartSidebar.tsx     # Sidebar keranjang belanja
│   │   ├── lib/
│   │   │   └── cart.ts             # Utility manajemen keranjang
│   │   ├── App.tsx                 # Main router
│   │   └── main.tsx                # Entry point
│   └── public/                      # Static files
│
├── server/                          # Backend Express + tRPC
│   ├── routers.ts                  # tRPC procedures (API endpoints)
│   ├── db.ts                       # Database query helpers
│   ├── seed-db.mjs                 # Script untuk insert data dummy
│   └── _core/                      # Framework internals
│       ├── index.ts                # Server entry point
│       ├── context.ts              # tRPC context
│       ├── trpc.ts                 # tRPC setup
│       └── ...
│
├── drizzle/                         # Database
│   ├── schema.ts                   # Table definitions
│   └── migrations/                 # SQL migration files
│
├── shared/                          # Shared code
│   └── const.ts                    # Constants
│
├── HOSTING.md                       # Panduan deployment
├── SETUP.md                         # Panduan setup lokal
├── README.md                        # File ini
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript config
```

---

## 📖 Dokumentasi

### Setup & Development
- **[SETUP.md](./SETUP.md)** - Panduan lengkap setup lokal untuk development

### Deployment & Hosting
- **[HOSTING.md](./HOSTING.md)** - Panduan deployment ke berbagai platform:
  - Manus (Recommended)
  - Railway
  - Render
  - Vercel

---

## 🎯 Fitur Qty Pecahan

Sistem mendukung pembelian dengan qty pecahan untuk satuan Kg/Liter:

**Contoh Penggunaan:**
- Pembeli memilih "1/2 kg" sebagai ukuran
- Input "2" sebagai jumlah item
- Total yang ditambahkan ke keranjang: 1 kg
- Harga otomatis dihitung: 2 × (harga per 1/2 kg)

**Preset Options:**
- 1/4 kg
- 1/2 kg
- 3/4 kg
- 1 kg
- 1 1/2 kg
- 2 kg
- Custom input untuk nilai lain

---

## 🔐 Security Features

- ✅ Type-safe API dengan tRPC
- ✅ Input validation di semua forms
- ✅ SQL injection protection (Drizzle ORM)
- ✅ CORS configured
- ✅ JWT authentication
- ✅ Role-based access control (admin/user)

---

## 📊 Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `users` | User authentication & roles |
| `products` | Katalog produk |
| `orders` | Order/tagihan dari pembeli |
| `order_items` | Detail item dalam order |
| `discounts` | Diskon produk |

---

## 🚀 Deployment

### Manus (Recommended)
```bash
# Publish dengan 1 klik di Management UI
# Domain otomatis: https://umkmweb-xxx.manus.space
```

### Railway
```bash
# Deploy dari GitHub
# https://railway.app
```

### Render
```bash
# Deploy dari GitHub
# https://render.com
```

Lihat [HOSTING.md](./HOSTING.md) untuk instruksi lengkap.

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build untuk production |
| `pnpm start` | Start production server |
| `pnpm test` | Run unit tests |
| `pnpm check` | Type check dengan TypeScript |
| `pnpm format` | Format code dengan Prettier |
| `pnpm drizzle-kit generate` | Generate migration files |
| `pnpm drizzle-kit migrate` | Run database migrations |

---

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run tests dengan watch mode
pnpm test --watch

# Generate coverage report
pnpm test --coverage
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Cek MySQL running
sudo systemctl status mysql

# Verify connection string di .env.local
```

### Port Already in Use
```bash
# Gunakan port berbeda
PORT=3001 pnpm dev
```

### Build Error
```bash
# Clear cache dan reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

Lihat [SETUP.md](./SETUP.md) untuk troubleshooting lengkap.

---

## 🤝 Contributing

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 Changelog

### v1.0.0 (April 2026)
- ✅ Landing Page dengan katalog produk
- ✅ Keranjang belanja dengan qty pecahan
- ✅ Checkout dan invoice/tagihan
- ✅ Admin Panel lengkap
- ✅ Manajemen produk, order, dan diskon
- ✅ Database schema dan migrations
- ✅ Dokumentasi hosting dan setup

---

## 📞 Support

Untuk pertanyaan atau issues:
- 📧 Email: support@umkm-system.com
- 🐛 GitHub Issues: https://github.com/KhatarMalayki/umkm-system/issues
- 📚 Documentation: Lihat [HOSTING.md](./HOSTING.md) dan [SETUP.md](./SETUP.md)

---

## 📄 License

Project ini dilisensikan di bawah MIT License - lihat file [LICENSE](./LICENSE) untuk detail.

---

## 👨‍💻 Author

**Manus AI Developer**
- GitHub: [@KhatarMalayki](https://github.com/KhatarMalayki)

---

## 🙏 Acknowledgments

- React & Vite community
- shadcn/ui components
- Drizzle ORM team
- tRPC framework
- Tailwind CSS

---

## 🎯 Roadmap

- [ ] Integrasi Payment Gateway (Midtrans/Stripe)
- [ ] Notifikasi WhatsApp/Email
- [ ] Laporan Penjualan & Analytics
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Inventory management advanced
- [ ] Customer review & rating

---

**Last Updated:** April 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
