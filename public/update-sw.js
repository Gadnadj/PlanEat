// Script pour forcer la mise à jour du service worker
(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      console.log('🔄 Unregistering old service workers...');
      
      // Désinscrire tous les service workers existants
      const promises = registrations.map(registration => {
        console.log('Unregistering:', registration.scope);
        return registration.unregister();
      });
      
      return Promise.all(promises);
    }).then(() => {
      console.log('✅ All service workers unregistered');
      
      // Réinscrire le nouveau service worker
      return navigator.serviceWorker.register('/sw.js');
    }).then(registration => {
      console.log('✅ New service worker registered:', registration);
      
      // Forcer l'activation immédiate
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      // Recharger la page pour utiliser le nouveau SW
      setTimeout(() => {
        console.log('🔄 Reloading page to apply changes...');
        window.location.reload();
      }, 1000);
      
    }).catch(error => {
      console.error('❌ Service worker update failed:', error);
    });
  }
})();

