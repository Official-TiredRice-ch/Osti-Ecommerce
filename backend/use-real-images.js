/**
 * Use Real Product Images from Unsplash
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

// Using Unsplash for real product images (free to use)
const productImages = {
  'Dell Laptop XPS 13': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=300&fit=crop',
  'HP Pavilion Gaming Laptop': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop',
  'Lenovo ThinkPad E14': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop',
  'Apple MacBook Air M2': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
  'Asus ROG Strix Gaming Laptop': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop',
  'Samsung Galaxy S23': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop',
  'iPhone 14 Pro': 'https://images.unsplash.com/photo-1592286927505-4bfaa7e8a3ee?w=300&h=300&fit=crop',
  'Sony WH-1000XM5 Headphones': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop',
  'Logitech MX Master 3S Mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
  'Samsung 27" 4K Monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop',
};

async function updateImages() {
  console.log('Updating to real product images...\n');

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

  console.log('\n✅ All products now have real images!');
  db.close();
}

updateImages().catch(err => {
  console.error('Error:', err);
  db.close();
});
