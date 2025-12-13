// routes/categoryRoutes.js
import express from "express";
import * as categories from "../controllers/categoryController.js";

const router = express.Router();

// Public routes
// router.get("/", categories.list);
router.get("/", categories.getCategories);


export default router;

