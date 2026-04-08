import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Data dummy produk
const products = [
  // Minuman
  {
    name: 'Air Mineral 1.5L',
    description: 'Air mineral murni berkualitas tinggi',
    price: 5000,
    unit: 'Botol',
    stock: 100,
    category: 'Minuman',
    imageUrl: 'https://via.placeholder.com/300x300?text=Air+Mineral'
  },
  {
    name: 'Jus Jeruk Segar',
    description: 'Jus jeruk asli tanpa pengawet',
    price: 15000,
    unit: 'Liter',
    stock: 50,
    category: 'Minuman',
    imageUrl: 'https://via.placeholder.com/300x300?text=Jus+Jeruk'
  },
  {
    name: 'Teh Celup Premium',
    description: 'Teh pilihan dengan aroma yang kuat',
    price: 25000,
    unit: 'Box',
    stock: 30,
    category: 'Minuman',
    imageUrl: 'https://via.placeholder.com/300x300?text=Teh+Celup'
  },
  {
    name: 'Kopi Arabika Bubuk',
    description: 'Kopi arabika pilihan dari Aceh',
    price: 35000,
    unit: 'Kg',
    stock: 20,
    category: 'Minuman',
    imageUrl: 'https://via.placeholder.com/300x300?text=Kopi+Arabika'
  },

  // Makanan Berat
  {
    name: 'Nasi Goreng Paket',
    description: 'Nasi goreng spesial dengan lauk lengkap',
    price: 25000,
    unit: 'Pcs',
    stock: 40,
    category: 'Makanan Berat',
    imageUrl: 'https://via.placeholder.com/300x300?text=Nasi+Goreng'
  },
  {
    name: 'Mie Ayam Kuah',
    description: 'Mie ayam dengan kuah kaldu yang gurih',
    price: 20000,
    unit: 'Pcs',
    stock: 60,
    category: 'Makanan Berat',
    imageUrl: 'https://via.placeholder.com/300x300?text=Mie+Ayam'
  },
  {
    name: 'Soto Ayam Tradisional',
    description: 'Soto ayam dengan resep tradisional',
    price: 22000,
    unit: 'Pcs',
    stock: 35,
    category: 'Makanan Berat',
    imageUrl: 'https://via.placeholder.com/300x300?text=Soto+Ayam'
  },
  {
    name: 'Gado-gado Lengkap',
    description: 'Gado-gado dengan bumbu kacang kental',
    price: 18000,
    unit: 'Pcs',
    stock: 50,
    category: 'Makanan Berat',
    imageUrl: 'https://via.placeholder.com/300x300?text=Gado-gado'
  },

  // Barang Grosir
  {
    name: 'Telur Ayam 1 Lusin',
    description: 'Telur ayam segar berkualitas',
    price: 28000,
    unit: 'Lusin',
    stock: 80,
    category: 'Barang Grosir',
    imageUrl: 'https://via.placeholder.com/300x300?text=Telur+Ayam'
  },
  {
    name: 'Minyak Goreng 2L',
    description: 'Minyak goreng berkualitas premium',
    price: 32000,
    unit: 'Botol',
    stock: 45,
    category: 'Barang Grosir',
    imageUrl: 'https://via.placeholder.com/300x300?text=Minyak+Goreng'
  },
  {
    name: 'Gula Pasir 1 Kg',
    description: 'Gula pasir putih berkualitas tinggi',
    price: 12000,
    unit: 'Kg',
    stock: 100,
    category: 'Barang Grosir',
    imageUrl: 'https://via.placeholder.com/300x300?text=Gula+Pasir'
  },
  {
    name: 'Tepung Terigu 1 Kg',
    description: 'Tepung terigu untuk berbagai kebutuhan',
    price: 10000,
    unit: 'Kg',
    stock: 70,
    category: 'Barang Grosir',
    imageUrl: 'https://via.placeholder.com/300x300?text=Tepung+Terigu'
  },
];

// Insert products
console.log('Inserting products...');
for (const product of products) {
  await connection.execute(
    'INSERT INTO products (name, description, price, unit, stock, imageUrl, category, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [product.name, product.description, product.price, product.unit, product.stock, product.imageUrl, product.category]
  );
}

// Get inserted product IDs
const [rows] = await connection.execute('SELECT id FROM products LIMIT 12');
const productIds = rows.map(r => r.id);

// Data dummy diskon
const discounts = [
  {
    productId: productIds[0],
    discountType: 'percentage',
    discountValue: 10,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 hari ke depan
    isActive: 1
  },
  {
    productId: productIds[4],
    discountType: 'fixed',
    discountValue: 5000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: 1
  },
  {
    productId: productIds[8],
    discountType: 'percentage',
    discountValue: 15,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: 1
  },
];

// Insert discounts
console.log('Inserting discounts...');
for (const discount of discounts) {
  await connection.execute(
    'INSERT INTO discounts (productId, discountType, discountValue, startDate, endDate, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [discount.productId, discount.discountType, discount.discountValue, discount.startDate, discount.endDate, discount.isActive]
  );
}

console.log('✓ Data dummy berhasil ditambahkan!');
await connection.end();
