// src/services/localStore.js
import { openDB } from "idb";

const DB_NAME = "faang_tracker_db";
const DB_VER = 1;
const PLAN_STORE = "plans";
const QUEUE_STORE = "queue";

async function getDB() {
  return openDB(DB_NAME, DB_VER, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(PLAN_STORE)) db.createObjectStore(PLAN_STORE, { keyPath: "day" });
      if (!db.objectStoreNames.contains(QUEUE_STORE)) db.createObjectStore(QUEUE_STORE, { keyPath: "id", autoIncrement: true });
    }
  });
}

export async function savePlanLocal(plan) {
  const db = await getDB();
  // store by day as keyPath
  const tx = db.transaction(PLAN_STORE, "readwrite");
  for (const day of plan) {
    await tx.store.put(day);
  }
  await tx.done;
}

export async function getAllLocalPlan() {
  const db = await getDB();
  return db.getAll(PLAN_STORE);
}

export async function saveDayLocal(dayObj) {
  const db = await getDB();
  return db.put(PLAN_STORE, dayObj);
}

export async function enqueueAction(action) {
  const db = await getDB();
  return db.add(QUEUE_STORE, { action, createdAt: Date.now() });
}

export async function getQueueItems() {
  const db = await getDB();
  return db.getAll(QUEUE_STORE);
}

export async function clearQueueItem(id) {
  const db = await getDB();
  return db.delete(QUEUE_STORE, id);
}
