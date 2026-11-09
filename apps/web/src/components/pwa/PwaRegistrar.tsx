'use client';

import { useEffect } from 'react';

export function PwaRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (reg) => {
            console.log('[Underground Tools] ServiceWorker registrado com sucesso:', reg.scope);
          },
          (err) => {
            console.log('[Underground Tools] Falha ao registrar ServiceWorker:', err);
          }
        );
      });
    }
  }, []);

  return null;
}
