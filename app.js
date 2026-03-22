// ── Trigger animations on load ────────────────────────────
window.addEventListener('load', () => {
  document.body.classList.remove('loading');
});

// ── Scroll reveal ─────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    // Stagger poem lines
    const lines = entry.target.querySelectorAll('.poem-lines li');
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('visible'), i * 300);
    });

    // Stagger letter paragraphs
    if (entry.target.id === 'letter') {
      const ps = entry.target.querySelectorAll('.letter p');
      ps.forEach((p, i) => {
        setTimeout(() => p.classList.add('visible'), i * 600);
      });
      const sig = entry.target.querySelector('.letter__sig');
      if (sig) {
        setTimeout(() => sig.classList.add('visible'), ps.length * 600 + 400);
      }
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section').forEach(s => observer.observe(s));

// ── Heart click ───────────────────────────────────────────
const heartBtn = document.getElementById('heartBtn');
const heartCounter = document.getElementById('heartCounter');
let count = 0;

heartBtn.addEventListener('click', (e) => {
  count++;
  heartCounter.classList.add('show');
  heartCounter.textContent = count === 1
    ? '1 prayer sent'
    : count + ' prayers sent';

  // Floating heart
  const rect = heartBtn.getBoundingClientRect();
  const h = document.createElement('span');
  h.textContent = '\u2764';
  h.style.cssText =
    'position:fixed;z-index:999;pointer-events:none;font-size:1rem;color:#c06070;' +
    'left:' + (rect.left + rect.width / 2) + 'px;' +
    'top:' + rect.top + 'px;' +
    'transition:all 2s ease-out;opacity:0.7;';
  document.body.appendChild(h);
  requestAnimationFrame(() => {
    h.style.top = (rect.top - 60) + 'px';
    h.style.opacity = '0';
  });
  setTimeout(() => h.remove(), 2200);
});
