const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// reproducir música al hacer clic
const music = document.getElementById("bg-music");
window.addEventListener("click", () => {
  music.play().catch(()=>{});
});

// lista de frases que caerán
const messages = [
  "Eres mi universo amorcito",
  "Eres mi lugar favorito, incluso cuando el mundo se vuelve caótico",
  "Eres la estrella más brillanteMe encantas más de lo que puedo explicar",
  "Tu amor me enciende el alma",
  "No sé cómo lo haces, pero cada día me gustas más",
  "Contigo todo es más bonito, incluso lo simple"
];

// partículas del corazón
const particles = [];
const heartPoints = [];
const size = 10;

// ✨ Chispas o estrellas suaves de fondo
const stars = [];
const STAR_COUNT = 120; // cantidad de chispas (puedes subir o bajar a gusto)

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    alpha: 0.3 + Math.random() * 0.7,
    twinkle: Math.random() * 0.05, // velocidad del parpadeo
    dir: Math.random() > 0.5 ? 1 : -1
  });
}


// función que genera el contorno del corazón
for (let t = 0; t < Math.PI * 2; t += 0.01) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  heartPoints.push({ x, y });
}

// ajustar a pantalla
function createHeart() {
  const LAYERS = 8;     // capas de puntitos por cada punto base (súbelo a 10–12 si quieres más)
  const THICKNESS = 12; // “grosor” del anillo en píxeles (sube/baja para ajustar)

  particles.length = 0;

  heartPoints.forEach(p => {
    for (let i = 0; i < LAYERS; i++) {
      // desplazamiento aleatorio alrededor del punto base
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * THICKNESS;
      const jx = Math.cos(ang) * r;
      const jy = Math.sin(ang) * r;

      particles.push({
        x: canvas.width / 2 + p.x * 20 + jx,
        y: canvas.height / 2 - p.y * 20 + jy,
        alpha: 0.6 + Math.random() * 0.4   // para que no todos brillen igual
      });
    }
  });
}


// texto que cae como lluvia
const fallingTexts = [];

function createFallingText() {
  const text = messages[Math.floor(Math.random() * messages.length)];
  const fontSize = 16 + Math.random() * 10;
  const x = Math.random() * (canvas.width - 200);
  fallingTexts.push({ text, x, y: -20, alpha: 1, speed: 1 + Math.random() * 1.5, fontSize });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // ✨ Dibujar chispas (sin borrar el fondo lila)
  for (let s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`; // blancas (puedes cambiar el color)
    ctx.fill();

    // efecto de parpadeo suave
    s.alpha += s.twinkle * s.dir;
    if (s.alpha <= 0.2 || s.alpha >= 1) s.dir *= -1;
  }

  // dibujar corazón
particles.forEach(p => {
  ctx.beginPath();

  // color aleatorio entre dos (puedes agregar más)
  const colors = [
    `rgba(255, 105, 255, ${p.alpha})`, // rosado
    `rgba(0, 255, 255, ${p.alpha})`,   // celeste
    `rgba(255, 255, 0, ${p.alpha})`    // amarillo (opcional, agrega más si quieres)
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  ctx.fillStyle = color;
  ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
  ctx.fill();
});


  // animar textos que caen
  for (let i = 0; i < fallingTexts.length; i++) {
    const t = fallingTexts[i];
    ctx.font = `bold ${t.fontSize}px 'Oswald'`;
    ctx.fillStyle = `rgba(255, 105, 255, ${t.alpha})`;
    ctx.fillText(t.text, t.x, t.y);
    t.y += t.speed;
    t.alpha -= 0.003;
  }

  // eliminar textos invisibles
  for (let i = fallingTexts.length - 1; i >= 0; i--) {
    if (fallingTexts[i].alpha <= 0) fallingTexts.splice(i, 1);
  }

  requestAnimationFrame(draw);
}

createHeart();
setInterval(createFallingText, 2000);
draw();
// Ajustar tamaño del canvas al cambiar orientación o tamaño de pantalla
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createHeart(); // vuelve a dibujar el corazón centrado
});
