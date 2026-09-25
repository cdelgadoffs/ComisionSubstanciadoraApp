const DB_NAME = 'comisionSubstanciadora';
const DB_VERSION = 1;
const STORE_SESIONES = 'sesiones';

function abrirDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_SESIONES)) {
        db.createObjectStore(STORE_SESIONES, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function guardarSesiones(sesiones) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SESIONES, 'readwrite');
    const store = tx.objectStore(STORE_SESIONES);
    store.clear();
    sesiones.forEach((s) => store.put(s));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function obtenerSesiones() {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SESIONES, 'readonly');
    const req = tx.objectStore(STORE_SESIONES).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
