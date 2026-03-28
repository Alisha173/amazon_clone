import * as ProductService from "../services/product.service.js";

export const getProducts = async (req, res) => {
  try {
    const result = await ProductService.getAllProducts(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeatured = async (req, res) => {
  try {
    const products = await ProductService.getFeaturedProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getTrending = async (req, res) => {
  try {
    const products = await ProductService.getTrendingProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};