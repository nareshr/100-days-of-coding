// src/utils/cache.js
export const memoryCache = {};

export async function cachedFetch(key, fetcher, ttl = 60000) {
  const now = Date.now();
  if (memoryCache[key] && (now - memoryCache[key].time < ttl)) {
    return memoryCache[key].data;
  }

  const local = localStorage.getItem(key);
  if (local) {
    const parsed = JSON.parse(local);
    if (now - parsed.time < ttl) {
      // background refresh
      fetcher().then(data => {
        memoryCache[key] = { time: now, data };
        localStorage.setItem(key, JSON.stringify({ time: now, data }));
      });
      return parsed.data;
    }
  }

  const data = await fetcher();
  memoryCache[key] = { time: now, data };
  localStorage.setItem(key, JSON.stringify({ time: now, data }));
  return data;
}
