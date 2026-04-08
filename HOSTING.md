# 🚀 Panduan Hosting & Deployment UMKM System

Dokumen ini menjelaskan cara hosting dan menjalankan sistem web UMKM Anda di berbagai platform.

---

## 📋 Daftar Isi

1. [Hosting dengan Manus (Rekomendasi)](#hosting-dengan-manus-rekomendasi)
2. [Hosting dengan Railway](#hosting-dengan-railway)
3. [Hosting dengan Render](#hosting-dengan-render)
4. [Hosting dengan Vercel + Backend Terpisah](#hosting-dengan-vercel--backend-terpisah)
5. [Setup Database](#setup-database)
6. [Environment Variables](#environment-variables)

---

## Hosting dengan Manus (Rekomendasi)

**Keuntungan:**
- ✅ Sudah terintegrasi dengan project ini
- ✅ Database MySQL included
- ✅ Custom domain support
- ✅ SSL/HTTPS otomatis
- ✅ Deployment dengan 1 klik
- ✅ Analytics dan monitoring built-in

### Cara Hosting di Manus:

1. **Publish Project**
   - Buka Management UI (klik tombol "Publish" di header)
   - Sistem akan membuat checkpoint otomatis
   - Klik "Publish" untuk deploy ke production

2. **Custom Domain**
   - Di Management UI → Settings → Domains
   - Tambahkan custom domain Anda (misal: umkm.com)
   - Ikuti instruksi DNS configuration
   - Domain akan aktif dalam beberapa menit

3. **Environment Variables**
   - Semua env variables sudah dikonfigurasi otomatis
   - Tidak perlu setup manual

4. **Database**
   - Database MySQL sudah tersedia
   - Akses via Management UI → Database panel
   - Connection info ada di Settings → Database

**URL Production:**
```
https://umkmweb-ikjggkq7.manus.space
```

---

## Hosting dengan Railway

**Keuntungan:**
- Mudah setup
- Free tier tersedia
- Database MySQL included
- GitHub integration

### Langkah-langkah:

1. **Persiapan Repository**
   ```bash
   cd /home/ubuntu/umkm-system
   git remote -v  # Pastikan remote sudah ke GitHub
   ```

2. **Buat Akun Railway**
   - Kunjungi https://railway.app
   - Sign up dengan GitHub

3. **Deploy Project**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository `umkm-system`
   - Railway akan auto-detect sebagai Node.js project

4. **Setup Environment Variables**
   - Di Railway Dashboard, buka project
   - Klik "Variables"
   - Tambahkan semua env dari `.env.example`:
     ```
     DATABASE_URL=mysql://user:password@host/dbname
     JWT_SECRET=your-secret-key
     VITE_APP_ID=your-app-id
     OAUTH_SERVER_URL=https://api.manus.im
     VITE_OAUTH_PORTAL_URL=https://portal.manus.im
     NODE_ENV=production
     ```

5. **Setup Database**
   - Di Railway, klik "New" → "MySQL"
   - Copy connection string ke `DATABASE_URL`

6. **Deploy**
   - Railway akan auto-deploy setiap kali push ke GitHub
   - Monitor di "Deployments" tab

**Build Command:**
```bash
pnpm install && pnpm build
```

**Start Command:**
```bash
pnpm start
```

---

## Hosting dengan Render

**Keuntunasi:**
- Free tier dengan 750 jam/bulan
- Auto-deploy dari GitHub
- Database PostgreSQL/MySQL

### Langkah-langkah:

1. **Buat Akun Render**
   - Kunjungi https://render.com
   - Sign up dengan GitHub

2. **Create New Web Service**
   - Dashboard → New → Web Service
   - Connect GitHub repository
   - Pilih branch: `main`

3. **Konfigurasi Build & Start**
   - **Name:** umkm-system
   - **Environment:** Node
   - **Build Command:**
     ```bash
     pnpm install && pnpm build
     ```
   - **Start Command:**
     ```bash
     pnpm start
     ```

4. **Environment Variables**
   - Di Render Dashboard, klik service
   - Environment → Add Environment Variable
   - Tambahkan semua env variables

5. **Database**
   - Render Dashboard → New → MySQL
   - Copy connection string ke `DATABASE_URL`

6. **Deploy**
   - Klik "Deploy"
   - Render akan build dan deploy otomatis

---

## Hosting dengan Vercel + Backend Terpisah

**Catatan:** Vercel hanya support frontend static/serverless. Backend harus di-host terpisah.

### Frontend di Vercel:

1. **Setup**
   ```bash
   cd /home/ubuntu/umkm-system/client
   pnpm install
   ```

2. **Deploy ke Vercel**
   - Kunjungi https://vercel.com
   - Import GitHub repository
   - Vercel auto-detect sebagai Vite project

3. **Build Settings**
   - **Framework:** Vite
   - **Build Command:** `pnpm build`
   - **Output Directory:** `dist`

### Backend di Railway/Render:

Ikuti langkah Railway atau Render di atas, tapi hanya deploy folder `server/`.

---

## Setup Database

### Untuk MySQL (Recommended):

1. **Local Development**
   ```bash
   # Install MySQL
   sudo apt-get install mysql-server

   # Login
   mysql -u root -p

   # Create database
   CREATE DATABASE umkm_system;
   CREATE USER 'umkm_user'@'localhost' IDENTIFIED BY 'password123';
   GRANT ALL PRIVILEGES ON umkm_system.* TO 'umkm_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Connection String**
   ```
   DATABASE_URL=mysql://umkm_user:password123@localhost:3306/umkm_system
   ```

3. **Run Migrations**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

### Untuk Production (Cloud):

**Railway MySQL:**
```
DATABASE_URL=mysql://user:password@containers-us-west-123.railway.app:3306/railway
```

**Render MySQL:**
```
DATABASE_URL=mysql://user:password@dpg-xxx.render.com:3306/dbname
```

---

## Environment Variables

Semua environment variables yang diperlukan:

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/dbname

# Authentication
JWT_SECRET=your-super-secret-key-min-32-chars
VITE_APP_ID=your-manus-app-id

# OAuth
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# App Settings
VITE_APP_TITLE=UMKM Store
VITE_APP_LOGO=https://your-logo-url.png

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# Node Environment
NODE_ENV=production
```

---

## Checklist Pre-Deployment

Sebelum deploy ke production, pastikan:

- [ ] Semua environment variables sudah dikonfigurasi
- [ ] Database sudah setup dan accessible
- [ ] Migrations sudah dijalankan (`pnpm drizzle-kit migrate`)
- [ ] Build berhasil tanpa error (`pnpm build`)
- [ ] Testing lokal sudah dilakukan (`pnpm test`)
- [ ] Git commits sudah di-push ke GitHub
- [ ] Custom domain sudah dikonfigurasi (jika ada)

---

## Troubleshooting

### Build Error: "Cannot find module"
```bash
# Clear cache dan reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Database Connection Error
```bash
# Cek connection string
echo $DATABASE_URL

# Test koneksi
mysql -u user -p -h host -D dbname
```

### Port Already in Use
```bash
# Gunakan port berbeda
PORT=3001 pnpm dev
```

### Deployment Stuck
- Cek logs di hosting platform
- Pastikan build command benar
- Verify environment variables sudah set

---

## Support & Resources

- **Manus Docs:** https://docs.manus.im
- **Railway Docs:** https://docs.railway.app
- **Render Docs:** https://render.com/docs
- **Drizzle ORM:** https://orm.drizzle.team

---

**Last Updated:** April 2026
**Version:** 1.0.0
