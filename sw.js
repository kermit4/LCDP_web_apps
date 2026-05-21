self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('message', e => {
    if (e.data && e.data.type === 'notify') {
        self.registration.showNotification(e.data.title, { body: e.data.body });
    }
});

self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
            for (const client of list) {
                if (client.url.includes('/group_chat.html') && 'focus' in client)
                    return client.focus();
            }
            return self.clients.openWindow('group_chat.html');
        })
    );
});
