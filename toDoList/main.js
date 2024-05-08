//seleccionamos elementos del DOM con querySelector()
const fecha = document.querySelector('#fecha');
const lista = document.querySelector('#lista');
const elemento = document.querySelector('#elemento');
const input = document.getElementById('input');
const botonEnter = document.querySelector('#boton-enter');
const check = 'fa-check';
const uncheck = 'fa-circle';
const textoTachado = 'tachado';
let LIST;


let id //para que inicie en 0 cada tarea tendra un id diferente

//creacion de fecha actualizada 
const date = new Date(); //obtenemos la fecha actual
//con innerHTML remplazamos el contenido que se muestra dentro del elemento fecha
//con el metodo toLocaleDateString() le damos el formato a la fecha
fecha.innerHTML = date.toLocaleString('es-ES', { weekday: 'long', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric" });



//funcion principal para agregar  tareas a la lista
function agregar(tarea, id, realizado, eliminado) {
    //usamos return para terminar la ejecucion en caso de que se cumpla la condicion
    if (eliminado) { return };  // si existe eliminado es true si no es false 

    const REALIZADO = realizado ? check : uncheck; // si realizado es verdadero check si no uncheck

    const LINE = realizado ? textoTachado : '';
    //creamos el contenido del elemento que vamos a mostrar
    const elemento = `
                        <li id="elemento">
                        <i class="fa-solid ${REALIZADO}" data="realizado" id="${id}"></i>
                        <p class="text ${LINE}">${tarea}</p>
                        <i class="fas fa-trash de" data="eliminado" id="${id}"></i> 
                        </li>
                    `
    lista.insertAdjacentHTML("beforeend", elemento); //agregamos el nuevo elemento antes de que FINALICE LA LISTA con "beforeend"

}


// funcion con la que cambiamos las clases CSS de un elemento con el metodo toggle()
function tareaCompletada(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    //accededemos al nodo padre del elemento 'element', buscamos el elemento que contenga la clase '.text' y la cambiamos por '.textoTachado' y viceversa
    element.parentNode.querySelector('.text').classList.toggle(textoTachado);
    //si realizado es true, se marca como no realizada (false)
    //si realizado es false, se marca como realizada (true)
    LIST[element.id].realizado = LIST[element.id].realizado ? false : true;
    console.log(LIST);
    // console.log(LIST[element.id])
    // console.log(LIST[element.id].realizado)
}

//funcion para elimunar tareas
function tareaEliminada(element) {
    // console.log(element.parentNode)
    // console.log(element.parentNode.parentNode)
    //accedemos al nodo padre del nodo padre, es decir, el elemento ul y eliminamos el li 
    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].eliminado = true; //actualizamos el estado logico de la tarea en el array LIST, marcandola como eliminada
    console.log(LIST);
}





//escuchamos y en cuanto haya un click ejecutamos la funcion flecha
botonEnter.addEventListener('click', () => {
    //Validamos que el contenido del input es correcto con reportValidity() antes de agregar una nueva tarea
    if (input.reportValidity()) {
        //asignamos el valor del input a la variable tarea y llamamos a la funcion principal
        const tarea = input.value;
        agregar(tarea, id, false, false);
        //agregamos al array LIST un nuevo objeto con sus propiedades
        LIST.push({
            nombre: tarea,
            id: id,
            realizado: false,
            eliminado: false
        });
        //guardamos el array LIST en el navegador con la clave 'TODO' y lo convertimos a una cadena de texto JSON mediante JSON.stringify()
        localStorage.setItem('TODO', JSON.stringify(LIST));
        //incrementamos el contador id  para que las siguientes tareas no tengan el mismo id
        id++;
        //limpiamos el valor del input para poder ingresar otra tarea
        input.value = '';

    }

})

//esperamos eventos de TECLADO. Cuando se levante la tecla ENTER se ejecuta la funcion event()
document.addEventListener('keyup', function (event) {
    //Validamos que el contenido del input es correcto con reportValidity() antes de agregar una nueva tarea
    if (input.reportValidity()) {
        //comparamos el valor de la tecla contenida en key con el valor "Enter"
        if (event.key == 'Enter') {
            //asignamos el valor del input a la variable tarea y llamamos a la funcion principal
            const tarea = input.value;
            agregar(tarea, id, false, false);
            //agregamos al array LIST un nuevo objeto con sus propiedades
            LIST.push({
                nombre: tarea,
                id: id,
                realizado: false,
                eliminado: false
            });
            //guardamos el array LIST en el navegador con la clave 'TODO' y lo convertimos a una cadena de texto JSON mediante JSON.stringify()
            localStorage.setItem('TODO', JSON.stringify(LIST));
            //incrementamos el contador id  para que las siguientes tareas no tengan el mismo id
            id++;
            //limpiamos el valor del input para poder ingresar otra tarea
            input.value = '';
            console.log(LIST);
        }
    }
})

//escuchamos y en cuanto haya un click ejecutamos una funcion 
lista.addEventListener('click', function (event) {
    //obtenemos el elemento sobre el que se hizo click
    const element = event.target
    //extraemos el valor del atributo `data` del elemento
    const elementData = element.attributes.data.value
    console.log(elementData)
    //si el valor es igual a "relaizado" ejecutamos la funcion tareaCompletada()
    if (elementData == 'realizado') {
        tareaCompletada(element)
    }//si es igual a "eliminado" ejecutamos tareaEliminada()
    else if (elementData == 'eliminado') {
        tareaEliminada(element)
        console.log("elimnado")
    }
    //actualizamos la lista de tareas y la convertimos en una cadea JASON antes de guardarlo en localStorage
    localStorage.setItem('TODO', JSON.stringify(LIST))
})


//cargamosla lista de tareas desde el navegador 
let data = localStorage.getItem('TODO')
if (data) { //si hay datos se llama a la funcion
    LIST = JSON.parse(data)
    console.log(LIST)
    id = LIST.length
    cargarLista(LIST)
} else {    //si no hay datos iniciamos una lista vacia
    LIST = []
    id = 0
}

//recibimos un array de objetos que representan tareas, y luego utilizamos el metodo forEach() para iterar sobre cada tarea en el array y llamamos a la funcion agregar() para añadir cada tarea a la lista en la interfaz de usuario
function cargarLista(array) {
    array.forEach(function (item) {
        agregar(item.nombre, item.id, item.realizado, item.eliminado)
    })
}