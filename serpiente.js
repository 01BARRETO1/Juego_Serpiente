
// 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CELDA = 25;
let intervaloSerpiente=setInterval(moverSerpiente, 1000);
let direccionActual;
//Agregamos el arreglo manzana para guardar la nueva manzana y tener su posicion
const manzana = [];
let puntos = 0;
let comidaAtrapada = true;

/* 
/////Taller serpiente parte 2/////
//CREACIÓN DE LA SERPIENTE
//PASO 1 .- Crear un arreglo:
//PASO 2 Agregar objetos de ejemplo con coordenadas
 */

/* const serpiente = [{x:5,y:4},
  {x:10,y:10},
  {x:8,y:0}
]; */

//✅ EJERCICIO 1 Una serpiente horizontal.
/* 
const serpiente = [{x:0,y:0},
  {x:1,y:0},
  {x:2,y:0}
];
 */

//✅ EJERCICIO 2 Ahora esta serpiente 

/* 
 const serpiente = [{x:8,y:9},
 {x:9,y:9},
 {x:10,y:9},
 {x:10,y:10}
];
*/

//✅ EJERCICIO 3 .- Una serpiente de 5 cuadros subiendo pegada al borde izquierdo

const serpiente = [{ x: 9, y: 9 },
{ x: 9, y: 10 },
{ x: 9, y: 11 },
{ x: 9, y: 12 },
];






// Primera pintura del juego al cargar la página
//dibujarTodo();

// =========================
// FUNCIONES DE DIBUJO
// =========================
document.getElementById("iniciarJuego").disabled = false;
function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTodo() {

  limpiarCanvas();
  gameOver();
  dibujarTablero();

  /* 
  pintarParte(5, 1);
  pintarParte(0, 3);
  //✅ PRUEBA 1 
  pintarParte(5,5);
  //✅ PRUEBA 2
  pintarParte(10,2);
  //✅ PRUEBA 3 Pintar un cuadrado pegado al borde inferior del canvas.
  pintarParte(9,19);
  //✅ PRUEBA 4 Pintar un cuadrado pegado al borde derecho del canvas. 
  pintarParte(19,9);
  //✅ PRUEBA 5 Pintar un cuadrado pegado al borde izquierdo del canva
  pintarParte(0,9);
  //✅ PRUEBA 6 Pintar un cuadrado en cualquier esquina del canvas. 
  pintarParte(19,0);
   */

  pintarSerpiente();
  pintarComida();







}
///////////////
//DIBUJAR UNA CUADRÍCULA 
//Construir el tablero del juego usando líneas verticales y horizontales. 
//Crear una constante:
//Esta constante almacenará el tamaño del ancho y alto de cada cuadrado de la cuadrícula

//Crear la función: 
/* function dibujarTablero() {
  //Dentro de de la función dibujarTablero, vamos a pintar una línea de prueba dentro del canvas.
  ctx.strokeStyle = "blue"; //coloca un color de línea, similar a fillStyle
  ctx.beginPath()//se invoca siempre para iniciar un trazo
  ctx.moveTo(250, 250)//posición inicial de la figura, colocar cualquier valor, punto inicial 
  ctx.lineTo(250, 0)//dibuja una línea desde la ultima posicion del, punto final 
  //graficador, en este caso lo que puso en moveTo, hasta la posicion que
  //recibe como parámetro, colocar cualquier valor
  ctx.stroke()//dibuja la línea
  //Invocar dibujarTablero() desde dibujarTodo() y probar el resultado
  ctx.strokeStyle = "red";   // línea vertical al lado del centro  de arriba 
  ctx.beginPath();
  ctx.moveTo(250, 250);      // punto inicial en el centro(posicion eje x, posicion eje y) en el centro
  ctx.lineTo(260, 0);        // sube hasta el borde superior al tope valor = 0 (, o) cero es el tope 10 es más abajo (260 al lado del centro arriba derecha)
  ctx.stroke();

  ctx.strokeStyle = "yellow";  // línea horizontal
  ctx.beginPath();
  //x=500 pixeles a la derecha
  ctx.moveTo(500, 10);       // punto inicial borde superior derecho, (,0) si fuersa cero coincide con la linea verde y= 0 pixeles hacia abajo por eso 10 baja, 250 a la mitad derecha
  ctx.lineTo(250, 250);      // va hacia centro el tope seria 500 , disparo el laser a la mitad al centro
  ctx.stroke();

  ctx.strokeStyle = "green"; // línea diagonal
  ctx.beginPath();
  ctx.moveTo(0, 500);        // esquina inferior izquierda
  ctx.lineTo(500, 0);        // esquina superior derecha le digo <al borde derecho arriba-->500 y a la esquina de arriba ---> 0 o sea 10 es mas abajito y 250 el centro derecho
  ctx.stroke();

  //Ejemplo linea desde el centro hacia abajo 

  ctx.strokeStyle = "white" //color, primero color

  ctx.beginPath(); //se invoca siempre para iniciar un trazo

  ctx.moveTo(250, 250); //Se inicia el punto, nace el punto 
  //X = 250 → 250 píxeles hacia la derecha.
  //y=500 → 500 píxeles hacia abajo. de arriba hacia abajo o sea 490 no topa el borde de abajo
  ctx.lineTo(250, 500);//dibuja la linea 250 derecha o sea cero --> 0 serír la esquina abajo izquierda, y 250 que es a la derecha al centro o sea 500 seria a la derecha del borde final 

  //Y por último .stroke() --> dibuja la linea

  ctx.stroke();

  for (let i = 25; i < canvas.height; i+=25) {

    ctx.strokeStyle = "#00FF00"; // línea diagonal
    ctx.beginPath();
    ctx.moveTo(i,0);     
    ctx.lineTo(i, 500);
    ctx.stroke();

  }
  
} */

//PASO 9 
//crear un for para pintar las líneas verticales.

function dibujarTablero() {
  for (let i = TAMANIO_CELDA; i < canvas.height; i += TAMANIO_CELDA) {

    ctx.strokeStyle = "#00FF00";
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.width);
    ctx.stroke();

  }
  //PASO 10
  //Crear un segundo for para pintar las líneas horizontales
  for (let i = TAMANIO_CELDA; i < canvas.width; i += TAMANIO_CELDA) {

    ctx.strokeStyle = "#00FF00";
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.height, i);
    ctx.stroke();

  }



}

//TALLER SERPIENTE PARTE 2
//
function pintarParte(lineaX, lineaY) {
  /* • Pintar un cuadrado  
  • Usar el tamaño de TAMANIO_CELDA  
  • Calcular la posición real dentro del canvas   */
  lineaX = lineaX * TAMANIO_CELDA;
  let x = lineaX;
  lineaY = lineaY * TAMANIO_CELDA;
  let y = lineaY;
  //ctx.fillStyle = "#27D3F5";
  ctx.fillRect(x, y, TAMANIO_CELDA, TAMANIO_CELDA);
  //Configurar color del borde y dibujar borde: 
  //ctx.strokeStyle="#080896"
  ctx.strokeRect(x, y, TAMANIO_CELDA, TAMANIO_CELDA);


}

//CREACIÓN DE LA SERPIENTE
//PASO 1 .- Crear un arreglo:
//PASO 2 Agregar objetos de ejemplo con coordenadas
//ESTÁ EN LA PARTE DE ARRIBA, DADO QUE ES LLAMADA AL PRICIPIO PARA LEERSE EN CASCADA DEBE ESTAR INICIALIZADA ARRIBA
//PASO 3 
//Crear la función: pintarSerpiente()
function pintarSerpiente() {

  for (let i = 0; i < serpiente.length; i++) {
    let cuerpo = serpiente[i];
    if (i === 0) {
      // Primer cuadro (cabeza)
      ctx.fillStyle = "#801f6f";
      ctx.strokeStyle = "#F5F30C"
    } else {
      // Resto del cuerpo
      ctx.fillStyle = "#27D3F5";
      ctx.strokeStyle = "#080896"
    }
    pintarParte(cuerpo.x, cuerpo.y);
  }
}
/* PASO 5 
En dibujarTodo(): 
• Eliminar llamadas individuales de pintarParte()  
• Invocar únicamente:  
pintarSerpiente() */

//EJERCICIOS DE MODIFICACIÓN
//Modificar las coordenadas del arreglo para mostrar:
///--- realizado en la aprte de arriba, como practica del taller.

/////----------------Taller PARTE 3------------------


//Esta función debe modificar el arreglo de posiciones de la serpiente. 
function moverDerecha() {

  //1. Obtener la posición de la cabeza actual. 
  serpiente[0, 0]
  //2. Crear un nuevo objeto ubicado una celda a la derecha.
  ctx.fillStyle = "#801f6f";
  ctx.strokeStyle = "#F5F30C"
  for (let i = 0; i < serpiente.length; i++) {
    if (i == 0) {
      let derecha = { x: serpiente[0, 0].x + 1, y: serpiente[0, 0].y };
      //3. Agregar este nuevo objeto al inicio del arreglo utilizando unshift().
      serpiente.unshift(derecha);
      //Luego de agregar la nueva cabeza, eliminar el último elemento del arreglo utilizando 
      serpiente.pop();
      limpiarCanvas();
      dibujarTodo();
      console.log("Derecha");
    }

  }


}

/* //Movimiento en las 4
direcciones 
Crear las funciones 
• moverIzquierda()  
• moverArriba()  
• moverAbajo()   */

function moverIzquierda() {

  //1. Obtener la posición de la cabeza actual. 
  serpiente[0, 0]
  //2. Crear un nuevo objeto ubicado una celda a la derecha.
  ctx.fillStyle = "#801f6f";
  ctx.strokeStyle = "#F5F30C"
  for (let i = 0; i < serpiente.length; i++) {
    if (i == 0) {
      let izquierda = { x: serpiente[0, 0].x - 1, y: serpiente[0, 0].y };
      //3. Agregar este nuevo objeto al inicio del arreglo utilizando unshift().
      serpiente.unshift(izquierda);
      //Luego de agregar la nueva cabeza, eliminar el último elemento del arreglo utilizando 
      serpiente.pop();
      limpiarCanvas();
      dibujarTodo();
      console.log("izquierda");
    }

  }

}

function moverArriba() {

  //1. Obtener la posición de la cabeza actual. 
  serpiente[0, 0]
  //2. Crear un nuevo objeto ubicado una celda a la derecha.
  ctx.fillStyle = "#801f6f";
  ctx.strokeStyle = "#F5F30C"
  for (let i = 0; i < serpiente.length; i++) {
    if (i == 0) {
      let arriba = { x: serpiente[0, 0].x, y: serpiente[0, 0].y - 1 };
      //3. Agregar este nuevo objeto al inicio del arreglo utilizando unshift().
      serpiente.unshift(arriba);
      //Luego de agregar la nueva cabeza, eliminar el último elemento del arreglo utilizando 
      serpiente.pop();
      limpiarCanvas();
      dibujarTodo();

      console.log("arriba");
    }

  }

}

function moverAbajo() {

  //1. Obtener la posición de la cabeza actual. 
  serpiente[0, 0]
  //2. Crear un nuevo objeto ubicado una celda a la derecha.
  ctx.fillStyle = "#801f6f";
  ctx.strokeStyle = "#F5F30C"
  for (let i = 0; i < serpiente.length; i++) {
    if (i == 0) {
      let abajo = { x: serpiente[0, 0].x, y: serpiente[0, 0].y + 1 };
      //3. Agregar este nuevo objeto al inicio del arreglo utilizando unshift().
      serpiente.unshift(abajo);
      //Luego de agregar la nueva cabeza, eliminar el último elemento del arreglo utilizando 
      serpiente.pop();
      limpiarCanvas();
      dibujarTodo();

      console.log("abajo");
    }

  }

}



// – Cambio de dirección 

function cambiarDireccion(direccion) {
  if (direccion == "arriba") {

    //dibujarTodo()
    //moverArriba();
    direccionActual = "arriba"
    //pintarSerpiente();
    moverSerpiente();

  }
  if (direccion == "derecha") {
    //dibujarTodo()
    //moverDerecha();
    direccionActual = "derecha"
    //pintarSerpiente();
    moverSerpiente();
  }
  if (direccion == "izquierda") {
    //dibujarTodo()
    //moverIzquierda();
    direccionActual = "izquierda"
    //pintarSerpiente();
    moverSerpiente();
  }
  if (direccion == "abajo") {
    //dibujarTodo()
    //moverAbajo();
    direccionActual = "abajo"
    //pintarSerpiente();
    moverSerpiente();
  }

}

//Movimiento automático 
function iniciarJuego() {
  const overlay = document.getElementById("canvasOverlay");
  overlay.classList.add("oculto"); // lo oculta
  dibujarTodo()
  //Esta función iniciará el movimiento automátic
  intervaloSerpiente = clearInterval(intervaloSerpiente);
  //intervaloSerpiente = setInterval(moverSerpiente, 1000);
  document.getElementById("btnArriba").disabled = false;
  document.getElementById("btnIzquierda").disabled = false;
  document.getElementById("btnDerecha").disabled = false;
  document.getElementById("btnAbajo").disabled = false;
}

///////////

function pausarJuego() {
  //Esta función detendrá temporalmente el movimiento.
  intervaloSerpiente = clearInterval(intervaloSerpiente);
  console.log("PAUSA || ");
  //botones en pasusa
  document.getElementById("btnArriba").disabled = true;
  document.getElementById("btnIzquierda").disabled = true;
  document.getElementById("btnDerecha").disabled = true;
  document.getElementById("btnAbajo").disabled = true;

}

////////////////
//////////////////

function moverSerpiente() {
  intervaloSerpiente = clearInterval(intervaloSerpiente);
  intervaloSerpiente = setInterval(moverSerpiente, 1000);
  console.log("moviendo");
  pintarComida();
  comidaAtrapada = atrapaComida();
  if (comidaAtrapada == true) {
    //Agregar un punto al marcador 
    let puntaje = document.getElementById("puntaje")
    puntos = puntos + 1
    puntaje.textContent = puntos;
    crecerSerpiente();
    pintarComida();
  }

  if (direccionActual == "arriba") {

    //dibujarTodo()
    moverArriba();
    pintarSerpiente();

  }
  if (direccionActual == "derecha") {
    //dibujarTodo()
    moverDerecha();
    pintarSerpiente();
  }
  if (direccionActual == "izquierda") {
    //dibujarTodo()
    moverIzquierda();
    pintarSerpiente();
  }
  if (direccionActual == "abajo") {
    //dibujarTodo()
    moverAbajo();
    pintarSerpiente();
  }
}

////------------------------------Comida de la serpiente 

function pintarComida() {
  
  if (comidaAtrapada == false && manzana.length===1) {
    //3. Dibujar la comida
    let color = ["#9e1d19", "#199e6b", "#2745f5", "#f5a227"];
    let colorBorder = ["#7aa11d", "#0a2e0d", "#1122aa", "#aa7711"];
    let colorManzana = Math.floor(Math.random() * color.length);
    ctx.fillStyle = color[colorManzana];
    ctx.strokeStyle = colorBorder[colorManzana];

    let miPrimeraManzanaDeColores=manzana[0]
    pintarParte(miPrimeraManzanaDeColores.x, miPrimeraManzanaDeColores.y);
    return;
  }else if(manzana.length>0){
    manzana.splice(0,1);
  }else{
    
    //1. Generar una posición aleatoria en X
    let lineasVerticales = canvas.width / TAMANIO_CELDA;
    console.log("Hay " + lineasVerticales + " lineas Verticales");
    let aleatorioX = Math.floor(Math.random() * lineasVerticales);
    console.log("Aleatorio en x: " + aleatorioX);

    //2. Generar una posición aleatoria en Y 
    let lineasHorizontales = canvas.height / TAMANIO_CELDA;
    console.log("Hay " + lineasHorizontales + " lineas Horizontales");
    let aleatorioY = Math.floor(Math.random() * lineasHorizontales);
    console.log("Aleatorio en y: " + aleatorioY);

    //3. Dibujar la comida
    let color = ["#9e1d19", "#199e6b", "#2745f5", "#f5a227"];
    let colorBorder = ["#7aa11d", "#0a2e0d", "#1122aa", "#aa7711"];


    //let manzanas = { x: aleatorioX, y: aleatorioY };
    //manzana.push(manzanas)
    //ctx.fillStyle = "#9e1d19"
    //ctx.strokeStyle = "#7aa11d"

    // manzana colores
    let colorManzana = Math.floor(Math.random() * color.length);
    ctx.fillStyle = color[colorManzana];
    ctx.strokeStyle = colorBorder[colorManzana];

    pintarParte(aleatorioX, aleatorioY);
    let manzanas = { x: aleatorioX, y: aleatorioY };
    manzana.push(manzanas)
    for (let i = 1; i < serpiente.length; i++) {
      let cuerpo = serpiente[i];
      let manzanaColores = manzana[0];
      if (cuerpo.x === manzanaColores.x && cuerpo.y === manzanaColores.y) {
        manzana.splice(0, 1);
        pintarComida();
        comidaAtrapada = false;
      }
    }
  }
}


  //////////////////---------------Detectar colisión con la comida 
  function atrapaComida() {
    let cabezaCabeza = serpiente[0];
    let manzanaManzana = manzana[0];
    if (cabezaCabeza.x === manzanaManzana.x && cabezaCabeza.y === manzanaManzana.y) {
      comidaAtrapada=true;
      manzana.splice(0, 1);
      console.log("Manzana atrapada");
      return true;
    } else {
      return false;
    }
  }

  function crecerSerpiente() {
    //Hacer crecer la serpiente
    let meLaAlargas = {};
    serpiente.push(meLaAlargas);
  }


  ///////////////////////////--------------Parte 4 1. Implementar GAME OVER al tocar los gameOver 
  function gameOver() {
    //Si se quiere escapar de la carcel:
    let borde = {}
    ctx.strokeStyle = "#ff0022";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(500, 0);
    ctx.stroke();
    let cabeza = serpiente[0]
    if (cabeza.y === 20 || cabeza.x === -1 || cabeza.x === 20 || cabeza.y === -1) {
      intervaloSerpiente = clearInterval(intervaloSerpiente)
      pausarJuego();
      document.getElementById("iniciarJuego").disabled = true;

      // Mostrar el overlay
      const overlay = document.getElementById("canvasOverlay");
      overlay.classList.remove("oculto");
      // Cambiar el mensaje y el icono
      const icono = overlay.querySelector(".canvas-overlay-icon");
      const texto = overlay.querySelector(".canvas-overlay-texto");

      icono.textContent = "💀💀💀💀"; // cambia el emoji
      texto.textContent = "Game Over"; // cambia el mensaje

      return
    } else {
      //Si la cabeza choca con el cuerpo
      for (let i = 2; i < serpiente.length; i++) {
        let cuerpo = serpiente[i];
        let cabeza = serpiente[0];
        if (cabeza.x === cuerpo.x && cabeza.y === cuerpo.y) {
          intervaloSerpiente = clearInterval(intervaloSerpiente)
          pausarJuego();
          document.getElementById("iniciarJuego").disabled = true;

          // Mostrar el overlay
          const overlay = document.getElementById("canvasOverlay");
          overlay.classList.remove("oculto");
          // Cambiar el mensaje y el icono
          const icono = overlay.querySelector(".canvas-overlay-icon");
          const texto = overlay.querySelector(".canvas-overlay-texto");

          icono.textContent = "💀"; // cambia el emoji
          texto.textContent = "Game Over"; // cambia el mensaje


        }
      }
    }
  }

  ////////-----------------2. Implementar botón “Reiniciar juego” 
  function reiniciarJuego() {
    intervaloSerpiente = clearInterval(intervaloSerpiente);
    direccionActual = "";
    document.getElementById("btnArriba").disabled = true;
    document.getElementById("btnIzquierda").disabled = true;
    document.getElementById("btnDerecha").disabled = true;
    document.getElementById("btnAbajo").disabled = true;

    const overlay = document.getElementById("canvasOverlay");
    overlay.classList.add("oculto"); // lo oculta
    limpiarCanvas();

    // Vaciar el array sin reasignar
    serpiente.length = 0;
    // Agregar los nuevos segmentos
    serpiente.push(
      { x: 9, y: 9 },
      { x: 9, y: 10 },
      { x: 9, y: 11 },
      { x: 9, y: 12 }
    );
    let puntaje = document.getElementById("puntaje")
    puntos = 0
    puntaje.textContent = puntos;
    //impiarCanvas();
    manzana.splice(0, 1);
    //pintarComida();
    //pintarSerpiente();
    //dibujarTodo();

    document.getElementById("iniciarJuego").disabled = false;

    // Mostrar el overlay
    //const overlay = document.getElementById("canvasOverlay");
    overlay.classList.remove("oculto");
    // Cambiar el mensaje y el icono
    const icono = overlay.querySelector(".canvas-overlay-icon");
    const texto = overlay.querySelector(".canvas-overlay-texto");

    icono.textContent = "🐉"; // cambia el emoji
    texto.textContent = "¡Prepárate para deslizarte!"; // cambia el mensaje




  }

