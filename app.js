// ── Cursor glow follows mouse ────────────────────────────
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

// ── Progress bar ─────────────────────────────────────────
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}, { passive: true });

// ── Floating petals ──────────────────────────────────────
const petalsContainer = document.getElementById('petals');

function createPetal(x) {
  const petal = document.createElement('div');
  petal.classList.add('petal');
  petal.style.left = (x !== undefined ? x + 'px' : Math.random() * 100 + '%');
  petal.style.animationDuration = (6 + Math.random() * 6) + 's';
  const size = 8 + Math.random() * 8;
  petal.style.width = size + 'px';
  petal.style.height = size + 'px';
  const hue = 340 + Math.random() * 30;
  petal.style.background = `hsl(${hue}, 70%, ${80 + Math.random() * 15}%)`;
  petalsContainer.appendChild(petal);
  petal.addEventListener('animationend', () => petal.remove());
}

setTimeout(() => {
  for (let i = 0; i < 5; i++) setTimeout(createPetal, i * 600);
  setInterval(createPetal, 2000);
}, 3000);

// ── Click to spawn petals + spark ────────────────────────
document.addEventListener('click', (e) => {
  // Spawn petals at click location
  for (let i = 0; i < 3; i++) {
    setTimeout(() => createPetal(e.clientX + (Math.random() - 0.5) * 40), i * 80);
  }

  // Spark burst
  const spark = document.createElement('div');
  spark.classList.add('click-spark');
  spark.style.left = e.clientX + 'px';
  spark.style.top = e.clientY + 'px';

  for (let i = 0; i < 8; i++) {
    const dot = document.createElement('div');
    dot.classList.add('spark-dot');
    const angle = (i / 8) * Math.PI * 2;
    const dist = 15 + Math.random() * 10;
    dot.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    dot.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    const hue = 340 + Math.random() * 30;
    dot.style.background = `hsl(${hue}, 70%, ${70 + Math.random() * 20}%)`;
    spark.appendChild(dot);
  }

  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 700);
});

// ── Hero particles ───────────────────────────────────────
const heroParticles = document.getElementById('heroParticles');
function createHeroParticle() {
  const p = document.createElement('div');
  p.classList.add('hero-particle');
  p.style.left = Math.random() * 100 + '%';
  p.style.bottom = Math.random() * 30 + '%';
  p.style.animationDuration = (3 + Math.random() * 4) + 's';
  p.style.animationDelay = Math.random() * 2 + 's';
  const size = 3 + Math.random() * 4;
  p.style.width = size + 'px';
  p.style.height = size + 'px';
  heroParticles.appendChild(p);
  p.addEventListener('animationend', () => {
    p.remove();
    createHeroParticle();
  });
}
for (let i = 0; i < 15; i++) createHeroParticle();

// ── Rose hover interaction ───────────────────────────────
const heroRose = document.getElementById('heroRose');
heroRose.addEventListener('click', () => {
  const rect = heroRose.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  for (let i = 0; i < 8; i++) {
    setTimeout(() => createPetal(cx + (Math.random() - 0.5) * 60), i * 100);
  }
});

// ── Parallax on scroll ───────────────────────────────────
const heroContent = document.querySelector('.hero__content');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroContent.style.transform = `translateY(${y * 0.3}px)`;
    heroContent.style.opacity = 1 - (y / window.innerHeight) * 1.2;
  }
}, { passive: true });

// ── Scroll reveal ────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    const lines = entry.target.querySelectorAll('.poem__line');
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('visible'), i * 250);
    });

    const cards = entry.target.querySelectorAll('.card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 120);
    });

    const heartBtn = entry.target.querySelector('.heart-btn');
    if (heartBtn) setTimeout(() => heartBtn.classList.add('visible'), 200);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section').forEach(s => observer.observe(s));

// ── Card 3D tilt + glow tracking ─────────────────────────
document.querySelectorAll('.card[data-tilt]').forEach(card => {
  const glow = card.querySelector('.card__glow');

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

    if (glow) {
      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });

  // Tap to "keep" a card
  card.addEventListener('click', (e) => {
    e.stopPropagation();
    card.classList.toggle('card--kept');
  });
});

// ── Heart click with burst ───────────────────────────────
const heartBtn = document.getElementById('heartBtn');
const heartCounter = document.getElementById('heartCounter');
const heartRing = document.getElementById('heartRing');
let count = 0;

heartBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  count++;
  heartCounter.classList.add('show');
  heartCounter.textContent = count === 1 ? '1 prayer sent' : count + ' prayers sent';

  // Pulse ring
  heartRing.classList.remove('pulse');
  void heartRing.offsetWidth;
  heartRing.classList.add('pulse');

  // Button bounce
  heartBtn.style.transform = 'scale(0.85)';
  setTimeout(() => { heartBtn.style.transform = ''; }, 200);

  // Burst of floating hearts
  const rect = heartBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const emojis = ['\u2764\uFE0F', '\uD83E\uDE77', '\uD83D\uDC97', '\uD83D\uDC96', '\u2728'];

  for (let i = 0; i < 6; i++) {
    const h = document.createElement('span');
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.classList.add('float-heart');
    h.style.left = cx + 'px';
    h.style.top = cy + 'px';
    h.style.opacity = '0.9';
    h.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
    document.body.appendChild(h);

    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const dist = 60 + Math.random() * 50;

    requestAnimationFrame(() => {
      h.style.left = (cx + Math.cos(angle) * dist) + 'px';
      h.style.top = (cy + Math.sin(angle) * dist - 40) + 'px';
      h.style.opacity = '0';
    });

    setTimeout(() => h.remove(), 1600);
  }
});

// ── Envelope open ────────────────────────────────────────
const envelope = document.getElementById('envelope');
const letterContent = document.getElementById('letterContent');

envelope.addEventListener('click', (e) => {
  e.stopPropagation();
  envelope.classList.add('opened');

  setTimeout(() => {
    letterContent.classList.add('letter--open');

    // Stagger reveal letter paragraphs
    const ps = letterContent.querySelectorAll('p');
    ps.forEach((p, i) => {
      setTimeout(() => p.classList.add('visible'), 300 + i * 500);
    });

    const sig = letterContent.querySelector('.letter__sig');
    if (sig) {
      setTimeout(() => sig.classList.add('visible'), 300 + ps.length * 500 + 300);
    }
  }, 500);
});
