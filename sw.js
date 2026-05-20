self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('message', e => {
    if (e.data && e.data.type === 'notify') {
        self.registration.showNotification(e.data.title, { body: e.data.body });
    }
});
