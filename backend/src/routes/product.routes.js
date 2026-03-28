import express from "express";
import * as ProductController from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", ProductController.getProducts);
router.get("/featured", ProductController.getFeatured);
router.get("/trending", ProductController.getTrending); // <-- Add it here!
router.get("/:id", ProductController.getProductDetails);

export default router;