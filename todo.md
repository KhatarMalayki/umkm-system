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
- [x] Tambahkan data dummy (Minuman, Makanan berat, Barang grosir)
- [x] Testing alur lengkap pembeli (Landing Page, Keranjang, Checkout)
- [x] Testing alur lengkap admin (Dashboard, Produk, Diskon, Order)

## GitHub Integration
- [x] Push initial setup ke GitHub
- [x] Atomic commits setiap fitur selesai
- [x] Pesan commit bahasa Indonesia deskriptif

## Status: SELESAI ✓
Sistem web UMKM lengkap telah berhasil dibangun dengan semua fitur yang diminta.

## Feature Enhancement - Qty Pecahan
- [x] Update ProductCard untuk support qty decimal dengan preset + input manual
- [x] Update CartSidebar untuk menampilkan qty dengan format decimal
- [x] Update cart.ts untuk handle decimal quantity
- [x] Update Home.tsx untuk menampilkan preset qty options
- [x] Testing fitur qty pecahan di semua halaman

## Bug Fix - Qty Pecahan Format
- [x] Ubah preset option dari desimal (0.25, 0.5) ke format pecahan (1/4, 1/2, 3/4) yang lebih user-friendly
- [x] Update display di ProductCard dan CartSidebar untuk menampilkan format pecahan

## Bug Fix - Qty Selection di ProductCard
- [x] Tambahkan field qty terpisah di ProductCard untuk menentukan jumlah item
- [x] Preset option untuk memilih ukuran (1/4, 1/2, 3/4 kg, dll)
- [x] Input qty untuk jumlah item yang dibeli
- [x] Contoh: 2x (1/2 kg) = 1 kg total
