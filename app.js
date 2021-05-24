require('dotenv').config();
const { inquirerMenu, pausa, leerInput, listadoLugares } = require("./helpers/inquirer");



const main = async() => {

    let opt;
    const Busquedas = require('./models/busquedas');

    const busqueda = new Busquedas();

    do {

        const { opcion } = await inquirerMenu();
        opt = opcion;

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Cuidad: ');
                //Buscar los lugares
                const lugares = await busqueda.ciudad(termino);
                //Seleccionar el lugar
                const { id } = await listadoLugares(lugares);
                if (id === '0') continue;

                const lugarSel = busqueda.buscarlugarporId(id, lugares);

                try { busqueda.agregarHistorial(lugarSel.nombre); } catch (error) { console.log(error); }

                await pausa();
                //Clima
                const clima = await busqueda.ClimaLugar(lugarSel.lat, lugarSel.lng);
                //Mostrar resultado
                console.clear();
                console.log('\nInformación del la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.nombre.green);
                console.log('Lat: ', lugarSel.lat);
                console.log('Lng: ', lugarSel.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Minima: ', clima.min);
                console.log('Maxima: ', clima.max);
                console.log('Como está el clima: ', clima.desc.green);
                await pausa();

                break;
            case 2:
                console.clear();
                console.log('Historial:'.bgYellow);
                busqueda.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i+1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                await pausa();
                break;
            case 0:
                break;
        }
    }
    while (opt !== 0);
}


main();