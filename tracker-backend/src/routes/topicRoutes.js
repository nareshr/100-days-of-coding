// routes/topicRoutes.js
import express from "express";
import * as topics from "../controllers/topicController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", topics.list);
router.get("/weeklyplan", topics.weeklyPlan);
router.get("/weeklyplan/:weekNumber", topics.weeklyPlanWeek);

// Protected admin/manager routes
router.post("/", requireAuth, requireRole(["admin", "manager"]), topics.create);
router.put("/:id", requireAuth, requireRole(["admin", "manager"]), topics.update);
router.delete("/:id", requireAuth, requireRole(["admin"]), topics.remove);

// Import / Export
router.post("/import", requireAuth, requireRole(["admin", "manager"]), topics.importTopics);
router.get("/export/csv", requireAuth, requireRole(["admin", "manager"]), topics.exportTopicsCSV);
router.get("/export/json", requireAuth, requireRole(["admin", "manager"]), topics.exportTopicsJSON);

export default router;

