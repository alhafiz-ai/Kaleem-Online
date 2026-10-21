import { createRoot } from 'react-dom/client';
import { AdminPanel } from './components/AdminPanel';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <AdminPanel onBackToSite={() => { window.location.href = '/'; }} />
  );
}
