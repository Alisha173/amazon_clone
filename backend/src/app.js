import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js"; // <-- Import Orders

const app = express();

app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes); // <-- Mount Orders

export default app;