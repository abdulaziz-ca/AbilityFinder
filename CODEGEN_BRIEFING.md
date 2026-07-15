# 🚀 Code Generation Task Brief: State Persistence Migration

**ROLE FOR AGENT:** You are an expert front-end JavaScript developer specializing in robust client-side state management for highly sensitive applications. Your expertise must balance flawless functionality with absolute security and adherence to the Single Page Application (SPA) model of data interaction. Any proposed solution must prioritize data integrity over feature completeness.

## 🎯 Project Goal
The current application relies on browser `localStorage` for session progress and state saving. This mechanism is fragile and unreliable, leading to lost user work if the browser cache is cleared or due to minor operational glitches.

**The Objective:** Migrate the entire client-side state management responsibility from `localStorage` to the **IndexedDB API**. This must create a significantly more robust, resilient, and scalable local data store that prevents user data loss while strictly maintaining our core architectural principles.

## 🔒 Non-Negotiable Safety Constraints (The Trust Contract)
You MUST internalize these rules. They are non-negotiable technical constraints that define the product's operating environment. Failure to adhere to any of these is a critical task failure.

1.  **Absolute Privacy:** The system **must not**, under any circumstance, transmit or store Personally Identifiable Information (PII), Protected Health Information (PHI), or financial data identifying an individual on a remote server or requiring credentials for access (e.g., no accounts, no email sign-ups).
2.  **Scope of Persistence:** The state saved must *only* consist of the application's derived progress and selections:
    *   Wizard step answers and current wizard progress.
    *   Eligibility quiz results (`answers` object).
    *   Current UI filter settings and feature flags utilized during a session.
3.  **Operational Reality:** We are building a client-side tool. If the user manually clears their browser profile/data, the state will be lost (this limitation must be acknowledged in developer comments).

## 🧱 Technical Migration Steps (The Implementation Plan)
Organize your work into four distinct phases. Do not attempt to implement all at once; follow this sequence.

### Phase 1: IndexedDB Initialization & Setup
- **Encapsulation:** Create a dedicated, modular service layer (e.g., `dbManager.js`). All database interactions must be routed through this manager class. *Never* call raw IndexedDB APIs in main view logic.
- **Database Structure:** Implement the structure using IndexedDB's versioning system (`onupgradeneeded`).
- **Object Store:** Define and create a primary object store, perhaps named `"sessionState"`, keyed by an anonymized session identifier (e.g., `session_uuid`).

### Phase 2: Replacing Save/Load Logic (The Core Migration)
- **Identification:** Identify every existing function responsible for reading from or writing to `localStorage` (particularly in `app.js` and all module loaders).
- **Migration Strategy:** Modify these identified functions to use the `dbManager.js` methods:
    *   **`loadState()`:** Must read state from IndexedDB upon application startup. It must gracefully handle the "No initial data found" case by returning a clean, default empty state object.
    *   **`saveState(state)`:** When called, it must serialize the current application state (the *data*, not the function calls) into a JSON payload and execute an IndexedDB transaction write.

### Phase 3: State Management & Synchronization
- **Event Listener Integration:** Implement a global internal event system or observer pattern (`EventEmitter`) attached to major component states. When any critical form element changes, selection is made, or calculation completes, this event must trigger `saveState()`. This ensures continuous synchronization between the live in-memory state and the persistent DB store.
- **Data Typing:** Ensure every piece of data written to IndexedDB is consistently typed (e.g., dates are stored as ISO strings, booleans use standard JSON representations).

### Phase 4: Verification & Testing
Before declaring completion, you MUST execute a sequence of functional tests and report the outcome for each step:
1.  **Normal Cycle Test:** Flow through the entire application wizard/finder multiple times (changes $\rightarrow$ save $\rightarrow$ reload page mid-flow). Verify that all progress points are correctly loaded from IndexedDB upon recovery.
2.  **Simulated Failure Test:** Simulate a total loss of current memory state, but ensure retrieval works by having it load the correct partial result directly from IndexDB.
3.  **Final Privacy Audit Check:** Review every single persistence point to ensure no PII is leaked, stored as context, or transmitted unnecessarily.

***End of Briefing. Please acknowledge these constraints and begin with Phase 1: IndexedDB Initialization.***