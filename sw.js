self.addEventListener("install", (event) => {
  const urlsToCache = [
    "/",
    "index.html",
    "style.css",
    "main.js",
    "src/logo.png",
  ];

  event.waitUntil(
    caches.open("budget-cache").then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );

  console.log("Service worker installed");
});
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

self.addEventListener("fetch", (event) => {
  console.log(`URL requested: ${event.request.url}`);
});
