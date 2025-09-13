import pool from './db.js';
import slugify from 'slugify';

const products = [
  { id: 1, name: 'American Broken Rice - 50kg', image_url: '/images/products/AmericanRice.jpg', price: 2500, categorie: 'rice', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 2, name: '5L Oil', image_url: '/images/products/oil2.jpeg', price: 2500, categorie: 'oil', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 3, name: '5L Palm Oil', image_url: '/images/products/palm-oil.png', price: 2500, categorie: 'oil', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 4, name: '5L Palm Oils', image_url: '/images/products/oil-2.jpeg', price: 2500, categorie: 'oil', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 5, name: '5Litr Palm Oil', image_url: '/images/products/veg-oil-5l.jpeg', price: 2500, categorie: 'oil', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 6, name: '5Litter Palm Oil', image_url: '/images/products/veg-oil-25l.jpeg', price: 2500, categorie: 'oil', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 2, name: '1Litr Vinaigre', image_url: '/images/products/vinaigre.jpeg', price: 2500, categorie: 'mix', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 8, name: 'American Broken Rice - 25kg', image_url: '/images/products/american-rice.jpeg', price: 1200, categorie: 'rice', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 9, name: 'Sadam Rice - 50kg', image_url: '/images/products/sadam-rice.jpeg', price: 2500, categorie: 'rice', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 10, name: '50kg Sadam Rice-1', image_url: '/images/products/armanti-5l.jpeg', price: 2500, categorie: 'mayonnaises', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 11, name: '50kg Sadam Rice-2', image_url: '/images/products/armanti-500ml.jpeg', price: 2500, categorie: 'mayonnaises', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 12, name: '50kg Sadam Rice-3', image_url: '/images/products/armanti.png', price: 2500, categorie: 'mayonnaises', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 13, name: '1Litr Vinaigre', image_url: '/images/products/bag-potatoes.jpeg', price: 2500, categorie: 'mix', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 14, name: '25kg Onion', image_url: '/images/products/onion-bg.png', price: 2500, categorie: 'mix', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 15, name: 'Lido Couscous mayen - 1kg', image_url: '/images/products/lido-coucous.jpg', price: 1.85, categorie: 'mix', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 16, name: 'Lido Couscous mayen - 500g', image_url: '/images/products/lido-coucous.jpg', price: 1.25, categorie: 'mix', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: false },
  { id: 17, name: 'Lido Basmatic Rice - 5kg', image_url: '/images/products/Lido_Basmati_Rice.jpg', price: 13.5, categorie: 'rice', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 18, name: 'Lido Basmatic Rice - 1kg', image_url: '/images/products/Lido_Basmati_Rice.jpg', price: 2.7, categorie: 'rice', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: false },
  { id: 19, name: 'Tilda Broken Basmatic Rice - 20kg', image_url: '/images/products/tilda-basmatic–20kg.jpg', price: 2.7, categorie: 'rice', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 20, name: 'Fresh Potato - 1kg', image_url: '/images/products/potatoe-1kg.jpeg', price: 2.25, categorie: 'mix', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: true },
  { id: 21, name: 'Lido Couscous mayen - 500g', image_url: '/images/products/lido-coucous.jpg', price: 1.25, categorie: 'mix', description: "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.", instock: false }
];

const seedProducts = async () => {
  try {
    for (const product of products) {
      if (!product.name) continue;
      const slug = slugify(String(product.name), { lower: true, strict: true });

      await pool.query(
        `INSERT INTO products (id, name, slug, image_url, price, categorie, description, instock)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (slug) DO NOTHING
         `,
        [
          product.id,
          product.name,
          slug,
          product.image_url,
          product.price,
          product.categorie,
          product.description,
          product.instock
        ]
      );
    }
    console.log('Products inserted successfully, with slug');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedProducts();
