import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));

// Health check endpoints for Cloud Run container startup & liveness probes
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// Serve compiled static assets from Vite build
const distPath = path.join(__dirname, 'dist');
app.use(
  express.static(distPath, {
    index: 'index.html',
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

// Return 404 for missing static assets instead of SPA HTML fallback
app.use('/assets', (_req, res) => {
  res.status(404).send('Asset not found');
});

// Admin route fallback (/admin and /admin/*)
app.get(['/admin', '/admin/*'], (_req, res) => {
  const adminFile = path.join(distPath, 'admin.html');
  const indexFile = path.join(distPath, 'index.html');
  if (fs.existsSync(adminFile)) {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(adminFile);
  } else if (fs.existsSync(indexFile)) {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(indexFile);
  } else {
    res.status(200).send('Kaleem Online Academy is starting up, please refresh in a moment...');
  }
});

// Single Page Application (SPA) fallback to index.html
app.get('*', (_req, res) => {
  const indexFile = path.join(distPath, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(indexFile);
  } else {
    res.status(200).send('Kaleem Online Academy is starting up, please refresh in a moment...');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});

