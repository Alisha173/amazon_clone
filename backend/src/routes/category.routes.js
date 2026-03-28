import express from "express";
import * as CategoryController from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", CategoryController.getCategories);

export default router;