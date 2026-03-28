import * as CategoryService from "../services/category.service.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryService.getCategoryHierarchy();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};