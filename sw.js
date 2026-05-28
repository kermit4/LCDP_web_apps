const CACHE = 'cjp2p-v1';
const APP_SHELL = ['group_chat.html', 'manifest.json', 'sw.js', 'icon.svg'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_SHELL)));
});

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Network-first for app shell: serve fresh when online, fall back to cache offline.
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);
    if (APP_SHELL.some(f => url.pathname.endsWith('/' + f) || url.pathname === '/' + f)) {
        e.respondWith(
            fetch(e.request).then(resp => {
                const copy = resp.clone();
                caches.open(CACHE).then(c => c.put(e.request, copy));
                return resp;
            }).catch(() => caches.match(e.request))
        );
    }
});

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
