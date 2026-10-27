/**
 * Sandbox-safe helpers for external links and saving printable certificates/receipts
 * without relying on blocked popups (`window.open` / `window.alert` / `window.confirm`).
 */

export function openExternalSafe(url: string): void {
  if (typeof document === 'undefined' || !url) return;
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    if (anchor.parentNode) {
      anchor.parentNode.removeChild(anchor);
    }
  }, 150);
}

export function downloadPrintableElement(
  elementId: string,
  filename: string,
  documentTitle = 'Kaleem Online Academy — Official Document'
): boolean {
  if (typeof document === 'undefined') return false;
  const el = document.getElementById(elementId);
  if (!el) return false;

  const dir = document.documentElement.dir || 'ltr';
  const lang = document.documentElement.lang || 'en';

  const htmlDocument = `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${documentTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800&family=Noto+Naskh+Arabic:wght@400;600;700&family=Outfit:wght@400;600;700;800&family=Reem+Kufi:wght@600;700&display=swap" rel="stylesheet" />
  <style>
    body {
      font-family: 'Outfit', 'Noto Naskh Arabic', 'Cairo', sans-serif;
      background: #f8fafc;
      padding: 24px;
      margin: 0;
    }
    .font-amiri { font-family: 'Amiri', 'Noto Naskh Arabic', serif; }
    .font-academy-brand { font-family: 'Reem Kufi', 'Amiri', 'Cairo', sans-serif; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .no-print-bar { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print-bar max-w-3xl mx-auto mb-5 flex items-center justify-between gap-4 bg-emerald-950 text-white px-5 py-3 rounded-xl shadow">
    <span style="font-size:14px;font-weight:700;">${documentTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
    <button onclick="window.print()" style="background:#d97706;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-weight:700;cursor:pointer;">
      Print / Save as PDF
    </button>
  </div>
  <div class="max-w-3xl mx-auto">
    ${el.outerHTML}
  </div>
</body>
</html>`;

  const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (link.parentNode) link.parentNode.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }, 250);
  return true;
}
