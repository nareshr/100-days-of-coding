// routes/adminRoutes.js
import express from "express";
import * as admin from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// protect entire admin router
router.use(requireAuth);
router.use(requireRole(["admin", "manager"]));

// users
// router.get("/users", admin.listUsers);
router.get("/users", admin.getUsers);
router.post("/users", admin.createUser);
router.put("/users/:id", admin.updateUser);
router.delete("/users/:id", admin.deleteUser);

// categories
router.get("/categories", admin.listCategories);
router.post("/categories", admin.createCategory);
router.put("/categories/:id", admin.updateCategory);
router.delete("/categories/:id", admin.deleteCategory);

// plans
router.get("/plans", admin.getPlans);
// router.get("/plans", admin.listPlans);
router.get("/plans/:id", admin.getPlan);
router.post("/plans", admin.createPlan);
router.put("/plans/:id", admin.updatePlan);
router.delete("/plans/:id", admin.deletePlan);

// plan tasks
router.get("/plans/:id/tasks", admin.getPlanTasks);
router.post("/plans/:id/tasks", admin.createPlanTask);
router.post("/plans/:id/tasks/bulk", admin.bulkCreatePlanTasks);
router.put("/plans/:id/tasks/:taskId", admin.updatePlanTask);
router.delete("/plans/:id/tasks/:taskId", admin.deletePlanTask);

// plan export
router.get("/plans/:id/export/csv", admin.exportPlanCSV);
router.get("/plans/:id/export/json", admin.exportPlanJSON);

// admin reports (user-wise, requires ?userId=)
router.get("/reports/summary", admin.adminReportSummary);
router.get("/reports/week/:weekNumber", admin.adminReportWeek);
router.get("/reports/category/:categoryName", admin.adminReportCategory);
router.get("/reports/topics", admin.adminReportTopics);
router.get("/reports/daily", admin.adminReportDaily);

export default router;
