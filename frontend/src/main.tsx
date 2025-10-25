import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// TEMPORARY: Stack Auth disabled for MVP - will re-enable post-MVP
// import { StackProvider } from '@stackframe/stack';
// import { stackClient } from './lib/stackAuth';
import './index.css';
import './i18n'; // Initialize i18next before App
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* TEMPORARY: Stack Auth disabled for MVP - will re-enable post-MVP */}
    {/* <StackProvider app={stackClient}> */}
      <App />
    {/* </StackProvider> */}
  </StrictMode>
);
