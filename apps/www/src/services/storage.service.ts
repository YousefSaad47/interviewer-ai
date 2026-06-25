const getStorage = (type: "local" | "session") => {
  if (typeof window === "undefined") return null;
  return type === "local" ? window.localStorage : window.sessionStorage;
};

export const storageService = {
  getItem(key: string, type: "local" | "session" = "local") {
    return getStorage(type)?.getItem(key) ?? null;
  },
  setItem(key: string, value: string, type: "local" | "session" = "local") {
    getStorage(type)?.setItem(key, value);
  },
  removeItem(key: string, type: "local" | "session" = "local") {
    getStorage(type)?.removeItem(key);
  },
};
