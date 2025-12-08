// routes/notifRoutes.js
import express from "express";
import { getVapidPublicKey, subscribe, sendTestPush } from "../controllers/notificationsController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/vapidPublicKey", getVapidPublicKey);
router.post("/subscribe", requireAuth, subscribe); // requireAuth optional
router.post("/sendTest", requireAuth, sendTestPush);
export default router;
