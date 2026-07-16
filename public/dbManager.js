/* =============================================================================
   AbilityFinder — IndexedDB persistence service

   Every IndexedDB call lives here. The app keeps one anonymous local-session
   record; it does not create an account or send this data anywhere. IndexedDB is
   more resilient than localStorage, but it is still browser-owned storage:
   clearing this site's browser data or the whole browser profile deletes it.
   ========================================================================== */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) {
    root.IndexedDBManager = api.IndexedDBManager;
    root.AbilityFinderDB = new api.IndexedDBManager();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  const DEFAULT_DB_NAME = "abilityfinder";
  const DEFAULT_STORE_NAME = "sessionState";
  // A stable, anonymous key is required so the same browser profile can recover
  // its one current session after a reload. It contains no user identifier.
  const DEFAULT_SESSION_ID = "00000000-0000-4000-8000-000000000001";

  function jsonSnapshot(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function cloneDefault(value) {
    try {
      return jsonSnapshot(value === undefined ? {} : value);
    } catch (error) {
      return {};
    }
  }

  class IndexedDBManager {
    constructor(options = {}) {
      this.indexedDB = Object.prototype.hasOwnProperty.call(options, "indexedDB")
        ? options.indexedDB
        : root && root.indexedDB;
      this.dbName = options.dbName || DEFAULT_DB_NAME;
      this.version = options.version || 1;
      this.storeName = options.storeName || DEFAULT_STORE_NAME;
      this.sessionId = options.sessionId || DEFAULT_SESSION_ID;
      this.logger = Object.prototype.hasOwnProperty.call(options, "logger")
        ? options.logger
        : root && root.console;
      this._dbPromise = null;
      this._writeQueue = Promise.resolve();
      this._knownRevision = null;
      this.lastWriteConflict = false;
    }

    warn(message, error) {
      if (this.logger && typeof this.logger.warn === "function") this.logger.warn(message, error);
    }

    openDB() {
      if (!this.indexedDB) return Promise.reject(new Error("IndexedDB is unavailable"));
      if (this._dbPromise) return this._dbPromise;

      this._dbPromise = new Promise((resolve, reject) => {
        const request = this.indexedDB.open(this.dbName, this.version);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: "session_uuid" });
          }
        };
        request.onsuccess = () => {
          const db = request.result;
          db.onversionchange = () => {
            db.close();
            this._dbPromise = null;
          };
          resolve(db);
        };
        request.onerror = () => {
          this._dbPromise = null;
          reject(request.error || new Error("Could not open IndexedDB"));
        };
        request.onblocked = () => {
          this._dbPromise = null;
          reject(new Error("IndexedDB upgrade was blocked"));
        };
      });

      return this._dbPromise;
    }

    async loadState(defaultState = {}) {
      try {
        await this._writeQueue;
        const db = await this.openDB();
        const record = await new Promise((resolve, reject) => {
          const transaction = db.transaction(this.storeName, "readonly");
          const request = transaction.objectStore(this.storeName).get(this.sessionId);
          request.onsuccess = () => resolve(request.result || null);
          request.onerror = () => reject(request.error || new Error("Could not read state"));
          transaction.onabort = () => reject(transaction.error || new Error("State read was aborted"));
        });
        this._knownRevision = record && Number.isInteger(record.revision) ? record.revision : 0;
        return record && record.payload !== undefined
          ? jsonSnapshot(record.payload)
          : cloneDefault(defaultState);
      } catch (error) {
        this.warn("AbilityFinder could not load local state:", error);
        return cloneDefault(defaultState);
      }
    }

    saveState(state) {
      let payload;
      try {
        payload = jsonSnapshot(state);
      } catch (error) {
        this.warn("AbilityFinder refused to save non-serializable state:", error);
        return Promise.resolve(false);
      }

      const write = async () => {
        try {
          const db = await this.openDB();
          let nextRevision = null;
          const saved = await new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(this.sessionId);
            let conflict = false;
            request.onsuccess = () => {
              const current = request.result || null;
              const currentRevision = current && Number.isInteger(current.revision) ? current.revision : 0;
              if (
                (!current && this._knownRevision > 0) ||
                (current && (this._knownRevision === null || currentRevision !== this._knownRevision))
              ) {
                conflict = true;
                this.lastWriteConflict = true;
                return;
              }
              this.lastWriteConflict = false;
              nextRevision = currentRevision + 1;
              store.put({
                session_uuid: this.sessionId,
                revision: nextRevision,
                payload,
                updatedAt: new Date().toISOString(),
              });
            };
            request.onerror = () => reject(request.error || new Error("Could not inspect current state"));
            transaction.oncomplete = () => resolve(!conflict);
            transaction.onerror = () => reject(transaction.error || new Error("Could not save state"));
            transaction.onabort = () => reject(transaction.error || new Error("State save was aborted"));
          });
          if (saved) this._knownRevision = nextRevision;
          return saved;
        } catch (error) {
          this.warn("AbilityFinder could not save local state:", error);
          return false;
        }
      };

      const result = this._writeQueue.then(write, write);
      this._writeQueue = result.then(() => undefined, () => undefined);
      return result;
    }

    async migrateLegacyState(storage = root && root.localStorage, sanitizeState) {
      if (!storage || typeof storage.getItem !== "function") return false;
      const keys = [
        "abilityfinder.v2",
        "abilityfinder.a11y",
        "abilityfinder.theme",
        "abilityfinder.lang",
        "abilityfinder.askConsent",
      ];
      const legacy = {};
      try {
        keys.forEach((key) => { legacy[key] = storage.getItem(key); });
      } catch (error) {
        this.warn("AbilityFinder could not inspect legacy local state:", error);
        return false;
      }
      if (!keys.some((key) => legacy[key] !== null)) return false;

      // Never overwrite a completed IndexedDB migration with stale localStorage.
      const current = await this.loadState(null);
      if (current !== null || this._knownRevision > 0) {
        try { keys.forEach((key) => storage.removeItem(key)); } catch (error) {}
        return false;
      }

      let state = {};
      try { state = JSON.parse(legacy["abilityfinder.v2"] || "{}") || {}; } catch (error) {}
      if (state.applied && typeof state.applied === "object") {
        state.progress = Object.assign({}, state.progress || {});
        Object.keys(state.applied).forEach((id) => {
          if (state.applied[id] && !state.progress[id]) state.progress[id] = "submitted";
        });
        delete state.applied;
      }
      const ui = {};
      try {
        const restoredA11y = JSON.parse(legacy["abilityfinder.a11y"] || "null");
        if (restoredA11y) ui.a11y = restoredA11y;
      } catch (error) {}
      if (legacy["abilityfinder.theme"] !== null) ui.theme = legacy["abilityfinder.theme"];
      if (legacy["abilityfinder.lang"] !== null) ui.lang = legacy["abilityfinder.lang"];
      if (legacy["abilityfinder.askConsent"] !== null) {
        ui.askConsent = legacy["abilityfinder.askConsent"] === "1";
      }
      state.ui = Object.assign({}, state.ui || {}, ui);

      if (typeof sanitizeState !== "function") {
        this.warn("AbilityFinder refused to migrate legacy state without a sanitizer.");
        return false;
      }
      state = sanitizeState(state);

      const saved = await this.saveState(state);
      if (!saved) return false;
      try { keys.forEach((key) => storage.removeItem(key)); } catch (error) {}
      return true;
    }

    clearState() {
      const clear = async () => {
        try {
          const db = await this.openDB();
          let nextRevision = null;
          const cleared = await new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(this.sessionId);
            let conflict = false;
            request.onsuccess = () => {
              const current = request.result || null;
              const currentRevision = current && Number.isInteger(current.revision) ? current.revision : 0;
              if (
                (!current && this._knownRevision > 0) ||
                (current && (this._knownRevision === null || currentRevision !== this._knownRevision))
              ) {
                conflict = true;
                this.lastWriteConflict = true;
                return;
              }
              this.lastWriteConflict = false;
              nextRevision = currentRevision + 1;
              // Keep a metadata-only tombstone so a stale tab cannot recreate
              // answers after the current tab deliberately cleared them.
              store.put({
                session_uuid: this.sessionId,
                revision: nextRevision,
                deleted: true,
                updatedAt: new Date().toISOString(),
              });
            };
            request.onerror = () => reject(request.error || new Error("Could not inspect current state"));
            transaction.oncomplete = () => resolve(!conflict);
            transaction.onerror = () => reject(transaction.error || new Error("Could not clear state"));
            transaction.onabort = () => reject(transaction.error || new Error("State clear was aborted"));
          });
          if (cleared) this._knownRevision = nextRevision;
          return cleared;
        } catch (error) {
          this.warn("AbilityFinder could not clear local state:", error);
          return false;
        }
      };

      const result = this._writeQueue.then(clear, clear);
      this._writeQueue = result.then(() => undefined, () => undefined);
      return result;
    }

    async close() {
      if (!this._dbPromise) return;
      const dbPromise = this._dbPromise;
      this._dbPromise = null;
      try {
        const db = await dbPromise;
        db.close();
      } catch (error) {}
    }
  }

  return { IndexedDBManager };
});
