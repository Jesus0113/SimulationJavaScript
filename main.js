//Variables

const client = document.querySelector('#client');

const newClient = document.querySelector('#new-client');

const solicitaPrestamo = document.querySelector('#solicita-prestamo');

const montoCalcular = document.querySelector('#MontoCalcular');

const pruebaPrestamo = document.querySelector('#calcula-prestamo');

const continuarForm = document.querySelector('#btn-continuar');

let seccionNewCliente = document.querySelector('#newClient-pag');

let seccionCliente = document.querySelector('#client-pag');

let seleccionPrestamo = document.querySelector('#cliente-opcion');


const inputNombre = document.querySelector('#nombre');

const inputApellido = document.querySelector('#apellido');

const inputTelefono = document.querySelector('#telefono');

const inputEmail = document.querySelector('#email');

const enviarformulario = document.querySelector('#enviar-form');

const listaCarrito = document.querySelector('.seccion-articles');

const carritoCompra = document.querySelector('.carrito-compra');

const contenedorCarrito = document.querySelector('#Lista-productos');

const carritoHover = document.querySelector('.carrito');

const spinner = document.querySelector('#spinner');

const formulario = document.querySelector('#formulario');

const fecthClima = document.querySelector('.div-icon');

let articulosDelCarrito = [];

let contactoNuevo = {
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
};

// Creacion de eventos

//Selecciona la seccion cliente
client.addEventListener('click', seleccionClient);

//Selecciona la seccion nuevo cliente

newClient.addEventListener('click', seleccionNewClient);

//Selecciona la opcion solicitar prestamo

solicitaPrestamo.addEventListener('click', seccionPrestamo);

// Monto a calcular prestamo
montoCalcular.addEventListener('blur', leeMontoinput);

// Selecciona calcular prestamo

pruebaPrestamo.addEventListener('click', calcularPrestamo);

// Continua al formulario

continuarForm.addEventListener('click', seleccionNewClient);

//obtenemos info de inputs

inputNombre.addEventListener('blur', validarInputs);

inputApellido.addEventListener('blur', validarInputs);

inputTelefono.addEventListener('blur', validarInputs);

inputEmail.addEventListener('blur', validarInputs);

enviarformulario.addEventListener('click', agregarCliente);

listaCarrito.addEventListener('click', agregaCarrito);

carritoHover.addEventListener('click', muestraCarrito);

carritoCompra.addEventListener('click', eliminarCurso);

enviarformulario.addEventListener('click', simularEnvio);

document.addEventListener('DOMContentLoaded', ()=>{
    articulosDelCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

    agregaCarritoHtml();
})




//Creacion de funciones


//Seleccion cliente
function seleccionClient(e) {
    if (seccionCliente.className == 'pag-cliente-off' && seccionNewCliente.className == 'pag-nuevo-cliente dir-form') {
        seccionCliente.className = 'pag-cliente';
    }

    else if (seccionCliente.className == 'pag-cliente-off' && seccionNewCliente.className == ' dir-form') {

        seccionNewCliente.className = 'pag-nuevo-cliente dir-form';

        seccionCliente.className = 'pag-cliente';

    }
    else {
        seccionCliente.className = 'pag-cliente-off';
    }

}
//Lee y agrega el curso a comprar
function agregaCarrito(e) {

    e.preventDefault();

    if (e.target.classList.contains('agregar-carrito')) {
        const curso = e.target.parentElement;

        leerDatosCurso(curso);
    }



}

function leerDatosCurso(curso) {
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        nombre: curso.querySelector('h2').textContent,
        precio: curso.querySelector('p span').textContent,
        id: curso.querySelector('button').getAttribute('data-id'),
        cantidad: 1
    }

    if (articulosDelCarrito.some(curso => curso.id === infoCurso.id)) {
        const cursos = articulosDelCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso;
            } else {
                return curso;
            }
        })
        articulosDelCarrito = [...cursos];

    } else {
        articulosDelCarrito = [...articulosDelCarrito, infoCurso];
    }

    Toastify({

        text: "Agregado al carrito exitosamente",

        duration: 3000,

        style: {
            background: "linear-gradient(to right, #f00c0c, #ecff00)",
            color: "black",
            fontSize: "1.3rem"
        },

    }).showToast();

    agregaCarritoHtml();

}

function agregaCarritoHtml() {

    vaciarCarrito();

    articulosDelCarrito.forEach(curso => {
        const filaCarrito = document.createElement('TR');

        filaCarrito.innerHTML = `
        <td><img src="${curso.imagen}" alt="Imagen Curso seleccionado"></td>
        <td>${curso.nombre}</td>
        <td>${curso.precio}</td>
        <td>${curso.cantidad}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${curso.id}"> X </a>
        </td>
        `;

        contenedorCarrito.appendChild(filaCarrito);
    });

    //carrito al local storage

    GuardaStorage();
}

function GuardaStorage(){

    localStorage.setItem('carrito', JSON.stringify(articulosDelCarrito));

}

function eliminarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        articulosDelCarrito = articulosDelCarrito.filter(curso => curso.id !== cursoId);

        //hacer que reste si hay mas de uno

        // if(articulosDelCarrito.some(curso=> curso.id === cursoId)){

        // }


        agregaCarritoHtml();
    }

}


function vaciarCarrito() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}



//Seleccion Nuevo cliente

function seleccionNewClient(e) {

    if (seccionNewCliente.className == 'pag-nuevo-cliente dir-form' && seccionCliente.className == 'pag-cliente-off') {

        seccionNewCliente.className = seccionNewCliente.className.replace('pag-nuevo-cliente', '');
    }

    else if (seccionCliente.className == 'pag-cliente') {

        seccionCliente.className = 'pag-cliente-off';

        seccionNewCliente.className = seccionNewCliente.className.replace('pag-nuevo-cliente', '');

    }
    else {

        seccionNewCliente.className = 'pag-nuevo-cliente dir-form';
    }
}


//Seleccona la opcion prestamo

function seccionPrestamo() {

    if (seleccionPrestamo.className == 'cliente-opcion-off') {

        seleccionPrestamo.className = 'cliente-opcion-prestamo';
    }
    else {
        seleccionPrestamo.className = 'cliente-opcion-off';
    }

}

//Leer datos del input

function leeMontoinput(e) {

    let montoInput = e.target.value;

    calcularPrestamo(montoInput);

}

//Selecciona calcular el prestamo

function calcularPrestamo(monto) {

    if (monto >= 200000) {

        let resultado = monto * 1.8;

        Swal.fire({
            icon: 'success',
            title: `Felicidades tenes un prestamo disponible de ${resultado}`,
        })

        while (seleccionPrestamo.firstChild) {
            seleccionPrestamo.removeChild(seleccionPrestamo.firstChild);
        }
    }

    else if (monto >= 100000 && monto < 200000) {
        let resultado = monto * 1.6;

        Swal.fire({
            icon: 'success',
            title: `Felicidades tenes un prestamo disponible de ${resultado}`,
        })

        while (seleccionPrestamo.firstElementChild) {
            seleccionPrestamo.removeChild(seleccionPrestamo.firstElementChild);
        }

    }
    else if (monto > 0) {

        Swal.fire({
            icon: 'error',
            title: 'Prestamo no disponible',
        });

        while (seleccionPrestamo.firstChild) {
            seleccionPrestamo.removeChild(seleccionPrestamo.firstChild);
        }
    }
}


function mostrarAlerta(mensaje, ref) {

    limpiarAlerta(ref);

    //Crea el parrafo de alerta
    const error = document.createElement('P');
    error.textContent = mensaje;
    error.classList.add('alert')

    ref.appendChild(error);

}

function validarInputs(e) {

    if (e.target.value.trim() === '') {
        mostrarAlerta(`El campo de ${e.target.id} es obligatorio!`, e.target.parentElement);
        contactoNuevo[e.target.id] = '';
        comprobarCamposContacto();
        return;
    }

    if (e.target.id === 'email' && !validarEmail(e.target.value)) {
        mostrarAlerta(`El email no es valido`, e.target.parentElement);
        contactoNuevo[e.target.id] = '';
        comprobarCamposContacto();
        return;
    }


    limpiarAlerta(e.target.parentElement);

    contactoNuevo[e.target.id] = e.target.value.trim().toLowerCase();

    comprobarCamposContacto();

}


function agregarCliente(e) {

    const clienteNuevo = {
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        telefono: inputTelefono.value,
        email: inputEmail.value,
    }

    simularEnvio();

    setTimeout(() => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Bien hecho ${clienteNuevo.nombre} ${clienteNuevo.apellido}`,
            text: 'Pronto nos comunicaremos contigo... ',
            showConfirmButton: false,
            timer: 5000
        });

    }, 4500);




    // seccionNewCliente.innerHTML = `<p class="textos-fin">Congratulations...</p>
    // <br>
    // <p class="textos-fin">${clienteNuevo.nombre} ${clienteNuevo.apellido}</p>
    // <br>
    // <p class="textos-fin">Recuerda revisar tu email:${clienteNuevo.email}.</p>
    // <br>
    // <p class="textos-fin">Pronto te contactaremos</p>`

}

function simularEnvio() {
    spinner.classList.remove('ocultar');

    setTimeout(() => {
        spinner.classList.add('ocultar');
        formulario.reset();
    }, 4000);

        contactoNuevo.nombre = '',
        contactoNuevo.apellido = '',
        contactoNuevo.telefono = '',
        contactoNuevo.email = '',
        comprobarCamposContacto();
}

function limpiarAlerta(referencia) {
    //Comprobar si ya hay alertas
    //falta identificar para que borre alerta por referencia c/u
    const alerta = referencia.querySelector('.alert');
    if (alerta) {
        alerta.remove();
    }

}

function muestraCarrito() {
    if (carritoCompra.classList.contains('carrito-compra--off')) {
        carritoCompra.classList.remove('carrito-compra--off');
    }
    else {
        carritoCompra.classList.add('carrito-compra--off');
    }
}

function validarEmail(email) {

    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    const resultado = regex.test(email);
    return resultado;
}

function comprobarCamposContacto() {
    if (Object.values(contactoNuevo).includes('')) {
        enviarformulario.classList.add('opacidad');
        enviarformulario.disabled = true;

    } else {
        enviarformulario.classList.remove('opacidad');
        enviarformulario.disabled = false;
    }
};

https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}


fetch("https://api.openweathermap.org/data/2.5/weather?q=Buenos Aires&lang=es&units=metric&appid=02fd5700b325a3c6d7cd407b644b1c31")
    .then(response=> response.json())
    .then(data=>{

        const clima = document.createElement('DIV')
        clima.innerHTML = `
        <p class="p-clim">Temperatura actual: ${data.main.temp} °</p>
        <p class="p-clim">Max : ${data.main.temp_max} °</p>
        <p class="p-clim">Min : ${data.main.temp_min} °</p>
        <p class="p-clim">Clima : ${data.weather[0].description} </p>
        `;
        fecthClima.append(clima)
        
    })
    .catch(err=> console.log(err));

