import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';

dotenv.config();
const MONGO_URI = 'mongodb://db_admin:secure_dev_password_123@mongodb:27017/mv-jewelers?authSource=admin';

const seedProducts = [
  {
    productCode: "CART-LOVE-01",
    name: "Cartier Love Bracelet",
    description: "An iconic symbol of love that transgresses convention. Features 18K yellow gold set with 4 brilliant-cut diamonds. Minimum rigid structure designed perfectly for pairing with elegant evening wear.",
    basePricePerDay: 4000,
    securityDeposit: 25000,
    category: "Bracelets",
    metalType: "18K Gold",
    quantityAvailable: 2,
    imageUrls: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
  },
  {
    productCode: "TIFF-ENG-02",
    name: "Tiffany Setting Engagement Ring",
    description: "The ring that has been a symbol of the world's greatest love stories. Masterfully crafted platinum band holding a brilliant round 2-carat diamond.",
    basePricePerDay: 8500,
    securityDeposit: 50000,
    category: "Rings",
    metalType: "Platinum",
    quantityAvailable: 1,
    imageUrls: ["https://images.unsplash.com/photo-1605100804763-247f67b2548e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
  },
  {
    productCode: "VCA-ALH-03",
    name: "Van Cleef Vintage Alhambra Necklace",
    description: "Faithful to the very first Alhambra jewel created in 1968, the Vintage Alhambra creations by Van Cleef & Arpels are distinguished by their unique, timeless elegance.",
    basePricePerDay: 2500,
    securityDeposit: 15000,
    category: "Necklaces",
    metalType: "18K Gold",
    quantityAvailable: 3,
    imageUrls: ["https://images.unsplash.com/photo-1599643478514-4a5202334f66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
  },
  {
    productCode: "RLX-SUB-04",
    name: "Rolex Submariner Date",
    description: "The archetype of the diver's watch. Oystersteel case and bracelet matching a striking black dial. Perfect for distinguished formal outings.",
    basePricePerDay: 12000,
    securityDeposit: 80000,
    category: "Watches",
    metalType: "Steel",
    quantityAvailable: 1,
    imageUrls: ["https://plus.unsplash.com/premium_photo-1673356302067-aac3b545a362?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
  },
  {
    productCode: "BVLG-SERP-05",
    name: "Bvlgari Serpenti Viper Ring",
    description: "An ultra-modern interpretation of Bvlgari’s celebrated icon of glamour and seduction, the Serpenti Viper enchants with its innovative and cutting-edge design.",
    basePricePerDay: 3500,
    securityDeposit: 18000,
    category: "Rings",
    metalType: "Rose Gold",
    quantityAvailable: 2,
    imageUrls: ["https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
  },
  {
    productCode: "CHOP-HAP-06",
    name: "Chopard Happy Diamonds Earrings",
    description: "At the very heart of Chopard's women's jewelry collection, the Happy Diamonds line is as original as it is timeless. 18-carat white gold and moving diamonds.",
    basePricePerDay: 3000,
    securityDeposit: 20000,
    category: "Earrings",
    metalType: "Silver",
    quantityAvailable: 0, 
    imageUrls: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
  },
  {
    productCode: "KUNDAN-GLM-07",
    name: "Navaratna Kundan Choker Set",
    description: "A breathtaking bridal masterpiece featuring semi-precious stones and intricate Kundan handiwork. Perfect for the main wedding ceremony.",
    basePricePerDay: 5500,
    securityDeposit: 15000,
    category: "Bridal",
    metalType: "Gold Plated",
    quantityAvailable: 1,
    imageUrls: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
  },
  {
    productCode: "GROOM-MALA-08",
    name: "Royal Emerald Heritage Mala",
    description: "A multi-layered emerald bead necklace designed exclusively for the modern groom's Sherwani. Radiates regal sophistication.",
    basePricePerDay: 4500,
    securityDeposit: 12000,
    category: "Groom",
    metalType: "Emerald Beads",
    quantityAvailable: 2,
    imageUrls: ["https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
  },
  {
    productCode: "SANG-SET-09",
    name: "Rose Gold Diamond Drop Set",
    description: "Lightweight and sparkling, this set is designed for high-movement events like the Sangeet or Mehendi. Modern chic meets traditional grace.",
    basePricePerDay: 3800,
    securityDeposit: 10000,
    category: "Sangeet",
    metalType: "Rose Gold",
    quantityAvailable: 3,
    imageUrls: ["https://images.unsplash.com/photo-1635767798638-3e25273a8236?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for Seeding...");
    await Product.deleteMany({});
    console.log("Cleared existing mock products.");
    await Product.insertMany(seedProducts);
    console.log("Successfully seeded 6 luxury products!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed database:", err);
    process.exit(1);
  }
};

seedDB();
