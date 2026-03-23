// ── Detect touch device ──────────────────────────────────
const isTouch = 'ontouchstart' in window;

// ── Progress bar ─────────────────────────────────────────
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}, { passive: true });

// ── Create clouds ────────────────────────────────────────
const cloudsContainer = document.getElementById('clouds');

function createCloud(className, shapes) {
  const cloud = document.createElement('div');
  cloud.classList.add('cloud', className);
  shapes.forEach(s => {
    const shape = document.createElement('div');
    shape.classList.add('cloud__shape');
    shape.style.width = s.w + 'px';
    shape.style.height = s.h + 'px';
    shape.style.left = s.x + 'px';
    shape.style.top = s.y + 'px';
    cloud.appendChild(shape);
  });
  cloudsContainer.appendChild(cloud);
}

createCloud('cloud--1', [
  { w: 80, h: 40, x: 0, y: 20 },
  { w: 60, h: 50, x: 30, y: 5 },
  { w: 70, h: 35, x: 70, y: 18 },
  { w: 50, h: 30, x: 100, y: 25 },
]);

createCloud('cloud--2', [
  { w: 60, h: 30, x: 0, y: 15 },
  { w: 50, h: 40, x: 20, y: 0 },
  { w: 55, h: 28, x: 55, y: 12 },
]);

createCloud('cloud--3', [
  { w: 70, h: 35, x: 0, y: 15 },
  { w: 55, h: 45, x: 25, y: 0 },
  { w: 65, h: 30, x: 60, y: 15 },
  { w: 45, h: 25, x: 90, y: 22 },
]);

// ── Create garden flowers ────────────────────────────────
const garden = document.getElementById('garden');

const flowerTypes = [
  { petals: 5, petalColor: '#FFB6C1', center: '#FFD700', petalW: 12, petalH: 18, stemH: 60 },
  { petals: 6, petalColor: '#FF85A2', center: '#FFF176', petalW: 10, petalH: 16, stemH: 50 },
  { petals: 5, petalColor: '#C3B1E1', center: '#FFD54F', petalW: 11, petalH: 15, stemH: 55 },
  { petals: 8, petalColor: '#FFCBA4', center: '#FF8A65', petalW: 9, petalH: 14, stemH: 45 },
  { petals: 5, petalColor: '#81D4FA', center: '#FFF9C4', petalW: 10, petalH: 15, stemH: 48 },
  { petals: 6, petalColor: '#FF8B8B', center: '#FFEB3B', petalW: 11, petalH: 17, stemH: 58 },
];

const flowerPositions = [];
for (let i = 0; i < 18; i++) {
  flowerPositions.push(5 + (i / 18) * 90 + (Math.random() - 0.5) * 4);
}

flowerPositions.forEach((pos, i) => {
  const type = flowerTypes[i % flowerTypes.length];
  const scale = 0.6 + Math.random() * 0.6;
  const flower = document.createElement('div');
  flower.classList.add('garden-flower');
  flower.style.left = pos + '%';
  flower.style.setProperty('--sway-dur', (2.5 + Math.random() * 2) + 's');
  flower.style.setProperty('--sway-delay', (Math.random() * 2) + 's');
  flower.style.setProperty('--sway-from', (-2 - Math.random() * 3) + 'deg');
  flower.style.setProperty('--sway-to', (2 + Math.random() * 3) + 'deg');
  flower.style.transform = `scale(${scale})`;

  // Stem
  const stem = document.createElement('div');
  stem.classList.add('garden-flower__stem');
  stem.style.height = type.stemH + 'px';

  // Flower head
  const head = document.createElement('div');
  head.classList.add('garden-flower__head');

  // Petals
  for (let p = 0; p < type.petals; p++) {
    const petal = document.createElement('div');
    petal.classList.add('garden-flower__petal');
    petal.style.width = type.petalW + 'px';
    petal.style.height = type.petalH + 'px';
    petal.style.background = type.petalColor;
    const angle = (p / type.petals) * 360;
    petal.style.transform = `rotate(${angle}deg) translateY(-${type.petalH / 2 + 3}px)`;
    head.appendChild(petal);
  }

  // Center
  const center = document.createElement('div');
  center.classList.add('garden-flower__center');
  center.style.background = type.center;
  head.appendChild(center);

  flower.appendChild(head);
  flower.appendChild(stem);
  garden.appendChild(flower);
});

// ── Create butterflies ───────────────────────────────────
const butterfliesContainer = document.getElementById('butterflies');
const butterflyColors = ['#C3B1E1', '#FFB6C1', '#81D4FA', '#FFCBA4', '#FF85A2'];

for (let i = 0; i < 4; i++) {
  const bf = document.createElement('div');
  bf.classList.add('butterfly');
  bf.style.left = (15 + Math.random() * 70) + '%';
  bf.style.bottom = (120 + Math.random() * 200) + 'px';
  bf.style.setProperty('--fly-dur', (10 + Math.random() * 8) + 's');
  bf.style.setProperty('--fly-delay', (Math.random() * 5) + 's');
  bf.style.setProperty('--fly-scale', (0.6 + Math.random() * 0.5).toFixed(2));
  bf.style.zIndex = '6';

  const color = butterflyColors[i % butterflyColors.length];

  const body = document.createElement('div');
  body.classList.add('butterfly__body');

  const wingL = document.createElement('div');
  wingL.classList.add('butterfly__wing', 'butterfly__wing--left');
  wingL.style.background = color;

  const wingR = document.createElement('div');
  wingR.classList.add('butterfly__wing', 'butterfly__wing--right');
  wingR.style.background = color;

  body.appendChild(wingL);
  body.appendChild(wingR);
  bf.appendChild(body);
  butterfliesContainer.appendChild(bf);
}

// ── Floating petals ──────────────────────────────────────
const petalsContainer = document.getElementById('petals');

function createPetal(x) {
  const petal = document.createElement('div');
  petal.classList.add('petal');
  petal.style.left = (x !== undefined ? x + 'px' : Math.random() * 100 + '%');
  petal.style.animationDuration = (6 + Math.random() * 6) + 's';
  const size = 8 + Math.random() * 10;
  petal.style.width = size + 'px';
  petal.style.height = size + 'px';
  const colors = ['#FFB6C1', '#FF85A2', '#FFCBA4', '#C3B1E1', '#FFD1DC'];
  petal.style.background = colors[Math.floor(Math.random() * colors.length)];
  petalsContainer.appendChild(petal);
  petal.addEventListener('animationend', () => petal.remove());
}

setTimeout(() => {
  for (let i = 0; i < 5; i++) setTimeout(createPetal, i * 600);
  setInterval(createPetal, 2500);
}, 3000);

// ── Click to spawn petals + spark ────────────────────────
document.addEventListener('click', (e) => {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => createPetal(e.clientX + (Math.random() - 0.5) * 40), i * 80);
  }

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
    const colors = ['#FFB6C1', '#FF85A2', '#FFD700', '#C3B1E1', '#FF8B8B'];
    dot.style.background = colors[Math.floor(Math.random() * colors.length)];
    spark.appendChild(dot);
  }

  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 700);
});

// ── Cat interaction ──────────────────────────────────────
const cat = document.getElementById('cat');
let catClicks = 0;

cat.addEventListener('click', (e) => {
  e.stopPropagation();
  catClicks++;

  // Spawn petals around cat
  const rect = cat.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  for (let i = 0; i < 6; i++) {
    setTimeout(() => createPetal(cx + (Math.random() - 0.5) * 80), i * 100);
  }

  // Spawn floating hearts from cat
  const cy = rect.top + rect.height / 3;
  const emojis = ['❤️', '🐱', '💕', '🌸', '✨', '😻'];
  for (let i = 0; i < 4; i++) {
    const h = document.createElement('span');
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.classList.add('float-heart');
    h.style.left = cx + 'px';
    h.style.top = cy + 'px';
    h.style.opacity = '0.9';
    h.style.fontSize = (0.8 + Math.random() * 0.6) + 'rem';
    document.body.appendChild(h);

    const angle = (i / 4) * Math.PI - Math.PI / 2;
    const dist = 50 + Math.random() * 40;

    requestAnimationFrame(() => {
      h.style.left = (cx + Math.cos(angle) * dist) + 'px';
      h.style.top = (cy + Math.sin(angle) * dist - 50) + 'px';
      h.style.opacity = '0';
    });

    setTimeout(() => h.remove(), 1600);
  }

  // Bounce cat
  cat.style.transform = 'translateX(-50%) scale(1.15)';
  setTimeout(() => { cat.style.transform = ''; }, 300);
});

// ── Parallax on scroll ───────────────────────────────────
const heroContent = document.querySelector('.hero__content');
const heroSun = document.querySelector('.hero__sun');
const heroClouds = document.querySelectorAll('.cloud');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroContent.style.transform = `translateY(${y * 0.3}px)`;
    heroContent.style.opacity = 1 - (y / window.innerHeight) * 1.2;
    heroSun.style.transform = `translateY(${y * -0.15}px) scale(${1 + y * 0.0003})`;
    heroClouds.forEach((c, i) => {
      c.style.transform = `translateY(${y * (0.05 + i * 0.05)}px)`;
    });
  }
}, { passive: true });

// ── Scroll reveal ────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    // Typewriter for poem lines
    const lines = entry.target.querySelectorAll('.poem__line');
    lines.forEach((line, i) => {
      const fullText = line.textContent;
      if (line.dataset.typed) return;
      line.dataset.typed = 'true';

      if (fullText.trim() === '' || fullText === '\u00A0') {
        setTimeout(() => {
          line.style.opacity = '1';
          line.style.transform = 'none';
        }, i * 1200);
        return;
      }

      line.textContent = '';
      line.style.opacity = '1';
      line.style.transform = 'none';

      let charIndex = 0;
      const delay = i * 1200;

      setTimeout(() => {
        line.classList.add('poem__line--typing');
        const interval = setInterval(() => {
          line.textContent = fullText.slice(0, ++charIndex);
          if (charIndex >= fullText.length) {
            clearInterval(interval);
            line.classList.remove('poem__line--typing');
          }
        }, 30);
      }, delay);
    });

    // Cards stagger
    const cards = entry.target.querySelectorAll('.card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 120);
    });

    // Heart button
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

  heartRing.classList.remove('pulse');
  void heartRing.offsetWidth;
  heartRing.classList.add('pulse');

  heartBtn.style.transition = 'transform 0.15s ease';
  heartBtn.style.transform = 'scale(0.85)';
  setTimeout(() => {
    heartBtn.style.transition = '';
    heartBtn.style.transform = '';
  }, 200);

  const rect = heartBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const emojis = ['❤️', '🐱', '💗', '🌸', '✨', '💐'];

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

// ── Magnetic heart button ────────────────────────────────
if (!isTouch) {
  const heartSection = document.getElementById('heart');
  const magnetRange = 120;

  heartSection.addEventListener('mousemove', (e) => {
    const rect = heartBtn.getBoundingClientRect();
    const btnCx = rect.left + rect.width / 2;
    const btnCy = rect.top + rect.height / 2;
    const dx = e.clientX - btnCx;
    const dy = e.clientY - btnCy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < magnetRange) {
      const pull = 1 - dist / magnetRange;
      const moveX = dx * pull * 0.4;
      const moveY = dy * pull * 0.4;
      heartBtn.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + pull * 0.1})`;
    } else {
      heartBtn.style.transform = '';
    }
  });

  heartSection.addEventListener('mouseleave', () => {
    heartBtn.style.transform = '';
  });
}

// ── Envelope open ────────────────────────────────────────
const envelope = document.getElementById('envelope');
const letterContent = document.getElementById('letterContent');

envelope.addEventListener('click', (e) => {
  e.stopPropagation();
  envelope.classList.add('opened');

  setTimeout(() => {
    letterContent.classList.add('letter--open');

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
