import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AdminPage from './admin.tsx';
import './index.css';

const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {pathname === '/admin' || pathname === '/admin/' ? <AdminPage /> : <App />}
  </StrictMode>,
);
