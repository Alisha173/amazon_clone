import * as OrderService from "../services/order.service.js";

export const placeOrder = async (req, res) => {
  try {
    const { addressLine1, city, state, pincode } = req.body;

    // Address validation is required for both flows
    if (!addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({ 
        message: "Please provide addressLine1, city, state, and pincode" 
      });
    }

    // Pass the entire req.body so the service can check for productId & quantity
    const orderResponse = await OrderService.placeOrder(req.body);
    
    res.status(201).json(orderResponse);
  } catch (error) {
    if (error.message === "CART_EMPTY") {
      return res.status(400).json({ message: "Cannot place order: Cart is empty" });
    }
    if (error.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({ message: "Product not found for Buy Now" });
    }
    
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};