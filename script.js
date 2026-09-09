// ============================================
// EMOJI LINES
// ============================================

// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Capa donde aparecerán los emojis
const emojiLayer = document.getElementById("emoji-layer");

// Botones
const clearButton = document.getElementById("clearButton");
const modeButton = document.getElementById("modeButton");


// ============================================
// CONFIGURACIÓN
// ============================================

const emojis = [
    "😀", "😂", "😍", "😎",
    "🥳", "🔥", "🚀", "🌈",
    "⭐", "❤️", "💎", "🎮",
    "👽", "🐱", "🐶", "🍕",
    "🍔", "⚡", "🌎", "🎵"
];

let lines = [];

let currentLine = null;

let drawing = false;

let mode = "draw";

let lastEmojiTime = 0;

const emojiDistance = 55;


// ============================================
// AJUSTAR CANVAS A LA PANTALLA
// ============================================

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    redraw();
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// ============================================
// COMENZAR UNA LÍNEA
// ============================================

function startDrawing(x, y) {

    drawing = true;

    currentLine = {
        points: [
            {
                x: x,
                y: y
            }
        ]
    };

    lines.push(currentLine);
}


// ============================================
// AGREGAR PUNTO A LA LÍNEA
// ============================================

function drawPoint(x, y) {

    if (!drawing || !currentLine) {
        return;
    }

    const points = currentLine.points;

    const lastPoint = points[points.length - 1];

    const distance = Math.hypot(
        x - lastPoint.x,
        y - lastPoint.y
    );

    // Evita crear demasiados puntos
    if (distance < 3) {
        return;
    }

    points.push({
        x: x,
        y: y
    });

    // Dibujar la línea
    drawSegment(
        lastPoint.x,
        lastPoint.y,
        x,
        y
    );

    // Crear emojis
    createEmojiIfNeeded(x, y);
}


// ============================================
// TERMINAR LÍNEA
// ============================================

function stopDrawing() {

    drawing = false;

    currentLine = null;
}


// ============================================
// DIBUJAR SEGMENTO
// ============================================

function drawSegment(
    x1,
    y1,
    x2,
    y2
) {

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.strokeStyle = "rgba(255,255,255,0.85)";

    ctx.lineWidth = 2;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    ctx.stroke();
}


// ============================================
// REDIBUJAR TODAS LAS LÍNEAS
// ============================================

function redraw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (const line of lines) {

        const points = line.points;

        if (points.length < 2) {
            continue;
        }

        ctx.beginPath();

        ctx.moveTo(
            points[0].x,
            points[0].y
        );

        for (let i = 1; i < points.length; i++) {

            ctx.lineTo(
                points[i].x,
                points[i].y
            );
        }

        ctx.strokeStyle =
            "rgba(255,255,255,0.85)";

        ctx.lineWidth = 2;

        ctx.lineCap = "round";

        ctx.lineJoin = "round";

        ctx.stroke();
    }
}


// ============================================
// CREAR EMOJI
// ============================================

function createEmojiIfNeeded(x, y) {

    const now = Date.now();

    if (now - lastEmojiTime < emojiDistance) {
        return;
    }

    lastEmojiTime = now;

    const emoji =
        emojis[
            Math.floor(
                Math.random() * emojis.length
            )
        ];

    createEmoji(
        emoji,
        x,
        y
    );
}


// ============================================
// CREAR ELEMENTO EMOJI
// ============================================

function createEmoji(
    emojiCharacter,
    x,
    y
) {

    const element =
        document.createElement("div");

    element.className = "floating-emoji";

    element.textContent =
        emojiCharacter;

    // Pequeña variación de tamaño
    const size =
        25 + Math.random() * 30;

    element.style.fontSize =
        `${size}px`;

    // Posición
    element.style.left =
        `${x}px`;

    element.style.top =
        `${y}px`;

    // Rotación aleatoria
    const rotation =
        -20 + Math.random() * 40;

    element.style.setProperty(
        "--rotation",
        `${rotation}deg`
    );

    emojiLayer.appendChild(element);

    // Eliminar después de unos segundos
    setTimeout(() => {

        element.remove();

    }, 4000);
}


// ============================================
// MOUSE
// ============================================

document.addEventListener(
    "mousemove",
    function(event) {

        const x = event.clientX;

        const y = event.clientY;

        if (mode === "draw") {

            if (!drawing) {

                startDrawing(
                    x,
                    y
                );

            } else {

                drawPoint(
                    x,
                    y
                );
            }
        }
    }
);


// ============================================
// CLICK DEL MOUSE
// ============================================

document.addEventListener(
    "mousedown",
    function(event) {

        if (mode === "draw") {

            startDrawing(
                event.clientX,
                event.clientY
            );
        }
    }
);


// ============================================
// SOLTAR MOUSE
// ============================================

document.addEventListener(
    "mouseup",
    function() {

        stopDrawing();
    }
);


// ============================================
// LIMPIAR
// ============================================

clearButton.addEventListener(
    "click",
    function(event) {

        // Evita que el click
        // cree una nueva línea
        event.stopPropagation();

        lines = [];

        currentLine = null;

        drawing = false;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Eliminar emojis
        emojiLayer.innerHTML = "";
    }
);


// ============================================
// CAMBIAR MODO
// ============================================

modeButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        if (mode === "draw") {

            mode = "free";

            modeButton.textContent =
                "Modo: Libre";

        } else {

            mode = "draw";

            modeButton.textContent =
                "Modo: Dibujar";
        }
    }
);


// ============================================
// EVITAR MENÚ DERECHO
// ============================================

document.addEventListener(
    "contextmenu",
    function(event) {

        event.preventDefault();
    }
);


// ============================================
// SOPORTE PARA CELULAR / TABLET
// ============================================

document.addEventListener(
    "touchstart",
    function(event) {

        const touch =
            event.touches[0];

        startDrawing(
            touch.clientX,
            touch.clientY
        );

    },
    {
        passive: true
    }
);


document.addEventListener(
    "touchmove",
    function(event) {

        const touch =
            event.touches[0];

        drawPoint(
            touch.clientX,
            touch.clientY
        );

    },
    {
        passive: true
    }
);


document.addEventListener(
    "touchend",
    function() {

        stopDrawing();
    }
);