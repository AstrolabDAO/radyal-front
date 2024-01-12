class LocalStorageService {
  // Time in milliseconds after which the stored item should expire
  static readonly EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

  static setItem(
    key: string,
    value: unknown,
    expiryTimeInMilliseconds = LocalStorageService.EXPIRY_TIME
  ): void {
    try {
      const currentTime = new Date().getTime();
      const expiryTime = currentTime + expiryTimeInMilliseconds;
      const item = { value, expiryTime };
      const serializedItem = JSON.stringify(item);
      localStorage.setItem(key, serializedItem);
    } catch (err) {
      console.error("Error setting item in local storage", err);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const serializedItem = localStorage.getItem(key);
      if (!serializedItem) return null;

      const { value, expiryTime } = JSON.parse(serializedItem);
      const currentTime = new Date().getTime();

      if (currentTime > expiryTime) {
        // Item has expired
        localStorage.removeItem(key);
        return null;
      }

      return value as T;
    } catch (err) {
      console.error("Error getting item from local storage", err);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error("Error removing item from local storage", err);
    }
  }
}

export default LocalStorageService;
