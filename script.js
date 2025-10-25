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
  "Eres mi lugar favorito",
  "Me encantas más de lo que puedo explicar",
  "Tu amor me enciende el alma",
  "Cada día me gustas más",
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
  const LAYERS = 8;
  const THICKNESS = 12;

  // escala automática según tamaño de pantalla
  const scale = (window.innerWidth < 768)
    ? Math.min(canvas.width, canvas.height) / 36   // móvil (más pequeño)
    : Math.min(canvas.width, canvas.height) / 30;  // desktop

  // centra y baja un poquito el corazón para que quepa con el título
  const centerX = canvas.width / 2;
  const centerY = canvas.height * 0.60; // 60% de alto (bajito)

  particles.length = 0;

  heartPoints.forEach(p => {
    for (let i = 0; i < LAYERS; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * THICKNESS;
      const jx = Math.cos(ang) * r;
      const jy = Math.sin(ang) * r;

      particles.push({
        x: centerX + p.x * scale + jx,
        y: centerY - p.y * scale + jy,
        alpha: 0.6 + Math.random() * 0.4
      });
    }
  });
}

// texto que cae como lluvia
const fallingTexts = [];  // ⬅️ necesario
const MAX_ACTIVE_TEXTS = 3;
let msgIndex = 0; // ⬅️ pon esto una sola vez (arriba de createFallingText)

function createFallingText() {
 // if (fallingTexts.length >= MAX_ACTIVE_TEXTS) return;  // ⬅️ evita superposición

  // OPCIONAL: en orden (no aleatorio):
  const text = messages[msgIndex];
  msgIndex = (msgIndex + 1) % messages.length;

  // Si prefieres aleatorio, usa tu línea anterior y borra las 2 de arriba:
  // const text = messages[Math.floor(Math.random() * messages.length)];

  const base   = (window.innerWidth < 768) ? 22 : 28;
  const spread = (window.innerWidth < 768) ? 10 : 15;
  const fontSize = base + Math.random() * spread;

  // Centro exacto (o deja tu variación ±100 px si quieres)
  const x = canvas.width / 2;

  fallingTexts.push({ text, x, y: -40, alpha: 1, speed: 6 + Math.random() * 6, fontSize });
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


// animar textos que caen (centrados sobre el corazón)
for (let i = 0; i < fallingTexts.length; i++) {
  const t = fallingTexts[i];

  // 1) centrado real respecto a x
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // fuente base
  ctx.font = `bold ${t.fontSize}px 'Oswald'`;

  // 2) si la frase es muy ancha, reduzco un poco el tamaño
  const maxWidth = Math.min(canvas.width * 0.85, 420); // límite razonable
  if (ctx.measureText(t.text).width > maxWidth) {
    let fs = t.fontSize;
    while (fs > 14 && ctx.measureText(t.text).width > maxWidth) {
      fs -= 1;
      ctx.font = `bold ${fs}px 'Oswald'`;
    }
  }

  // color + glow sutil para legibilidad
  ctx.fillStyle = `rgba(255, 105, 255, ${t.alpha})`;
  ctx.shadowBlur = 8;
  ctx.shadowColor = "rgba(255, 105, 255, 1)";

  // dibujar
  ctx.fillText(t.text, t.x, t.y);

  // movimiento y desvanecimiento
  t.y += t.speed;
  t.alpha -= 0.002; // un poco más lento para que se lea mejor
}


  // eliminar textos invisibles
  for (let i = fallingTexts.length - 1; i >= 0; i--) {
    if (fallingTexts[i].alpha <= 0) fallingTexts.splice(i, 1);
  }

  requestAnimationFrame(draw);
}

createHeart();
createFallingText();               // aparece una de inmediato
setInterval(createFallingText, 2000);  // intenta cada 2.2s; si hay una, se salta
draw();
// Ajustar tamaño del canvas al cambiar orientación o tamaño de pantalla
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createHeart(); // vuelve a dibujar el corazón centrado
});
