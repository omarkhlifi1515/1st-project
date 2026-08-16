# Doc Live

Real-time collaborative document editor built with React, TipTap, and Yjs.

## Quick Start

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start MongoDB (required for future persistence):
   ```bash
   mongod --dbpath /path/to/data/db
   ```

3. Run both server and client in development:
   ```bash
   npm run dev
   ```

   Or run them separately in two terminals:
   ```bash
   npm run server   # Terminal 1 — Node + y-websocket on port 1234
   npm run client   # Terminal 2 — React dev server on port 3000
   ```

4. Open http://localhost:3000 in your browser.

## Ports

| Service      | Port |
|--------------|------|
| React dev    | 3000 |
| Node server  | 1234 |
| MongoDB      | 27017 |
```
