const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

const diverseProducts = [
  // Home & Garden (category_id: 4)
  {
    name: 'Modern Sofa Set',
    description: '3-seater comfortable sofa with premium fabric',
    price: 25999,
    stock: 8,
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop'
  },
  {
    name: 'Wooden Dining Table',
    description: '6-seater solid wood dining table',
    price: 18999,
    stock: 5,
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&h=300&fit=crop'
  },
  {
    name: 'Indoor Plant Collection',
    description: 'Set of 5 decorative indoor plants',
    price: 2999,
    stock: 20,
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=300&h=300&fit=crop'
  },
  {
    name: 'LED Floor Lamp',
    description: 'Modern adjustable LED floor lamp',
    price: 3499,
    stock: 15,
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop'
  },

  // Fashion (category_id: 5)
  {
    name: 'Denim Jacket',
    description: 'Classic blue denim jacket for men',
    price: 1999,
    stock: 30,
    category_id: 5,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop'
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable athletic running shoes',
    price: 3999,
    stock: 25,
    category_id: 5,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop'
  },
  {
    name: 'Leather Handbag',
    description: 'Premium leather handbag for women',
    price: 4999,
    stock: 12,
    category_id: 5,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop'
  },
  {
    name: 'Sunglasses',
    description: 'UV protection polarized sunglasses',
    price: 1499,
    stock: 40,
    category_id: 5,
    image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop'
  },

  // Sports & Outdoors (category_id: 6)
  {
    name: 'Yoga Mat',
    description: 'Non-slip exercise yoga mat with carrying strap',
    price: 899,
    stock: 50,
    category_id: 6,
    image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop'
  },
  {
    name: 'Dumbbell Set',
    description: 'Adjustable dumbbell set 5-25kg',
    price: 5999,
    stock: 15,
    category_id: 6,
    image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop'
  },
  {
    name: 'Camping Tent',
    description: '4-person waterproof camping tent',
    price: 7999,
    stock: 10,
    category_id: 6,
    image_url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=300&h=300&fit=crop'
  },
  {
    name: 'Basketball',
    description: 'Official size basketball for outdoor play',
    price: 1299,
    stock: 35,
    category_id: 6,
    image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=300&fit=crop'
  },

  // Books (category_id: 7)
  {
    name: 'Programming Book Set',
    description: 'Complete guide to modern web development',
    price: 2499,
    stock: 20,
    category_id: 7,
    image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=300&fit=crop'
  },
  {
    name: 'Fiction Novel Collection',
    description: 'Bestselling fiction novels bundle',
    price: 1999,
    stock: 25,
    category_id: 7,
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop'
  },
  {
    name: 'Cookbook',
    description: 'Healthy recipes cookbook with 200+ recipes',
    price: 899,
    stock: 30,
    category_id: 7,
    image_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=300&fit=crop'
  },
  {
    name: 'Self-Help Book',
    description: 'Personal development and motivation guide',
    price: 699,
    stock: 40,
    category_id: 7,
    image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop'
  },

  // Beauty & Health (category_id: 8)
  {
    name: 'Skincare Set',
    description: 'Complete skincare routine set with cleanser, toner, moisturizer',
    price: 3999,
    stock: 18,
    category_id: 8,
    image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop'
  },
  {
    name: 'Hair Dryer',
    description: 'Professional ionic hair dryer with diffuser',
    price: 2499,
    stock: 22,
    category_id: 8,
    image_url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=300&h=300&fit=crop'
  },
  {
    name: 'Perfume Set',
    description: 'Luxury perfume collection for men and women',
    price: 4999,
    stock: 15,
    category_id: 8,
    image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop'
  },
  {
    name: 'Fitness Tracker',
    description: 'Smart fitness band with heart rate monitor',
    price: 2999,
    stock: 28,
    category_id: 8,
    image_url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop'
  }
];

console.log('🚀 Adding diverse products to database...\n');

// First, let's check and create categories if they don't exist
const categories = [
  { id: 4, name: 'Home & Garden', description: 'Furniture, decor, and garden items' },
  { id: 5, name: 'Fashion', description: 'Clothing, shoes, and accessories' },
  { id: 6, name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },
  { id: 7, name: 'Books', description: 'Books and educational materials' },
  { id: 8, name: 'Beauty & Health', description: 'Beauty products and health items' }
];

db.serialize(() => {
  // Insert categories
  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (id, name, description)
    VALUES (?, ?, ?)
  `);

  categories.forEach(cat => {
    insertCategory.run(cat.id, cat.name, cat.description);
  });
  insertCategory.finalize();

  console.log('✅ Categories created/verified\n');

  // Insert products
  const insertProduct = db.prepare(`
    INSERT INTO products (name, description, price, stock, category_id, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  let count = 0;
  diverseProducts.forEach(product => {
    insertProduct.run(
      product.name,
      product.description,
      product.price,
      product.stock,
      product.category_id,
      product.image_url,
      function(err) {
        if (err) {
          console.error(`❌ Error adding ${product.name}:`, err.message);
        } else {
          count++;
          console.log(`✅ Added: ${product.name} (${categories.find(c => c.id === product.category_id)?.name})`);
        }
      }
    );
  });

  insertProduct.finalize(() => {
    console.log(`\n🎉 Successfully added ${count} diverse products!`);
    
    // Show summary
    db.all(`
      SELECT c.name as category, COUNT(p.id) as count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name
      ORDER BY c.id
    `, [], (err, rows) => {
      if (!err) {
        console.log('\n📊 Products by category:');
        rows.forEach(row => {
          console.log(`   ${row.category}: ${row.count} products`);
        });
      }
      db.close();
    });
  });
});
