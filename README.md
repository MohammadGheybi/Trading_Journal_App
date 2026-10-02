# Crimson Ledger

A local trading journal. Trades, settings, and screenshots are stored on this computer in a SQLite file. There is no Docker, no separate database server, and no account login.

Requires Node.js 22 or newer.

## Run it while developing

From this folder:

```bash
npm install
npm run dev
```

Open the address Vite prints, usually [http://127.0.0.1:5173](http://127.0.0.1:5173). The API listens on [http://127.0.0.1:3001](http://127.0.0.1:3001).

## Run it as one local app

```bash
npm start
```

That builds the interface and serves everything from [http://127.0.0.1:3001](http://127.0.0.1:3001). A later desktop shortcut or installer can launch this same command and open that address. `npm run serve` skips the build and opens an existing one.

## Where data lives

- `data/journal.sqlite` — trades and settings
- `data/uploads/` — chart screenshots

Copy those with the app if you move it to another computer. Each person who installs the app gets their own database.

Broker imports stay switched off. Trades are entered by hand.
