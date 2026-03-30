/**
 * Update Product Images
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

const productImages = {
  'Dell Laptop XPS 13': 'https://via.placeholder.com/300x300/007AFF/FFFFFF?text=Dell+XPS+13',
  'HP Pavilion Gaming Laptop': 'https://via.placeholder.com/300x300/0096D6/FFFFFF?text=HP+Pavilion',
  'Lenovo ThinkPad E14': 'https://via.placeholder.com/300x300/E2231A/FFFFFF?text=Lenovo+ThinkPad',
  'Apple MacBook Air M2': 'https://via.placeholder.com/300x300/000000/FFFFFF?text=MacBook+Air',
  'Asus ROG Strix Gaming Laptop': 'https://via.placeholder.com/300x300/FF0000/FFFFFF?text=Asus+ROG',
  'Samsung Galaxy S23': 'https://via.placeholder.com/300x300/1428A0/FFFFFF?text=Galaxy+S23',
  'iPhone 14 Pro': 'https://via.placeholder.com/300x300/000000/FFFFFF?text=iPhone+14',
  'Sony WH-1000XM5 Headphones': 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Sony+WH1000XM5',
  'Logitech MX Master 3S Mouse': 'https://via.placeholder.com/300x300/00B8FC/FFFFFF?text=Logitech+MX',
  'Samsung 27" 4K Monitor': 'https://via.placeholder.com/300x300/1428A0/FFFFFF?text=Samsung+Monitor',
};

async function updateImages() {
  console.log('Updating product images...\n');

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

  console.log('\n✅ All product images updated!');
  db.close();
}

updateImages().catch(err => {
  console.error('Error:', err);
  db.close();
});
