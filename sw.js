// sw.js
self.addEventListener('notificationclick', event => {
  event.notification.close();
  // Al hacer clic, abre o enfoca tu app de Pomodoro
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      if (windowClients.length > 0) return windowClients[0].focus();
      return clients.openWindow('/');
    })
  );
});
