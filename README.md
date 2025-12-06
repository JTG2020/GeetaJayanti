# Shrimad Bhagavad Geeta Jayanti — Static site

This repository contains a static single-page app for hosting PDFs, audios and videos for "Shrimad Bhagavad Geeta Jayanti".

Features:
- Title set to "Shrimad Bhagavad Geeta Jayanti".
- A table with 4 columns:
  - Adhyay / Chapters
  - Geeta Aarati
  - Hanumaan Chalisa
  - Deep Prajwalan
- Responsive: table on desktop, card layout on mobile.
- Data-driven: edit `data/media.json` to add chapters and file URLs.
- Uses HTML5 audio/video players and links to PDFs.

How to add media
1. Put files under `assets/media/<slug>/` (slug examples: `adhyay-1`, `adhyay-2`).
2. Edit `data/media.json` and add an entry for each chapter. See `data/media.json` for examples.
3. Commit and push to GitHub.

Hosting on GitHub Pages
1. Create a repository on GitHub (or use an existing one).
2. Push the contents of this project to the `main` branch (or `gh-pages` branch).
3. In repository Settings → Pages, choose the branch (main) and root folder (`/`) and save.
4. Your site will be available at `https://<owner>.github.io/<repo>/` after a few minutes.

If you want me to push these files, confirm and accept the authorization prompt when it appears.
