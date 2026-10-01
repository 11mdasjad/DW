import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://DwellMart:DwellMart123456@cluster0.fg2wgjg.mongodb.net/DwellMart';

const RETAIL_BANNERS = [
  {
    title: 'Festive Retail Collection',
    subtitle: 'Up to 60% OFF on Top Brands & Designer Wear',
    description: 'Explore the latest fashion, ethnic wear, and premium apparel on Dwell Mart Retail.',
    image: '/assets/hero/slide1.png',
    link: '/retail',
    type: 'retail',
    order: 1,
    isActive: true,
  },
  {
    title: 'Next-Gen Electronics & Mobiles',
    subtitle: 'Latest Smartphones, Laptops & Smart Audio Gear',
    description: 'Get verified warranty and express doorstep delivery across all electronics.',
    image: '/assets/hero/slide2.png',
    link: '/retail',
    type: 'retail',
    order: 2,
    isActive: true,
  },
  {
    title: 'Designer Footwear & Lifestyle',
    subtitle: 'Premium Footwear for Men, Women & Kids',
    description: 'Step up your style with sneakers, formal footwear, and athletic gear.',
    image: '/assets/hero/slide3.png',
    link: '/retail',
    type: 'retail',
    order: 3,
    isActive: true,
  },
  {
    title: 'Elevate Your Home & Living',
    subtitle: 'Cookware, Smart Appliances & Elegant Home Decor',
    description: 'Modern essentials and stylish home decor delivered directly to your doorstep.',
    image: '/assets/hero/slide4.png',
    link: '/retail',
    type: 'retail',
    order: 4,
    isActive: true,
  },
];

const WHOLESALE_BANNERS = [
  {
    title: 'Direct Factory Wholesale Sourcing',
    subtitle: 'Connect directly with verified Indian manufacturers & distributors. Enjoy automatic volume pricing tiers.',
    description: 'Pallet and carton lots with automated tier discounts and official GST invoices.',
    image: '/assets/wholesale/factory_banner.jpg',
    link: '/wholesale',
    type: 'wholesale',
    order: 1,
    isActive: true,
  },
  {
    title: 'Apparel, Fabrics & Garments Hub',
    subtitle: 'Direct mill inventory & tiered wholesale volume slabs for bulk buyers, retailers, and boutique owners.',
    description: 'Source premium cotton, fabrics, and ready-to-wear apparel in bulk.',
    image: '/assets/wholesale/textiles_banner.jpg',
    link: '/wholesale',
    type: 'wholesale',
    order: 2,
    isActive: true,
  },
  {
    title: 'Industrial Tools, Hardware & Tech',
    subtitle: 'Heavy-duty machinery, precision components, tools & wholesale electronics with full GST ITC invoices.',
    description: 'Certified industrial equipment, electricals, and precision tools with fast freight.',
    image: '/assets/wholesale/electronics_banner.jpg',
    link: '/wholesale',
    type: 'wholesale',
    order: 3,
    isActive: true,
  },
];

async function seedBanners() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    const bannersCollection = db.collection('banners');

    console.log('Seeding Retail Banners...');
    for (const b of RETAIL_BANNERS) {
      await bannersCollection.updateOne(
        { title: b.title, type: b.type },
        { $set: b },
        { upsert: true }
      );
      console.log(`Upserted Retail Banner: "${b.title}"`);
    }

    console.log('Seeding Wholesale Banners...');
    for (const b of WHOLESALE_BANNERS) {
      await bannersCollection.updateOne(
        { title: b.title, type: b.type },
        { $set: b },
        { upsert: true }
      );
      console.log(`Upserted Wholesale Banner: "${b.title}"`);
    }

    const countRetail = await bannersCollection.countDocuments({ type: 'retail' });
    const countWholesale = await bannersCollection.countDocuments({ type: 'wholesale' });
    console.log(`\nSuccess! Current counts in DB -> Retail: ${countRetail}, Wholesale: ${countWholesale}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding banners:', err);
    process.exit(1);
  }
}

seedBanners();
