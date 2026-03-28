import { prisma } from "../src/db/db.js";

async function main() {
  console.log("Wiping database and resetting IDs...");

  // 1. WIPE DATABASE AND RESET IDs
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "User", "Category", "Brand", "Seller", "Product", "ProductImage", "Cart", "CartItem", "Order", "OrderItem", "Wishlist", "WishlistItem" RESTART IDENTITY CASCADE;
  `);

  console.log("Seeding Categories...");
  
  // 2. ROOT CATEGORIES
  const electronics = await prisma.category.create({ data: { name: "Electronics" } });
  const fashion = await prisma.category.create({ data: { name: "Fashion" } });

  // 3. SUBCATEGORIES
  const mobiles = await prisma.category.create({ data: { name: "Mobiles", parentId: electronics.id } });
  const laptops = await prisma.category.create({ data: { name: "Laptops", parentId: electronics.id } });
  const audio = await prisma.category.create({ data: { name: "Audio", parentId: electronics.id } });
  const shoes = await prisma.category.create({ data: { name: "Shoes", parentId: fashion.id } });
  const clothing = await prisma.category.create({ data: { name: "Clothing", parentId: fashion.id } });

  console.log("Seeding Brands & Sellers...");

  // 4. BRANDS
  const apple = await prisma.brand.create({ data: { name: "Apple" } });
  const samsung = await prisma.brand.create({ data: { name: "Samsung" } });
  const sony = await prisma.brand.create({ data: { name: "Sony" } });
  const nike = await prisma.brand.create({ data: { name: "Nike" } });
  const levis = await prisma.brand.create({ data: { name: "Levi's" } });

  // 5. SELLERS
  const appario = await prisma.seller.create({ data: { name: "Appario Retail", email: "contact@appario.com" } });
  const cloudtail = await prisma.seller.create({ data: { name: "Cloudtail India", email: "support@cloudtail.com" } });
  const superKicks = await prisma.seller.create({ data: { name: "SuperKicks Official", email: "sales@superkicks.com" } });

  console.log("Seeding Products (This might take a second)...");

  // 6. PRODUCTS (12 Diverse Items)
  
  // --- MOBILES ---
  await prisma.product.create({
    data: {
      name: "Apple iPhone 15 Pro (256 GB) - Natural Titanium",
      description: "Forged in titanium and featuring the groundbreaking A17 Pro chip. Pro camera system with 7 next-generation lenses.",
      price: 144900.00, discountedPrice: 137990.00, discountPercent: 5, stock: 45,
      isFeatured: true, averageRating: 4.8, popularityScore: 99,
      categoryId: mobiles.id, brandId: apple.id, sellerId: appario.id,
      images: { create: [
        { imageUrl: "https://m.media-amazon.com/images/I/81c50PU+lpL._SX679_.jpg", isPrimary: true },
        { imageUrl: "https://m.media-amazon.com/images/I/71hqONoN44L._SX679_.jpg", isPrimary: false }
      ]}
    }
  });

  await prisma.product.create({
    data: {
      name: "Samsung Galaxy S24 Ultra 5G AI Smartphone",
      description: "Meet the new Galaxy S24 Ultra with Galaxy AI. Titanium exterior and a 6.8-inch flat display. Built-in S Pen.",
      price: 129999.00, discountedPrice: 129999.00, discountPercent: 0, stock: 30,
      isFeatured: true, averageRating: 4.7, popularityScore: 95,
      categoryId: mobiles.id, brandId: samsung.id, sellerId: appario.id,
      images: { create: [
        { imageUrl: "https://m.media-amazon.com/images/I/71CXhVhpM0L._SX679_.jpg", isPrimary: true }
      ]}
    }
  });

  // --- LAPTOPS ---
  await prisma.product.create({
    data: {
      name: "Apple MacBook Air Laptop M3 chip",
      description: "13.6-inch Liquid Retina display, 8GB RAM, 256GB SSD storage, Backlit Keyboard, 1080p FaceTime HD Camera.",
      price: 114900.00, discountedPrice: 104990.00, discountPercent: 9, stock: 20,
      isFeatured: false, averageRating: 4.9, popularityScore: 92,
      categoryId: laptops.id, brandId: apple.id, sellerId: appario.id,
      images: { create: [
        { imageUrl: "https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg", isPrimary: true }
      ]}
    }
  });

  // --- AUDIO ---
  await prisma.product.create({
    data: {
      name: "Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones",
      description: "Industry Leading Noise Cancellation, 30Hrs Battery Life, Over Ear Style optimized for Alexa and Google Assistant.",
      price: 34990.00, discountedPrice: 26990.00, discountPercent: 23, stock: 100,
      isFeatured: true, averageRating: 4.6, popularityScore: 88,
      categoryId: audio.id, brandId: sony.id, sellerId: cloudtail.id,
      images: { create: [
        { imageUrl: "https://m.media-amazon.com/images/I/61vJtKbAssL._SX679_.jpg", isPrimary: true }
      ]}
    }
  });

  await prisma.product.create({
    data: {
      name: "Apple AirPods Pro (2nd Generation)",
      description: "Active Noise Cancellation, Transparency mode, and Personalized Spatial Audio. USB-C Charging Case.",
      price: 24900.00, discountedPrice: 18999.00, discountPercent: 24, stock: 150,
      isFeatured: false, averageRating: 4.7, popularityScore: 96, // Highly trending!
      categoryId: audio.id, brandId: apple.id, sellerId: appario.id,
      images: { create: [
        { imageUrl: "https://m.media-amazon.com/images/I/61SUj2aKoEL._SX679_.jpg", isPrimary: true }
      ]}
    }
  });

  await prisma.product.create({
    data: {
      name: "Sony MDR-ZX110 Wired On-Ear Headphones",
      description: "30mm dynamic drivers, tangle-free cable. Great cheap option for basic listening.",
      price: 1390.00, discountedPrice: 999.00, discountPercent: 28, stock: 300,
      isFeatured: false, averageRating: 3.8, popularityScore: 40,
      categoryId: audio.id, brandId: sony.id, sellerId: cloudtail.id,
      images: { create: [
        { imageUrl: "https://m.media-amazon.com/images/I/41s1rL2EhmL._SX679_.jpg", isPrimary: true }
      ]}
    }
  });

  // --- FASHION: SHOES ---
  await prisma.product.create({
    data: {
      name: "Nike Men's Revolution 6 Running Shoe",
      description: "Comfortable, breathable running shoes perfect for daily workouts and casual wear.",
      price: 3695.00, discountedPrice: 2586.00, discountPercent: 30, stock: 60,
      isFeatured: true, averageRating: 4.2, popularityScore: 85,
      categoryId: shoes.id, brandId: nike.id, sellerId: superKicks.id,
      images: { create: [
        { imageUrl: "https://m.media-amazon.com/images/I/71p0A12kCGL._SY695_.jpg", isPrimary: true }
      ]}
    }
  });

  await prisma.product.create({
    data: {
      name: "Nike Air Force 1 '07",
      description: "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best.",
      price: 7495.00, discountedPrice: 7495.00, discountPercent: 0, stock: 25,
      isFeatured: false, averageRating: 4.8, popularityScore: 94, // Trending fashion
      categoryId: shoes.id, brandId: nike.id, sellerId: superKicks.id,
      images: { create: [
        { imageUrl: "https://m.media-amazon.com/images/I/51A2kP+8h-L._SY695_.jpg", isPrimary: true }
      ]}
    }
  });

  // --- FASHION: CLOTHING ---
  await prisma.product.create({
    data: {
      name: "Levi's Men's 511 Slim Fit Jeans",
      description: "A modern slim with room to move, the 511 Slim Fit Jeans are a classic since right now.",
      price: 2899.00, discountedPrice: 1449.00, discountPercent: 50, stock: 80,
      isFeatured: false, averageRating: 4.1, popularityScore: 75,
      categoryId: clothing.id, brandId: levis.id, sellerId: cloudtail.id,
      images: { create: [
        { imageUrl: "https://m.media-amazon.com/images/I/81M59E2aKwL._SX569_.jpg", isPrimary: true }
      ]}
    }
  });

  await prisma.product.create({
    data: {
      name: "Levi's Men's Regular Fit T-Shirt",
      description: "100% Cotton classic graphic tee with iconic batwing logo.",
      price: 1099.00, discountedPrice: 549.00, discountPercent: 50, stock: 200,
      isFeatured: false, averageRating: 4.0, popularityScore: 60,
      categoryId: clothing.id, brandId: levis.id, sellerId: cloudtail.id,
      images: { create: [
        { imageUrl: "https://m.media-amazon.com/images/I/71u9s8o-ZcL._SX569_.jpg", isPrimary: true }
      ]}
    }
  });

  // --- MORE ELECTRONICS ---
  await prisma.product.create({
    data: {
      name: "Samsung 43 inches Crystal iSmart 4K Ultra HD Smart LED TV",
      description: "Supported Apps: Netflix, Prime Video, YouTube. Crystal Processor 4K.",
      price: 52900.00, discountedPrice: 28990.00, discountPercent: 45, stock: 15,
      isFeatured: true, averageRating: 4.3, popularityScore: 82,
      categoryId: electronics.id, brandId: samsung.id, sellerId: appario.id,
      images: { create: [
        { imageUrl: "https://m.media-amazon.com/images/I/71yzjoGQz4L._SX679_.jpg", isPrimary: true }
      ]}
    }
  });

  await prisma.product.create({
    data: {
      name: "Apple Watch Series 9 [GPS 45mm] Smartwatch",
      description: "Midnight Aluminum Case with Midnight Sport Band. Fitness Tracker, Blood Oxygen & ECG Apps.",
      price: 44900.00, discountedPrice: 40999.00, discountPercent: 8, stock: 40,
      isFeatured: false, averageRating: 4.8, popularityScore: 91,
      categoryId: electronics.id, brandId: apple.id, sellerId: appario.id,
      images: { create: [
        { imageUrl: "https://m.media-amazon.com/images/I/71XmZ7Kq6oL._SX679_.jpg", isPrimary: true }
      ]}
    }
  });

  console.log("Database successfully seeded with 12 amazing products!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });