import express from "express";
import * as CartController from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", CartController.getCart);
router.post("/add", CartController.addToCart);
router.put("/update", CartController.updateCartItem);
router.delete("/remove/:product_id", CartController.removeCartItem);

export default router;