# Crimson Ledger

Crimson Ledger is a personal trading journal that runs on your own computer. You log each trade, import a MetaTrader history report, and review results on a dashboard, calendar, analytics, and session view. There is no account, no cloud, and no Docker. Trades, settings, and chart screenshots stay in a local SQLite database.

The interface is English, left to right, and dark. Profit and loss use separate colors from the crimson and sand theme, so a result is never shown by color alone.

## What you can do

- Record a trade across entry, risk, reasoning, psychology, and review. Holding time, realized R/R, balance, and session are calculated for you.
- Import a MetaTrader 5 Excel history report. Each closed position becomes an incomplete trade you finish one by one. Partial closes stay attached to that position.
- Report clocks are shifted into the display timezone you choose in Settings (Tehran, UTC+3:30, is included). A trailing `.X` on a symbol is removed. Importing the same history again does not duplicate a trade you already have, including one you typed by hand, when the symbol, direction, date, and entry time match.
- Edit the lists used on the form: entry reasons, exit reasons, feelings, motivation, and behavioral mistakes.
- Download a one-page performance report for a date range. Use **Download PDF**, then choose **Save as PDF** in the print dialog.

A live broker login is not connected. History comes from the report file MetaTrader saves.

## Requirements

- [Node.js](https://nodejs.org/) 22 or newer

## Run it

From this folder:

```bash
npm install
npm run dev
```

Open the address printed in the terminal, usually [http://127.0.0.1:5173](http://127.0.0.1:5173). The API listens only on this computer, at [http://127.0.0.1:3001](http://127.0.0.1:3001).

Stop it with Ctrl+C in that terminal.

`npm install` is only needed the first time, and again after dependencies change. After that, `npm run dev` is enough.

If the terminal says port 3001 is already in use, another journal window is still running. Close that window, or stop it with Ctrl+C, then start again.

## Run it as one local app

```bash
npm start
```

That builds the interface and serves the whole app at [http://127.0.0.1:3001](http://127.0.0.1:3001). `npm run serve` skips the build and opens an existing one.

## Where your data lives

- `data/journal.sqlite` — trades and settings
- `data/uploads/` — chart screenshots

These files are not part of the git repository. Each person who clones the project gets an empty journal. To move your journal to another computer, copy `data/journal.sqlite` and `data/uploads/` into that copy of the app.
