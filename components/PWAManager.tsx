/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isIOSStandalone = (window.navigator as any).standalone === true;
      
      setIsInstalled(isStandalone || (isIOS && isIOSStandalone));
    };

    checkIfInstalled();

    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Plan-Eat: Service Worker registered successfully:', registration);
          
          // Vérifier les mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Une nouvelle version est disponible
                  if (confirm('Une nouvelle version de Plan-Eat est disponible. Voulez-vous la recharger ?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Plan-Eat: Service Worker registration failed:', error);
        });
    }

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Écouter l'événement d'installation
    window.addEventListener('appinstalled', () => {
      console.log('Plan-Eat: App installed successfully');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('Plan-Eat: User accepted the install prompt');
      } else {
        console.log('Plan-Eat: User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Plan-Eat: Error during installation:', error);
    }
  };

  // Bouton d'installation personnalisé
  if (isInstallable && !isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleInstallClick}
          className="bg-gradient-to-r from-[#3b82f6] to-[#10b981] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium hover:-translate-y-1"
          title="Installer Plan-Eat sur votre appareil"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Install App
        </button>
      </div>
    );
  }

  // Indicateur que l'app est installée
  if (isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-50 opacity-0 pointer-events-none">
        <div className="bg-green-500 text-white px-3 py-2 rounded-full text-xs">
          ✓ App installée
        </div>
      </div>
    );
  }

  return null;
}

// Hook personnalisé pour les fonctionnalités PWA
export function usePWA() {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier le statut en ligne/hors ligne
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier si l'app est installée
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isIOSStandalone = (window.navigator as any).standalone === true;
      
      setIsInstalled(isStandalone || (isIOS && isIOSStandalone));
    };

    checkIfInstalled();
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const clearCache = async () => {
    if ('serviceWorker' in navigator && 'caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      
      // Envoyer un message au service worker pour vider ses caches
      if (navigator.serviceWorker.controller) {
        const messageChannel = new MessageChannel();
        navigator.serviceWorker.controller.postMessage(
          { type: 'CACHE_CLEAR' },
          [messageChannel.port2]
        );
      }
    }
  };

  return {
    isOnline,
    isInstalled,
    clearCache
  };
}
