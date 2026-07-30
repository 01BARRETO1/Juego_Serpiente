/* Nivel 2. Cárgalo después de serpiente.js: <script src="nivel2.js"></script>. */

// Reutilizamos el tablero y el tamaño de celdas del nivel uno.
const canvasNivel2 = canvas;
const ctxNivel2 = ctx;
const celdaNivel2 = TAMANIO_CELDA;
const columnasNivel2 = canvasNivel2.width / celdaNivel2;
const filasNivel2 = canvasNivel2.height / celdaNivel2;

// Cargamos las piezas PNG de la serpiente.
const cabezaNivel2 = new Image(); cabezaNivel2.src = "assets/cabeza.png";
const cuelloNivel2 = new Image(); cuelloNivel2.src = "assets/cuello.png";
const cuerpoNivel2 = new Image(); cuerpoNivel2.src = "assets/cuerpo.png";
const colaNivel2 = new Image(); colaNivel2.src = "assets/cola.png";
// Cargamos las manzanas de colores y el reloj.
const manzanasNivel2 = ["roja", "verde", "azul", "amarilla"].map(color => {
  const imagen = new Image(); imagen.src = `assets/manzana_${color}.png`; return imagen;
});
const relojImagenNivel2 = new Image(); relojImagenNivel2.src = "assets/reloj.png";
// Cargamos el sonido que debe escucharse al obtener tiempo extra.
const sonidoRelojNivel2 = new Audio("sounds/tic-tac.mp3");
sonidoRelojNivel2.preload = "auto";

// Definimos el área útil de cada PNG; evita leer píxeles y funciona incluso al abrir el HTML con file://.
const recortesNivel2 = new Map();
recortesNivel2.set(cabezaNivel2, { x: 252, y: 28, ancho: 117, alto: 159 });
recortesNivel2.set(cuelloNivel2, { x: 267, y: 0, ancho: 320, alto: 207 });
recortesNivel2.set(cuerpoNivel2, { x: 101, y: 0, ancho: 486, alto: 283 });
recortesNivel2.set(colaNivel2, { x: 96, y: 0, ancho: 544, alto: 300 });
recortesNivel2.set(manzanasNivel2[0], { x: 69, y: 26, ancho: 180, alto: 208 });
recortesNivel2.set(manzanasNivel2[1], { x: 19, y: 14, ancho: 180, alto: 208 });
recortesNivel2.set(manzanasNivel2[2], { x: 7, y: 37, ancho: 180, alto: 208 });
recortesNivel2.set(manzanasNivel2[3], { x: 17, y: 12, ancho: 180, alto: 208 });
recortesNivel2.set(relojImagenNivel2, { x: 412, y: 83, ancho: 601, alto: 598 });

// Guardamos el reloj visible, su temporizador y la orden de crecer.
let relojNivel2 = null;
let temporizadorRelojNivel2 = null;
let crecerNivel2 = false;
// El nivel dos empieza apagado para conservar el nivel uno hasta lograr 23 puntos.
let nivel2Activo = false;

// Dice si una celda pertenece a la serpiente.
function ocupaSerpienteNivel2(posicion) {
  return serpiente.some(segmento => segmento.x === posicion.x && segmento.y === posicion.y);
}

// Entrega una celda aleatoria que no contiene serpiente, manzana ni reloj.
function celdaLibreNivel2() {
  let posicion;
  do {
    posicion = {
      x: Math.floor(Math.random() * columnasNivel2),
      y: Math.floor(Math.random() * filasNivel2)
    };
  } while (ocupaSerpienteNivel2(posicion)
    || manzana.some(fruta => fruta.x === posicion.x && fruta.y === posicion.y)
    || (relojNivel2 && relojNivel2.x === posicion.x && relojNivel2.y === posicion.y));
  return posicion;
}

// Dibuja una imagen ya recortada y centrada dentro de una celda.
function dibujarImagenNivel2(imagen, x, y, angulo = 0) {
  if (!imagen.complete || imagen.naturalWidth === 0) return;
  // Obtenemos el recorte correspondiente al recurso; los PNG ya tienen fondo transparente.
  const recorte = recortesNivel2.get(imagen) || { x: 0, y: 0, ancho: imagen.naturalWidth, alto: imagen.naturalHeight };
  ctxNivel2.save();
  ctxNivel2.translate(x * celdaNivel2 + celdaNivel2 / 2, y * celdaNivel2 + celdaNivel2 / 2);
  ctxNivel2.rotate(angulo);
  // Dibujamos solo el contenido visible, sin el gran espacio transparente que desplazaba las piezas.
  ctxNivel2.drawImage(imagen, recorte.x, recorte.y, recorte.ancho, recorte.alto, -celdaNivel2 / 2, -celdaNivel2 / 2, celdaNivel2, celdaNivel2);
  ctxNivel2.restore();
}

// Calcula la orientación que hay entre dos segmentos consecutivos.
function anguloNivel2(origen, destino) {
  return Math.atan2(destino.y - origen.y, destino.x - origen.x);
}

// Pinta una serpiente continua que encaja siempre en la cuadrícula, incluso al doblar.
function pintarSerpienteNivel2() {
  // No intentamos dibujar sin segmentos.
  if (serpiente.length === 0) return;
  // Dibujamos una línea gruesa desde la cola hasta el cuello para que no haya espacios entre cuadros.
  ctxNivel2.save();
  ctxNivel2.lineCap = "round";
  ctxNivel2.lineJoin = "round";
  // La primera línea oscura es el contorno exterior del cuerpo.
  ctxNivel2.strokeStyle = "#35104f";
  ctxNivel2.lineWidth = celdaNivel2 * 0.82;
  ctxNivel2.beginPath();
  const cola = serpiente[serpiente.length - 1];
  ctxNivel2.moveTo(cola.x * celdaNivel2 + celdaNivel2 / 2, cola.y * celdaNivel2 + celdaNivel2 / 2);
  for (let indice = serpiente.length - 2; indice >= 1; indice -= 1) {
    const segmento = serpiente[indice];
    ctxNivel2.lineTo(segmento.x * celdaNivel2 + celdaNivel2 / 2, segmento.y * celdaNivel2 + celdaNivel2 / 2);
  }
  ctxNivel2.stroke();
  // La segunda línea morada da volumen a la piel.
  ctxNivel2.strokeStyle = "#71369c";
  ctxNivel2.lineWidth = celdaNivel2 * 0.68;
  ctxNivel2.stroke();
  // La franja clara representa el vientre y da una apariencia más orgánica.
  ctxNivel2.strokeStyle = "#b77bd0";
  ctxNivel2.lineWidth = celdaNivel2 * 0.25;
  ctxNivel2.stroke();
  // Dibujamos escamas superpuestas sobre cada tramo del cuerpo.
  ctxNivel2.fillStyle = "#8f53b4";
  ctxNivel2.strokeStyle = "#431667";
  ctxNivel2.lineWidth = 1.2;
  for (let indice = 1; indice < serpiente.length; indice += 1) {
    const segmento = serpiente[indice];
    ctxNivel2.beginPath();
    ctxNivel2.arc(segmento.x * celdaNivel2 + celdaNivel2 / 2, segmento.y * celdaNivel2 + celdaNivel2 / 2, celdaNivel2 * 0.22, 0, Math.PI * 2);
    ctxNivel2.fill();
    ctxNivel2.stroke();
  }
  // Terminamos la serpiente con una punta de cola orientada en la dirección correcta.
  if (serpiente.length > 2) {
    const penultimo = serpiente[serpiente.length - 2];
    const punta = serpiente[serpiente.length - 1];
    const direccionCola = anguloNivel2(penultimo, punta);
    const centroX = punta.x * celdaNivel2 + celdaNivel2 / 2;
    const centroY = punta.y * celdaNivel2 + celdaNivel2 / 2;
    ctxNivel2.fillStyle = "#71369c";
    ctxNivel2.beginPath();
    ctxNivel2.moveTo(centroX + Math.cos(direccionCola) * celdaNivel2 * 0.60, centroY + Math.sin(direccionCola) * celdaNivel2 * 0.60);
    ctxNivel2.lineTo(centroX + Math.cos(direccionCola + 2.35) * celdaNivel2 * 0.34, centroY + Math.sin(direccionCola + 2.35) * celdaNivel2 * 0.34);
    ctxNivel2.lineTo(centroX + Math.cos(direccionCola - 2.35) * celdaNivel2 * 0.34, centroY + Math.sin(direccionCola - 2.35) * celdaNivel2 * 0.34);
    ctxNivel2.closePath();
    ctxNivel2.fill();
  }
  ctxNivel2.restore();
  // La cabeza usa PNG y se rota desde su orientación natural, que apunta hacia arriba.
  const cabeza = serpiente[0];
  const cuello = serpiente[1];
  const direccion = cuello ? anguloNivel2(cuello, cabeza) : -Math.PI / 2;
  dibujarImagenNivel2(cabezaNivel2, cabeza.x, cabeza.y, direccion + Math.PI / 2);
}

// Genera una manzana PNG si no existe y siempre la dibuja.
function pintarComidaNivel2() {
  if (manzana.length === 0) {
    manzana.push({ ...celdaLibreNivel2(), color: Math.floor(Math.random() * manzanasNivel2.length) });
    comidaAtrapada = false;
  }
  const fruta = manzana[0];
  dibujarImagenNivel2(manzanasNivel2[fruta.color ?? 0], fruta.x, fruta.y);
}

// Detecta la manzana, la elimina, suma velocidad y deja listo el crecimiento.
function atrapaComidaNivel2() {
  const fruta = manzana[0];
  const cabeza = serpiente[0];
  if (!fruta || cabeza.x !== fruta.x || cabeza.y !== fruta.y) return false;
  sonidoManzana.play().catch(() => {});
  manzana.splice(0, 1);
  tiempo = Math.max(60, tiempo - 12);
  clearInterval(intervaloSerpiente);
  intervaloSerpiente = setInterval(moverSerpiente, tiempo);
  // El reloj comienza a aparecer solamente cuando ya se llegó a la velocidad mínima de 60.
  if (nivel2Activo && tiempo <= 60 && !temporizadorRelojNivel2) programarRelojNivel2();
  return true;
}

// Conserva la cola en vez de insertar un objeto vacío: así la forma no se pierde.
function crecerSerpienteNivel2() {
  crecerNivel2 = true;
}

// Dibuja el reloj cuando existe.
function pintarRelojNivel2() {
  if (relojNivel2) dibujarImagenNivel2(relojImagenNivel2, relojNivel2.x, relojNivel2.y);
}

// Crea o mueve el reloj a una celda libre y lo muestra inmediatamente.
function crearRelojNivel2() {
  relojNivel2 = celdaLibreNivel2();
  dibujarTodo();
}

// Programa relojes en intervalos aleatorios entre ocho y dieciocho segundos.
function programarRelojNivel2() {
  // No creamos relojes durante el nivel uno ni antes de alcanzar la velocidad 60.
  if (!nivel2Activo || tiempo > 60) return;
  clearTimeout(temporizadorRelojNivel2);
  const retraso = (8 + Math.random() * 10) * 1000;
  temporizadorRelojNivel2 = setTimeout(() => {
    crearRelojNivel2();
    programarRelojNivel2();
  }, retraso);
}

// Detiene el reloj automático al pausar, reiniciar o terminar el juego.
function detenerRelojNivel2() {
  clearTimeout(temporizadorRelojNivel2);
  temporizadorRelojNivel2 = null;
}

// Si la serpiente come el reloj, el intervalo sube quince: mínimo 60 pasa a 75.
function atrapaRelojNivel2() {
  const cabeza = serpiente[0];
  if (!relojNivel2 || cabeza.x !== relojNivel2.x || cabeza.y !== relojNivel2.y) return false;
  // Reiniciamos y reproducimos el sonido tic-tac cada vez que se captura un reloj.
  sonidoRelojNivel2.currentTime = 0;
  sonidoRelojNivel2.play().catch(() => {});
  tiempo = Math.max(60, tiempo + 15);
  clearInterval(intervaloSerpiente);
  intervaloSerpiente = setInterval(moverSerpiente, tiempo);
  relojNivel2 = null;
  // Borramos la manzana actual para obligar una nueva posición al comer reloj.
  manzana.splice(0, manzana.length);
  pintarComidaNivel2();
  return true;
}

// Gestiona el movimiento y preserva la cola al crecer.
function moverSerpienteNivel2() {
  atrapaRelojNivel2();
  const comioManzana = atrapaComidaNivel2();
  if (comioManzana) {
    puntos += 1;
    document.getElementById("puntaje").textContent = puntos;
    crecerSerpienteNivel2();
  }
  if (!direccionActual) return dibujarTodo();
  const nuevaCabeza = { ...serpiente[0] };
  if (direccionActual === "arriba") nuevaCabeza.y -= 1;
  if (direccionActual === "abajo") nuevaCabeza.y += 1;
  if (direccionActual === "izquierda") nuevaCabeza.x -= 1;
  if (direccionActual === "derecha") nuevaCabeza.x += 1;
  serpiente.unshift(nuevaCabeza);
  // Solo quitamos la cola si no se comió una manzana en este movimiento.
  if (!crecerNivel2) serpiente.pop();
  crecerNivel2 = false;
  dibujarTodo();
}

// Redibuja todo para borrar visualmente el cuerpo anterior y conservar el tablero.
function dibujarTodoNivel2() {
  limpiarCanvas();
  gameOver();
  dibujarTablero();
  pintarComidaNivel2();
  pintarRelojNivel2();
  pintarSerpienteNivel2();
}

// Activa los gráficos y reglas del nivel dos cuando se alcanza el puntaje requerido.
function activarNivel2() {
  // Evitamos activar dos veces el mismo nivel.
  if (nivel2Activo) return;
  // Marcamos que desde este momento se usará el nivel dos.
  nivel2Activo = true;
  // Eliminamos la manzana del nivel uno para generar una PNG nueva en una posición válida.
  manzana.splice(0, manzana.length);
  // Mostramos un mensaje corto de cambio de nivel cuando el elemento existe.
  const mensaje = document.getElementById("mensaje");
  if (mensaje) mensaje.textContent = "¡Nivel 2!";
  // Redibujamos inmediatamente con el aspecto del nivel dos.
  dibujarTodo();
  // Solo iniciamos los relojes si la velocidad ya llegó al mínimo de 60.
  if (tiempo <= 60) programarRelojNivel2();
}

// Conservamos las funciones de interfaz del nivel uno.
const iniciarNivelUno = iniciarJuego;
const pausarNivelUno = pausarJuego;
const reiniciarNivelUno = reiniciarJuego;
// Conservamos la lógica visual y de movimiento original para el nivel uno.
const pintarSerpienteNivelUno = pintarSerpiente;
const pintarComidaNivelUno = pintarComida;
const atrapaComidaNivelUno = atrapaComida;
const crecerSerpienteNivelUno = crecerSerpiente;
const moverSerpienteNivelUno = moverSerpiente;
const dibujarTodoNivelUno = dibujarTodo;

// Inicia el juego original y activa el primer reloj aleatorio.
iniciarJuego = function () {
  iniciarNivelUno();
  // Si ya se activó el nivel dos y la velocidad vale 60, reanudamos sus relojes.
  if (nivel2Activo && tiempo <= 60) programarRelojNivel2();
};

// Pausa el juego original y también los relojes.
pausarJuego = function () {
  detenerRelojNivel2();
  pausarNivelUno();
};

// Reinicia el nivel original y limpia el estado exclusivo del nivel dos.
reiniciarJuego = function () {
  detenerRelojNivel2();
  relojNivel2 = null;
  crecerNivel2 = false;
  // Volvemos a empezar desde el nivel uno después de reiniciar.
  nivel2Activo = false;
  reiniciarNivelUno();
};

// Elegimos en tiempo real las funciones del nivel uno o dos según el puntaje alcanzado.
pintarSerpiente = function () { return nivel2Activo ? pintarSerpienteNivel2() : pintarSerpienteNivelUno(); };
pintarComida = function () { return nivel2Activo ? pintarComidaNivel2() : pintarComidaNivelUno(); };
atrapaComida = function () { return nivel2Activo ? atrapaComidaNivel2() : atrapaComidaNivelUno(); };
crecerSerpiente = function () { return nivel2Activo ? crecerSerpienteNivel2() : crecerSerpienteNivelUno(); };
dibujarTodo = function () { return nivel2Activo ? dibujarTodoNivel2() : dibujarTodoNivelUno(); };
moverSerpiente = function () {
  // Mientras no haya 23 puntos se ejecuta intacto el movimiento del nivel uno.
  if (!nivel2Activo) {
    moverSerpienteNivelUno();
    // Después del movimiento comprobamos si ya se obtuvieron los 23 puntos.
    if (puntos >= 23) activarNivel2();
    return;
  }
  // Desde el punto 23 se ejecuta el movimiento propio del nivel dos.
  moverSerpienteNivel2();
};

// Volvemos a pintar cuando cada PNG acaba de cargar.
[cabezaNivel2, cuelloNivel2, cuerpoNivel2, colaNivel2, ...manzanasNivel2, relojImagenNivel2].forEach(imagen => {
  imagen.onload = () => dibujarTodo();
});
