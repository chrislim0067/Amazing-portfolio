import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@/styles/global.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element #root not found');
}

// StrictMode is intentionally omitted — the legacy WebGL runtime cannot safely
// mount twice in development.
createRoot(root).render(<App />);
