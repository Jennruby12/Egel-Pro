'use client'

import type { OfflineBundle } from '@/modules/quiz/offline-content-actions'

/**
 * Almacen offline del contenido (banco de preguntas) en IndexedDB.
 * IndexedDB aguanta MBs (a diferencia de localStorage ~5MB y sincrono), ideal
 * para el banco completo. Wrapper KV minimal: una store, claves por string.
 */

const DB_NAME = 'egelpro-offline'
const DB_VERSION = 1
const STORE = 'content'
const BUNDLE_KEY = 'question-bundle'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB no disponible'))
      return
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function put<T>(key: string, value: T): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}

async function get<T>(key: string): Promise<T | null> {
  const db = await openDb()
  const value = await new Promise<T | null>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(key)
    req.onsuccess = () => resolve((req.result as T) ?? null)
    req.onerror = () => reject(req.error)
  })
  db.close()
  return value
}

export async function saveOfflineBundle(bundle: OfflineBundle): Promise<void> {
  await put(BUNDLE_KEY, bundle)
}

export async function getOfflineBundle(): Promise<OfflineBundle | null> {
  try {
    return await get<OfflineBundle>(BUNDLE_KEY)
  } catch {
    return null
  }
}

/** Metadatos ligeros sin cargar todas las preguntas a memoria. */
export async function getOfflineMeta(): Promise<{ version: string; downloadedAt: number; count: number } | null> {
  const bundle = await getOfflineBundle()
  if (!bundle) return null
  return { version: bundle.version, downloadedAt: bundle.downloadedAt, count: bundle.questions.length }
}

export async function clearOfflineBundle(): Promise<void> {
  try {
    await put(BUNDLE_KEY, null)
  } catch {
    // noop
  }
}
