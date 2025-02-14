import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'sonner';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <Toaster position="top-center" richColors  />
    <App />
  </StrictMode>
);

