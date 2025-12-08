// controllers/notificationsController.js
import webpush from "web-push";
import prisma from "../prismaClient.js"; // store subscriptions in DB table webPushSubscriptions

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
webpush.setVapidDetails('mailto:admin@yourdomain.com', publicKey, privateKey);

export async function getVapidPublicKey(req, res) {
  res.send(publicKey);
}

export async function subscribe(req, res) {
  // req.body must be the subscription object from browser
  const sub = req.body;
  // store in DB for user if authenticated
  try {
    const userId = req.user?.id || null;
    await prisma.webPushSubscription.create({
      data: { userId, endpoint: sub.endpoint, keys: JSON.stringify(sub.keys) }
    });
    res.json({ ok: true });
  } catch (e) {
    console.error("subscribe error", e);
    res.status(500).json({ error: "subscribe failed" });
  }
}

export async function sendTestPush(req, res) {
  // send to all subscriptions OR filter by user
  const subs = await prisma.webPushSubscription.findMany();
  const payload = JSON.stringify({ title: "Test notification", body: req.body?.message || "Hello from FAANG Tracker" });
  const results = [];
  for (const s of subs) {
    try {
      const subscription = {
        endpoint: s.endpoint,
        keys: JSON.parse(s.keys)
      };
      await webpush.sendNotification(subscription, payload);
      results.push({ endpoint: s.endpoint, ok: true });
    } catch (err) {
      console.warn("push error", err);
      results.push({ endpoint: s.endpoint, ok: false, error: err.message });
    }
  }
  res.json({ results });
}
