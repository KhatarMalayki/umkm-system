# UMKM Web System - TODO

## Database & Backend
- [x] Setup schema database (produk, order, diskon, user)
- [x] Implementasi query helpers di server/db.ts
- [x] Implementasi tRPC procedures untuk produk, order, diskon

## Landing Page
- [x] Desain dan layout Landing Page
- [x] Implementasi katalog produk dengan filter dan search
- [x] Fitur keranjang belanja (add/remove/update quantity)
- [x] Integrasi keranjang dengan localStorage

## Checkout & Invoice
- [x] Halaman checkout dengan form pembeli
- [x] Implementasi metode pembayaran (COD/Transfer)
- [x] Halaman invoice/tagihan
- [ ] Fitur print dan download invoice (partial - print tersedia)

## Admin Panel
- [x] Dashboard admin dengan ringkasan order dan produk
- [x] Manajemen produk CRUD (create, read, update, delete)
- [ ] Upload gambar produk (URL based)
- [x] Sistem diskon produk
- [x] Manajemen order/tagihan masuk dengan status pembayaran

## Data & Testing
- [ ] Tambahkan data dummy (Minuman, Makanan berat, Barang grosir)
- [ ] Testing alur lengkap pembeli
- [ ] Testing alur lengkap admin

## GitHub Integration
- [ ] Push initial setup ke GitHub
- [ ] Atomic commits setiap fitur selesai
- [ ] Pesan commit bahasa Indonesia deskriptif
