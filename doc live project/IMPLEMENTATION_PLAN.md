# Implementation Plan: Google Docs Clone (Doc Live Project)

## 1. Current State Assessment

### What exists
| Path | Status | Notes |
|------|--------|-------|
| `CLONE_GOOGLE_DOC.md` | Spec | Describes intended stack: Node.js + Express + y-websocket + Yjs + React + TipTap + Mongoose |
| `public/` | Partial | Static HTML/CSS/JS with a basic `contenteditable` toolbar; no backend connection |
| `src/app.js` | Empty | Placeholder |
| `src/index.js` | Empty | Placeholder |
| `collab/server/` | Broken | `scripts.js` mixes client DOM code with Node.js server logic; `package.json` has deps but no `index.js`; has `index.html`, `styles.css` |
| `collab/client/client/` | Broken scaffold | CRA boilerplate; TipTap deps declared in `package.json` but missing `react`, `react-dom`, and `react-scripts`; no TipTap integration |
| `tests/` | Empty | No tests present |
| `.env` | Missing | No environment configuration |
| `infra/` | Missing | No deployment or infrastructure config |
| `README.md` | Missing | No documentation |
| `.gitignore` | Missing | No git ignore rules |

### What is broken
- `collab/server/scripts.js` is not valid Node.js server code (uses browser globals like `document`).
- `collab/server/` has no entrypoint (`index.js` missing).
- `collab/client/client/` is not runnable: CRA scaffold with incomplete dependency graph.
- Frontend in `public/` is static and disconnected from any backend or collaborative engine.
- No working WebSocket / Yjs connection anywhere in the project.

---

## 2. Architecture Target

### Proposed file tree
```
/home/lasmih/Desktop/New Folder/1st project/doc live project/
├── CLONE_GOOGLE_DOC.md
├── IMPLEMENTATION_PLAN.md
├── README.md
├── .gitignore
├── .env.example
├── package.json
├── src/
│   ├── index.js
│   └── app.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── favicon.ico
├── collab/
│   ├── server/
│   │   ├── index.js
│   │   ├── package.json
│   │   └── README.md
│   └── client/
│       ├── package.json
│       ├── public/
│       │   └── index.html
│       ├── src/
│       │   ├── index.js
│       │   ├── App.js
│       │   ├── Editor.jsx
│       │   ├── Toolbar.jsx
│       │   ├── utils/
│       │   │   └── yjs.js
│       │   └── styles/
│       │       └── Editor.css
│       └── README.md
├── infra/
│   ├── docker-compose.yml
│   ├── Dockerfile.server
│   └── Dockerfile.client
├── tests/
│   ├── server/
│   │   └── index.test.js
│   └── client/
│       └── Editor.test.jsx
└── .github/
    └── workflows/
        └── ci.yml
```

### Stack
- **Backend**: Node.js + Express + `y-websocket` (Yjs WebSocket server) + Mongoose (MongoDB)
- **Frontend**: React + TipTap (`@tiptap/react`, `@tiptap/starter-kit`) + Yjs (`yjs`, `y-websocket`)
- **Infra**: Docker + docker-compose for local dev parity

---

## 3. Gap Analysis with Priorities

### Backend (P0/P1/P2)
| Priority | Item | Description |
|----------|------|-------------|
| P0 | Server entrypoint | Create `collab/server/index.js` with Express + y-websocket |
| P0 | WebSocket signaling | Expose `/` (y-websocket handler) for Yjs doc sync |
| P0 | Healthcheck | Add `/health` route for infra probes |
| P1 | MongoDB connection | Add Mongoose connection + optional persistence layer |
| P1 | Room/Doc metadata API | REST endpoints for listing/creating docs |
| P2 | Auth middleware | JWT or session-based auth for room access |
| P2 | Persistence hooks | Save Yjs updates to MongoDB |

### Frontend (P0/P1/P2)
| Priority | Item | Description |
|----------|------|-------------|
| P0 | Dependency fix | Ensure `collab/client/package.json` has `react`, `react-dom`, `react-scripts` |
| P0 | TipTap integration | Install `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-collaboration`, `@tiptap/extension-collaboration-cursor` |
| P0 | Yjs connection | Connect editor to `y-websocket` backend |
| P0 | Toolbar | Build basic formatting toolbar bound to TipTap commands |
| P1 | Cursor awareness | Show collaborator cursors/selections |
| P1 | Document list | UI to create/select docs |
| P1 | Offline/Reconnect | Handle WS disconnect/reconnect gracefully |
| P2 | Presence/User info | Usernames, colors, status |
| P2 | Version history | Undo/redo across clients, snapshots |

### Infra & DX (P0/P1/P2)
| Priority | Item | Description |
|----------|------|-------------|
| P0 | Root `package.json` | Add scripts to run server, client, and tests from repo root |
| P0 | `.env.example` | Document required env vars (`PORT`, `MONGO_URI`, `WS_URL`, etc.) |
| P0 | `.gitignore` | Ignore `node_modules`, `.env`, `dist`, `build`, logs |
| P1 | Docker compose | Local dev with MongoDB + server + client |
| P1 | README | Setup, run, test instructions |
| P2 | CI | GitHub Actions for lint + test |
| P2 | E2E tests | Playwright or Cypress for multi-user editing simulation |

---

## 4. Recommended Execution Order (Phases)

### Phase 1 — Stabilize foundation (P0 only)
1. Create `.gitignore` and `.env.example` at repo root.
2. Delete broken `collab/server/scripts.js`; create `collab/server/index.js` with minimal Express + y-websocket server.
3. Fix `collab/client/package.json`; add missing `react`, `react-dom`, `react-scripts`.
4. Add root `package.json` with workspace scripts.
5. Verify server starts and client compiles.

### Phase 2 — Core collaborative editing (P0 + P1 frontend)
1. Integrate TipTap + Yjs in client `Editor.jsx`.
2. Connect client to `y-websocket` server.
3. Implement `Toolbar.jsx` with basic formatting.
4. Add collaboration cursor support.

### Phase 3 — Data & API (P1 backend)
1. Add Mongoose connection + Doc model.
2. Expose REST API for doc metadata.
3. Wire server to persist Yjs updates.

### Phase 4 — Hardening (P1 + P2)
1. Add healthchecks and Docker compose.
2. Improve reconnection, presence, error handling.
3. Add unit tests for server and client components.

### Phase 5 — Production readiness (P2)
1. Auth middleware.
2. CI pipeline.
3. E2E tests.

---

## 5. File-by-File Action Checklist

### Root
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/.gitignore`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/.env.example`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/package.json`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/README.md`

### Server (`collab/server/`)
- [ ] Delete `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/server/scripts.js`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/server/index.js`
- [ ] Update `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/server/package.json`
- [ ] Optionally update `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/server/README.md`

### Client (`collab/client/`)
- [ ] Update `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/client/package.json`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/client/public/index.html`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/client/src/index.js`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/client/src/App.jsx`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/client/src/Editor.jsx`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/client/src/Toolbar.jsx`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/client/src/utils/yjs.js`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/client/src/styles/Editor.css`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/collab/client/README.md`

### Infra
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/infra/docker-compose.yml`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/infra/Dockerfile.server`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/infra/Dockerfile.client`

### Tests
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/tests/server/index.test.js`
- [ ] Create `/home/lasmih/Desktop/New Folder/1st project/doc live project/tests/client/Editor.test.jsx`

---

## 6. Technical Decisions & Tradeoffs

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Editor framework | TipTap over Slate/ProseMirror direct | Faster to implement; good Yjs integration via official extensions |
| Sync engine | Yjs + y-websocket | CRDT-based, battle-tested, supports offline/reconnect |
| Database | MongoDB (Mongoose) | Already specified; acceptable for doc metadata; Yjs binary blobs can be stored directly |
| Monorepo layout | Single repo, `collab/server` + `collab/client` subdirs | Keeps related code together without forcing npm workspaces complexity early |
| Client bundler | CRA (retain) | Faster bootstrap; avoid ejecting. Consider Vite migration later if build times degrade |
| Containerization | Docker compose from day one | Eliminates "works on my machine" for DB + WS + client |

---

## 7. Open Questions / Risks

1. **CRA compatibility**: Ensure chosen TipTap/Yjs versions work with the CRA Webpack config. If not, eject or migrate to Vite.
2. **MongoDB schema for Yjs**: Decide whether to store full Yjs binary state per revision or deltas. Full state is simpler; deltas reduce storage.
3. **Scaling y-websocket**: `y-websocket` is single-process. If horizontal scaling is needed later, evaluate `y-redis` or `hocuspocus`.
4. **Auth on WebSocket**: Standard JWT over WS is workable but not specified yet. Delay to P2 unless required.
5. **Conflict with existing `public/`**: Decide whether `public/` is obsolete once React client is ready, or if it should be retained as a lightweight fallback. Recommend deleting or moving to `archive/` after client is verified.
