let canvas = document.getElementById("areaJuego");

let ctx = canvas.getContext("2d");

// =========================================================
// CONFIGURACIÓN DEL JUEGO
// =========================================================

const ALTURA_SUELO = 40;

const ALTURA_PERSONAJE = 60;

const ANCHO_PERSONAJE = 40;

const ANCHO_LIMON = 20;

const ALTURA_LIMON = 20;

const MOVIMIENTO = 10;

const VELOCIDAD_INICIAL = 200;

// =========================================================
// VARIABLES DEL JUEGO
// =========================================================

let personajeX = canvas.width / 2;

let personajeY =
canvas.height -
(ALTURA_SUELO + ALTURA_PERSONAJE);

let limonX = canvas.width / 2;

let limonY = 0;

let puntaje = 0;

let vidas = 3;

let velocidadCaida = VELOCIDAD_INICIAL;

let intervalo = null;

let juegoActivo = false;

// =========================================================
// INICIAR JUEGO
// =========================================================

function iniciar() {


reiniciar();

}

// =========================================================
// DIBUJAR SUELO
// =========================================================

function dibujarSuelo() {


ctx.fillStyle = "blue";

ctx.fillRect(
    0,
    canvas.height - ALTURA_SUELO,
    canvas.width,
    ALTURA_SUELO
);


}

// =========================================================
// DIBUJAR PERSONAJE
// =========================================================

function dibujarPersonaje() {


ctx.fillStyle = "yellow";

ctx.fillRect(
    personajeX,
    personajeY,
    ANCHO_PERSONAJE,
    ALTURA_PERSONAJE
);


}

// =========================================================
// MOVER PERSONAJE A LA IZQUIERDA
// =========================================================

function moverIzquierda() {


if (!juegoActivo) {
    return;
}

personajeX -= MOVIMIENTO;


// Evitar que salga del canvas

if (personajeX < 0) {

    personajeX = 0;

}


actualizarPantalla();


}

// =========================================================
// MOVER PERSONAJE A LA DERECHA
// =========================================================

function moverDerecha() {


if (!juegoActivo) {
    return;
}

personajeX += MOVIMIENTO;


// Evitar que salga del canvas

if (
    personajeX >
    canvas.width - ANCHO_PERSONAJE
) {

    personajeX =
        canvas.width - ANCHO_PERSONAJE;

}


actualizarPantalla();


}

// =========================================================
// DIBUJAR LIMÓN
// =========================================================

function dibujarLimon() {


ctx.fillStyle = "green";

ctx.fillRect(
    limonX,
    limonY,
    ANCHO_LIMON,
    ALTURA_LIMON
);


}

// =========================================================
// HACER CAER EL LIMÓN
// =========================================================

function bajarLimon() {


if (!juegoActivo) {
    return;
}


limonY += 10;


actualizarPantalla();


detectarAtrapado();


if (!juegoActivo) {
    return;
}


detectarPiso();


}

// =========================================================
// ACTUALIZAR PANTALLA
// =========================================================

function actualizarPantalla() {


limpiarCanvas();

dibujarSuelo();

dibujarPersonaje();

dibujarLimon();



}

// =========================================================
// LIMPIAR CANVAS
// =========================================================

function limpiarCanvas() {


ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
);


}

// =========================================================
// DETECTAR SI EL PERSONAJE ATRAPÓ EL LIMÓN
// =========================================================

function detectarAtrapado() {


const colisionHorizontal =
    limonX + ANCHO_LIMON > personajeX &&
    limonX < personajeX + ANCHO_PERSONAJE;


const colisionVertical =
    limonY + ALTURA_LIMON > personajeY &&
    limonY < personajeY + ALTURA_PERSONAJE;


if (
    colisionHorizontal &&
    colisionVertical
) {

    puntaje++;

    mostrarEnSpan(
        "txtPuntaje",
        puntaje
    );


    aparecerLimon();


    actualizarVelocidad();

}


}

// =========================================================
// CAMBIAR VELOCIDAD SEGÚN EL PUNTAJE
// =========================================================

function actualizarVelocidad() {


let nuevaVelocidad = VELOCIDAD_INICIAL;


if (puntaje >= 6) {

    nuevaVelocidad = 100;

}
else if (puntaje >= 3) {

    nuevaVelocidad = 150;

}


if (nuevaVelocidad !== velocidadCaida) {

    velocidadCaida = nuevaVelocidad;


    clearInterval(intervalo);


    intervalo = setInterval(
        bajarLimon,
        velocidadCaida
    );

}


// Victoria

if (puntaje >= 10) {

    ganarJuego();

}


}

// =========================================================
// HACER APARECER UN NUEVO LIMÓN
// =========================================================

function aparecerLimon() {


limonX =
    generarAleatorio(
        0,
        canvas.width - ANCHO_LIMON
    );


limonY = 0;


actualizarPantalla();


}

// =========================================================
// DETECTAR SI EL LIMÓN TOCÓ EL SUELO
// =========================================================

function detectarPiso() {


const piso =
    canvas.height - ALTURA_SUELO;


if (
    limonY + ALTURA_LIMON >= piso
) {

    vidas--;


    mostrarEnSpan(
        "txtVidas",
        vidas
    );


    if (vidas <= 0) {

        perderJuego();

        return;

    }


    aparecerLimon();

}


}

// =========================================================
// GAME OVER
// =========================================================

function perderJuego() {


juegoActivo = false;


clearInterval(intervalo);

intervalo = null;


alert("Juego Terminado");


}

// =========================================================
// VICTORIA
// =========================================================

function ganarJuego() {


juegoActivo = false;


clearInterval(intervalo);

intervalo = null;


alert("¡HAZ LIMONADA! 🍋");


}

// =========================================================
// REINICIAR
// =========================================================

function reiniciar() {


// Detener intervalo anterior

clearInterval(intervalo);

intervalo = null;


// Restaurar variables

vidas = 3;

puntaje = 0;

velocidadCaida =
    VELOCIDAD_INICIAL;


// Restaurar personaje

personajeX =
    canvas.width / 2;

personajeY =
    canvas.height -
    (ALTURA_SUELO + ALTURA_PERSONAJE);


// Restaurar limón

limonX =
    generarAleatorio(
        0,
        canvas.width - ANCHO_LIMON
    );

limonY = 0;


// Actualizar estadísticas

mostrarEnSpan(
    "txtVidas",
    vidas
);


mostrarEnSpan(
    "txtPuntaje",
    puntaje
);


// Activar juego

juegoActivo = true;


// Dibujar

actualizarPantalla();


// Iniciar caída automática

intervalo =
    setInterval(
        bajarLimon,
        velocidadCaida
    );


}

// =========================================================
// CONTROLES CON TECLADO
// =========================================================

document.addEventListener(
"keydown",
function (evento) {


    if (
        evento.key === "ArrowLeft" ||
        evento.key.toLowerCase() === "a"
    ) {

        evento.preventDefault();

        moverIzquierda();

    }


    if (
        evento.key === "ArrowRight" ||
        evento.key.toLowerCase() === "d"
    ) {

        evento.preventDefault();

        moverDerecha();

    }


    // Tecla R para reiniciar

    if (
        evento.key.toLowerCase() === "r"
    ) {

        reiniciar();

    }

}


);


