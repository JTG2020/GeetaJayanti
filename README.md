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