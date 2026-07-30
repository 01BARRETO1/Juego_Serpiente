/**
 * ================================================================
 * SERPIENTE.JS — El Cerebro de las Animaciones
 * ================================================================
 * Este archivo hace que todo se mueva, brille y responda
 * a lo que hace el usuario. No tiene la lógica del juego todavía
 * (eso viene después), pero sí todas las animaciones y efectos.
 *
 * ÍNDICE DE SECCIONES:
 * 1. Variables y referencias al HTML
 * 2. Efecto máquina de escribir (#mensaje)
 * 3. Hojas cayendo del cielo
 * 4. Dibujo decorativo en el canvas
 * 5. Funciones del juego (stubs para conectar la lógica después)
 * 6. Controles de teclado y táctiles
 * 7. Parallax suave
 * 8. GIFs y carga perezosa (lazy load)
 * 9. Arranque de todo
 *
 * ════════════════════════════════════════════════════════════════
 * CÓMO CONECTAR LA LÓGICA DEL JUEGO (para el futuro):
 * ════════════════════════════════════════════════════════════════
 * 1. Busca la sección "FUNCIONES DEL JUEGO (STUBS)" más abajo.
 * 2. Dentro de iniciarJuego(), pausarJuego(), reiniciarJuego()
 *    y cambiarDireccion() agrega la lógica real de la serpiente.
 * 3. El canvas ya está en la variable CANVAS y el contexto en CTX.
 *    Úsalos así:
 *      CTX.fillStyle = '#22c55e';
 *      CTX.fillRect(x, y, TAMANIO_CELDA, TAMANIO_CELDA);
 * 4. La cuadrícula es de 500×500 px internos.
 *    Con celdas de 25px tendrás un grid de 20×20.
 * 5. Los eventos de teclado y táctiles ya llaman a cambiarDireccion(),
 *    así que solo necesitas implementar el movimiento ahí.
 * ================================================================
 */

'use strict';

////------------comentar debido a que ya estan c¿siendo declaradas en serpienets.js
//'touchInicioX'
//ESTADO_JUEGO
/* ================================================================
   1. VARIABLES Y REFERENCIAS AL HTML
   Son como etiquetas pegadas a cada parte de la página para
   poder encontrarlas rápido cuando las necesitamos.
================================================================ */

// El canvas: la pizarra donde irá el juego
const CANVAS = document.getElementById('canvasJuego');

// El contexto 2D: el "pincel" para dibujar dentro del canvas
const CTX = CANVAS ? CANVAS.getContext('2d') : null;

// El párrafo donde aparece el mensaje de texto
const elMensaje = document.getElementById('mensaje');

// El número grande de puntaje
const elPuntaje = document.getElementById('puntaje');

// El texto de estado (Listo / Jugando / Pausado / Fin)
const elEstado = document.getElementById('estado');

// El overlay decorativo del canvas (antes de iniciar)
const elOverlay = document.getElementById('canvasOverlay');

// El brillo pulsante de la serpiente en el árbol
const elBrilloSerpiente = document.getElementById('brilloSerpiente');

// La capa donde van a caer las hojas animadas
const capaHojas = document.getElementById('capaHojas');

// El contenedor de la escena del Edén (para el parallax)
const escenaEden = document.querySelector('.escena-eden');

// El contenedor principal del juego
const contenedorJuego = document.querySelector('.contenedor-juego');


/* ================================================================
   ESTADO GLOBAL DEL JUEGO
   Como una hoja donde anotamos si el juego está encendido,
   pausado, o todavía no empezó.
================================================================ */
/* const ESTADO_JUEGO = {
  iniciado: false,   // ¿Ya empezó el juego?
  pausado:  false,   // ¿Está en pausa?
  terminado: false,  // ¿Terminó el juego (game over)?
  puntaje:  0,       // Cuántos puntos tiene el jugador
};
 */
// El tamaño de cada cuadrito de la cuadrícula del juego
//const TAMANIO_CELDA = 25; // 500px ÷ 25 = 20 casillas × 20 casillas


/* ================================================================
   2. EFECTO MÁQUINA DE ESCRIBIR (typewriter)
   Hace que las letras del mensaje aparezcan una por una,
   como si alguien las estuviera escribiendo en tiempo real.
================================================================ */

// Aquí guardamos el estado de la escritura
const ESCRITURA = {
  textoCompleto: 'Presiona iniciar para comenzar.', // El texto default
  posicion: 0,           // En qué letra vamos
  intervalo: null,       // El temporizador que avanza letra por letra
  velocidad: 60,         // Cuántos milisegundos entre cada letra
  activa: true,          // ¿Está escribiendo ahora?
};

/**
 * Empieza a escribir un texto letra por letra.
 * Es como ver a alguien escribir en la computadora en tiempo real.
 * @param {string} texto - El texto que queremos escribir
 * @param {Function} [alTerminar] - Función que se llama cuando termina de escribir
 */
function iniciarEscritura(texto, alTerminar) {
  // Pausamos cualquier escritura que esté pasando
  detenerEscritura();

  // Guardamos el nuevo texto
  ESCRITURA.textoCompleto = texto;
  ESCRITURA.posicion = 0;
  ESCRITURA.activa = true;

  // Vaciamos el mensaje para empezar desde el principio
  if (elMensaje) {
    elMensaje.textContent = '';
    elMensaje.classList.remove('sin-cursor');
  }

  // Cada cierto tiempo, agregamos una letra más
  ESCRITURA.intervalo = setInterval(() => {
    if (!ESCRITURA.activa) return;

    if (ESCRITURA.posicion < ESCRITURA.textoCompleto.length) {
      // Agregamos la siguiente letra
      elMensaje.textContent = ESCRITURA.textoCompleto.slice(0, ESCRITURA.posicion + 1);
      ESCRITURA.posicion++;
    } else {
      // Ya terminamos de escribir todas las letras
      detenerEscritura();
      if (typeof alTerminar === 'function') alTerminar();
    }
  }, ESCRITURA.velocidad);
}

/**
 * Para la escritura automática pero deja el texto como está.
 * Como si la persona dejara de escribir a la mitad.
 */
function detenerEscritura() {
  ESCRITURA.activa = false;
  if (ESCRITURA.intervalo) {
    clearInterval(ESCRITURA.intervalo);
    ESCRITURA.intervalo = null;
  }
}

/**
 * Para la escritura Y quita el cursor parpadeante.
 * Se usa cuando el juego empieza y el mensaje ya no cambia.
 */
function fijarMensaje() {
  detenerEscritura();
  if (elMensaje) elMensaje.classList.add('sin-cursor');
}

/**
 * Retoma la escritura desde donde se quedó.
 * Como cuando alguien vuelve a escribir después de una pausa.
 */
function reanudarEscritura() {
  if (!elMensaje) return;
  elMensaje.classList.remove('sin-cursor');
  ESCRITURA.activa = true;

  ESCRITURA.intervalo = setInterval(() => {
    if (!ESCRITURA.activa) return;
    if (ESCRITURA.posicion < ESCRITURA.textoCompleto.length) {
      elMensaje.textContent = ESCRITURA.textoCompleto.slice(0, ESCRITURA.posicion + 1);
      ESCRITURA.posicion++;
    } else {
      detenerEscritura();
    }
  }, ESCRITURA.velocidad);
}

/**
 * Reinicia la escritura desde el principio con un texto nuevo.
 * Es como borrar la pizarra y empezar a escribir de nuevo.
 * @param {string} texto - El nuevo mensaje a escribir
 */
function cambiarMensaje(texto) {
  if (!elMensaje) return;
  elMensaje.classList.remove('sin-cursor');
  iniciarEscritura(texto);
}


/* ================================================================
   3. HOJAS CAYENDO DEL CIELO
   De vez en cuando, una hoja cae desde arriba.
   Es como estar en el jardín del Edén cuando hay viento.
================================================================ */

// Los diferentes tipos de hojas que pueden caer
const TIPOS_HOJAS = ['🍃', '🌿', '🍀', '🌱', '🌾'];

/**
 * Crea una hoja animada que cae desde arriba de la pantalla.
 * Como cuando el viento arrastra las hojas en otoño.
 */
function crearHoja() {
  if (!capaHojas) return;

  const hoja = document.createElement('div');
  hoja.className = 'hoja';

  // Elegimos una hoja al azar
  hoja.textContent = TIPOS_HOJAS[Math.floor(Math.random() * TIPOS_HOJAS.length)];

  // La posicionamos en un lugar random del ancho de la pantalla
  hoja.style.left = Math.random() * 100 + '%';

  // Cuánto tarda en caer (entre 5 y 12 segundos)
  const duracion = 5 + Math.random() * 7;
  hoja.style.animationDuration = duracion + 's';
  hoja.style.fontSize = (10 + Math.random() * 12) + 'px';
  hoja.style.opacity = 0.4 + Math.random() * 0.5;

  capaHojas.appendChild(hoja);

  // Cuando la hoja termina de caer, la eliminamos para no llenar la memoria
  setTimeout(() => {
    if (hoja.parentNode) hoja.parentNode.removeChild(hoja);
  }, duracion * 1000 + 500);
}

/**
 * Empieza a crear hojas periódicamente.
 * Una hoja nueva aparece cada cierto tiempo.
 */
function arrancarHojas() {
  // Primera hoja inmediatamente
  crearHoja();

  // Después una hoja nueva cada 2.5 segundos aproximadamente
  setInterval(() => {
    // Solo creamos hoja si el usuario tiene la página visible
    if (!document.hidden) crearHoja();
  }, 2500);
}


/* ================================================================
   4. DIBUJO DECORATIVO EN EL CANVAS
   Antes de que empiece el juego, el canvas muestra una decoración
   del jardín. Como el fondo de pantalla antes de abrir una app.
================================================================ */

/**
 * Dibuja el fondo decorativo del Edén dentro del canvas.
 * ¡IMPORTANTE! Esto es solo decoración visual. Cuando integres
 * la lógica del juego, este dibujo se reemplaza con el juego real.
 */
function dibujarDecoracionCanvas() {
  
  if (!CTX || !CANVAS) return;

  const W = CANVAS.width;   // 500
  const H = CANVAS.height;  // 500

  // Limpiamos todo lo que había antes
  CTX.clearRect(0, 0, W, H);

  // --- Fondo: cielo del jardín ---
  const cielo = CTX.createLinearGradient(0, 0, 0, H);
  cielo.addColorStop(0, '#0a1a06');   // Arriba: verde muy oscuro
  cielo.addColorStop(0.6, '#0d2010'); // Medio: verde bosque
  cielo.addColorStop(1, '#040a03');   // Abajo: casi negro
  CTX.fillStyle = cielo;
  CTX.fillRect(0, 0, W, H);

  // --- Puntos de luz tipo estrellas / luciérnagas ---
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H * 0.7;
    const r = Math.random() * 2 + 0.5;
    CTX.beginPath();
    CTX.arc(x, y, r, 0, Math.PI * 2);
    CTX.fillStyle = `rgba(${Math.random() > 0.5 ? '250,204,21' : '56,189,248'}, ${0.3 + Math.random() * 0.5})`;
    CTX.fill();
  }

  // --- Piso de césped ---
  const cesped = CTX.createLinearGradient(0, H * 0.75, 0, H);
  cesped.addColorStop(0, 'rgba(22, 101, 52, 0.6)');
  cesped.addColorStop(1, 'rgba(5, 46, 22, 0.9)');
  CTX.fillStyle = cesped;
  CTX.fillRect(0, H * 0.75, W, H * 0.25);

  // --- Una pequeña serpiente de neón decorativa ---
  dibujarSerpienteDecoNeon(CTX, W, H);

  // --- Texto del centro ---
  CTX.save();
  CTX.textAlign = 'center';
  CTX.textBaseline = 'middle';
  CTX.font = 'bold 16px Orbitron, monospace';
  CTX.fillStyle = 'rgba(34, 197, 94, 0.3)';
  CTX.fillText('— EL JARDÍN DEL EDÉN —', W / 2, H * 0.88);
  CTX.font = '12px Nunito, Arial';
  CTX.fillStyle = 'rgba(148, 163, 184, 0.3)';
  CTX.fillText('Condenada a arrastrarse sobre su vientre', W / 2, H * 0.93);
  CTX.restore();
}

/**
 * Dibuja una pequeña serpiente de neón decorativa en el canvas.
 * Solo para que se vea bonito antes de que empiece el juego de verdad.
 * @param {CanvasRenderingContext2D} ctx - El pincel del canvas
 * @param {number} W - Ancho del canvas
 * @param {number} H - Alto del canvas
 */
function dibujarSerpienteDecoNeon(ctx, W, H) {
  // La serpiente es una curva sinusoidal (como una ola)
  ctx.save();

  // El brillo exterior de la serpiente
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 15;
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  const startX = W * 0.1;
  const startY = H * 0.5;
  ctx.moveTo(startX, startY);

  // Dibujamos la curva de la serpiente punto por punto
  for (let t = 0; t <= 1; t += 0.01) {
    const x = startX + t * W * 0.8;
    const y = startY + Math.sin(t * Math.PI * 3) * 60; // Ondulación suave
    ctx.lineTo(x, y);
  }

  ctx.stroke();

  // El centro brillante de la serpiente (más claro)
  ctx.shadowBlur = 5;
  ctx.strokeStyle = 'rgba(134, 239, 172, 0.7)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // La cabeza de la serpiente
  const headX = W * 0.1 + W * 0.8;
  const headY = H * 0.5 + Math.sin(Math.PI * 3) * 60;
  ctx.beginPath();
  ctx.arc(headX, headY, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#22c55e';
  ctx.shadowBlur = 20;
  ctx.fill();

  // Los ojos reptilianos de la serpiente decorativa
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ff6b00';
  ctx.beginPath();
  ctx.arc(headX - 3, headY - 3, 3, 0, Math.PI * 2);
  ctx.arc(headX + 3, headY - 3, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Anima la decoración del canvas con un brillo que cambia.
 * La decoración "respira" suavemente mientras esperas iniciar.
 */
let frameDecoracion = 0;
function animarDecoracion() {
  
  // Solo animamos cuando el juego no ha empezado
  if (ESTADO_JUEGO.iniciado) return;
  if (!CTX) return;

  frameDecoracion++;

  // Redibujar cada 60 frames (aproximadamente 2 segundos)
  if (frameDecoracion % 90 === 0) {
    dibujarDecoracionCanvas();
  }

  requestAnimationFrame(animarDecoracion);
}


/* ================================================================
   5. FUNCIONES DEL JUEGO (STUBS)
   Estas funciones ya están conectadas a los botones del HTML.
   Ahora solo tienen efectos visuales.
   ¡AQUÍ AGREGAS LA LÓGICA DEL JUEGO CUANDO ESTÉS LISTO!
================================================================ */

/**
 * Se llama cuando el usuario presiona "Iniciar".
 * Por ahora cambia el estado visual. Agrega la lógica del juego aquí.
 *
 * TODO (para el futuro):
 * - Inicializar la serpiente en el centro del canvas
 * - Colocar la primera manzana en posición aleatoria
 * - Arrancar el loop del juego con setInterval o requestAnimationFrame
 */
function iniciarJuegoAnimaciones() {
  
  if (ESTADO_JUEGO.iniciado && !ESTADO_JUEGO.pausado) return;

  ESTADO_JUEGO.iniciado  = true;
  ESTADO_JUEGO.pausado   = false;
  ESTADO_JUEGO.terminado = false;

  // ---- Efectos visuales al iniciar ----
  actualizarEstadoVisual('Jugando', 'jugando');

  // Cuando se inicia, el mensaje se fija (deja de escribirse)
  fijarMensaje();
  if (elMensaje) elMensaje.textContent = '¡A jugar! Esquiva tu rastro…';

  // Ocultamos el overlay decorativo del canvas
  if (elOverlay) elOverlay.classList.add('oculto');

  // Limpiamos el canvas (el juego dibujará encima)
  if (CTX) CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

  console.log('🐍 iniciarJuego() — Listo para recibir la lógica del juego.');
  iniciarJuego();
  // ↑ Cuando agregues la lógica, ponla después de esta línea.
}

/**
 * Se llama cuando el usuario presiona "⏸️".
 * Alterna entre pausar y reanudar.
 *
 * TODO (para el futuro):
 * - Si hay un intervalo/loop del juego, detenerlo aquí al pausar
 * - Y reanudarlo cuando se despause
 */
function pausarJuegoAnimaciones() {
  if (!ESTADO_JUEGO.iniciado || ESTADO_JUEGO.terminado) return;

  ESTADO_JUEGO.pausado = !ESTADO_JUEGO.pausado; // Alternamos

  if (ESTADO_JUEGO.pausado) {
    // El juego se PAUSÓ
    actualizarEstadoVisual('Pausado', 'pausado');
    // El mensaje vuelve a escribirse letra por letra
    cambiarMensaje('En pausa… presiona ⏸️ para continuar.');
    console.log('⏸️ pausarJuego() — Juego pausado.');
    // TODO: Detener el loop del juego aquí.

  } else {
    // El juego SE REANUDÓ
    actualizarEstadoVisual('Jugando', 'jugando');
    // El mensaje se fija de nuevo
    fijarMensaje();
    if (elMensaje) elMensaje.textContent = '¡De vuelta al jardín!';
    console.log('▶️ reanudarJuego() — Juego reanudado.');
    pausarJuego();
    // TODO: Reanudar el loop del juego aquí.
  }
}

/**
 * Se llama cuando el usuario presiona "Reiniciar".
 * Vuelve todo al estado inicial.
 *
 * TODO (para el futuro):
 * - Detener el loop activo del juego
 * - Resetear la posición de la serpiente
 * - Borrar la comida del canvas
 * - Volver a arrancar desde cero
 */
function reiniciarJuegoAnimaciones() {
  // Detenemos todo
  ESTADO_JUEGO.iniciado  = false;
  ESTADO_JUEGO.pausado   = false;
  ESTADO_JUEGO.terminado = false;
  ESTADO_JUEGO.puntaje   = 0;

  // ---- Efectos visuales al reiniciar ----
  actualizarEstadoVisual('Listo', 'listo');
  actualizarPuntaje(0);

  // Mostramos el overlay decorativo de nuevo
  if (elOverlay) elOverlay.classList.remove('oculto');

  // Redibujamos la decoración del canvas
  dibujarDecoracionCanvas();

  // El mensaje vuelve a escribirse
  cambiarMensaje('Presiona iniciar para comenzar.');

  console.log('↺ reiniciarJuego() — Todo reiniciado.');
  // TODO: Agrega aquí la limpieza de la lógica del juego.
  reiniciarJuego()
}

/**
 * Se llama cuando el juego termina (game over).
 * Muestra el mensaje de fin y el puntaje final.
 * @param {number} puntajeFinal - Cuántos puntos consiguió el jugador
 */
function finJuego(puntajeFinal) {
  ESTADO_JUEGO.iniciado  = false;
  ESTADO_JUEGO.terminado = true;
  ESTADO_JUEGO.pausado   = false;

  actualizarEstadoVisual('Fin', 'fin');

  // El mensaje de game over se escribe letra por letra
  cambiarMensaje(`¡La serpiente mordió su cola! Puntaje: ${puntajeFinal}`);

  console.log(`💀 finJuego() — Game Over. Puntaje: ${puntajeFinal}`);
  gameOver();
}

/**
 * Se llama cuando el usuario usa las flechas o botones de dirección.
 * @param {'arriba'|'abajo'|'izquierda'|'derecha'} direccion - La dirección
 *
 * TODO (para el futuro):
 * - Aquí cambias la dirección de movimiento de la serpiente
 * - No permitas que la serpiente vaya en dirección opuesta
 *   (si va a la derecha, no puede girar de golpe a la izquierda)
 */



/* ================================================================
   FUNCIONES DE AYUDA PARA ACTUALIZAR LA UI
================================================================ */

/**
 * Actualiza el texto y color del estado del juego.
 * @param {string} texto - Qué texto mostrar ('Listo', 'Jugando', etc.)
 * @param {string} clase - La clase CSS que da el color correcto
 */
function actualizarEstadoVisual(texto, clase) {
  if (!elEstado) return;
  elEstado.textContent = texto;
  // Quitamos clases anteriores y ponemos la nueva
  elEstado.className = 'numero-3d estado-texto';
  if (clase === 'pausado') elEstado.classList.add('pausado');
  if (clase === 'fin')     elEstado.classList.add('fin');
}

/**
 * Actualiza el número de puntaje que ve el jugador.
 * @param {number} nuevoPuntaje - El puntaje que queremos mostrar
 */
function actualizarPuntaje(nuevoPuntaje) {
  ESTADO_JUEGO.puntaje = nuevoPuntaje;
  if (elPuntaje) elPuntaje.textContent = nuevoPuntaje;
}




/* ================================================================
   7. PARALLAX SUAVE
   Cuando mueves el ratón, el fondo se mueve un poquito diferente
   al primer plano. Esto da una sensación de profundidad, como
   cuando ves el campo desde el tren y las cosas cercanas pasan
   más rápido que las lejanas.
================================================================ */

/**
 * Activa el efecto de parallax al mover el ratón.
 * Solo en pantallas grandes (no en celulares, ahorra batería).
 */
function activarParallax() {
  // Solo en pantallas donde hay ratón
  if (window.innerWidth < 768) return;

  document.addEventListener('mousemove', (e) => {
    // Cuánto se movió el ratón respecto al centro (entre -0.5 y 0.5)
    const centroX = window.innerWidth  / 2;
    const centroY = window.innerHeight / 2;
    const factorX = (e.clientX - centroX) / centroX;
    const factorY = (e.clientY - centroY) / centroY;

    // El árbol y Eva se mueven suavemente con el ratón
    if (escenaEden) {
      const ladoArbol = escenaEden.querySelector('.lado-arbol');
      const ladoEva   = escenaEden.querySelector('.lado-eva');

      if (ladoArbol) {
        // El árbol se mueve un poquito (efecto sutil)
        ladoArbol.style.transform = `translateX(${factorX * -6}px) translateY(${factorY * -3}px)`;
      }
      if (ladoEva) {
        // Eva se mueve un poquito más (está "más cerca")
        ladoEva.style.transform = `translateX(${factorX * 8}px) translateY(${factorY * -4}px)`;
      }
    }

    // Las nubes del fondo también se mueven, pero muy poco
    document.querySelectorAll('.nube').forEach((nube, i) => {
      const factor = (i + 1) * 0.8;
      nube.style.transform = `translateX(${factorX * factor * -5}px)`;
    });
  }, { passive: true });
}


/* ================================================================
   8. GIFs Y CARGA PEREZOSA (LAZY LOAD)
   Esta sección prepara el espacio para cargar los GIFs animados
   cuando estén disponibles, sin frenar la carga de la página.
================================================================ */

/**
 * Carga un GIF de manera perezosa (lazy): espera a que sea visible.
 * Así la página carga rápido y los GIFs se piden solo cuando hacen falta.
 *
 * CÓMO USAR (cuando tengas los GIFs):
 * 1. Sube los GIFs a tu servidor o carpeta
 * 2. Llama: cargarGifLazy('.placeholder-image[data-role="eva"]', 'eva.gif', 'Eva en el jardín')
 * 3. El div del placeholder se reemplazará por la imagen
 *
 * @param {string} selector - El selector CSS del placeholder
 * @param {string} srcGif   - La ruta del archivo GIF
 * @param {string} altTexto - Texto alternativo (accesibilidad)
 */
function cargarGifLazy(selector, srcGif, altTexto) {
  const placeholder = document.querySelector(selector);
  if (!placeholder) return;

  // Creamos el observador que vigila si el elemento es visible
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        // El elemento es visible, cargamos el GIF
        const img = document.createElement('img');
        img.src     = srcGif;
        img.alt     = altTexto;
        img.loading = 'lazy'; // El navegador también lo carga perezosamente
        img.style.cssText = `
          width: 100%; height: 100%;
          object-fit: contain;
          object-position: bottom;
          display: block;
        `;

        // Cuando el GIF cargue, reemplazamos el placeholder
        img.onload = () => {
          placeholder.innerHTML = '';
          placeholder.appendChild(img);
          placeholder.removeAttribute('data-role'); // Ya no es placeholder
        };

        img.onerror = () => {
          console.warn(`⚠️ No se pudo cargar el GIF: ${srcGif}`);
          // Si falla, el CSS decorativo sigue visible
        };

        // Dejamos de observar (ya lo cargamos)
        observador.unobserve(placeholder);
      }
    });
  }, { threshold: 0.1 }); // Se activa cuando el 10% del elemento es visible

  observador.observe(placeholder);
}

/**
 * Inicializa la carga de todos los GIFs del juego.
 *
 * ════════════════════════════════════════════════════════════════
 * CUANDO TENGAS LOS GIFs:
 * Descomenta y ajusta las líneas de abajo con las rutas correctas.
 * ════════════════════════════════════════════════════════════════
 */
function inicializarGifs() {
  // GIF de Eva (mujer con cabello rojizo, cobertura modesta)
  cargarGifLazy('.placeholder-image[data-role="eva"]', './assets/eva.gif', 'Eva en el jardín del Edén');

  // GIF del árbol con manzanas brillantes
  cargarGifLazy('.placeholder-image[data-role="arbol"]', './assets/arbol.gif', 'Árbol del conocimiento con manzanas');

  console.log('📁 GIFs configurados. Para activarlos, descomenta las líneas en inicializarGifs()');
}


/* ================================================================
   9. ARRANQUE DE TODO — cuando la página termina de cargar
   Es como encender el interruptor: todo se activa junto.
================================================================ */

/**
 * Esta función se llama una sola vez cuando la página ya cargó.
 * Arranca todas las animaciones, efectos y escuchadores.
 */
function arrancarAplicacion() {
  dibujarDecoracionCanvas();
  
  console.log('🌿 Neon Slither: El Despertar Algorítmico — Iniciando…');

  // 1. Empezamos a escribir el mensaje inicial letra por letra
  iniciarEscritura('Presiona iniciar para comenzar.');

  // 2. Las hojas empiezan a caer del cielo
  arrancarHojas();

  // 3. Dibujamos la decoración inicial en el canvas
  

  // 4. Arrancamos la animación suave del canvas decorativo
  animarDecoracion();

  // 5. Activamos el parallax del ratón (solo en pantallas grandes)
  activarParallax();

  // 6. Configuramos la carga de GIFs (descomenta en inicializarGifs cuando los tengas)
  inicializarGifs();

  console.log('✅ Aplicación lista. La serpiente espera en el árbol…');
}

// Cuando la página termine de cargar, arrancamos todo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', arrancarAplicacion);
} else {
  // La página ya cargó (el script se cargó diferido)
  arrancarAplicacion();
}
