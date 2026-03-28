import { prisma } from "../db/db.js";

export const getAllProducts = async (filters) => {
  const {
    search,
    category_id,
    brand_id,
    seller_id,
    min_price,
    max_price,
    min_rating,
    min_discount,
    sort,
    page = 1,
    limit = 10,
  } = filters;

  // 1. Build the dynamic WHERE clause
  const where = {};
  
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (category_id) where.categoryId = parseInt(category_id);
  if (brand_id) where.brandId = parseInt(brand_id);
  if (seller_id) where.sellerId = parseInt(seller_id);
  
  if (min_price || max_price) {
    where.price = {};
    if (min_price) where.price.gte = parseFloat(min_price);
    if (max_price) where.price.lte = parseFloat(max_price);
  }
  
  if (min_rating) where.averageRating = { gte: parseFloat(min_rating) };
  if (min_discount) where.discountPercent = { gte: parseInt(min_discount) };

  // 2. Determine Sorting
  let orderBy = {};
  switch (sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "rating":
      orderBy = { averageRating: "desc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
  }

  // 3. Pagination limits
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // 4. Execute Query
  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      images: { where: { isPrimary: true }, take: 1 } // Only fetch the primary image for the list
    }
  });

  const total = await prisma.product.count({ where });

  return { products, total, page: parseInt(page), totalPages: Math.ceil(total / take) };
};

export const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      images: true, // Fetch all images for the detail page
      seller: { select: { id: true, name: true } },
      brand: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } }
    }
  });
};

export const getFeaturedProducts = async () => {
  return await prisma.product.findMany({
    where: { isFeatured: true },
    take: 10,
    include: {
      images: { where: { isPrimary: true }, take: 1 }
    }
  });
};

export const getTrendingProducts = async () => {
  return await prisma.product.findMany({
    // Sort by highest popularity score first, then by highest rating
    orderBy: [
      { popularityScore: 'desc' },
      { averageRating: 'desc' }
    ],
    take: 10, // Top 10 trending products
    include: {
      images: { where: { isPrimary: true }, take: 1 }
    }
  });
};