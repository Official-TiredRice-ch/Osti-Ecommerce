/**
 * Add Sample Products to Database
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

const sampleProducts = [
  {
    name: 'Dell Laptop XPS 13',
    description: 'High-performance laptop with Intel i7 processor, 16GB RAM, 512GB SSD',
    price: 45999,
    stock: 15,
    category_id: 1
  },
  {
    name: 'HP Pavilion Gaming Laptop',
    description: 'Gaming laptop with NVIDIA GTX 1650, AMD Ryzen 5, 8GB RAM',
    price: 35999,
    stock: 20,
    category_id: 1
  },
  {
    name: 'Lenovo ThinkPad E14',
    description: 'Business laptop with Intel i5, 8GB RAM, 256GB SSD',
    price: 32999,
    stock: 10,
    category_id: 1
  },
  {
    name: 'Apple MacBook Air M2',
    description: 'Ultra-thin laptop with Apple M2 chip, 8GB RAM, 256GB SSD',
    price: 65999,
    stock: 8,
    category_id: 1
  },
  {
    name: 'Asus ROG Strix Gaming Laptop',
    description: 'High-end gaming laptop with RTX 3060, Intel i7, 16GB RAM',
    price: 75999,
    stock: 5,
    category_id: 1
  },
  {
    name: 'Samsung Galaxy S23',
    description: 'Flagship smartphone with Snapdragon 8 Gen 2, 8GB RAM, 256GB storage',
    price: 49999,
    stock: 25,
    category_id: 2
  },
  {
    name: 'iPhone 14 Pro',
    description: 'Premium smartphone with A16 Bionic chip, 128GB storage',
    price: 59999,
    stock: 12,
    category_id: 2
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Premium noise-cancelling wireless headphones',
    price: 15999,
    stock: 30,
    category_id: 3
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    description: 'Wireless ergonomic mouse for productivity',
    price: 4999,
    stock: 40,
    category_id: 3
  },
  {
    name: 'Samsung 27" 4K Monitor',
    description: '4K UHD monitor with HDR support, 60Hz refresh rate',
    price: 18999,
    stock: 15,
    category_id: 3
  }
];

async function addSampleProducts() {
  console.log('Adding sample products...\n');

  // First, ensure categories exist
  const categories = [
    { id: 1, name: 'Laptops', description: 'Laptops and notebooks' },
    { id: 2, name: 'Smartphones', description: 'Mobile phones and accessories' },
    { id: 3, name: 'Electronics', description: 'Electronic devices and accessories' }
  ];

  for (const category of categories) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)`,
        [category.id, category.name, category.description],
        (err) => {
          if (err) {
            console.error(`Error adding category ${category.name}:`, err.message);
            reject(err);
          } else {
            console.log(`✅ Category: ${category.name}`);
            resolve();
          }
        }
      );
    });
  }

  console.log('\n');

  // Add products
  for (const product of sampleProducts) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO products (name, description, price, stock, category_id, created_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`,
        [
          product.name,
          product.description,
          product.price,
          product.stock,
          product.category_id
        ],
        function(err) {
          if (err) {
            console.error(`Error adding ${product.name}:`, err.message);
            reject(err);
          } else {
            console.log(`✅ Added: ${product.name} (₱${product.price})`);
            resolve();
          }
        }
      );
    });
  }

  // Show summary
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) {
      console.error('Error counting products:', err.message);
    } else {
      console.log(`\n✅ Total products in database: ${row.count}`);
    }
    db.close();
  });
}

addSampleProducts().catch(err => {
  console.error('Error:', err);
  db.close();
});
