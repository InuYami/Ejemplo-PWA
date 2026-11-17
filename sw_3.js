self.addEventListener('fetch', evento =>{
    const respuestaOffLine = new Response ('Este sitio requiere conexion a internet.');

    const respuesta = fetch(evento.request)
        .catch(()=> respuestaOffLine);
    evento.respondWith(respuesta);
});