
var url=window.location.href;

var ubicacionSw='/Ejemplo-PWA/sw.js';




if (navigator.serviceWorker){

    if(url.includes('localhost')){

    }

    navigator.serviceWorker.register(ubicacionSw);
}
