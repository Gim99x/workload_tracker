# Workload Tracker

An offline-first, mobile-first Progressive Web App for tracking personal projects, jobs and hours. Built for iPhone, with no backend, no account and no build step. Everything is stored on your device in IndexedDB.

## Features

- **Weekly capacity bar**: hours logged since Monday against a target you set.
- **Status tabs and project filter**: All, In progress, Todo and Done, plus a scrolling project chip strip.
- **Job cards with sub-steps**: project badge, hours logged, due date, status, and a "3/5 steps completed" progress bar. Tap a card to open its checklist and add steps. Completing the last step offers to mark the job Completed.
- **Quick-log bottom sheet**: +0.5h, +1.0h, +2.0h and +4.0h buttons, project and job chips, a status toggle, an optional note, and one-tap save.
- **Backup and export**:
  - Export Backup (JSON) opens the iOS share sheet so you can save to the Files app, with a normal download as fallback.
  - Import Backup restores from a JSON file and replaces current data.
  - Export Timesheet CSV gives one row per job.
- **Offline**: a service worker caches the app shell, so it loads with no connection.
- **iOS polish**: safe-area insets for the Dynamic Island and home indicator, 44px tap targets, no double-tap zoom delay, standalone display.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app: markup, styles and JavaScript (raw IndexedDB) |
| `manifest.json` | PWA configuration (name, colors, icon, standalone display) |
| `sw.js` | Service worker that caches the app shell and the Tailwind script |

## Deploy with GitHub Pages

A service worker only runs over HTTPS (or `localhost`), so the app needs to be hosted.

1. Create a repository and add the three files above plus this README to the root.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. After a minute your site is live at `https://<your-username>.github.io/<repo-name>/`.

## Install on iPhone

1. Open the Pages URL in **Safari** while online. This first visit caches everything needed to run offline.
2. Tap **Share → Add to Home Screen**.
3. Launch it from the home screen. It now works without a connection.

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Updating

When you change `index.html` or `manifest.json`, bump `VERSION` in `sw.js` (for example `workload-v2`). Installed copies then pick up the new files on their next launch. You may need to close and reopen the app once.

## Data and privacy

- All data lives in your browser's IndexedDB on the device. Nothing is sent anywhere.
- iOS can clear storage for sites that are rarely used. The app asks the browser to keep its data, but export a backup regularly and save it to Files.
- Clearing Safari website data deletes the app's data, so restore from a backup if that happens.

## Notes and limitations

- Tailwind CSS is loaded from `cdn.tailwindcss.com` and cached by the service worker. The first load must be online. For a fully self-contained build, compile Tailwind and replace the script tag.
- `navigator.vibrate` is used for haptic feedback, but iOS Safari does not support it, so it only works on Android browsers.
- The home-screen icon is drawn on a canvas at load. Replace it with your own 180×180 PNG `apple-touch-icon` if you prefer.

## Data model

- **Project**: `id`, `name`, `color`, `status` (`active` or `archived`), `created_at`
- **Job**: `id`, `project_id`, `title`, `status` (`todo`, `in_progress`, `completed`, `blocked`), `total_hours`, `due_date`, `updated_at`
- **Step**: `id`, `task_id`, `title`, `is_completed`, `created_at`
- **Log**: `id`, `task_id`, `hours`, `note`, `logged_at`
