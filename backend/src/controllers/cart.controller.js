import * as CartService from "../services/cart.service.js";

export const getCart = async (req, res) => {
  try {
    const cart = await CartService.getCart();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) {
      return res.status(400).json({ message: "product_id and quantity are required" });
    }
    
    const item = await CartService.addToCart(product_id, quantity);
    res.status(201).json({ message: "Added to cart", item });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id || quantity === undefined) {
      return res.status(400).json({ message: "product_id and quantity are required" });
    }

    const item = await CartService.updateCartItem(product_id, quantity);
    res.status(200).json({ message: "Cart updated", item });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    await CartService.removeCartItem(req.params.product_id);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};