// Storage abstraction - ONLY place localStorage is accessed
// localStorage + API sync

const STORAGE_KEY = 'jj_sales_game';

export const Storage = {
  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.syncToAPI(data); // Async, non-blocking
    } catch (e) {
      console.error('Storage save failed:', e);
    }
  },
  
  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage load failed:', e);
      return null;
    }
  },
  
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
  
  async syncToAPI(data) {
    // API sync stub - implement later
    // await fetch('/api/sync', { method: 'POST', body: JSON.stringify(data) });
    console.log('API sync (stub):', data);
  }
};
