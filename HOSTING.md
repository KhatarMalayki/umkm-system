# 🚀 Panduan Hosting & Deployment UMKM System

Dokumen ini menjelaskan cara hosting dan menjalankan sistem web UMKM Anda di berbagai platform.

---

## 📋 Daftar Isi

1. [Hosting dengan Railway (Rekomendasi)](#hosting-dengan-railway-rekomendasi)
2. [Hosting dengan Render](#hosting-dengan-render)
3. [Hosting dengan Vercel + Backend Terpisah](#hosting-dengan-vercel--backend-terpisah)
4. [Setup Database](#setup-database)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

---

## Hosting dengan Railway (Rekomendasi)

**Keuntungan:**
- ✅ Mudah setup dengan GitHub integration
- ✅ Free tier tersedia (500 jam/bulan)
- ✅ Database MySQL included
- ✅ Auto-deploy setiap push ke GitHub
- ✅ Custom domain support
- ✅ Environment variables management built-in
- ✅ Monitoring dan logs real-time

### Langkah-langkah Detail:

#### 1. Persiapan Repository

Pastikan project sudah di-push ke GitHub:

```bash
cd /home/ubuntu/umkm-system
git remote -v  # Verify remote ke GitHub
git push origin main
```

#### 2. Buat Akun Railway

1. Kunjungi https://railway.app
2. Sign up dengan GitHub (lebih mudah)
3. Authorize Railway untuk akses repository

#### 3. Create New Project di Railway

1. Dashboard Railway → Click "New Project"
2. Pilih "Deploy from GitHub repo"
3. Authorize dan pilih repository `umkm-system`
4. Railway akan auto-detect sebagai Node.js project

#### 4. Setup MySQL Database (PENTING: Lakukan Dulu!)

Di Railway:

1. Dashboard → Click "New"
2. Pilih "MySQL"
3. Railway akan auto-create database
4. Tunggu sampai database selesai dibuat
5. Copy connection string (akan digunakan di step berikutnya)

**Format connection string:**
```
mysql://username:password@host:port/database_name
```

Contoh:
```
mysql://root:mypassword@containers-us-west-123.railway.app:3306/railway
```

#### 5. Configure Build Settings

Railway akan otomatis mendeteksi, tapi pastikan:

**Build Command:**
```bash
pnpm install && pnpm build
```

**Start Command:**
```bash
pnpm start
```

**Node Version:** v18+ (default sudah OK)

#### 6. Setup Environment Variables

Sekarang setup environment variables di Railway Dashboard:

1. Klik project → "Variables" tab
2. Tambahkan environment variables berikut:

**Database (dari step 4):**
```
DATABASE_URL=mysql://username:password@host:port/database_name
```

**Authentication:**
```
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
NODE_ENV=production
```

**App Settings:**
```
VITE_APP_TITLE=UMKM Store
VITE_APP_LOGO=https://your-logo-url.png
```

#### 7. Run Database Migrations

Setelah environment variables set dan database terhubung:

Setelah deploy pertama kali, Anda perlu run migrations:

**Opsi A: Via Railway Shell**
1. Di Railway Dashboard, klik service
2. Klik "Shell" tab
3. Run command:
   ```bash
   pnpm drizzle-kit migrate
   ```

**Opsi B: Via GitHub Actions** (Recommended)
Buat file `.github/workflows/migrate.yml`:
```yaml
name: Database Migration
on:
  push:
    branches: [main]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm drizzle-kit migrate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

#### 8. Deploy & Monitor

Setelah migrations berhasil:

1. Railway akan auto-deploy setiap kali push ke GitHub
2. Monitor di "Deployments" tab
3. View logs di "Logs" tab
4. Check status di "Monitoring" tab

**URL Production:**
```
https://umkm-system-production.up.railway.app
```

#### 9. Custom Domain (Optional)

1. Di Railway Dashboard → Settings
2. Klik "Custom Domain"
3. Tambahkan domain Anda (misal: umkm.com)
4. Update DNS records sesuai instruksi Railway
5. Domain akan aktif dalam 24 jam

---

## Hosting dengan Render

**Keuntungan:**
- Free tier dengan 750 jam/bulan
- Auto-deploy dari GitHub
- Database PostgreSQL/MySQL
- Unlimited bandwidth

### Langkah-langkah:

#### 1. Buat Akun Render

- Kunjungi https://render.com
- Sign up dengan GitHub

#### 2. Create New Web Service

1. Dashboard → "New" → "Web Service"
2. Connect GitHub repository
3. Pilih branch: `main`

#### 3. Setup MySQL Database (PENTING: Lakukan Dulu!)

1. Render Dashboard → "New" → "MySQL"
2. Tunggu database selesai dibuat
3. Copy connection string (akan digunakan di step berikutnya)

**Format connection string:**
```
mysql://username:password@host:port/database_name
```

#### 4. Konfigurasi Build & Start

- **Name:** umkm-system
- **Environment:** Node
- **Region:** Singapore (untuk latency rendah)
- **Build Command:**
  ```bash
  pnpm install && pnpm build
  ```
- **Start Command:**
  ```bash
  pnpm start
  ```

#### 5. Environment Variables

Di Render Dashboard:
1. Klik service
2. "Environment" → "Add Environment Variable"
3. Tambahkan:
   ```
   DATABASE_URL=mysql://username:password@host:port/database_name
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   VITE_APP_TITLE=UMKM Store
   ```

#### 6. Deploy

1. Klik "Deploy"
2. Render akan build dan deploy otomatis
3. Monitor di "Logs" tab

---

## Hosting dengan Vercel + Backend Terpisah

**Catatan:** Vercel hanya support frontend static/serverless. Backend harus di-host terpisah di Railway atau Render.

### Backend di Railway/Render (PENTING: Setup Dulu!):

Ikuti langkah Railway atau Render di atas untuk:
1. Setup MySQL Database
2. Configure Build & Start
3. Setup Environment Variables
4. Deploy backend

Setelah backend selesai deploy, catat URL-nya (misal: `https://your-backend-api.railway.app`)

### Frontend di Vercel:

#### 1. Setup

```bash
cd /home/ubuntu/umkm-system/client
pnpm install
```

#### 2. Deploy ke Vercel

1. Kunjungi https://vercel.com
2. Import GitHub repository
3. Vercel auto-detect sebagai Vite project

#### 3. Build Settings

- **Framework:** Vite
- **Build Command:** `pnpm build`
- **Output Directory:** `dist`

#### 4. Environment Variables

Di Vercel Dashboard:
```
VITE_API_URL=https://your-backend-api.railway.app
```

Ganti dengan URL backend yang sudah di-deploy di Railway/Render

---

## Setup Database

### MySQL Setup untuk Production

#### 1. Create Database & User

```bash
# Login ke MySQL
mysql -u root -p

# Create database
CREATE DATABASE umkm_system;

# Create user dengan password strong
CREATE USER 'umkm_user'@'%' IDENTIFIED BY 'StrongPassword123!@#';

# Grant permissions
GRANT ALL PRIVILEGES ON umkm_system.* TO 'umkm_user'@'%';
FLUSH PRIVILEGES;

# Verify
SHOW GRANTS FOR 'umkm_user'@'%';
EXIT;
```

#### 2. Connection String Format

```
mysql://umkm_user:StrongPassword123!@#@localhost:3306/umkm_system
```

#### 3. Run Migrations

```bash
# Generate migration files
pnpm drizzle-kit generate

# Run migrations
pnpm drizzle-kit migrate
```

#### 4. Seed Data (Optional)

```bash
# Insert data dummy
node server/seed-db.mjs
```

### Railway MySQL Connection

Railway auto-generate connection string:

```
mysql://user:password@containers-us-west-123.railway.app:3306/railway
```

Copy langsung ke `DATABASE_URL` environment variable.

---

## Environment Variables

### Wajib (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host:3306/db` |
| `JWT_SECRET` | Secret key untuk auth (min 32 chars) | `your-super-secret-key-min-32-chars` |
| `NODE_ENV` | Environment (development/production) | `production` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_TITLE` | Judul aplikasi | `UMKM Store` |
| `VITE_APP_LOGO` | URL logo aplikasi | - |
| `PORT` | Port server | `3000` |

### Tidak Perlu untuk Railway

Variabel berikut hanya untuk Manus hosting (bisa abaikan):
- `VITE_APP_ID`
- `OAUTH_SERVER_URL`
- `VITE_OAUTH_PORTAL_URL`
- `BUILT_IN_FORGE_API_KEY`
- `BUILT_IN_FORGE_API_URL`

---

## Checklist Pre-Deployment

Sebelum deploy ke production:

- [ ] Database sudah setup dan accessible
- [ ] Environment variables sudah dikonfigurasi di Railway/Render
- [ ] Build berhasil tanpa error: `pnpm build`
- [ ] Testing lokal sudah dilakukan: `pnpm test`
- [ ] Git commits sudah di-push ke GitHub
- [ ] Database migrations sudah dijalankan
- [ ] Custom domain sudah dikonfigurasi (jika ada)
- [ ] Logs sudah di-check untuk errors

---

## Troubleshooting

### Build Error: "Cannot find module"

```bash
# Clear cache dan reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Database Connection Error

**Error:** `Error: connect ECONNREFUSED`

**Solusi:**
1. Verify `DATABASE_URL` format benar
2. Cek MySQL server running
3. Verify username/password correct
4. Cek firewall/network access

```bash
# Test connection
mysql -u user -p -h host -D database
```

### Port Already in Use

```bash
# Gunakan port berbeda
PORT=3001 pnpm start
```

### Deployment Stuck/Timeout

1. Check Railway/Render logs
2. Verify build command benar
3. Check disk space (Railway free tier limited)
4. Reduce build size (remove unused dependencies)

### Migrations Failed

```bash
# Check migration status
pnpm drizzle-kit migrate --verbose

# Rollback last migration
# (Manual: drop tables dan rerun)
```

### 502 Bad Gateway Error

1. Check server logs
2. Verify environment variables set correctly
3. Check database connection
4. Restart deployment

---

## Performance Tips

### 1. Database Optimization

```sql
-- Add indexes untuk frequently queried fields
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_order_user_id ON orders(user_id);
CREATE INDEX idx_order_created_at ON orders(created_at);
```

### 2. Caching Strategy

- Leverage browser caching (static assets)
- Implement Redis caching untuk frequently accessed data
- Cache database queries dengan TTL

### 3. Image Optimization

- Compress images sebelum upload
- Use WebP format jika possible
- Lazy load images di frontend

### 4. Code Optimization

- Tree-shake unused dependencies
- Minify CSS/JS di production
- Use CDN untuk static assets

---

## Security Checklist

- [ ] `JWT_SECRET` sudah strong (min 32 chars, mix of upper/lower/numbers/symbols)
- [ ] Database password sudah strong
- [ ] `.env` file tidak di-commit ke repository
- [ ] HTTPS enabled (auto di Railway/Render)
- [ ] CORS dikonfigurasi dengan benar
- [ ] Input validation di semua forms
- [ ] SQL injection protection (Drizzle ORM handles)
- [ ] Rate limiting implemented (optional)

---

## Monitoring & Logs

### Railway

1. Dashboard → Service → "Logs" tab
2. Real-time logs dari server
3. Filter by level (error, warning, info)
4. Export logs untuk analysis

### Render

1. Dashboard → Service → "Logs" tab
2. View deployment logs dan runtime logs
3. Search dan filter capabilities

### Common Log Patterns

```
[ERROR] Database connection failed
[WARN] Slow query detected
[INFO] Server started on port 3000
[ERROR] Unhandled promise rejection
```

---

## Scaling untuk Production

### Jika traffic tinggi:

1. **Upgrade Railway/Render plan** untuk lebih resources
2. **Add database replicas** untuk read scaling
3. **Implement caching layer** (Redis)
4. **Use CDN** untuk static assets (Cloudflare)
5. **Monitor performance** dengan APM tools

---

## Support & Resources

- **Railway Docs:** https://docs.railway.app
- **Render Docs:** https://render.com/docs
- **Drizzle ORM:** https://orm.drizzle.team
- **Express.js:** https://expressjs.com
- **MySQL:** https://dev.mysql.com/doc

---

## FAQ

**Q: Berapa biaya hosting di Railway?**
A: Free tier 500 jam/bulan, atau bayar sesuai usage (~$5/bulan untuk small project)

**Q: Apakah bisa pakai PostgreSQL?**
A: Ya, tinggal ganti `DATABASE_URL` dan update Drizzle config

**Q: Bagaimana cara backup database?**
A: Railway/Render provide automated backups. Manual backup via mysqldump

**Q: Bisa deploy multiple instances?**
A: Ya, Railway/Render support horizontal scaling

**Q: Bagaimana monitoring uptime?**
A: Gunakan UptimeRobot atau Pingdom untuk monitoring

---

**Last Updated:** April 2026
**Version:** 2.0.0
**Recommended Platform:** Railway
