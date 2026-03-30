/**
 * Fix Product Image URLs - Use more reliable service
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

// Using placehold.co which is more reliable than via.placeholder.com
const productImages = {
  'Dell Laptop XPS 13': 'https://placehold.co/300x300/007AFF/FFFFFF/png?text=Dell+XPS+13',
  'HP Pavilion Gaming Laptop': 'https://placehold.co/300x300/0096D6/FFFFFF/png?text=HP+Pavilion',
  'Lenovo ThinkPad E14': 'https://placehold.co/300x300/E2231A/FFFFFF/png?text=Lenovo+ThinkPad',
  'Apple MacBook Air M2': 'https://placehold.co/300x300/000000/FFFFFF/png?text=MacBook+Air',
  'Asus ROG Strix Gaming Laptop': 'https://placehold.co/300x300/FF0000/FFFFFF/png?text=Asus+ROG',
  'Samsung Galaxy S23': 'https://placehold.co/300x300/1428A0/FFFFFF/png?text=Galaxy+S23',
  'iPhone 14 Pro': 'https://placehold.co/300x300/000000/FFFFFF/png?text=iPhone+14',
  'Sony WH-1000XM5 Headphones': 'https://placehold.co/300x300/000000/FFFFFF/png?text=Sony+WH1000XM5',
  'Logitech MX Master 3S Mouse': 'https://placehold.co/300x300/00B8FC/FFFFFF/png?text=Logitech+MX',
  'Samsung 27" 4K Monitor': 'https://placehold.co/300x300/1428A0/FFFFFF/png?text=Samsung+Monitor',
};

async function updateImages() {
  console.log('Fixing product image URLs...\n');

  for (const [name, imageUrl] of Object.entries(productImages)) {
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE products SET image_url = ? WHERE name = ?`,
        [imageUrl, name],
        function(err) {
          if (err) {
            console.error(`❌ Error updating ${name}:`, err.message);
            reject(err);
          } else {
            console.log(`✅ Updated: ${name}`);
            resolve();
          }
        }
      );
    });
  }

  console.log('\n✅ All product images fixed!');
  db.close();
}

updateImages().catch(err => {
  console.error('Error:', err);
  db.close();
});
