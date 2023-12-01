import type { CacheEntry } from "@epic-web/cachified"
import { lruCacheAdapter } from "@epic-web/cachified"
import { LRUCache } from "lru-cache"

const lru = new LRUCache<string, CacheEntry>({ max: 5000 })
export const lruCache = lruCacheAdapter(lru)
