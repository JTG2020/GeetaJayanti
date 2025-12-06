# Shrimad Bhagavad Geeta Jayanti — Static site

This repository is a small static single-page site for publishing chapter PDFs, Geeta Aarati audio/PDF, Hanumaan Chalisa video and a Deep Prajwalan audio. The UI uses a simple, accessible accordion layout (one page) that works the same on mobile and desktop.

**Quick Start**
- **Serve locally:**

   ```bash
   cd /path/to/GeetaJayanti
   python3 -m http.server 8080
   # open http://127.0.0.1:8080 in a browser
   ```

- **Hard refresh** your browser after changes: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (macOS).

**Project layout**
- `index.html`: single-page app entry (renders accordion UI).
- `css/styles.css`: site styles, accordion styles.
- `js/app.js`: client-side renderer — reads `data/media.json` and builds the accordion.
- `data/media.json`: manifest describing chapters and media files.
- `assets/`:
   - `assets/pdfs/` — chapter PDFs and `GeetaAarti.pdf`
   - `assets/mp3/` — audio files (supports `.mp3`, `.mpeg`)
   - `assets/mp4/` — video files (e.g. `hanumaan-chalisa.mp4`)

**Manifest (`data/media.json`)**
The app reads `data/media.json` (an array of items). Each item generally represents a chapter and can include any of these fields:

```json
{
   "id": "adhyay-12",
   "title": "Adhyay 12 — Bhakti Yoga",
   "geeta_aarati": "assets/pdfs/GeetaAarti.pdf",
   "hanumaan_chalisa": { "type": "video", "src": "assets/mp4/hanumaan-chalisa.mp4" },
   "deep_prajwalan": "assets/mp3/DeepPrajwalan.mpeg",
   "pdf": "assets/pdfs/01_12_BhaktiYoga.pdf"
}
```

- `id` (required): unique id used by the renderer (e.g. `adhyay-03`).
- `title` (required): human-readable chapter title.
- `geeta_aarati`: string (path to `.mp3` or `.pdf`) — the renderer will prefer a PDF for the Geeta Aarati panel and will show an audio player for audio files.
- `hanumaan_chalisa`: string (video path) or object `{ "type": "video", "src": "..." }`. The app shows only the first Hanumaan Chalisa it finds (you can place it on the first row).
- `deep_prajwalan`: string (audio or video path) or object `{ "type": "audio|video", "src": "..." }`. The app shows the first Deep Prajwalan it finds (place it on the first row).
- `pdf`: chapter PDF path (opens in new tab).

Notes about behavior
- The app currently renders the accordion sections in a fixed order for the chapter links: **12, 15, 9, 14, 3, 6**. That order is defined in `js/app.js` — update the `order` array there to change the sequence.
- The **Geeta Aarati** panel displays a GeetaAarti PDF (if present) and the first audio file found for Geeta Aarati.
- The **Hanumaan Chalisa** and **Deep Prajwalan** panels display only the first matching file found in the manifest — add those files to the chapter where you want them to appear (typically the first chapter entry).

Troubleshooting
- If the page looks blank or JS doesn’t run, do a hard refresh and clear cache; cached JS can cause DOM mismatch.
- If `data/media.json` fails to load (network error), check the browser Network tab to confirm it is served and accessible at `data/media.json`.
- If a PDF shows blank in GitHub preview but opens locally, re-save/normalize the PDF (export to PDF or run through Ghostscript) — some PDF features can break previewers.

Contributing / Adding media
1. Add your files to the correct `assets/` subfolder (keep names unique).
2. Edit `data/media.json` and add/update an entry following the sample.
3. Commit and push:

```bash
git add assets data/media.json
git commit -m "Add media and update manifest"
git push origin main
```

License
- See the `LICENSE` file in the repository root.

If you want, I can add a small script to validate `data/media.json` (checks file existence and basic structure) — tell me and I'll add it.
```text
# Shrimad Bhagavad Geeta Jayanti — Static site

This repository contains a static single-page app for hosting PDFs, audios and videos for "Shrimad Bhagavad Geeta Jayanti".

Status
- Media files have been reorganized into flat directories under `assets/`:
  - PDFs: assets/pdfs/
  - Audio: assets/mp3/  (supports .mp3, .mpe, .mpeg)
  - Video: assets/mp4/

How to add new media
1. Put the files under the appropriate folder:
   - PDFs -> assets/pdfs/<filename>.pdf
   - Audio -> assets/mp3/<filename>.(mp3|mpe|mpeg)
   - Video -> assets/mp4/<filename>.mp4

2. Edit `data/media.json` and set the file paths to the exact paths you used (relative paths as above).

3. Commit and push (for example):
   git add assets data/media.json
   git commit -m "Add media files and update manifest"
   git push origin reorganize/media-folders

Enabling GitHub Pages
1. In the repository Settings → Pages, choose branch: main (or the branch you merged into main) and folder: / (root).
2. Wait a few minutes for the site to be published.

Notes
- Filenames are preserved when moving — make sure the names in `data/media.json` exactly match the files under assets/.
- If multiple files share the same filename, add a prefix/suffix (for example, adhyay-1-geeta-aarati.mpe) to avoid collisions.
```