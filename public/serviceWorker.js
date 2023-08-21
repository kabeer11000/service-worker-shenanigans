console.log("REGISTERED");

let cacheData = "appv1"

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open('static').then(
            vm => {
                vm.addAll([
                    '/images/image1',
                    '/images/image2',
                    '/Offline.js',
                    '/App.css',
                    '/'
                ])
            }
        )
    )
})

async function onFetch(event) {
    // Updated this function
    let request = event.request;

    // Check if the browser is online
    if (navigator.onLine) {
        // If online, fetch the resource and store it in the cache
        return fetch(request)
            .then(res =>
                caches.open('static-1')
                    .then(cache => cache.put(request, res.clone()))
                    .then(() => res) // Return the fetched response
            );
    }

    // If offline, attempt to retrieve the resource from the cache
    const cachedRes = (await caches.match(request)) ?? null;

    // Create a new response with additional information indicating offline status
    return new Response(
        JSON.stringify({
            ...(await cachedRes.json()), // Merge cached response data with offline flag
            offline: true
        }),
        {
            status: cachedRes.status,
            statusText: cachedRes.statusText,
            headers: cachedRes.headers
        }
    );
}

function getFromCache(event) {

    return caches.match(event.request).then(resp => {
            if (!resp) {
                throw Error("Something Went Wrong")
            }

            return resp
        }
    )
}


function addToCache(key, response) {
    let copy = response.clone()
    if (response.ok) {
        caches.open(key).then(cache => cache.put(key, copy))
    }
    return response
}

function shouldHandleFetch(event) {
    const request = event.request;
    const url = new URL(request.url);
    const criteria = {
        isGETRequest: request.method === 'GET',
        isFromMyOrigin: url.origin === self.location.origin
    };

    const failingCriteria = Object.keys(criteria)
        .filter(criteriaKey => !criteria[criteriaKey]);

    console.log("RETURNED STATUS", !failingCriteria.length);
    return !failingCriteria.length;
}


self.addEventListener("fetch", event => {
    event.respondWith(onFetch(event));
})