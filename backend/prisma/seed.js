import { prisma } from "../src/db/db.js";

async function main() {
  console.log("🚀 Starting Mega-Seed: Wiping database...");

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "User", "Category", "Brand", "Seller", "Product", "ProductImage", "Cart", "CartItem", "Order", "OrderItem", "Wishlist", "WishlistItem" RESTART IDENTITY CASCADE;
  `);

  console.log("📁 Seeding Category Hierarchy...");

  // 1. ELECTRONICS (Parent)
  const electronics = await prisma.category.create({ data: { name: "Electronics" } });
  const laptops = await prisma.category.create({ data: { name: "Laptops", parentId: electronics.id } });
  const audio = await prisma.category.create({ data: { name: "Audio", parentId: electronics.id } });
  const cameras = await prisma.category.create({ data: { name: "Cameras", parentId: electronics.id } });

  // 2. MOBILES (Parent)
  const mobiles = await prisma.category.create({ data: { name: "Mobiles" } });
  const smartphones = await prisma.category.create({ data: { name: "Smartphones", parentId: mobiles.id } });
  const tablets = await prisma.category.create({ data: { name: "Tablets", parentId: mobiles.id } });

  // 3. BOOKS
  const books = await prisma.category.create({ data: { name: "Books" } });

  // 4. WOMEN'S FASHION (Parent)
  const womensFashion = await prisma.category.create({ data: { name: "Women's Fashion" } });
  const western = await prisma.category.create({ data: { name: "Western Wear", parentId: womensFashion.id } });
  const ethnic = await prisma.category.create({ data: { name: "Ethnic Wear", parentId: womensFashion.id } });
  const accessories = await prisma.category.create({ data: { name: "Jewelry & Accessories", parentId: womensFashion.id } });

  console.log("🏢 Seeding Brands & Sellers...");

  const brands = {
    apple: await prisma.brand.create({ data: { name: "Apple" } }),
    sony: await prisma.brand.create({ data: { name: "Sony" } }),
    hp: await prisma.brand.create({ data: { name: "HP" } }),
    samsung: await prisma.brand.create({ data: { name: "Samsung" } }),
    nike: await prisma.brand.create({ data: { name: "Nike" } }),
    biba: await prisma.brand.create({ data: { name: "Biba" } }),
    penguin: await prisma.brand.create({ data: { name: "Penguin Books" } }),
    fossil: await prisma.brand.create({ data: { name: "Fossil" } }),
  };

  const sellers = {
    appario: await prisma.seller.create({ data: { name: "Appario Retail", email: "contact@appario.com" } }),
    cloudtail: await prisma.seller.create({ data: { name: "Cloudtail India", email: "support@cloudtail.com" } }),
    superCom: await prisma.seller.create({ data: { name: "SuperCom Net", email: "sales@supercom.com" } }),
    retailEZ: await prisma.seller.create({ data: { name: "RetailEZ", email: "orders@retailez.com" } }),
  };

  console.log("📦 Seeding Products...");

  // --- ELECTRONICS: LAPTOPS (3) ---
  const laptopData = [
    { name: "MacBook Pro M3", brand: brands.apple, seller: sellers.appario },
    { name: "HP Spectre x360", brand: brands.hp, seller: sellers.cloudtail },
    { name: "Samsung Galaxy Book Ultra", brand: brands.samsung, seller: sellers.retailEZ }
  ];

  for (const item of laptopData) {
    await prisma.product.create({
      data: {
        name: item.name, description: "Premium high-performance laptop for professionals.",
        price: 150000, discountedPrice: 140000, stock: 10, averageRating: 4.8, categoryId: laptops.id, brandId: item.brand.id, sellerId: item.seller.id,
        images: { create: [
          { imageUrl: "https://images.unsplash.com/photo-1654852360714-3899af1f5be7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftc3VuZyUyMGdhbGF4eSUyMGJvb2t8ZW58MHx8MHx8fDA%3D", isPrimary: true },
          { imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ec696e523b?auto=format&fit=crop&q=80&w=1000" },
          { imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=1000" }
        ]}
      }
    });
  }

  // --- ELECTRONICS: AUDIO (4) ---
  const audioData = ["Sony XM5", "Bose QuietComfort", "Apple AirPods Max", "Samsung Buds Pro"];
  for (const name of audioData) {
    await prisma.product.create({
      data: {
        name, description: "Noise-cancelling high-fidelity audio.",
        price: 30000, discountedPrice: 25000, stock: 50, averageRating: 4.5, categoryId: audio.id, brandId: brands.sony.id, sellerId: sellers.cloudtail.id,
        images: { create: [
          { imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000", isPrimary: true },
          { imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=1000" }
        ]}
      }
    });
  }

  // --- ELECTRONICS: CAMERAS (3) ---
  const cameraData = ["Sony A7 IV", "Canon EOS R5", "Nikon Z9"];
  for (const name of cameraData) {
    await prisma.product.create({
      data: {
        name, description: "Full-frame mirrorless camera for elite photography.",
        price: 200000, discountedPrice: 190000, stock: 5, averageRating: 4.9, categoryId: cameras.id, brandId: brands.sony.id, sellerId: sellers.appario.id,
        images: { create: [
          { imageUrl: "https://images.unsplash.com/photo-1561930543-32ede0352b5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtZXJ8ZW58MHx8MHx8fDA%3D", isPrimary: true },
          { imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=1000" }
        ]}
      }
    });
  }

  // --- MOBILES & TABLETS (2) ---
  await prisma.product.create({
    data: {
      name: "iPhone 15 Pro Max", description: "The ultimate iPhone with Titanium design.",
      price: 159900, discountedPrice: 149900, stock: 20, averageRating: 4.9, categoryId: smartphones.id, brandId: brands.apple.id, sellerId: sellers.appario.id,
      images: { create: [
        { imageUrl: "https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&q=80&w=1000", isPrimary: true },
        { imageUrl: "https://images.unsplash.com/photo-1556656793-062ff9878504?auto=format&fit=crop&q=80&w=1000" },
        { imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=1000" },
        { imageUrl: "https://images.unsplash.com/photo-1523206489230-c012cdd4cc2b?auto=format&fit=crop&q=80&w=1000" },
        { imageUrl: "https://images.unsplash.com/photo-1533228100845-08145b01de14?auto=format&fit=crop&q=80&w=1000" } // 5 Images
      ]}
    }
  });

  await prisma.product.create({
    data: {
      name: "Samsung Galaxy Tab S9", description: "Powerful tablet for productivity and creativity.",
      price: 80000, discountedPrice: 72000, stock: 15, averageRating: 4.6, categoryId: tablets.id, brandId: brands.samsung.id, sellerId: sellers.cloudtail.id,
      images: { create: [
        { imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000", isPrimary: true },
        { imageUrl: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&q=80&w=1000" }
      ]}
    }
  });

  // --- BOOKS (2) ---
  const bookList = ["Atomic Habits", "Deep Work"];
  for (const name of bookList) {
    await prisma.product.create({
      data: {
        name, description: "Bestselling book on personal growth and focus.",
        price: 500, discountedPrice: 450, stock: 100, averageRating: 4.7, categoryId: books.id, brandId: brands.penguin.id, sellerId: sellers.cloudtail.id,
        images: { create: [
          { imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000", isPrimary: true },
          { imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=1000" }
        ]}
      }
    });
  }

  // --- WOMEN'S FASHION (2) ---
  await prisma.product.create({
    data: {
      name: "Premium Silk Ethnic Saree", description: "Handwoven silk saree for special occasions.",
      price: 12000, discountedPrice: 8500, stock: 20, averageRating: 4.8, categoryId: ethnic.id, brandId: brands.biba.id, sellerId: sellers.retailEZ.id,
      images: { create: [
        { imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000", isPrimary: true },
        { imageUrl: "https://images.unsplash.com/photo-1610030469668-93530c1761cf?auto=format&fit=crop&q=80&w=1000" },
        { imageUrl: "https://images.unsplash.com/photo-1583391733975-642c3b038316?auto=format&fit=crop&q=80&w=1000" },
        { imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000" } // 4 Images
      ]}
    }
  });

  await prisma.product.create({
    data: {
      name: "Luxury Fossil Gold Watch", description: "Elegant timepiece with stainless steel strap.",
      price: 15000, discountedPrice: 13500, stock: 30, averageRating: 4.7, categoryId: accessories.id, brandId: brands.fossil.id, sellerId: sellers.superCom.id,
      images: { create: [
        { imageUrl: "https://images.unsplash.com/photo-1613704193420-a53cab02d194?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", isPrimary: true },
        { imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=1000" },
        { imageUrl: "https://images.unsplash.com/photo-1541778480-fc1752bbc2a9?q=80&w=1296&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
      ]}
    }
  });

  console.log("✅ Mega-Seed Complete: 16 high-quality products added!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });