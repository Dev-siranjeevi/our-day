/* ============================================================
   OUR DAY — app.js
   ============================================================ */
'use strict';

/* ─────────────────────────────────────────
   DEFAULT DATA
───────────────────────────────────────── */
const DEFAULT = {
  pwd: 'ourday2026',
  driveClientId:  '',
  driveFolderId:  '',
  ask: {
    eyebrow:  'psst. yes, this is for you.',
    greeting: 'Dear ___,',
    mainText: 'Okay so you already know we\'re going out on May 31st. But do you know everything?',
    body:     'You think you know the plan — mall, movie, beach. Cute. Adorable, even. But here\'s the thing: I\'ve been lowkey plotting this for a while, and let\'s just say the full picture is a little more interesting than you think. I\'m not going to spoil it (that would defeat the whole point). But I will say this — I really, really want today to be a good one. For both of us. So buckle up. It\'s going to be a whole day.',
    sign:     '— the one who definitely has a plan ♡'
  },
  celebrate: {
    sub:    'Obviously. Did you ever doubt it? The adventure begins — and I promise it\'s worth it.',
    gifUrl: ''
  },
  map: {
    title: 'The May 31st Plan',
    date:  'Saturday, 31st May',
    msg:   'You knew the outline. Now here\'s the whole story — one stop at a time.',
    note:  'You walked into today knowing three things. You\'re leaving knowing a lot more — including, hopefully, that I put actual thought into this. Thank you for saying yes. Both to the date, and to putting up with me in general.',
    sig:   '— always yours ♡'
  },
  stops: [
    { emoji:'🚗', name:'The Pickup',     time:'13:00', desc:'I\'ll be outside at 1pm sharp. And yes, I will honk. Once. Romantically.',                                                                                                                             hint:'Look cute. You always do, but still — look cute.',                                                                           mapUrl:'' },
    { emoji:'🛍️', name:'The Mall',       time:'13:30', desc:'First stop: the mall. Don\'t act like you don\'t love it. We\'re going to walk around, maybe eat something questionable, and definitely get distracted by at least three stores we didn\'t plan to enter.', hint:'You\'re allowed to window shop. I\'m not made of money but I\'ll pretend for a bit.',                                       mapUrl:'' },
    { emoji:'🍔', name:'Lunch Stop',     time:'14:30', desc:'Fuel up before the main event. Pick whatever you want — this is a judgment-free zone. (Unless you pick something weird. Then I\'m judging a little.)',                                                     hint:'Seriously though, your pick.',                                                                                              mapUrl:'' },
    { emoji:'🎬', name:'The Movie',      time:'16:00', desc:'Cinema time. I\'ll let you choose the snacks. I\'ll pretend I didn\'t already memorise your order.',                                                                                                       hint:'If it\'s a scary movie, I\'m holding your hand. If it\'s a sad movie, I\'m pretending I\'m fine. Either way, popcorn.',  mapUrl:'' },
    { emoji:'🌊', name:'The Beach',      time:'18:30', desc:'And then — the beach. The real reason I planned this whole thing. Just us, the water, and a sunset that\'s going to be genuinely unfair in how pretty it is.',                                            hint:'Leave your shoes in the car. Trust me on this one.',                                                                        mapUrl:'' },
    { emoji:'🌅', name:'Golden Hour',    time:'19:15', desc:'We\'re not leaving right when we get there. We\'re staying for the golden hour — that stupid beautiful light that makes everything look like a movie. You\'ve been warned.',                               hint:'This is the part I\'ve been looking forward to most. Don\'t tell the others.',                                              mapUrl:'' },
    { emoji:'🍦', name:'The Drive Back', time:'20:00', desc:'Ice cream on the way home. Obviously. The day doesn\'t end without it — that\'s basically a rule at this point.',                                                                                          hint:'If you fall asleep in the car I\'m taking a photo. Just so you know.',                                                      mapUrl:'' }
  ]
};

/* ─────────────────────────────────────────
   STORAGE
───────────────────────────────────────── */
const STORE_KEY  = 'ourday_v3';
const SCREEN_KEY = 'ourday_screen';
const FOLDER_KEY = 'ourday_drive_folder';

function loadData() {
  try { return Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(STORE_KEY) || '{}')); }
  catch { return DEFAULT; }
}
function saveData(d) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); }
  catch (e) { console.error('saveData failed', e); }
}

/* ─────────────────────────────────────────
   SCREEN NAVIGATION
───────────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (!el) { console.error('showScreen: no element', id); return; }
  el.classList.add('active');
  el.style.animation = 'none';
  void el.offsetHeight; // reflow
  el.style.animation = '';
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ─────────────────────────────────────────
   SCREEN 1 — ASK HER OUT
───────────────────────────────────────── */
function renderAskScreen() {
  const a = loadData().ask;
  setText('ask-eyebrow', a.eyebrow);
  setText('ask-greeting', a.greeting);
  // Highlight key words
  document.getElementById('ask-main-text').innerHTML = escHtml(a.mainText)
    .replace(/(everything\??)/gi, '<span>$1</span>')
    .replace(/\b(date)\b/gi, '<span>$1</span>');
  setText('ask-body', a.body);
  setText('ask-sign', a.sign);
}

let noCount = 0;
const NO_CAPS = [
  'go on, you know you want to… 😏',
  'it won\'t bite! 🥺',
  'the \'No\' button is embarrassed — try Yes',
  'almost there… 💕',
  'seriously, \'No\' has given up on you',
  'okay, \'No\' has left the chat 👋'
];

function runAway() {
  const btn = document.getElementById('btn-no');
  if (!btn) return;
  noCount = Math.min(noCount + 1, NO_CAPS.length - 1);
  setText('no-caption', NO_CAPS[noCount]);
  const x = Math.random() * (window.innerWidth  - 100);
  const y = Math.random() * (window.innerHeight - 60);
  btn.style.position   = 'fixed';
  btn.style.left       = x + 'px';
  btn.style.top        = y + 'px';
  btn.style.transition = 'left .25s ease, top .25s ease';
  btn.style.zIndex     = '50';
  if (noCount >= 5) { btn.style.opacity = '0'; btn.style.pointerEvents = 'none'; }
}

function sayYes() {
  localStorage.setItem(SCREEN_KEY, 'yes');
  spawnConfetti();
  showScreen('screen-yes');
  renderCelebScreen();
}

/* ─────────────────────────────────────────
   SCREEN 2 — CELEBRATION
───────────────────────────────────────── */
function renderCelebScreen() {
  const c = loadData().celebrate;
  setText('celebrate-sub', c.sub);
  const f = document.getElementById('gif-frame');
  if (!f) return;
  if (c.gifUrl) {
    const img = document.createElement('img');
    img.src = c.gifUrl; img.alt = 'celebration';
    f.innerHTML = ''; f.appendChild(img);
  } else {
    f.innerHTML = '<div class="gif-placeholder">✨ Your celebration GIF will appear here ✨<br><span style="font-size:11px;color:var(--locked);display:block;margin-top:8px">Add a GIF URL in admin ⚙</span></div>';
  }
}

function goToMap() {
  localStorage.setItem(SCREEN_KEY, 'map');
  showScreen('screen-map');
  renderMapScreen();
}

function spawnConfetti() {
  const cols = ['#c0474a','#d4a843','#b8860b','#3d6b4f','#e8888a'];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const w = 6 + Math.random() * 8;
    c.style.cssText = `left:${Math.random()*100}vw;top:-20px;background:${cols[Math.floor(Math.random()*cols.length)]};width:${w}px;height:${w}px;border-radius:${Math.random()>.5?'50%':'2px'};animation-duration:${1.5+Math.random()*2}s;animation-delay:${Math.random()*.8}s`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

/* ─────────────────────────────────────────
   SCREEN 3 — MAP / ITINERARY
───────────────────────────────────────── */
function parseTime(s) { const [h, m] = (s||'0:0').split(':').map(Number); return h * 60 + (m || 0); }
function nowMin()      { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); }
function fmt12(s)      { const [h, m] = (s||'0:0').split(':').map(Number); return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`; }

function renderMapScreen() {
  const d = loadData();
  setText('hero-title',    d.map.title);
  setText('hero-message',  d.map.msg);
  setText('hero-date',     d.map.date);
  setText('closing-note',  d.map.note);
  setText('note-sig',      d.map.sig);

  const now = nowMin(), stops = d.stops || [];
  const unlocked = stops.filter(s => now >= parseTime(s.time)).length;
  const pct = stops.length ? Math.round((unlocked / stops.length) * 100) : 0;
  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = pct + '%';

  const msgs = [
    'The journey is about to begin…','First steps taken! Onwards ✦',
    'The adventure is unfolding…','Halfway through the magic!',
    'So many beautiful moments already…','Almost at the end of a perfect day…',
    'What a day this has been… ♡','Every single stop was worth it ✦'
  ];
  setText('progress-text', stops.length
    ? msgs[Math.min(Math.floor((unlocked / stops.length) * (msgs.length - 1)), msgs.length - 1)]
    : 'Add stops in admin ⚙');

  const container = document.getElementById('treasure-path');
  if (!container) return;
  // Preserve the path-line div
  const line = container.querySelector('.path-line');
  container.innerHTML = '';
  if (line) container.appendChild(line);

  stops.forEach((stop, i) => {
    const isU = now >= parseTime(stop.time);
    const isA = isU && (i === stops.length - 1 || now < parseTime(stops[i + 1]?.time || '23:59'));
    const mc  = isU && !isA ? 'done' : isA ? 'active' : 'locked-m';
    const mi  = isU && !isA ? '✓'   : isA ? stop.emoji : '🔒';
    const statusHtml = isU && !isA
      ? '<span class="status-pill pill-done">Visited</span>'
      : isA ? '<span class="status-pill pill-now">Now ✦</span>'
             : '<span class="status-pill pill-soon">Locked</span>';

    let inner = '';
    if (isU) {
      inner = `
        <div class="stop-time">${fmt12(stop.time)}</div>
        ${statusHtml}
        <div class="stop-name">${escHtml(stop.emoji)} ${escHtml(stop.name)}</div>
        <div class="stop-desc">${escHtml(stop.desc)}</div>
        ${stop.hint ? `<div style="font-size:13px;color:var(--gold);margin-bottom:10px;font-style:italic">💡 ${escHtml(stop.hint)}</div>` : ''}
        ${stop.mapUrl ? `<a class="map-btn" href="${escAttr(stop.mapUrl)}" target="_blank" rel="noopener">🗺 Open in Maps</a>` : ''}`;
    } else {
      const mins = parseTime(stop.time) - now;
      const cd   = mins > 59 ? `${Math.floor(mins/60)}h ${mins%60}m` : `${mins}m`;
      inner = `
        <div class="stop-time">${fmt12(stop.time)}</div>
        ${statusHtml}
        <div class="stop-name" style="filter:blur(4px);user-select:none;pointer-events:none">✧ Secret Stop ${i+1} ✧</div>
        <div class="stop-locked-msg">🔒 Unlocks in ${cd}</div>`;
    }

    const el = document.createElement('div');
    el.className = 'stop';
    el.innerHTML = `
      <div class="stop-card ${isU ? 'unlocked' : 'locked'}">
        <div class="stop-tail"></div>${inner}
      </div>
      <div class="stop-marker ${mc}">${mi}</div>`;
    container.appendChild(el);
  });
}

// Refresh map every 30 s when visible
setInterval(() => {
  if (document.getElementById('screen-map')?.classList.contains('active')) renderMapScreen();
}, 30000);

/* ─────────────────────────────────────────
   SCREEN 4 — MEMORY BOOK (Google Drive)
   ─────────────────────────────────────────
   Flow:
   1. Page loads → initDriveApi() (gapi onload callback)
   2. Saved token found → auto sign-in silently
   3. User taps "Sign in" → OAuth popup
   4. onSignedIn() → show upload zone, load photos
   5. Photos fetched as authenticated blobs → no CORS
   6. Upload: compress → caption modal → multipart POST to Drive
───────────────────────────────────────── */

// Drive constants (overridden at runtime from saved data)
const GAPI_SCOPES  = 'https://www.googleapis.com/auth/drive.file';
const CAPTION_META = 'ourday_caption';

// Drive state
let driveReady        = false;
let driveApiIniting   = false;
let gapiInitDone      = false;
let driveToken        = null;
let tokenClient       = null;

// Photo state
let memPhotos      = [];  // [{id, name, caption, blobUrl}]
let pendingFiles   = [];
let currentFile    = null;
let currentBlob    = null;
let stripSelection = []; // ordered indices into memPhotos, max 4

/* ── GAPI INIT ─────────────────────────── */
function gapiLoaded() {
  if (gapiInitDone) return;
  gapiInitDone = true;
  initDriveApi();
}

function initDriveApi() {
  if (driveApiIniting || driveReady) return;
  driveApiIniting = true;
  gapi.load('client', async () => {
    try {
      await gapi.client.init({});
      await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');

      const clientId = loadData().driveClientId || '';
      if (clientId) {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope:     GAPI_SCOPES,
          callback:  onTokenResponse,
        });
        tokenClient._clientId = clientId;
      }
      driveReady = true;

      // Try silent restore
      const saved = localStorage.getItem('ourday_drive_token');
      if (saved) {
        try {
          const t = JSON.parse(saved);
          if (t.expiry > Date.now() + 60000) {
            gapi.client.setToken(t);
            driveToken = t;
            onSignedIn(t);
            return;
          }
        } catch {}
        localStorage.removeItem('ourday_drive_token');
      }
    } catch (e) {
      console.error('initDriveApi failed', e);
      driveApiIniting = false; // allow retry
    }
  });
}

/* ── TOKEN RESPONSE ─────────────────────── */
function onTokenResponse(resp) {
  if (resp.error) { console.warn('Drive auth error', resp.error); return; }
  driveToken = resp;
  driveToken.expiry = Date.now() + (resp.expires_in - 30) * 1000;
  try { localStorage.setItem('ourday_drive_token', JSON.stringify(driveToken)); } catch {}
  onSignedIn(resp);
}

/* ── SIGN IN / OUT ──────────────────────── */
async function onSignedIn(token) {
  // Fetch user profile for the avatar
  try {
    const r = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: 'Bearer ' + token.access_token }
    });
    const u = await r.json();
    setText('drive-name', u.name || u.email || 'Signed in');
    const av = document.getElementById('drive-avatar');
    if (av) {
      if (u.picture) {
        const img = document.createElement('img');
        img.src = u.picture; img.className = 'drive-avatar'; img.alt = '';
        av.replaceWith(img);
      } else {
        av.textContent = (u.name || '?')[0].toUpperCase();
      }
    }
  } catch (e) { console.warn('profile fetch failed', e); }

  const sigBtn = document.getElementById('drive-signin-btn');
  if (sigBtn) {
    sigBtn.textContent = 'Sign out';
    sigBtn.className   = 'drive-btn drive-btn-signout';
    sigBtn.onclick     = driveSignOut;
  }
  const notice = document.getElementById('drive-notice');
  if (notice) notice.style.display = 'none';

  const uploadZone = document.getElementById('upload-zone');
  if (uploadZone) uploadZone.style.display = '';

  const fid = getFolderId();
  if (!fid) {
    const fc = document.getElementById('folder-cfg');
    if (fc) fc.style.display = '';
    setText('mem-empty-text', 'Set up the shared folder first');
    setText('mem-empty-sub',  'Paste the Drive folder ID below ↑');
  } else {
    const fc = document.getElementById('folder-cfg');
    if (fc) fc.style.display = 'none';
    loadDrivePhotos();
  }
}

function driveSignIn() {
  const clientId = loadData().driveClientId || '';

  if (!clientId) {
    alert('⚙ Setup needed:\n\nOpen the admin panel → Settings → Google Drive Setup\nto enter your Google Client ID.\n\nSee the HOW-TO-HOST guide for instructions.');
    return;
  }

  if (!driveReady) {
    // Poll until ready (gapi may still be loading)
    const btn  = document.getElementById('drive-signin-btn');
    const orig = btn ? btn.textContent : '';
    if (btn) { btn.textContent = 'Loading…'; btn.disabled = true; }
    let tries = 0;
    const poll = setInterval(() => {
      tries++;
      if (driveReady) {
        clearInterval(poll);
        if (btn) { btn.textContent = orig; btn.disabled = false; }
        _doSignIn(clientId);
      } else if (tries > 24) { // 6 s timeout
        clearInterval(poll);
        if (btn) { btn.textContent = orig; btn.disabled = false; }
        alert('Google API failed to load. Check your internet connection and refresh the page.');
      }
    }, 250);
    return;
  }

  _doSignIn(clientId);
}

function _doSignIn(clientId) {
  if (!tokenClient || tokenClient._clientId !== clientId) {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope:     GAPI_SCOPES,
      callback:  onTokenResponse,
    });
    tokenClient._clientId = clientId;
  }
  tokenClient.requestAccessToken({ prompt: '' });
}

function driveSignOut() {
  if (driveToken) {
    try { google.accounts.oauth2.revoke(driveToken.access_token, () => {}); } catch {}
  }
  driveToken = null;
  try { localStorage.removeItem('ourday_drive_token'); } catch {}
  location.reload();
}

/* ── FOLDER ID ───────────────────────────── */
function getFolderId() {
  return loadData().driveFolderId || localStorage.getItem(FOLDER_KEY) || '';
}
function saveFolderId() {
  const v = (document.getElementById('folder-id-input')?.value || '').trim();
  if (!v) { alert('Please paste a folder ID.'); return; }
  localStorage.setItem(FOLDER_KEY, v);
  const d = loadData(); d.driveFolderId = v; saveData(d);
  const fc = document.getElementById('folder-cfg');
  if (fc) fc.style.display = 'none';
  loadDrivePhotos();
}

/* ── LOAD PHOTOS ─────────────────────────── */
async function loadDrivePhotos() {
  const fid = getFolderId();
  if (!fid || !driveToken) return;
  setMemEmpty('loading');
  try {
    const res = await gapi.client.drive.files.list({
      q:         `'${fid}' in parents and mimeType contains 'image/' and trashed=false`,
      fields:    'files(id,name,appProperties,createdTime)',
      orderBy:   'createdTime',
      pageSize:  100,
    });
    const files = res.result.files || [];
    // Fetch all as authenticated blobs (avoids CORS for <img> and canvas)
    memPhotos = await Promise.all(files.map(async f => ({
      id:      f.id,
      name:    f.name,
      caption: f.appProperties?.[CAPTION_META] || '',
      blobUrl: await fetchDriveBlob(f.id),
    })));
    stripSelection = []; // reset on fresh load
    renderMemories();
  } catch (e) {
    console.error('loadDrivePhotos error', e);
    setMemEmpty('error');
  }
}

async function fetchDriveBlob(fileId) {
  try {
    const resp = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      { headers: { Authorization: 'Bearer ' + driveToken.access_token } }
    );
    if (!resp.ok) throw new Error(resp.status);
    return URL.createObjectURL(await resp.blob());
  } catch (e) {
    console.warn('fetchDriveBlob failed', fileId, e);
    return '';
  }
}

function setMemEmpty(state) {
  const el = document.getElementById('mem-empty');
  const t  = document.getElementById('mem-empty-text');
  const s  = document.getElementById('mem-empty-sub');
  if (!el) return;
  if (state === 'loading') {
    el.style.display = '';
    if (t) t.textContent = 'Loading memories…';
    if (s) s.textContent = '';
    const grid  = document.getElementById('polaroid-grid');
    const booth = document.getElementById('booth-section');
    const count = document.getElementById('mem-count');
    if (grid)  grid.innerHTML     = '';
    if (booth) booth.style.display = 'none';
    if (count) count.style.display = 'none';
  } else if (state === 'empty') {
    el.style.display = '';
    if (t) t.textContent = 'No memories yet…';
    if (s) s.textContent = 'Upload your first photo to get started';
  } else if (state === 'error') {
    el.style.display = '';
    if (t) t.textContent = 'Couldn\'t load photos';
    if (s) s.textContent = 'Check your folder ID and try refreshing';
  } else {
    el.style.display = 'none';
  }
}

/* ── NAVIGATE TO MEMORIES ────────────────── */
function goToMemories() {
  localStorage.setItem(SCREEN_KEY, 'memories');
  showScreen('screen-memories');
  if (!driveReady && window.gapi) initDriveApi();
  if (driveToken) loadDrivePhotos();
}

/* ── UPLOAD ──────────────────────────────── */
function handlePhotos(files) {
  if (!files || !files.length) return;
  if (!driveToken) { driveSignIn(); return; }
  const fid = getFolderId();
  if (!fid) {
    const fc = document.getElementById('folder-cfg');
    if (fc) fc.style.display = '';
    alert('Please set the shared folder ID first.');
    return;
  }
  pendingFiles = Array.from(files);
  processNextFile();
}

function processNextFile() {
  if (!pendingFiles.length) return;
  currentFile = pendingFiles.shift();
  compressFile(currentFile).then(blob => {
    currentBlob = blob;
    const modal = document.getElementById('caption-modal');
    const prev  = document.getElementById('caption-preview');
    const inp   = document.getElementById('caption-input');
    if (prev)  prev.src = URL.createObjectURL(blob);
    if (inp)   inp.value = '';
    if (modal) modal.classList.add('open');
    setTimeout(() => inp?.focus(), 200);
  }).catch(e => {
    console.error('compressFile failed', e);
    if (pendingFiles.length) setTimeout(processNextFile, 300);
  });
}

function compressFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload  = e => {
      const img = new Image();
      img.onerror = reject;
      img.onload  = () => {
        const MAX = 1600;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else       { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/jpeg', 0.88);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function saveCaption() {
  const cap   = (document.getElementById('caption-input')?.value || '').trim();
  const modal = document.getElementById('caption-modal');
  if (modal) modal.classList.remove('open');
  uploadToDrive(currentBlob, currentFile.name, cap);
}
function skipCaption() {
  const modal = document.getElementById('caption-modal');
  if (modal) modal.classList.remove('open');
  uploadToDrive(currentBlob, currentFile.name, '');
}

async function uploadToDrive(blob, filename, caption) {
  const fid = getFolderId();
  setUploadProgress(true, 'Uploading…');
  const ext  = (filename.split('.').pop() || 'jpg').toLowerCase();
  const ts   = new Date().toISOString().replace(/[:.]/g, '-');
  const name = `ourday-${ts}.${ext}`;
  const meta = { name, parents: [fid], appProperties: { [CAPTION_META]: caption } };

  try {
    const boundary  = '-------ourday_boundary_' + Date.now();
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelim= `\r\n--${boundary}--`;
    const metaStr   = JSON.stringify(meta);

    // Read blob as base64
    const base64 = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onerror = rej;
      r.onload  = e => res(e.target.result.split(',')[1]);
      r.readAsDataURL(blob);
    });

    const body = delimiter
      + 'Content-Type: application/json\r\n\r\n'
      + metaStr
      + delimiter
      + `Content-Type: ${blob.type || 'image/jpeg'}\r\nContent-Transfer-Encoding: base64\r\n\r\n`
      + base64
      + closeDelim;

    const resp = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,appProperties',
      {
        method: 'POST',
        headers: {
          Authorization:  'Bearer ' + driveToken.access_token,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body,
      }
    );
    if (!resp.ok) throw new Error('Upload failed: ' + resp.status);
    const file = await resp.json();

    // Add immediately using the blob we already have
    memPhotos.push({
      id:      file.id,
      name:    file.name,
      caption,
      blobUrl: URL.createObjectURL(blob),
    });
    setUploadProgress(false, '');
    renderMemories();
    if (pendingFiles.length) setTimeout(processNextFile, 300);
  } catch (err) {
    console.error('uploadToDrive error', err);
    setUploadProgress(false, '');
    alert('Upload failed. Check your internet connection and try again.');
    if (pendingFiles.length) setTimeout(processNextFile, 300);
  }
}

function setUploadProgress(busy, msg) {
  const spinner = document.getElementById('upload-spinner');
  const icon    = document.getElementById('upload-icon');
  const prog    = document.getElementById('upload-progress');
  if (spinner) spinner.style.display = busy ? 'block' : 'none';
  if (icon)    icon.style.display    = busy ? 'none'  : '';
  if (prog)    prog.textContent      = msg;
}

/* ── DELETE PHOTO ────────────────────────── */
async function removePhoto(idx) {
  if (!confirm('Remove this memory from the shared album?')) return;
  const photo = memPhotos[idx];
  if (!photo) return;
  try {
    await gapi.client.drive.files.delete({ fileId: photo.id });
    if (photo.blobUrl) URL.revokeObjectURL(photo.blobUrl);
    memPhotos.splice(idx, 1);
    stripSelection = stripSelection.filter(i => i !== idx).map(i => i > idx ? i - 1 : i);
    renderMemories();
  } catch (e) {
    alert('Could not delete. You can only delete photos you uploaded.');
    console.error(e);
  }
}

/* ── RENDER POLAROIDS ────────────────────── */
function renderMemories() {
  const grid  = document.getElementById('polaroid-grid');
  const booth = document.getElementById('booth-section');
  const count = document.getElementById('mem-count');
  if (!grid) return;
  grid.innerHTML = '';

  if (!memPhotos.length) {
    setMemEmpty('empty');
    if (booth) booth.style.display = 'none';
    if (count) count.style.display = 'none';
    stripSelection = [];
    return;
  }
  setMemEmpty('hidden');
  if (booth) booth.style.display = '';
  if (count) { count.style.display = ''; count.textContent = `${memPhotos.length} memor${memPhotos.length===1?'y':'ies'} captured ♡`; }

  // Sanitise strip selection
  stripSelection = stripSelection.filter(i => i >= 0 && i < memPhotos.length);
  renderStrip();

  const ROTS = [-3,-1.5,2,0.5,-2,1,-0.5,2.5,-1,1.5,3,-2.5];
  memPhotos.forEach((photo, i) => {
    const rot    = ROTS[i % ROTS.length];
    const selIdx = stripSelection.indexOf(i);
    const isSel  = selIdx !== -1;
    const p = document.createElement('div');
    p.className = 'polaroid' + (isSel ? ' strip-selected' : '');
    p.style.setProperty('--r', rot + 'deg');
    p.style.transform     = `rotate(${rot}deg)`;
    p.style.animationDelay= (i * 0.06) + 's';
    p.title = isSel ? 'Tap to remove from strip' : 'Tap to add to strip';
    // Use textContent-safe approach for caption to avoid XSS
    p.innerHTML = `
      <span class="polaroid-heart">♡</span>
      <div class="strip-badge">${isSel ? selIdx + 1 : ''}</div>
      <img class="polaroid-img" src="${escAttr(photo.blobUrl)}" alt="memory ${i+1}" loading="lazy">
      <div class="polaroid-caption"></div>
      <button class="polaroid-remove" title="Remove">✕</button>`;
    p.querySelector('.polaroid-caption').textContent = photo.caption || '✦';
    p.querySelector('.polaroid-remove').addEventListener('click', e => { e.stopPropagation(); removePhoto(i); });
    p.addEventListener('click', () => toggleStripPhoto(i));
    grid.appendChild(p);
  });
}

/* ── STRIP SELECTION ─────────────────────── */
function toggleStripPhoto(idx) {
  const pos = stripSelection.indexOf(idx);
  if (pos !== -1) {
    stripSelection.splice(pos, 1);
  } else {
    if (stripSelection.length >= 4) stripSelection.shift(); // bump oldest out
    stripSelection.push(idx);
  }
  renderStrip();
  // Update badges without full grid rebuild
  document.querySelectorAll('.polaroid').forEach((el, i) => {
    const selIdx = stripSelection.indexOf(i);
    const isSel  = selIdx !== -1;
    el.classList.toggle('strip-selected', isSel);
    el.title = isSel ? 'Tap to remove from strip' : 'Tap to add to strip';
    const badge = el.querySelector('.strip-badge');
    if (badge) badge.textContent = isSel ? selIdx + 1 : '';
  });
}

function clearStripSelection() {
  stripSelection = [];
  renderStrip();
  document.querySelectorAll('.polaroid').forEach((el, i) => {
    el.classList.remove('strip-selected');
    el.title = 'Tap to add to strip';
    const badge = el.querySelector('.strip-badge');
    if (badge) badge.textContent = '';
  });
}

/* ── RENDER STRIP ────────────────────────── */
function renderStrip() {
  const strip = document.getElementById('photo-strip');
  if (!strip) return;
  const dateStr  = loadData().map.date || 'our day ♡';
  const indices  = stripSelection.length ? stripSelection : memPhotos.slice(0, 4).map((_, i) => i);
  const frames   = indices.map(i => memPhotos[i]).filter(Boolean);
  const empties  = 4 - frames.length;

  const countEl = document.getElementById('strip-pick-count');
  if (countEl) countEl.textContent = `${stripSelection.length} / 4 selected`;

  strip.innerHTML =
    `<div class="strip-header">OUR DAY ♡</div>` +
    frames.map((ph, i) =>
      `<div class="strip-frame"><img src="${escAttr(ph.blobUrl)}" alt="frame ${i+1}"></div>` +
      `<div class="strip-caption">${escHtml(ph.caption) || '&nbsp;'}</div>`
    ).join('') +
    Array.from({ length: empties }).map(() =>
      `<div class="strip-frame"><div class="strip-frame-empty-slot">📷<span>tap a photo</span></div></div>` +
      `<div class="strip-caption">&nbsp;</div>`
    ).join('') +
    `<div class="strip-date-label">${escHtml(dateStr)}</div>`;
}

/* ── DOWNLOAD STRIP ──────────────────────── */
function downloadStrip() {
  const indices = stripSelection.length ? stripSelection : memPhotos.slice(0, 4).map((_, i) => i);
  const frames  = indices.map(i => memPhotos[i]).filter(Boolean);
  if (!frames.length) return;

  const W = 240, FH = 180, CAP = 22, HEADER = 42, FOOTER = 34, PAD = 16;
  const totalH = HEADER + (FH + CAP) * 4 + FOOTER + PAD;
  const canvas = document.createElement('canvas');
  canvas.width  = W * 2;
  canvas.height = totalH * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  // Background
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, W, totalH);
  // Header
  ctx.fillStyle = '#888'; ctx.font = 'italic 11px serif'; ctx.textAlign = 'center';
  ctx.fillText('OUR DAY ♡', W / 2, 26);
  ctx.strokeStyle = '#333'; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(14, 34); ctx.lineTo(W - 14, 34); ctx.stroke();

  const loadImg = src => new Promise((res, rej) => {
    if (!src) { rej(new Error('no src')); return; }
    const img = new Image();
    img.onload  = () => res(img);
    img.onerror = () => rej(new Error('img load failed'));
    img.src = src;
  });

  const dateStr = loadData().map.date || 'our day';
  Promise.all(frames.map(f => loadImg(f.blobUrl))).then(imgs => {
    let y = HEADER;
    imgs.forEach((img, i) => {
      const fw = W - PAD * 2, fh = FH, fx = PAD;
      const ar = img.width / img.height, far = fw / fh;
      let sx, sy, sw, sh;
      if (ar > far) { sw = img.height * far; sh = img.height; sx = (img.width - sw) / 2; sy = 0; }
      else          { sh = img.width / far;  sw = img.width;  sy = (img.height - sh) / 2; sx = 0; }
      ctx.fillStyle = '#222'; ctx.fillRect(fx, y, fw, fh);
      ctx.drawImage(img, sx, sy, sw, sh, fx, y, fw, fh);
      y += fh;
      ctx.fillStyle = '#777'; ctx.font = 'italic 9px serif'; ctx.textAlign = 'center';
      ctx.fillText(frames[i].caption || '', W / 2, y + 14);
      y += CAP;
    });
    ctx.strokeStyle = '#333'; ctx.beginPath(); ctx.moveTo(14, y + 4); ctx.lineTo(W - 14, y + 4); ctx.stroke();
    ctx.fillStyle = '#666'; ctx.font = '10px serif';
    ctx.fillText(dateStr, W / 2, y + 18);

    const a = document.createElement('a');
    a.download = 'our-day-photobooth.png';
    a.href     = canvas.toDataURL('image/png');
    a.click();
  }).catch(() => alert('Could not generate strip. Try refreshing and signing in again.'));
}

/* ─────────────────────────────────────────
   ADMIN PANEL
───────────────────────────────────────── */
let authed = false;

function openAdmin() {
  document.getElementById('admin-overlay')?.classList.add('open');
  if (!authed) {
    setDisplay('pwd-gate',      '');
    setDisplay('editor-panel', 'none');
  } else {
    populateEditor();
  }
}
function closeAdmin() { document.getElementById('admin-overlay')?.classList.remove('open'); }
function overlayClick(e) { if (e.target === document.getElementById('admin-overlay')) closeAdmin(); }

function checkPwd() {
  const input = document.getElementById('pwd-input');
  const val   = input?.value || '';
  if (val === loadData().pwd) {
    authed = true;
    setDisplay('pwd-gate',     'none');
    setDisplay('editor-panel', '');
    populateEditor();
  } else {
    setText('pwd-err', 'That\'s not right… try again 😅');
    if (input) input.value = '';
  }
}

function switchTab(id, btn) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  btn?.classList.add('active');
}

function populateEditor() {
  const d = loadData();
  setVal('cfg-eyebrow',   d.ask.eyebrow);
  setVal('cfg-greeting',  d.ask.greeting);
  setVal('cfg-main-text', d.ask.mainText);
  setVal('cfg-ask-body',  d.ask.body);
  setVal('cfg-ask-sign',  d.ask.sign);
  setVal('cfg-celeb-sub', d.celebrate.sub);
  setVal('cfg-gif-url',   d.celebrate.gifUrl || '');
  setVal('cfg-title',     d.map.title);
  setVal('cfg-date',      d.map.date);
  setVal('cfg-msg',       d.map.msg);
  setVal('cfg-note',      d.map.note);
  setVal('cfg-sig',       d.map.sig);
  setVal('cfg-pwd',       d.pwd);
  setVal('cfg-client-id', d.driveClientId || '');
  setVal('cfg-folder-id', d.driveFolderId || localStorage.getItem(FOLDER_KEY) || '');
  renderStopEditors(d.stops);
}

function renderStopEditors(stops) {
  const c = document.getElementById('stops-container');
  if (!c) return;
  c.innerHTML = '';
  stops.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'stop-editor';
    div.innerHTML = `
      <div class="stop-editor-hdr">
        <span class="stop-editor-num">Stop ${i + 1}</span>
        <button class="remove-stop" data-idx="${i}">Remove</button>
      </div>
      <div class="field-row">
        <div class="field"><label>Emoji</label><input type="text"  class="f-emoji" value="${escAttr(s.emoji)}"></div>
        <div class="field"><label>Reveal Time (24h)</label><input type="time" class="f-time" value="${escAttr(s.time)}"></div>
      </div>
      <div class="field-row full"><div class="field"><label>Place Name</label><input type="text" class="f-name" value="${escAttr(s.name)}"></div></div>
      <div class="field-row full"><div class="field"><label>Description</label><textarea class="f-desc">${escHtml(s.desc)}</textarea></div></div>
      <div class="field-row full"><div class="field"><label>Hint (shown after unlock)</label><input type="text" class="f-hint" value="${escAttr(s.hint||'')}"></div></div>
      <div class="field-row full"><div class="field"><label>Google Maps Link</label><input type="url" class="f-map" value="${escAttr(s.mapUrl||'')}"></div></div>`;
    div.querySelector('.remove-stop').addEventListener('click', () => removeStop(i));
    c.appendChild(div);
  });
}

function addStop() {
  const d = loadData();
  d.stops.push({ emoji:'✨', name:'New Stop', time:'12:00', desc:'Describe this stop…', hint:'', mapUrl:'' });
  saveData(d);
  renderStopEditors(d.stops);
}

function removeStop(i) {
  const d = loadData();
  d.stops.splice(i, 1);
  saveData(d);
  renderStopEditors(d.stops);
}

function collectStops() {
  return Array.from(document.querySelectorAll('.stop-editor')).map(e => ({
    emoji:  e.querySelector('.f-emoji')?.value.trim() || '✨',
    time:   e.querySelector('.f-time')?.value  || '12:00',
    name:   e.querySelector('.f-name')?.value.trim()  || '',
    desc:   e.querySelector('.f-desc')?.value.trim()  || '',
    hint:   e.querySelector('.f-hint')?.value.trim()  || '',
    mapUrl: e.querySelector('.f-map')?.value.trim()   || '',
  }));
}

function saveAll() {
  const stops       = collectStops();
  stops.sort((a, b) => parseTime(a.time) - parseTime(b.time));
  const newClientId = (document.getElementById('cfg-client-id')?.value || '').trim();
  const newFolderId = (document.getElementById('cfg-folder-id')?.value || '').trim();

  const d = {
    pwd:           (document.getElementById('cfg-pwd')?.value       || '').trim() || DEFAULT.pwd,
    driveClientId: newClientId,
    driveFolderId: newFolderId,
    ask: {
      eyebrow:  (document.getElementById('cfg-eyebrow')?.value   || '').trim() || DEFAULT.ask.eyebrow,
      greeting: (document.getElementById('cfg-greeting')?.value  || '').trim() || DEFAULT.ask.greeting,
      mainText: (document.getElementById('cfg-main-text')?.value || '').trim() || DEFAULT.ask.mainText,
      body:     (document.getElementById('cfg-ask-body')?.value  || '').trim() || DEFAULT.ask.body,
      sign:     (document.getElementById('cfg-ask-sign')?.value  || '').trim() || DEFAULT.ask.sign,
    },
    celebrate: {
      sub:    (document.getElementById('cfg-celeb-sub')?.value || '').trim() || DEFAULT.celebrate.sub,
      gifUrl: (document.getElementById('cfg-gif-url')?.value   || '').trim(),
    },
    map: {
      title: (document.getElementById('cfg-title')?.value || '').trim() || DEFAULT.map.title,
      date:  (document.getElementById('cfg-date')?.value  || '').trim() || DEFAULT.map.date,
      msg:   (document.getElementById('cfg-msg')?.value   || '').trim() || DEFAULT.map.msg,
      note:  (document.getElementById('cfg-note')?.value  || '').trim() || DEFAULT.map.note,
      sig:   (document.getElementById('cfg-sig')?.value   || '').trim() || DEFAULT.map.sig,
    },
    stops,
  };

  saveData(d);
  if (newFolderId) { try { localStorage.setItem(FOLDER_KEY, newFolderId); } catch {} }

  // If client ID changed, re-init Drive on next sign-in
  if (newClientId && newClientId !== tokenClient?._clientId) {
    driveReady      = false;
    driveApiIniting = false;
    gapiInitDone    = false;
    tokenClient     = null;
    if (window.gapi) initDriveApi();
  }

  renderAskScreen();
  const conf = document.getElementById('save-confirm');
  if (conf) { conf.textContent = '✦ Saved! All settings updated ✦'; setTimeout(() => conf.textContent = '', 3000); }
}

function resetScreen() {
  try { localStorage.removeItem(SCREEN_KEY); } catch {}
  const c = document.getElementById('reset-confirm');
  if (c) { c.textContent = '✦ Reset! She will see the asking-out screen next visit.'; setTimeout(() => c.textContent = '', 3500); }
}

/* ─────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────── */
function setText(id, text)    { const el = document.getElementById(id); if (el) el.textContent = text; }
function setVal(id, val)      { const el = document.getElementById(id); if (el) el.value = val; }
function setDisplay(id, disp) { const el = document.getElementById(id); if (el) el.style.display = disp; }
function escHtml(s)  { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escAttr(s)  { return String(s||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

/* ─────────────────────────────────────────
   UPLOAD / DRAG & DROP SETUP
───────────────────────────────────────── */
function setupUpload() {
  const input = document.getElementById('photo-input');
  const dz    = document.getElementById('drop-zone');
  if (!input || !dz) return;
  input.addEventListener('change', () => handlePhotos(input.files));
  dz.addEventListener('dragover',  e => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop',      e => { e.preventDefault(); dz.classList.remove('drag-over'); handlePhotos(e.dataTransfer.files); });
}

// Caption Enter key
function setupCaptionKey() {
  const inp = document.getElementById('caption-input');
  if (!inp) return;
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); saveCaption(); } });
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setupUpload();
  setupCaptionKey();
  renderAskScreen();

  // Try gapi if already loaded (unlikely but safe)
  if (window.gapi) gapiLoaded();

  // Restore saved screen
  const s = localStorage.getItem(SCREEN_KEY);
  if      (s === 'map')      { showScreen('screen-map');      renderMapScreen();  }
  else if (s === 'yes')      { showScreen('screen-yes');      renderCelebScreen(); }
  else if (s === 'memories') { showScreen('screen-memories'); /* Drive loads after sign-in */ }
});
