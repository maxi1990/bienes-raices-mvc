(function() {
    
    const lat =   -33.5863657;
    const lng = -70.6525653;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 13);
    
    let markers = new L.FeatureGroup().addTo(mapa)
    console.log(markers);

    let propiedades = []

       // filtros
       const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');




    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // filtrado de categorias y precios
    categoriasSelect.addEventListener('change', e =>{
        filtros.categoria = +e.target.value
        filtrarPropiedades()
    })

    preciosSelect.addEventListener('change', e =>{
        filtros.precio = +e.target.value
        filtrarPropiedades()

    })

    const obtenerPropiedades = async () =>{
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()
            // console.log(propiedades);
            mostrarPropiedades(propiedades)
        } catch (error) {
            console.log(error);
        }
    }

    const mostrarPropiedades = propiedades =>{
        // limpiar los markers previos
        markers.clearLayers()
          
        propiedades.forEach(propiedad => {
            // agregar los pines
            const marker = new L.marker([propiedad?.lat,propiedad?.lng],{
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre}</p>

                <h1 class="text-xl font-extrabold uppercase my-2">${propiedad?.titulo}</h1
                >
                <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase ">Ver Propiedad</a>
                `)

            markers.addLayer(marker)
        });
    }


    const filtrarCategoria = propiedad =>  
     filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
    
    const filtrarPropiedades = () =>{
         const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio)
        mostrarPropiedades(resultado);
    }
   

    const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad
    

    obtenerPropiedades()
})()