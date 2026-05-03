// ── Terminal log lines ────────────────────────────────────────────────────
const logs = [
  { cls: 't-muted',   text: '$ docker run -d -p 3000:3000 nexus-app' },
  { cls: 't-muted',   text: '' },
  { cls: 't-cyan',    text: '> nexus-static-app@1.0.0 start' },
  { cls: 't-cyan',    text: '> node src/server.js' },
  { cls: 't-muted',   text: '' },
  { cls: 't-green',   text: '✅  Server running  →  http://0.0.0.0:3000' },
  { cls: 't-green',   text: '🌍  Environment     →  production' },
  { cls: 't-green',   text: '🏥  Health check    →  http://0.0.0.0:3000/health' },
  { cls: 't-muted',   text: '' },
  { cls: 't-yellow',  text: 'GET  /          200  1ms' },
  { cls: 't-yellow',  text: 'GET  /health    200  0ms' },
  { cls: 't-yellow',  text: 'GET  /api/info  200  1ms' },
  { cls: 't-muted',   text: '' },
  { cls: 't-magenta', text: '🐳  Container healthy · uptime ticking…' },
];

function renderTerminal() {
  const body = document.getElementById('termBody');
  if (!body) return;
  let i = 0;
  function next() {
    if (i >= logs.length) {
      // blinking cursor at end
      const cur = document.createElement('span');
      cur.className = 't-cursor';
      body.appendChild(cur);
      return;
    }
    const el = document.createElement('span');
    el.className = `t-line ${logs[i].cls}`;
    el.textContent = logs[i].text || '\u00A0';
    el.style.animationDelay = `${i * 0.18}s`;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    i++;
    setTimeout(next, 180);
  }
  next();
}

// ── Fetch /api/info and populate stats ───────────────────────────────────
async function loadStats() {
  const pill = document.getElementById('statusPill');
  try {
    const res  = await fetch('/api/info');
    const data = await res.json();

    set('sStatus', '● ONLINE');
    set('sUptime', data.uptime);
    set('sNode',   data.node);
    set('sHeap',   data.memory.heapUsed);
    set('sEnv',    data.env.toUpperCase());
    set('sPort',   data.port);

    if (pill) { pill.textContent = '● Online'; }
    // refresh uptime every 5 s
    setInterval(async () => {
      try {
        const r = await fetch('/api/info');
        const d = await r.json();
        set('sUptime', d.uptime);
        set('sHeap',   d.memory.heapUsed);
      } catch { /* silent */ }
    }, 5000);
  } catch {
    if (pill) { pill.textContent = '● Offline'; pill.style.color = '#FF0080'; }
    set('sStatus', 'OFFLINE');
  }
}

function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── Boot ─────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  renderTerminal();
  loadStats();
});
