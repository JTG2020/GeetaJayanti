// Loads data/media.json and renders the table and mobile cards.
// Simple client-side rendering so you can add entries to data/media.json
// Format for each item:
// {
//   "id": "adhyay-1",
//   "title": "Adhyay 1 — Arjuna Vishada Yoga",
//   "geeta_aarati": "assets/media/adhyay-1/geeta-aarati.mp3",
//   "hanumaan_chalisa": "assets/media/adhyay-1/hanumaan-chalisa.mp3",
//   "deep_prajwalan": { "type": "video", "src": "assets/media/adhyay-1/deep.mp4" },
//   "pdf": "assets/media/adhyay-1/notes.pdf"   // optional
// }

const MEDIA_JSON = 'data/media.json';

async function fetchMedia() {
  try {
    const res = await fetch(MEDIA_JSON, {cache: "no-cache"});
    if (!res.ok) throw new Error('Failed to load media manifest');
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return [];
  }
}

function makeCellMedia(media, type) {
  if (!media) return '<span class="muted">—</span>';
  if (typeof media === 'string') {
    const ext = media.split('.').pop().toLowerCase();
    if (ext === 'mp3' || ext === 'ogg' || ext === 'mpeg') {
      return `<audio controls preload="none"><source src="${media}"></audio>`;
    }
    if (ext === 'mp4' || ext === 'webm') {
      return `<video controls preload="none" width="320"><source src="${media}"></video>`;
    }
    if (ext === 'pdf') {
      return `<a href="${media}" target="_blank" rel="noopener">Open PDF</a>`;
    }
    return `<a href="${media}" target="_blank" rel="noopener">${media}</a>`;
  } else if (typeof media === 'object') {
    if (media.type === 'video') {
      return `<video controls preload="none" width="320"><source src="${media.src}"></video>`;
    }
    if (media.type === 'audio') {
      return `<audio controls preload="none"><source src="${media.src}"></audio>`;
    }
    if (media.type === 'pdf') {
      return `<a href="${media.src}" target="_blank" rel="noopener">Open PDF</a>`;
    }
  }
  return '<span class="muted">—</span>';
}

function renderTable(items) {
  const tbody = document.querySelector('#media-table tbody');
  tbody.innerHTML = '';
  items.forEach(it => {
    const tr = document.createElement('tr');

    // Adhyay/Chapter cell - include optional pdf link if present
    const titleCell = document.createElement('td');
    titleCell.innerHTML = `
      <div class="row-title">
        <div>
          <div class="chapter">${it.title}</div>
          ${it.subtitle ? `<div class="meta">${it.subtitle}</div>` : ''}
        </div>
      </div>
      ${it.pdf ? `<div style="margin-top:.5rem"><a href="${it.pdf}" target="_blank" rel="noopener">Chapter PDF</a></div>` : ''}
    `;
    tr.appendChild(titleCell);

    // Geeta Aarati
    const gaCell = document.createElement('td');
    gaCell.innerHTML = makeCellMedia(it.geeta_aarati, 'audio');
    tr.appendChild(gaCell);

    // Hanumaan Chalisa
    const hcCell = document.createElement('td');
    hcCell.innerHTML = makeCellMedia(it.hanumaan_chalisa, 'audio');
    tr.appendChild(hcCell);

    // Deep Prajwalan
    const dpCell = document.createElement('td');
    dpCell.innerHTML = makeCellMedia(it.deep_prajwalan, 'video');
    tr.appendChild(dpCell);

    tbody.appendChild(tr);
  });
}

function renderCards(items) {
  const list = document.getElementById('card-list');
  list.innerHTML = '';
  items.forEach(it => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${it.title}</h3>
      ${it.subtitle ? `<div class="meta">${it.subtitle}</div>` : ''}
      <div class="row"><strong>Geeta Aarati</strong><div>${makeCellMedia(it.geeta_aarati)}</div></div>
      <div class="row"><strong>Hanumaan Chalisa</strong><div>${makeCellMedia(it.hanumaan_chalisa)}</div></div>
      <div class="row"><strong>Deep Prajwalan</strong><div>${makeCellMedia(it.deep_prajwalan)}</div></div>
      ${it.pdf ? `<div class="row"><a href="${it.pdf}" target="_blank" rel="noopener">Open Chapter PDF</a></div>` : ''}
    `;
    list.appendChild(card);
  });
}

function applySearch(items, q) {
  if (!q) return items;
  q = q.toLowerCase();
  return items.filter(it => {
    return (it.title && it.title.toLowerCase().includes(q)) ||
           (it.subtitle && it.subtitle.toLowerCase().includes(q)) ||
           (it.geeta_aarati && String(it.geeta_aarati).toLowerCase().includes(q)) ||
           (it.hanumaan_chalisa && String(it.hanumaan_chalisa).toLowerCase().includes(q));
  });
}

async function init() {
  const raw = await fetchMedia();
  const items = Array.isArray(raw) ? raw : [];
  const searchInput = document.getElementById('search');
  const refreshBtn = document.getElementById('refresh');
  const cardList = document.getElementById('card-list');

  function rerender() {
    const q = searchInput.value.trim();
    const filtered = applySearch(items, q);
    renderTable(filtered);
    renderCards(filtered);
    // show/hide card area based on viewport
    if (window.innerWidth <= 880) {
      cardList.hidden = false;
    } else {
      cardList.hidden = true;
    }
  }

  searchInput.addEventListener('input', () => rerender());
  refreshBtn.addEventListener('click', async () => {
    // re-fetch the manifest
    const newItems = await fetchMedia();
    if (Array.isArray(newItems)) {
      items.length = 0;
      items.push(...newItems);
    }
    rerender();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 880) {
      cardList.hidden = false;
    } else {
      cardList.hidden = true;
    }
  });

  rerender();
}

document.addEventListener('DOMContentLoaded', init);
