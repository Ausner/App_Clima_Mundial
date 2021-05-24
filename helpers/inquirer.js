const inquirer = require('inquirer'); //Requiere el inquirer
require('colors'); //Requiere los colores


const preguntas = [{ //Crea las preguntas para el prompt
    type: 'list',
    name: 'opcion',
    message: '¿Que desea hacer?',
    choices: [{ //Las opciones del listado
            value: 1,
            name: `${'1.'.green} Buscar cuidad`
        },
        {
            value: 2,
            name: `${'2.'.green} Historial`
        },
        {
            value: 0,
            name: `${'0.'.green} Salir`
        }
    ]
}];



const inquirerMenu = async() => { //Menu

    console.clear();
    console.log('=================================='.green);
    console.log('       Seleccione una opción      '.white);
    console.log('==================================\n'.green);


    const opt = await inquirer.prompt(preguntas); //Muestra el listado de la lista de preguntas
    return opt; //Retorna la opción seleccionada por el usuario

}

const pausa = async() => { //Pausa para ver todo sin afectaciones del limpiar pantalla


    await inquirer.prompt({ //Crea el prompt de tipo input
        type: 'input',
        name: 'pausa',
        message: `\nPresione ${ 'ENTER'.green } para continuar.` //Muestra mensaje
    });

}


const leerInput = async(message) => { //Leeun input para crear una tarea


    const question = { //Crea la pregunta
        type: 'input', //De tipo input
        name: 'desc',
        message,
        validate(value) {
            if (value.length === 0) {
                return 'Por favor ingrese un valor'; //Muestra el mensaje mientras no se escriba nada
            }
            return true;

        }
    };

    const { desc } = await inquirer.prompt(question); //Usa la question y obtiene la descripcion de la tarea creada
    return desc; //Retorna la descripcion de la tarea
}


const listadoLugares = async(lugares) => { //Muestra las tareas como lista para poder seleccionar una y borrarla
    //{
    //  value: '1',
    //name: `${'1.'.green} Crear tarea`
    //}
    const choices = lugares.map((lugar, i) => { //Agrega las tareas como choices de la lista

        const idx = `${i+1}`.green;
        return ({
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        })
    })

    choices.unshift({ //Agrega la opcion cancelar con el id 0
        value: '0',
        name: '0.'.green + 'Cancelar'
    })

    const preguntas = [{ //Crea las preguntas y usa las choices creadas.
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }

    ]
    const id = await inquirer.prompt(preguntas); //Muestra la lista y obtiene el id de la tarea seleccionada

    return id; //Retorna el id.

}


const Confirmar = async(message) => { //Confirmaiones del usuario
    const question = [{ //Pregunta
        type: 'confirm', //Tipo confirm
        name: 'ok',
        message
    }];

    const { ok } = await inquirer.prompt(question); //Hace la pregunta y obtiene la respuesta
    return ok; //Retorna la respuesta

}


const MostrarListadoChecklist = async(tareas) => { //Muestra las tareas como lista para poder seleccionar una y borrarla
    //{
    //  value: '1',
    //name: `${'1.'.green} Crear tarea`
    //}
    const choices = tareas.map((tarea, i) => { //Agrega las tareas como choices de la lista

        const idx = `${i+1}`.green;
        return ({
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        })
    })


    const preguntas = [{ //Crea las preguntas y usa las choices creadas.
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }

    ]
    const ids = await inquirer.prompt(preguntas); //Muestra la lista y obtiene el id de la tarea seleccionada

    return ids; //Retorna el id.

}



module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoLugares,
    Confirmar,
    MostrarListadoChecklist
}