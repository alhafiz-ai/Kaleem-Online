import { createRoot } from 'react-dom/client';
import { AdminPanel } from './components/AdminPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <AdminPanel onBackToSite={() => { window.location.href = './'; }} />
    </ErrorBoundary>
  );
}

