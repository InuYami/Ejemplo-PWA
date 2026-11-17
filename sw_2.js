self.addEventListener('install', evento=>{
    console.log('SW: Instalando Service Worker');
    
    const instalacion= new Promise((resolve,reject)=>{
         setTimeout(()=>{
        console.log("SW: Instalacion terminada")
    },5000)
    self.skipWaiting(); 
    resolve();
})
    evento.waitUntil(instalacion);
})

self.addEventListener('activate', evento=>{
    console.log("SW: Activado y listo para controlar la app");

})
