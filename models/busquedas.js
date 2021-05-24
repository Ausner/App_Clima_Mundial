const fs = require('fs');
const axios = require('axios');
const { pausa } = require('../helpers/inquirer');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        //TODO: leer db si existe

        this.leerDB();

    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    get historialCapitalizado() {
        //Capitalizar la primer letra de las palabras :)
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        })
    }

    async ciudad(lugar = '') {


        try {
            //peticion http

            const instance = axios.create({

                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            })
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            return [];
        }

    }

    buscarlugarporId(id, lugares) {
        let lugarSel;
        lugares.forEach(lugar => {
            if (lugar.id === id) {
                lugarSel = lugar;
            }

        });

        return lugarSel;
    }


    async ClimaLugar(lat, lon) {
        try {
            //intance de axios.create()
            const instance = axios.create({
                    baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                    params: this.paramsOpenWeather
                })
                //resp.data
            const resp = await instance.get();


            return {
                desc: resp.data.weather[0].description,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp,
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = '') {

        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        // Grabar en DB
        this.guardarDB();


    }




    guardarDB() {

        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

    leerDB() {
        //Debe de existir....
        if (!fs.existsSync(this.dbPath)) {
            return;
        }

        const info = fs.readFileSync(this.dbPath, { enconding: 'utf-8' });

        const data = JSON.parse(info);

        this.historial = data.historial;

    }



}


module.exports = Busquedas;