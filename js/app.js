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

// Table rendering is deprecated in favor of accordion/sequence view for mobile-first UX.
function renderTable(items) {
  // keep compatibility: if table exists render minimally for desktop
  const tbody = document.querySelector('#media-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  items.forEach(it => {
    const tr = document.createElement('tr');
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

    const gaCell = document.createElement('td'); gaCell.innerHTML = makeCellMedia(it.geeta_aarati, 'audio'); tr.appendChild(gaCell);
    const hcCell = document.createElement('td'); hcCell.innerHTML = makeCellMedia(it.hanumaan_chalisa, 'audio'); tr.appendChild(hcCell);
    const dpCell = document.createElement('td'); dpCell.innerHTML = makeCellMedia(it.deep_prajwalan, 'video'); tr.appendChild(dpCell);
    tbody.appendChild(tr);
  });
}

function renderCards(items) {
  const list = document.getElementById('card-list');
  if (!list) return;
  list.innerHTML = '';
  items.forEach(it => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${it.title}</h3>
      ${it.subtitle ? `<div class="meta">${it.subtitle}</div>` : ''}
      ${it.pdf ? `<div class="row"><a href="${it.pdf}" target="_blank" rel="noopener">Open Chapter PDF</a></div>` : ''}
    `;
    list.appendChild(card);
  });
}

// New: render accordion sections in specific grouped order for mobile-first UX
function renderAccordion(items) {
  const container = document.getElementById('accordion');
  if (!container) return;
  container.innerHTML = '';

  // Desired sequence for Chapters
  const order = ['adhyay-12','adhyay-15','adhyay-09','adhyay-14','adhyay-03','adhyay-06'];
  const byId = items.reduce((acc, it) => { acc[it.id] = it; return acc }, {});

  // Helper to create a panel
  function createPanel(heading, innerHTML) {
    const panel = document.createElement('div'); panel.className = 'panel';
    const btn = document.createElement('button'); btn.className = 'header'; btn.type = 'button'; btn.setAttribute('aria-expanded','false'); btn.innerText = heading;
    const body = document.createElement('div'); body.className = 'panel-body'; body.hidden = true; body.innerHTML = innerHTML;
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      body.hidden = expanded;
    });
    panel.appendChild(btn); panel.appendChild(body);
    return panel;
  }

  // Chapters panel: list chapters sequentially as links to PDFs or titles
  const chaptersHTML = order.map(id => {
    const it = byId[id];
    if (!it) return '';
    return `<div class="media-row"><strong>${it.title}</strong>${it.pdf ? ` <div><a href="${it.pdf}" target="_blank" rel="noopener">Open PDF</a></div>` : ''}</div>`;
  }).join('');
  container.appendChild(createPanel('Adhyay / Chapters', chaptersHTML));

  // Geeta Aarati panel - include PDF then MP3 if present
  const gaPdf = items.find(i => i.geeta_aarati && i.geeta_aarati.toLowerCase().endsWith('.pdf'));
  const gaAudio = items.find(i => i.geeta_aarati && (i.geeta_aarati.toLowerCase().endsWith('.mp3') || i.geeta_aarati.toLowerCase().endsWith('.mpeg') || i.geeta_aarati.toLowerCase().endsWith('.ogg')));
  const geetaHTML = `
    <div class="media-row">${gaPdf ? `<a href="${gaPdf.geeta_aarati}" target="_blank" rel="noopener">GeetaAarti PDF</a>` : ''}</div>
    <div class="media-row">${gaAudio ? makeCellMedia(gaAudio.geeta_aarati,'audio') : ''}</div>
  `;
  container.appendChild(createPanel('Geeta Aarati', geetaHTML));

  // Hanumaan Chalisa panel - show only the first occurrence or the specific file
  const hFile = items.reduce((found, it) => found || it.hanumaan_chalisa || null, null);
  const hanumaanHTML = hFile ? (typeof hFile === 'string' ? makeCellMedia(hFile,'video') : (hFile.type === 'video' ? makeCellMedia(hFile,'video') : '')) : '<span class="muted">—</span>';
  container.appendChild(createPanel('Hanumaan Chalisa', `<div class="media-row">${hanumaanHTML}</div>`));

  // Deep Prajwalan panel - first occurrence
  const dp = items.reduce((found, it) => found || it.deep_prajwalan || null, null);
  const dpHTML = dp ? makeCellMedia(dp,'audio') : '<span class="muted">—</span>';
  container.appendChild(createPanel('Deep Prajwalan', `<div class="media-row">${dpHTML}</div>`));
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
  const accordionEl = document.getElementById('accordion');

  function rerender() {
    try {
      const q = (searchInput && typeof searchInput.value === 'string') ? searchInput.value.trim() : '';
      const filtered = applySearch(items, q);
      // Render accordion only (single layout for all devices)
      renderAccordion(filtered);
      const el = document.getElementById('accordion');
      if (el) el.hidden = false;
    } catch (err) {
      console.error('Error during rerender:', err);
    }
  }

  if (searchInput) searchInput.addEventListener('input', () => rerender());
  if (refreshBtn) refreshBtn.addEventListener('click', async () => {
    // re-fetch the manifest
    const newItems = await fetchMedia();
    if (Array.isArray(newItems)) {
      items.length = 0;
      items.push(...newItems);
    }
    rerender();
  });

  // No viewport dependent show/hide needed; always render accordion
  rerender();
}

document.addEventListener('DOMContentLoaded', init);
