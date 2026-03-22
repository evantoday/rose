// ── Floating petals ──────────────────────────────────────
const petalsContainer = document.getElementById('petals');

function createPetal() {
  const petal = document.createElement('div');
  petal.classList.add('petal');
  petal.style.left = Math.random() * 100 + '%';
  petal.style.animationDuration = (6 + Math.random() * 6) + 's';
  petal.style.width = (8 + Math.random() * 8) + 'px';
  petal.style.height = petal.style.width;
  petal.style.opacity = 0.2 + Math.random() * 0.3;
  const hue = 340 + Math.random() * 30;
  petal.style.background = `hsl(${hue}, 70%, ${80 + Math.random() * 15}%)`;
  petalsContainer.appendChild(petal);
  petal.addEventListener('animationend', () => petal.remove());
}

// Start petals after a short delay
setTimeout(() => {
  for (let i = 0; i < 5; i++) setTimeout(createPetal, i * 600);
  setInterval(createPetal, 2000);
}, 3000);

// ── Scroll reveal ────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    // Stagger poem lines
    const lines = entry.target.querySelectorAll('.poem__line');
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('visible'), i * 250);
    });

    // Stagger cards
    const cards = entry.target.querySelectorAll('.card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 120);
    });

    // Heart button
    const heartBtn = entry.target.querySelector('.heart-btn');
    if (heartBtn) {
      setTimeout(() => heartBtn.classList.add('visible'), 200);
    }

    // Stagger letter paragraphs
    if (entry.target.id === 'letter') {
      const ps = entry.target.querySelectorAll('.letter p');
      ps.forEach((p, i) => {
        setTimeout(() => p.classList.add('visible'), i * 500);
      });
      const sig = entry.target.querySelector('.letter__sig');
      if (sig) {
        setTimeout(() => sig.classList.add('visible'), ps.length * 500 + 300);
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section').forEach(s => observer.observe(s));

// ── Heart click ──────────────────────────────────────────
const heartBtn = document.getElementById('heartBtn');
const heartCounter = document.getElementById('heartCounter');
let count = 0;

heartBtn.addEventListener('click', (e) => {
  count++;
  heartCounter.classList.add('show');
  heartCounter.textContent = count === 1
    ? '1 prayer sent'
    : count + ' prayers sent';

  // Pulse animation
  heartBtn.style.transform = 'scale(0.9)';
  setTimeout(() => { heartBtn.style.transform = ''; }, 150);

  // Floating heart
  const rect = heartBtn.getBoundingClientRect();
  const h = document.createElement('span');
  h.textContent = '\u2764\uFE0F';
  h.classList.add('float-heart');
  h.style.left = (rect.left + rect.width / 2 - 8) + 'px';
  h.style.top = rect.top + 'px';
  h.style.opacity = '0.8';
  document.body.appendChild(h);

  requestAnimationFrame(() => {
    h.style.top = (rect.top - 80 - Math.random() * 40) + 'px';
    h.style.left = (rect.left + rect.width / 2 - 8 + (Math.random() - 0.5) * 60) + 'px';
    h.style.opacity = '0';
  });

  setTimeout(() => h.remove(), 1600);
});
