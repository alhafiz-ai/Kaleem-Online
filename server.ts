import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Health check endpoint for Cloud Run container liveness probe
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// Serve compiled static assets from Vite build
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Admin route fallback
app.get('/admin', (_req, res) => {
  const adminFile = path.join(distPath, 'admin.html');
  const indexFile = path.join(distPath, 'index.html');
  if (fs.existsSync(adminFile)) {
    res.sendFile(adminFile);
  } else if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(200).send('Applet building, please refresh in a moment...');
  }
});

// Single Page Application (SPA) fallback to index.html
app.get('*', (_req, res) => {
  const indexFile = path.join(distPath, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(200).send('Applet building, please refresh in a moment...');
  }
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Production server running on http://0.0.0.0:${PORT}`);
});
