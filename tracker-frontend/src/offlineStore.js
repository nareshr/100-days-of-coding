// src/offlineStore.js
import { openDB } from 'idb'

const DB_NAME = 'faang-tracker-db'
const STORE = 'plan'

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'day' })
      }
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

export async function saveDay(dayObj) {
  const db = await initDB()
  await db.put(STORE, dayObj)
}

export async function readDay(day) {
  const db = await initDB()
  return db.get(STORE, day)
}

export async function enqueueSync(action) {
  const db = await initDB()
  await db.add('syncQueue', { action, createdAt: Date.now() })
}

export async function getSyncQueue() {
  const db = await initDB()
  return db.getAll('syncQueue')
}
export async function clearSyncQueueItem(id) {
  const db = await initDB()
  await db.delete('syncQueue', id)
}
