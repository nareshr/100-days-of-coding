import { openDB } from "idb";
import API from "../services/api";

const DB_NAME = "faang_offline_db";
const STORE = "completion_queue";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
    }
  });
}

export async function enqueueCompletion(planId, taskId, completed) {
  const db = await getDB();
  await db.add(STORE, {
    planId,
    taskId,
    completed,
    timestamp: Date.now()
  });
}

export async function flushQueue() {
  const db = await getDB();
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.store;

  let cursor = await store.openCursor();
  while (cursor) {
    const item = cursor.value;
    try {
      if (item.completed) {
        await API.post(`/userplans/${item.planId}/tasks/${item.taskId}/complete`);
      } else {
        await API.post(`/userplans/${item.planId}/tasks/${item.taskId}/uncomplete`);
      }
      await cursor.delete();
    } catch (err) {
      // keep in queue
    }
    cursor = await cursor.continue();
  }
}
