// ============================================================
// ROSE — Interactive Romantic Website
// ============================================================

(function () {
  'use strict';

  // ── Canvas: Floating Particles Background ──────────────────
  const particlesCanvas = document.getElementById('particles-canvas');
  const pCtx = particlesCanvas.getContext('2d');
  let particles = [];

  function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * particlesCanvas.width;
      this.y = Math.random() * particlesCanvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.3 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += this.pulseSpeed;

      if (this.x < 0 || this.x > particlesCanvas.width ||
          this.y < 0 || this.y > particlesCanvas.height) {
        this.reset();
      }
    }

    draw() {
      const glow = Math.sin(this.pulse) * 0.15 + 0.85;
      pCtx.beginPath();
      pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(200, 80, 100, ${this.opacity * glow})`;
      pCtx.fill();
    }
  }

  function initParticles() {
    resizeCanvas(particlesCanvas);
    particles = [];
    const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawParticleConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          pCtx.beginPath();
          pCtx.moveTo(particles[i].x, particles[i].y);
          pCtx.lineTo(particles[j].x, particles[j].y);
          pCtx.strokeStyle = `rgba(150, 40, 60, ${0.08 * (1 - dist / 120)})`;
          pCtx.lineWidth = 0.5;
          pCtx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawParticleConnections();
    requestAnimationFrame(animateParticles);
  }

  // ── Canvas: Falling Petals ────────────────────────────────
  const petalsCanvas = document.getElementById('petals-canvas');
  const petalCtx = petalsCanvas.getContext('2d');
  let petals = [];

  class Petal {
    constructor(burst) {
      if (burst) {
        this.x = burst.x;
        this.y = burst.y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed - 2;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.gravity = 0.08;
      } else {
        this.x = Math.random() * petalsCanvas.width;
        this.y = -20;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.life = 1;
        this.decay = 0;
        this.gravity = 0;
      }
      this.size = Math.random() * 8 + 4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.04;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.03 + 0.01;
      const hue = Math.random() * 30 + 340;
      const light = Math.random() * 20 + 30;
      this.color = `hsl(${hue}, 60%, ${light}%)`;
      this.isBurst = !!burst;
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.5;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.isBurst) {
        this.speedY += this.gravity;
        this.life -= this.decay;
      } else {
        if (this.y > petalsCanvas.height + 20) this.life = 0;
      }
    }

    draw() {
      petalCtx.save();
      petalCtx.translate(this.x, this.y);
      petalCtx.rotate(this.rotation);
      petalCtx.globalAlpha = Math.max(0, this.isBurst ? this.life : 0.6);
      petalCtx.beginPath();
      petalCtx.ellipse(0, 0, this.size * 0.5, this.size * 0.8, 0, 0, Math.PI * 2);
      petalCtx.fillStyle = this.color;
      petalCtx.fill();
      petalCtx.restore();
    }

    isDead() {
      return this.life <= 0;
    }
  }

  let petalTimer = 0;

  function animatePetals() {
    petalCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);

    petalTimer++;
    if (petalTimer % 40 === 0 && petals.length < 50) {
      petals.push(new Petal());
    }

    petals = petals.filter(p => !p.isDead());
    petals.forEach(p => { p.update(); p.draw(); });

    requestAnimationFrame(animatePetals);
  }

  function burstPetals(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
      petals.push(new Petal({ x, y }));
    }
  }

  // ── Rose Drawing on Canvas ────────────────────────────────
  const roseCanvas = document.getElementById('rose-draw-canvas');
  const rCtx = roseCanvas.getContext('2d');
  let roseDrawn = false;
  let roseProgress = 0;
  let roseAnimating = true;
  let roseBloomed = false;

  function drawRosePetal(cx, cy, angle, radius, spread, color, progress) {
    if (progress <= 0) return;
    const p = Math.min(progress, 1);
    rCtx.save();
    rCtx.translate(cx, cy);
    rCtx.rotate(angle);
    rCtx.scale(p, p);
    rCtx.beginPath();
    rCtx.moveTo(0, 0);
    rCtx.bezierCurveTo(-spread, -radius * 0.6, -spread * 0.5, -radius, 0, -radius);
    rCtx.bezierCurveTo(spread * 0.5, -radius, spread, -radius * 0.6, 0, 0);
    rCtx.fillStyle = color;
    rCtx.globalAlpha = 0.85 * p;
    rCtx.fill();
    rCtx.restore();
  }

  function drawFullRose(progress) {
    const cx = roseCanvas.width / 2;
    const cy = roseCanvas.height * 0.45;
    rCtx.clearRect(0, 0, roseCanvas.width, roseCanvas.height);

    // Stem
    const stemP = Math.min(progress / 0.15, 1);
    if (stemP > 0) {
      rCtx.save();
      rCtx.globalAlpha = stemP;
      rCtx.beginPath();
      rCtx.moveTo(cx, cy + 20);
      const stemEnd = cy + 20 + 80 * stemP;
      rCtx.quadraticCurveTo(cx - 3, cy + 60, cx + 2, stemEnd);
      rCtx.strokeStyle = '#2d5a1e';
      rCtx.lineWidth = 3;
      rCtx.lineCap = 'round';
      rCtx.stroke();

      // Leaves
      if (stemP > 0.5) {
        const lp = (stemP - 0.5) * 2;
        rCtx.save();
        rCtx.globalAlpha = lp * 0.8;
        // Left leaf
        rCtx.beginPath();
        rCtx.moveTo(cx - 1, cy + 60);
        rCtx.quadraticCurveTo(cx - 25, cy + 45, cx - 30, cy + 55);
        rCtx.quadraticCurveTo(cx - 20, cy + 52, cx - 1, cy + 60);
        rCtx.fillStyle = '#3a7a2a';
        rCtx.fill();
        // Right leaf
        rCtx.beginPath();
        rCtx.moveTo(cx + 1, cy + 45);
        rCtx.quadraticCurveTo(cx + 25, cy + 30, cx + 28, cy + 40);
        rCtx.quadraticCurveTo(cx + 20, cy + 38, cx + 1, cy + 45);
        rCtx.fillStyle = '#3a7a2a';
        rCtx.fill();
        rCtx.restore();
      }
      rCtx.restore();
    }

    // Outer petals (progress 0.15 - 0.4)
    const outerP = Math.max(0, (progress - 0.15) / 0.25);
    const bloomScale = roseBloomed ? 1.12 : 1;
    const bloomSpread = roseBloomed ? 8 : 0;
    const outerColors = ['#7a1525', '#8b1a2b', '#7a1525', '#8b1a2b', '#7a1525'];
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 / 5) * i - Math.PI / 2 + (roseBloomed ? i * 0.08 : 0);
      drawRosePetal(cx, cy, a, (42 + bloomSpread) * bloomScale, 22 * bloomScale, outerColors[i], outerP - i * 0.1);
    }

    // Mid petals (progress 0.4 - 0.65)
    const midP = Math.max(0, (progress - 0.4) / 0.25);
    const midColors = ['#b22840', '#c03050', '#a82238', '#b22840', '#c03050'];
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 / 5) * i - Math.PI / 2 + 0.3 + (roseBloomed ? i * -0.06 : 0);
      drawRosePetal(cx, cy, a, (32 + bloomSpread * 0.6) * bloomScale, 16 * bloomScale, midColors[i], midP - i * 0.1);
    }

    // Inner petals (progress 0.65 - 0.85)
    const innerP = Math.max(0, (progress - 0.65) / 0.2);
    const innerColors = ['#d44060', '#e05575', '#d44060', '#e05575'];
    for (let i = 0; i < 4; i++) {
      const a = (Math.PI * 2 / 4) * i - Math.PI / 2 + 0.5 + (roseBloomed ? i * 0.05 : 0);
      drawRosePetal(cx, cy, a, (22 + bloomSpread * 0.3) * bloomScale, 10 * bloomScale, innerColors[i], innerP - i * 0.1);
    }

    // Center (progress 0.85 - 1.0)
    const centerP = Math.max(0, (progress - 0.85) / 0.15);
    if (centerP > 0) {
      rCtx.save();
      rCtx.globalAlpha = centerP * 0.9;
      rCtx.beginPath();
      rCtx.ellipse(cx, cy - 2, 8 * centerP, 6 * centerP, 0, 0, Math.PI * 2);
      rCtx.fillStyle = '#e86080';
      rCtx.fill();
      rCtx.beginPath();
      rCtx.ellipse(cx, cy - 2, 4 * centerP, 3 * centerP, 0, 0, Math.PI * 2);
      rCtx.fillStyle = '#f0809a';
      rCtx.fill();
      rCtx.restore();
    }
  }

  function animateRoseDrawing() {
    if (roseAnimating && roseProgress < 1) {
      roseProgress += 0.008;
      if (roseProgress >= 1) {
        roseProgress = 1;
        roseDrawn = true;
        roseAnimating = false;
      }
    }
    drawFullRose(roseProgress);
    requestAnimationFrame(animateRoseDrawing);
  }

  // Click rose to bloom/unboom
  roseCanvas.addEventListener('click', () => {
    if (!roseDrawn) return;
    roseBloomed = !roseBloomed;
    const rect = roseCanvas.getBoundingClientRect();
    burstPetals(rect.left + rect.width / 2, rect.top + rect.height * 0.4, 20);
  });

  // ── Ambient Glow follows mouse ───────────────────────────
  const ambientGlow = document.querySelector('.ambient-glow');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    ambientGlow.style.top = e.clientY + 'px';
    ambientGlow.style.left = e.clientX + 'px';
  });

  // ── Cursor Trail ──────────────────────────────────────────
  let lastTrail = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrail < 40) return;
    lastTrail = now;
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = (e.clientX - 3) + 'px';
    trail.style.top = (e.clientY - 3) + 'px';
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 1000);
  });

  // ── Click Sparkles ────────────────────────────────────────
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 10; i++) {
      const spark = document.createElement('div');
      spark.className = 'sparkle';
      const angle = (Math.PI * 2 / 10) * i + Math.random() * 0.5;
      const dist = Math.random() * 60 + 25;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const hue = 345 + Math.random() * 30;
      spark.innerHTML = `<div class="sparkle-dot" style="--tx:${tx}px;--ty:${ty}px; background:hsl(${hue},70%,70%);"></div>`;
      spark.style.left = e.clientX + 'px';
      spark.style.top = e.clientY + 'px';
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 1000);
    }
  });

  // ── Heart Click Counter ───────────────────────────────────
  const heartSvg = document.querySelector('.heart-svg');
  const loveCounter = document.querySelector('.love-counter');
  let loveCount = 0;

  heartSvg.addEventListener('click', (e) => {
    loveCount++;
    loveCounter.classList.add('show');
    loveCounter.textContent = loveCount === 1
      ? '1 kiss sent'
      : `${loveCount} kisses sent`;

    // Big burst
    burstPetals(e.clientX, e.clientY, 25);

    // Floating heart
    const floater = document.createElement('div');
    floater.textContent = '\u2764';
    floater.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      font-size: 1.5rem;
      pointer-events: none;
      z-index: 9999;
      color: #e04060;
      transition: all 1.5s ease-out;
      opacity: 1;
    `;
    document.body.appendChild(floater);
    requestAnimationFrame(() => {
      floater.style.top = (e.clientY - 100) + 'px';
      floater.style.opacity = '0';
      floater.style.transform = `scale(2) rotate(${(Math.random() - 0.5) * 30}deg)`;
    });
    setTimeout(() => floater.remove(), 1600);
  });

  // ── Letter Typewriter Effect ──────────────────────────────
  let letterTyped = false;

  function typewriterLetter() {
    if (letterTyped) return;
    letterTyped = true;
    const letterPs = document.querySelectorAll('.letter p');
    letterPs.forEach(p => {
      const text = p.textContent;
      p.textContent = '';
      const chars = text.split('');
      chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char;
        p.appendChild(span);
        setTimeout(() => span.classList.add('typed'), i * 25);
      });
    });
  }

  // ── Scroll Reveal (IntersectionObserver) ──────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Stagger poem lines
        const lines = entry.target.querySelectorAll('.poem-lines li');
        lines.forEach((line, i) => {
          setTimeout(() => line.classList.add('visible'), i * 200);
        });

        // Trigger letter typewriter
        if (entry.target.id === 'letter') {
          setTimeout(typewriterLetter, 400);
        }
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section').forEach(s => observer.observe(s));

  // ── Parallax on scroll ────────────────────────────────────
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // ── Music Toggle (ambient tone via Web Audio API) ─────────
  const musicBtn = document.querySelector('.music-toggle');
  let audioCtx = null;
  let isPlaying = false;
  let gainNode = null;
  let oscillators = [];

  function createAmbientMusic() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(audioCtx.destination);

    // Soft ambient chord: A minor
    const freqs = [220, 261.63, 329.63, 440];
    freqs.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      oscGain.gain.value = 0.04;
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      oscillators.push({ osc, gain: oscGain });
    });

    // Slow LFO modulation
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 0.01;
    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);
    lfo.start();
  }

  musicBtn.addEventListener('click', () => {
    if (!audioCtx) createAmbientMusic();

    if (isPlaying) {
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
      isPlaying = false;
      musicBtn.classList.remove('playing');
    } else {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 1);
      isPlaying = true;
      musicBtn.classList.add('playing');
    }
  });

  // ── Garden rose click burst ───────────────────────────────
  document.querySelectorAll('.garden-rose').forEach(rose => {
    rose.addEventListener('click', (e) => {
      const rect = rose.getBoundingClientRect();
      burstPetals(rect.left + rect.width / 2, rect.top + rect.height * 0.3, 10);
    });
  });

  // ── Init ──────────────────────────────────────────────────
  function init() {
    resizeCanvas(particlesCanvas);
    resizeCanvas(petalsCanvas);
    roseCanvas.width = 240;
    roseCanvas.height = 220;
    initParticles();
    animateParticles();
    animatePetals();
    animateRoseDrawing();

    // Seed initial petals
    for (let i = 0; i < 8; i++) {
      const p = new Petal();
      p.y = Math.random() * petalsCanvas.height;
      petals.push(p);
    }
  }

  window.addEventListener('resize', () => {
    resizeCanvas(particlesCanvas);
    resizeCanvas(petalsCanvas);
    initParticles();
  });

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
