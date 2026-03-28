import * as OrderService from "../services/order.service.js";

export const placeOrder = async (req, res) => {
  try {
    const { addressLine1, city, state, pincode } = req.body;

    // Basic validation
    if (!addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({ 
        message: "Please provide addressLine1, city, state, and pincode" 
      });
    }

    const orderResponse = await OrderService.placeOrder(req.body);
    
    res.status(201).json(orderResponse);
  } catch (error) {
    if (error.message === "CART_EMPTY") {
      return res.status(400).json({ message: "Cannot place order: Cart is empty" });
    }
    
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};