/**
 * AI SATHI - IndexedDB Utility for Offline-First Data
 * Uses native IndexedDB to store tips, user profile, and chat history.
 */

const DB_NAME = 'AISathiDB';
const DB_VERSION = 1;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;

      // Store for farming tips
      if (!db.objectStoreNames.contains('tips')) {
        db.createObjectStore('tips', { keyPath: 'id', autoIncrement: true });
      }

      // Store for chat history
      if (!db.objectStoreNames.contains('chat')) {
        db.createObjectStore('chat', { keyPath: 'id' });
      }

      // Store for user profile
      if (!db.objectStoreNames.contains('profile')) {
        db.createObjectStore('profile', { keyPath: 'key' });
      }
    };
  });
};

export const saveData = async (storeName: string, data: any) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(transaction.objectStoreNames[0]);
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllData = async (storeName: string): Promise<any[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(transaction.objectStoreNames[0]);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
