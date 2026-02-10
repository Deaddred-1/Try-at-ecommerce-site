import express from "express";
import { getProducts } from "../controllers/product.controller.js";
import { getProductById } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;