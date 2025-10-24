// --------- Canvas y contexto ----------
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// (opcional) “HD” en pantallas retina
function fitCanvasToScreen() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = Math.floor(window.innerWidth  * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
fitCanvasToScreen();

// ---------- Música ----------
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");

// algunos navegadores piden interacción
window.addEventListener("click", () => {
  music.play().catch(()=>{});
});

musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicBtn.textContent = "⏸️ Pausar música";
  } else {
    music.pause();
    musicBtn.textContent = "🎵 Reproducir música";
  }
});

// ---------- Frases que caen ----------
const messages = [
  "Eres mi universo amorcito",
  "Eres mi lugar favorito",
  "Me encantas más de lo que puedo explicar",
  "Tu amor me enciende el alma",
  "Cada día me gustas más",
  "Contigo todo es más bonito, incluso lo simple"
];

// ---------- Corazón ----------
const particles = [];
const heartPoints = [];
for (let t = 0; t < Math.PI * 2; t += 0.01) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  heartPoints.push({ x, y });
}

function createHeart() {
  const LAYERS = 8;
  const THICKNESS = 12;

  // escala automática: mantiene el corazón dentro de la pantalla
  const scale = (window.innerWidth < 768)
    ? Math.min(canvas.width, canvas.height) / 36   // móvil
    : Math.min(canvas.width, canvas.height) / 30;  // desktop

  // lo centramos y lo bajamos un poquito para convivir con el título
  const centerX = canvas.width / 2;
  const centerY = canvas.height * 0.60;

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

// ---------- Estrellitas de fondo ----------
const stars = [];
const STAR_COUNT = 120;
for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    alpha: 0.3 + Math.random() * 0.7,
    twinkle: Math.random() * 0.05,
    dir: Math.random() > 0.5 ? 1 : -1
  });
}

// ---------- Textos que caen ----------
const fallingTexts = [];

function createFallingText() {
  const text = messages[Math.floor(Math.random() * messages.length)];

  // tamaño de fuente adaptativo
  const base   = (window.innerWidth < 768) ? 22 : 28;
  const spread = (window.innerWidth < 768) ? 10 : 15;
  const fontSize = base + Math.random() * spread;

  // carril central para que se lean
  const centerX = canvas.width / 2;
  const lane    = canvas.width * (window.innerWidth < 768 ? 0.55 : 0.40);
  const x = centerX - lane / 2 + Math.random() * lane;

  fallingTexts.push({ text, x, y: -20, alpha: 1, speed: 1 + Math.random() * 1.5, fontSize });
}

// ---------- Dibujo principal ----------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // estrellas
  for (let s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    const sparkColors = [
      `rgba(255, 255, 255, ${s.alpha})`,
      `rgba(255, 200, 255, ${s.alpha})`,
      `rgba(221, 160, 221, ${s.alpha})`
    ];
    ctx.fillStyle = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    ctx.fill();
    s.alpha += s.twinkle * s.dir;
    if (s.alpha <= 0.2 || s.alpha >= 1) s.dir *= -1;
  }

  // corazón (con glow)
  particles.forEach(p => {
    ctx.beginPath();
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(255, 180, 255, 1)";
    const colors = [
      `rgba(255, 105, 255, ${p.alpha})`,
      `rgba(0, 255, 255, ${p.alpha})`,
      `rgba(255, 255, 0, ${p.alpha})`
    ];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // textos que caen (glow + contorno)
  for (let i = 0; i < fallingTexts.length; i++) {
    const t = fallingTexts[i];
    ctx.font = `bold ${t.fontSize}px 'Oswald'`;
    ctx.fillStyle = `rgba(255, 105, 255, ${t.alpha})`;

    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(255, 105, 255, 1)";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.strokeText(t.text, t.x, t.y);
    ctx.fillText(t.text, t.x, t.y);

    t.y += t.speed;
    t.alpha -= 0.003;
  }

  // limpiar textos invisibles
  for (let i = fallingTexts.length - 1; i >= 0; i--) {
    if (fallingTexts[i].alpha <= 0) fallingTexts.splice(i, 1);
  }

  requestAnimationFrame(draw);
}

// ---------- Inicio ----------
createHeart();
setInterval(createFallingText, 2000);
draw();

// redimensiona (mantiene todo proporcionado)
window.addEventListener('resize', () => {
  fitCanvasToScreen();
  createHeart();
});
