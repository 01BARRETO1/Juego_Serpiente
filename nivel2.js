/* nivel2.js
   Nivel 2: dibujar todo dentro del canvas usando imágenes (piezas de serpiente y manzanas)
   + Reloj que aparece aleatoriamente y aumenta "tiempo" al comerse (+15).
   Diseñado para integrarse con tu archivo principal (serpiente.js).
   ---------------------------------------------------------------
   Instrucciones de uso:
   1) Añade <script src="nivel2.js"></script> después de cargar tu serpiente.js en el HTML.
   2) Este archivo precarga assets automáticamente.
   3) Llama a window.activarNivel2() antes de iniciar el juego (por ejemplo dentro de iniciarJuego())
      o deja que el juego use nivel 2 si ya lo tienes configurado.
   4) Llama a window.desactivarNivel2() para volver al modo canvas original si lo necesitas.
*/

// Inicializar la serpiente global si no existe
if (!window.serpiente || !Array.isArray(window.serpiente)) {
  // posición inicial ejemplo; ajusta según tu tablero
  window.serpiente = [
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 }
  ];
}

// Alias para compatibilidad con nivel2.js que usa _serpiente
if (!window._serpiente) {
  window._serpiente = window.serpiente;
} else {
  // si existe _serpiente pero no es el mismo array, unificarlos
  if (window._serpiente !== window.serpiente) {
    window._serpiente = window.serpiente;
  }
}


/* ============================
   Compatibilidad con tu entorno
   ============================ */
/* Usamos las variables globales existentes si ya están definidas en serpiente.js.
   Si no existen, intentamos obtener el canvas por id. */
const _canvas = window.canvas || document.getElementById("canvasJuego");
const _ctx = window.ctx || (_canvas ? _canvas.getContext("2d") : null);
const _TAMANIO_CELDA = window.TAMANIO_CELDA || 25;

/* Referencias a estructuras globales que tu serpiente.js ya define:
   - serpiente (array)
   - manzana (array)
   - tiempo (number)
   - intervaloSerpiente (id)
   - funciones moverArriba/moverAbajo/moverIzquierda/moverDerecha, dibujarTodo, moverSerpiente
   Si no existen, el script seguirá cargando pero algunas funciones no funcionarán hasta que
   el archivo principal las defina. */
const _serpiente = window.serpiente || [];
const _manzana = window.manzana || []; // se usará como array de objetos {x,y,imgIndex}

/* ============================
   Assets (imágenes) y precarga
   ============================ */
const Nivel2Assets = {
  cabeza: new Image(),
  cuello: new Image(),
  cuerpo: new Image(),
  cola: new Image(),
  manzanas: [],   // array de Image()
  reloj: new Image()
};

let _assetsCargados = 0;
let _totalAssets = 0;
let nivel2Activo = true; // por defecto activado; puedes cambiar con activarNivel2()/desactivarNivel2()

// Rutas por defecto (ajusta si tus archivos están en otra carpeta)
const rutas = {
  cabeza: "assets/cabeza.png",
  cuello: "assets/cuello.png",
  cuerpo: "assets/cuerpo.png",
  cola: "assets/cola.png",
  manzanas: [
    "assets/manzana_roja.png",
    "assets/manzana_verde.png",
    "assets/manzana_azul.png",
    "assets/manzana_amarilla.png"
  ],
  reloj: "assets/reloj.png"
};


// Inicializa rutas personalizadas si el usuario ya definió window.RUTAS_NIVEL2
if (window.RUTAS_NIVEL2) {
  Object.assign(rutas, window.RUTAS_NIVEL2);
}

/* Precarga de assets */
function cargarAssetsNivel2(callback) {
  _assetsCargados = 0;
  Nivel2Assets.cabeza.src = rutas.cabeza;
  Nivel2Assets.cuello.src = rutas.cuello;
  Nivel2Assets.cuerpo.src = rutas.cuerpo;
  Nivel2Assets.cola.src = rutas.cola;
  Nivel2Assets.reloj.src = rutas.reloj;

  Nivel2Assets.manzanas = rutas.manzanas.map(r => {
    const img = new Image();
    img.src = r;
    return img;
  });

  _totalAssets = 4 + Nivel2Assets.manzanas.length + 1; // cabeza, cuello, cuerpo, cola + manzanas + reloj

  function onLoadAsset() {
    _assetsCargados++;
    if (_assetsCargados >= _totalAssets && typeof callback === "function") {
      callback();
    }
  }
// Handler cuando un asset falla en cargar
  function onErrorAsset(e) {
    console.error("Error cargando asset:", e && e.target && e.target.src);
    // Contamos el asset fallido para no bloquear la carga completa
    onLoadAsset();
  }

  // Asignar onload y onerror a cada asset
  Nivel2Assets.cabeza.onload = onLoadAsset;
  Nivel2Assets.cabeza.onerror = onErrorAsset;

  Nivel2Assets.cuello.onload = onLoadAsset;
  Nivel2Assets.cuello.onerror = onErrorAsset;

  Nivel2Assets.cuerpo.onload = onLoadAsset;
  Nivel2Assets.cuerpo.onerror = onErrorAsset;

  Nivel2Assets.cola.onload = onLoadAsset;
  Nivel2Assets.cola.onerror = onErrorAsset;

  Nivel2Assets.reloj.onload = onLoadAsset;
  Nivel2Assets.reloj.onerror = onErrorAsset;

  Nivel2Assets.manzanas.forEach(img => {
    img.onload = onLoadAsset;
    img.onerror = onErrorAsset;
  });

  // Fallback: si algunas imágenes ya estaban en cache y no dispararon onload
  setTimeout(() => {
    if (_assetsCargados < _totalAssets) {
      const all = [Nivel2Assets.cabeza, Nivel2Assets.cuello, Nivel2Assets.cuerpo, Nivel2Assets.cola, Nivel2Assets.reloj, ...Nivel2Assets.manzanas];
      all.forEach(img => {
        if (img.complete && !img._counted) {
          img._counted = true;
          _assetsCargados++;
        }
      });
      if (_assetsCargados >= _totalAssets && typeof callback === "function") callback();
    }
  }, 300);
}

/* ============================
   Helpers para dibujar imágenes rotadas
   ============================ */
function calcularAngulo(a, b) {
  // a y b son objetos con x,y en celdas
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (dx === 1 && dy === 0) return 0;             // derecha
  if (dx === -1 && dy === 0) return Math.PI;      // izquierda
  if (dx === 0 && dy === 1) return Math.PI / 2;   // abajo
  if (dx === 0 && dy === -1) return -Math.PI / 2; // arriba
  return 0;
}

//------------------------------------------------
// Dibujo seguro sin rotación
function safeDrawImage(ctx, img, x, y, w, h) {
  if (!img) return false;
  if (!img.complete || img.naturalWidth === 0) {
    console.warn("safeDrawImage: imagen no lista o rota:", img && img.src);
    return false;
  }
  try {
    ctx.drawImage(img, x, y, w, h);
    return true;
  } catch (err) {
    console.error("safeDrawImage falló para", img && img.src, err);
    return false;
  }
}

// Dibujo seguro con rotación (reemplaza la versión anterior)
function drawImageRotated(ctx, image, cellX, cellY, w, h, angle) {
  if (!image) return false;
  if (!image.complete || image.naturalWidth === 0) {
    console.warn("drawImageRotated: imagen no lista o rota:", image && image.src);
    return false;
  }
  const cx = cellX + w / 2;
  const cy = cellY + h / 2;
  try {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.drawImage(image, -w / 2, -h / 2, w, h);
    ctx.restore();
    return true;
  } catch (err) {
    console.error("drawImageRotated falló para", image && image.src, err);
    try { ctx.restore(); } catch (e) {}
    return false;
  }
}


//------------------------------------------------------

/* ============================
   Pintar serpiente (nivel 2: imágenes)
   ============================ */
function pintarSerpienteNivel2() {
  if (!_ctx) return;

  // Si no queremos usar nivel2, no hacemos nada aquí
  if (!nivel2Activo) return;

  for (let i = 0; i < _serpiente.length; i++) {
    const seg = _serpiente[i];
    const px = seg.x * _TAMANIO_CELDA;
    const py = seg.y * _TAMANIO_CELDA;

    // Seleccionar imagen según posición en la serpiente
    let imgToDraw = Nivel2Assets.cuerpo;
    if (i === 0) imgToDraw = Nivel2Assets.cabeza;
    else if (i === 1) imgToDraw = Nivel2Assets.cuello;
    else if (i === _serpiente.length - 1) imgToDraw = Nivel2Assets.cola;

    // Calcular ángulo para cabeza y cola (y opcionalmente cuello)
    let angle = 0;
    if (i === 0 && _serpiente.length > 1) {
      angle = calcularAngulo(_serpiente[0], _serpiente[1]);
    } else if (i === _serpiente.length - 1 && _serpiente.length > 1) {
      angle = calcularAngulo(_serpiente[_serpiente.length - 2], seg);
    } else if (i === 1 && _serpiente.length > 2) {
      angle = calcularAngulo(_serpiente[0], seg);
    }

    drawImageRotated(_ctx, imgToDraw, px, py, _TAMANIO_CELDA, _TAMANIO_CELDA, angle);
  }
}

/* ============================
   Crecer serpiente (preservando forma de cola)
   ============================ */
function crecerSerpienteNivel2() {
  // usar el alias global _serpiente que apunta a window.serpiente
  const s = window._serpiente || window.serpiente;
  if (!Array.isArray(s) || s.length === 0) {
    console.warn("crecerSerpienteNivel2: serpiente vacía, creando segmento inicial.");
    window.serpiente = [{ x: 9, y: 9 }];
    window._serpiente = window.serpiente;
    return;
  }

  const ultima = s[s.length - 1];
  if (!ultima || typeof ultima.x === "undefined" || typeof ultima.y === "undefined") {
    console.error("crecerSerpienteNivel2: última celda inválida:", ultima);
    return;
  }

  const copia = { x: ultima.x, y: ultima.y };
  s.push(copia);
}



/* ============================
   Manzanas (dibujar dentro del canvas usando imágenes)
   ============================ */
/* manzana (global) se usa como array de objetos {x,y,imgIndex}
   Si tu serpiente.js ya define `manzana`, este script usará esa referencia. */
function pintarComidaNivel2(forceNew = false) {
  if (!_ctx) return;

  // Si ya hay una manzana y no forzamos nueva, dibujarla
  if (!forceNew && _manzana.length === 1 && typeof comidaAtrapada !== "undefined" && comidaAtrapada === false) {
    const m = _manzana[0];
    const img = Nivel2Assets.manzanas[m.imgIndex];
    safeDrawImage(_ctx, img, m.x * _TAMANIO_CELDA, m.y * _TAMANIO_CELDA, _TAMANIO_CELDA, _TAMANIO_CELDA);
    return;
  }

  // Si hay manzana en array y forzamos nueva, eliminar la anterior
  if (_manzana.length > 0) {
    _manzana.splice(0, 1);
  }

  // Generar nueva posición aleatoria evitando la serpiente
  const lineasVerticales = _canvas.width / _TAMANIO_CELDA;
  const lineasHorizontales = _canvas.height / _TAMANIO_CELDA;
  let aleatorioX, aleatorioY, colision;
  do {
    aleatorioX = Math.floor(Math.random() * lineasVerticales);
    aleatorioY = Math.floor(Math.random() * lineasHorizontales);
    colision = _serpiente.some(seg => seg.x === aleatorioX && seg.y === aleatorioY);
  } while (colision);

  // **Declarar imgIndex antes de usarla**
  const imgIndex = Math.floor(Math.random() * Nivel2Assets.manzanas.length);
  const nueva = { x: aleatorioX, y: aleatorioY, imgIndex };
  _manzana.push(nueva);

  // Dibujarla inmediatamente usando safeDrawImage
  const img = Nivel2Assets.manzanas[imgIndex];
  safeDrawImage(_ctx, img, aleatorioX * _TAMANIO_CELDA, aleatorioY * _TAMANIO_CELDA, _TAMANIO_CELDA, _TAMANIO_CELDA);
}


/* ============================
   Reloj: spawn, dibujado y colisión
   ============================ */
const relojArr = []; // puede contener 0 o 1 reloj: {x,y}

function generarReloj() {
  if (!_ctx) return;
  if (relojArr.length > 0) return; // ya hay uno

  const lineasVerticales = _canvas.width / _TAMANIO_CELDA;
  const lineasHorizontales = _canvas.height / _TAMANIO_CELDA;
  let aleatorioX, aleatorioY, colision;
  do {
    aleatorioX = Math.floor(Math.random() * lineasVerticales);
    aleatorioY = Math.floor(Math.random() * lineasHorizontales);
    colision = _serpiente.some(seg => seg.x === aleatorioX && seg.y === aleatorioY) ||
              _manzana.some(m => m.x === aleatorioX && m.y === aleatorioY);
  } while (colision);

  relojArr.push({ x: aleatorioX, y: aleatorioY });
}

function pintarReloj() {
  if (!_ctx) return;
  if (relojArr.length === 0) return;
  const r = relojArr[0];
  safeDrawImage(_ctx, Nivel2Assets.reloj, r.x * _TAMANIO_CELDA, r.y * _TAMANIO_CELDA, _TAMANIO_CELDA, _TAMANIO_CELDA);

}

function atrapaRelojNivel2() {
  if (relojArr.length === 0) return false;
  const cabeza = _serpiente[0];
  const r = relojArr[0];
  if (cabeza.x === r.x && cabeza.y === r.y) {
    // Aumentar tiempo en +15 (y reiniciar intervalo)
    if (typeof window.tiempo !== "undefined") {
      window.tiempo = Math.min(window.tiempo + 15, 300);
      clearInterval(window.intervaloSerpiente);
      window.intervaloSerpiente = setInterval(window.moverSerpiente, window.tiempo);
    }
    // Eliminar reloj
    relojArr.splice(0, 1);
    // Forzar que la manzana se regenere en otra posición
    if (typeof window.pintarComida === "function") {
      // Si tu serpiente.js define pintarComida, llamamos con forceNew si acepta
      try { window.pintarComida(true); } catch (e) { /* ignore */ }
    } else {
      // Si no, usamos la versión nivel2
      pintarComidaNivel2(true);
    }
    return true;
  }
  return false;
}

/* ============================
   Spawn aleatorio de relojes
   ============================ */
let spawnRelojTimeout = null;

function iniciarSpawnRelojes() {
  detenerSpawnRelojes();
  const minSeg = 8;
  const maxSeg = 20;
  const delay = (Math.random() * (maxSeg - minSeg) + minSeg) * 1000;
  spawnRelojTimeout = setTimeout(() => {
    generarReloj();
    // programar siguiente spawn
    iniciarSpawnRelojes();
  }, delay);
}

function detenerSpawnRelojes() {
  if (spawnRelojTimeout) {
    clearTimeout(spawnRelojTimeout);
    spawnRelojTimeout = null;
  }
}

/* ============================
   Integración con tu ciclo de dibujo y movimiento
   ============================ */
/* Estas funciones están pensadas para ser llamadas desde tu serpiente.js:
   - En dibujarTodo() reemplaza/añade llamadas:
       pintarComidaNivel2();
       pintarReloj();
       pintarSerpienteNivel2();
   - En moverSerpiente() antes de comprobar manzana llama:
       atrapaRelojNivel2();
   Si prefieres, puedes dejar que este script exponga helpers y tú los llamas desde tu código. */

function dibujarTodoNivel2() {
  if (!_ctx) return;
  // Asumimos que limpiarCanvas() y dibujarTablero() se llaman desde tu dibujarTodo()
  // Aquí solo dibujamos los elementos del nivel 2
  pintarComidaNivel2();
  pintarReloj();
  pintarSerpienteNivel2();
}

/* ============================
   Activar / Desactivar nivel 2
   ============================ */
function activarNivel2() {
  nivel2Activo = true;
  // Precargar assets si no lo están
  cargarAssetsNivel2(() => {
    // una vez cargados, dibujar si existe dibujarTodo
    if (typeof window.dibujarTodo === "function") window.dibujarTodo();
    // iniciar spawn de relojes si el juego ya está iniciado
    if (window.ESTADO_JUEGO && window.ESTADO_JUEGO.iniciado) iniciarSpawnRelojes();
  });
}

function desactivarNivel2() {
  nivel2Activo = false;
  detenerSpawnRelojes();
  // redibujar con el modo clásico si existe
  if (typeof window.dibujarTodo === "function") window.dibujarTodo();
}

/* ============================
   Exponer funciones globales
   ============================ */
window.nivel2 = {
  activarNivel2,
  desactivarNivel2,
  cargarAssetsNivel2,
  pintarSerpienteNivel2,
  pintarComidaNivel2,
  generarReloj,
  pintarReloj,
  atrapaRelojNivel2,
  iniciarSpawnRelojes,
  detenerSpawnRelojes,
  crecerSerpienteNivel2,
  dibujarTodoNivel2
};

/* ============================
   Auto-precarga al incluir el script
   ============================ */
cargarAssetsNivel2(() => {
  // assets listos; si quieres que el juego espere a la carga, llama a cargarAssetsNivel2 desde iniciarJuego
  console.log("Nivel2: assets cargados.");
});

/* ============================
   Comentarios finales y notas
   ============================
 - Este archivo no sobrescribe tus funciones originales; expone helpers que puedes llamar
   desde tu serpiente.js. Para integrar rápidamente:
     1) En tu dibujarTodo() reemplaza las llamadas a pintarSerpiente() y pintarComida()
        por window.nivel2.pintarComidaNivel2(); window.nivel2.pintarReloj(); window.nivel2.pintarSerpienteNivel2();
     2) En moverSerpiente() llama antes de atrapaComida(): window.nivel2.atrapaRelojNivel2();
     3) En iniciarJuego() llama a window.nivel2.iniciarSpawnRelojes() y en pausar/gameOver llama a window.nivel2.detenerSpawnRelojes().
     4) Para que la serpiente crezca manteniendo la forma de la cola, reemplaza crecerSerpiente() por window.nivel2.crecerSerpienteNivel2() o llama a esta función desde tu crecerSerpiente().
 - Si quieres que este script reemplace automáticamente las funciones antiguas, dímelo y lo adapto para sobrescribir pintarSerpiente, pintarComida y crecerSerpiente directamente.
 - Ajusta las rutas en la constante `rutas` si tus imágenes están en otra carpeta.
 - Si necesitas que la orientación del cuello y las transiciones entre segmentos sean más realistas (detectar giros y usar piezas de esquina), puedo añadir esa lógica.
*/
