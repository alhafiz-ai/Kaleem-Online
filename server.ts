import express from 'express';
import path from 'path';
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
app.use(express.static(distPath));

// Admin route fallback
app.get('/admin', (_req, res) => {
  res.sendFile(path.join(distPath, 'admin.html'), (err) => {
    if (err) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
});

// Single Page Application (SPA) fallback to index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Production server running on http://0.0.0.0:${PORT}`);
});
