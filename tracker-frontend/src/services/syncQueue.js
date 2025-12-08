// src/services/syncQueue.js
import { getQueueItems, clearQueueItem } from "./localStore";
import { db } from "./firebase"; // firebase RTDB instance; ensure export exists

// replay actions from IDB queue to Firebase. Actions are simple objects like:
// { type: 'saveDay', payload: { day: 1, ... }, uid: '<user-uid>' }

export async function replayQueueToFirebase() {
  try {
    const items = await getQueueItems();
    if (!items || items.length === 0) return;

    for (const it of items) {
      const { id, action } = it;
      try {
        if (action.type === "saveDay" && action.payload && action.uid) {
          // write to RTDB path plans/{uid}/{day}
          await db.ref(`plans/${action.uid}/${action.payload.day}`).set(action.payload);
        }
        // other action types can be added here (createCategory, delete, etc.)
        await clearQueueItem(id);
      } catch (err) {
        console.warn("Replay item failed, will retry later", err);
      }
    }
  } catch (e) {
    console.error("replayQueueToFirebase error", e);
  }
}

// helper: call on window.online or after firebase auth
export function setupAutoReplayOnNetworkAndAuth(firebaseAuth) {
  const tryReplay = async () => {
    if (navigator.onLine && firebaseAuth.currentUser) {
      // attach uid to queued actions if missing? We assume actions include uid during enqueue.
      await replayQueueToFirebase();
    }
  };

  window.addEventListener("online", tryReplay);
  firebaseAuth.onAuthStateChanged(() => tryReplay());
  // call once initially
  tryReplay();
}
