// routes/planRoutes.js
import express from "express";
import * as ctrl from "../controllers/planController.js";
import * as userPlanCtrl from "../controllers/userplanController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// List and create user plans
router.get("/", requireAuth, userPlanCtrl.listForUser);
router.post("/", requireAuth, userPlanCtrl.create);

// Weekly tasks for plan
router.get("/:id/tasks", requireAuth, ctrl.tasksForWeek);

// Plan-specific operations
router.get("/:id/summary", ctrl.planSummary);
router.get("/:id/dayBuckets", ctrl.dayBuckets);
router.get("/:id/weeklyBuckets", ctrl.weeklyBuckets);
router.get("/:id/tasksByDate", ctrl.tasksByDate);
router.post("/:id/tasks/:taskId/complete", requireAuth, ctrl.completeTask);
router.post("/:id/tasks/:taskId/uncomplete", requireAuth, ctrl.uncompleteTask);

export default router;
