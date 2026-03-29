import express from "express";
import * as OrderController from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", OrderController.placeOrder);
router.get("/", OrderController.getUserOrders);

export default router;