import { prisma } from "../db/db.js";

export const getCategoryHierarchy = async () => {
  // We only want to fetch top-level categories here. 
  // Prisma will automatically nest the subcategories inside the 'children' array.
  return await prisma.category.findMany({
    where: {
      parentId: null, // This ensures we only get root categories
    },
    include: {
      children: {
        select: {
          id: true,
          name: true,
        }
      },
    },
  });
};