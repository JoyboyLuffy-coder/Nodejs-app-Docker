const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const ENV  = process.env.NODE_ENV || 'development';

// ── Serve static files ──────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'public')));

// ── Health-check endpoint (used by Docker HEALTHCHECK) ─────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status : 'ok',
    uptime : process.uptime().toFixed(2) + 's',
    env    : ENV,
    time   : new Date().toISOString(),
  });
});

// ── API: basic server info ─────────────────────────────────────────────────
app.get('/api/info', (req, res) => {
  res.json({
    app     : 'Nexus Static App',
    version : '1.0.0',
    node    : process.version,
    env     : ENV,
    port    : PORT,
    uptime  : process.uptime().toFixed(2) + 's',
    memory  : {
      rss        : (process.memoryUsage().rss        / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed   : (process.memoryUsage().heapUsed   / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal  : (process.memoryUsage().heapTotal  / 1024 / 1024).toFixed(2) + ' MB',
    },
  });
});

// ── SPA fallback – send index.html for any unknown route ──────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅  Server running  →  http://0.0.0.0:${PORT}`);
  console.log(`🌍  Environment     →  ${ENV}`);
  console.log(`🏥  Health check    →  http://0.0.0.0:${PORT}/health`);
});
