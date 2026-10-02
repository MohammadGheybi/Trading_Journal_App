// Tells the packaged app that this browser tab is still open.
// Closing the last tab asks the local server to exit. A refresh reconnects first.
const tabId = sessionStorage.getItem('cl-tab') || crypto.randomUUID();
sessionStorage.setItem('cl-tab', tabId);

function ping() {
  fetch('/api/presence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: tabId }),
    keepalive: true,
  }).catch(() => {});
}

ping();
window.setInterval(ping, 20000);
window.addEventListener('pagehide', () => {
  navigator.sendBeacon(`/api/leave?id=${encodeURIComponent(tabId)}`);
});
