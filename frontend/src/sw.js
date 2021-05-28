import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';
import { setCatchHandler, setDefaultHandler } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

const manifest = self.__WB_MANIFEST;
if (manifest) {
  console.log('precaching: ', manifest);
  precacheAndRoute(manifest);
}

// https://web.dev/offline-fallback-page/
const CACHE_NAME = 'offline-html';
const FALLBACK_HTML_URL = '/offline/';
self.addEventListener('install',  (event) => {
  event.waitUntil(
    // Setting {cache: 'reload'} in the new request will ensure that the
    // response isn't fulfilled from the HTTP cache; i.e., it will be from
    // the network.
    caches.open(CACHE_NAME)
      .then((cache) => cache.add(
        new Request(FALLBACK_HTML_URL, { cache: "reload" })
      ))
  );

  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

setDefaultHandler(
  new NetworkOnly()
);

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
setCatchHandler(({event}) => {
  // The FALLBACK_URL entries must be added to the cache ahead of time, either
  // via runtime or precaching. If they are precached, then call
  // `matchPrecache(FALLBACK_URL)` (from the `workbox-precaching` package)
  // to get the response from the correct cache.
  //
  // Use event, request, and url to figure out how to respond.
  // One approach would be to use request.destination, see
  // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
  switch (event.request.destination) {
    case 'document':
      // If using precached URLs:
      // return matchPrecache(FALLBACK_HTML_URL);
      return caches.match(FALLBACK_HTML_URL);

    default:
      // If we don't have a fallback, just return an error response.
      return Response.error();
  }
});

self.addEventListener('push', function (event) {
  let notificationTitle = 'Push Notification';
  let notificationOptions;

  try {
    // Push is a JSON
    const responseJson = event.data.json();
    notificationTitle = responseJson.title;
    notificationOptions = {
      body: responseJson.body,
      icon: '/static/assets/favicon-48x48.png',
    };
  } catch (err) {
    // Push is a simple text (usually debugging)
    notificationOptions = {
      body: event.data.text(),
    };
  }

  event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});
