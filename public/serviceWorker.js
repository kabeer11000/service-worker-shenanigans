console.log("REGISTERED");

let cacheData = "appv1"

self.addEventListener("install",event => {

event.waitUntil(
    caches.open('static').then(
        vm => {vm.addAll([
            '/images/image1',
            '/images/image2',
            '/Offline.js',
            '/App.css',
            '/'
        ])}
        
    )
)
})

function onFetch(event){
    let request = event.request
    let header = request.headers.get('Accept')
    let cacheKey = 'static'

    if(header.indexOf('text/html') !== -1)
     cacheKey = 'content'
    else if(header.indexOf('image') !== -1)
    cacheKey = 'image'
    
    if(cacheKey === 'content'){
        event.respondWith(
        fetch(request)
        .then(res => addToCache(cacheKey,res,request))
        .catch(()=> getFromCache(event))
        .catch(()=> showOffline())
    )}
    else{
        event.respondWith(
        getFromCache(event)
        .catch(()=> fetch(request))
        .then(res=> addToCache(cacheKey,res,request))
        .catch(()=> showOffline())
    )}

}

function getFromCache(event){

    return caches.match(event.request).then(resp => {
        if(!resp){
        throw Error("Something Went Wrong")}

        return resp}
    )}
    


function addToCache(key,response,request){
    let copy = response.clone()
    if(response.ok){
        caches.open(key).then(cache => cache.put(key,copy))
    }
  return response
}

function shouldHandleFetch (event) {
    var request            = event.request;
    var url                = new URL(request.url);
    var criteria           = {
      isGETRequest      : request.method === 'GET',
      isFromMyOrigin    : url.origin === self.location.origin
    };
  
    var failingCriteria    = Object.keys(criteria)
      .filter(criteriaKey => !criteria[criteriaKey]);
     
      console.log("RETURNED STATUS",!failingCriteria.length);
    return !failingCriteria.length;
  }


self.addEventListener("fetch",ev => {


console.log("SOMETHING GOT FETCHED",ev);

    if(shouldHandleFetch(ev)){ 
    onFetch(ev)
}
    console.log("SOMEWHERE FETCH OCCURED!")
})