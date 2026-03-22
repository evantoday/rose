// ============================================================
// ROSE — Quiet, Supportive Website
// ============================================================

(function () {
  'use strict';

  // ── Canvas: Soft Floating Particles ───────────────────────
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
      this.size = Math.random() * 1.5 + 0.3;
      this.speedY = -(Math.random() * 0.15 + 0.05);
      this.speedX = (Math.random() - 0.5) * 0.1;
      this.opacity = Math.random() * 0.2 + 0.05;
      this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += 0.008;
      if (this.y < -10) {
        this.y = particlesCanvas.height + 10;
        this.x = Math.random() * particlesCanvas.width;
      }
    }

    draw() {
      const glow = Math.sin(this.pulse) * 0.1 + 0.9;
      pCtx.beginPath();
      pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(180, 100, 110, ${this.opacity * glow})`;
      pCtx.fill();
    }
  }

  function initParticles() {
    resizeCanvas(particlesCanvas);
    particles = [];
    const count = Math.min(40, Math.floor((window.innerWidth * window.innerHeight) / 25000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }

  // ── Canvas: Slow Falling Petals ───────────────────────────
  const petalsCanvas = document.getElementById('petals-canvas');
  const petalCtx = petalsCanvas.getContext('2d');
  let petals = [];

  class Petal {
    constructor() {
      this.x = Math.random() * petalsCanvas.width;
      this.y = -15;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = Math.random() * 0.4 + 0.2;
      this.size = Math.random() * 5 + 3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.008;
      this.wobble = Math.random() * Math.PI * 2;
      this.opacity = Math.random() * 0.3 + 0.15;
      const hue = Math.random() * 20 + 345;
      const light = Math.random() * 15 + 25;
      this.color = `hsla(${hue}, 40%, ${light}%, ${this.opacity})`;
    }

    update() {
      this.wobble += 0.008;
      this.x += this.speedX + Math.sin(this.wobble) * 0.2;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
    }

    draw() {
      petalCtx.save();
      petalCtx.translate(this.x, this.y);
      petalCtx.rotate(this.rotation);
      petalCtx.beginPath();
      petalCtx.ellipse(0, 0, this.size * 0.4, this.size * 0.7, 0, 0, Math.PI * 2);
      petalCtx.fillStyle = this.color;
      petalCtx.fill();
      petalCtx.restore();
    }

    isDead() {
      return this.y > petalsCanvas.height + 20;
    }
  }

  let petalTimer = 0;

  function animatePetals() {
    petalCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);

    petalTimer++;
    if (petalTimer % 120 === 0 && petals.length < 15) {
      petals.push(new Petal());
    }

    petals = petals.filter(p => !p.isDead());
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animatePetals);
  }

  // ── Rose Drawing on Canvas ────────────────────────────────
  const roseCanvas = document.getElementById('rose-draw-canvas');
  const rCtx = roseCanvas.getContext('2d');
  let roseProgress = 0;
  let roseDrawn = false;
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
    rCtx.globalAlpha = 0.8 * p;
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
      rCtx.quadraticCurveTo(cx - 3, cy + 60, cx + 2, cy + 20 + 80 * stemP);
      rCtx.strokeStyle = '#2d5a1e';
      rCtx.lineWidth = 2.5;
      rCtx.lineCap = 'round';
      rCtx.stroke();

      if (stemP > 0.5) {
        const lp = (stemP - 0.5) * 2;
        rCtx.globalAlpha = lp * 0.7;
        rCtx.beginPath();
        rCtx.moveTo(cx - 1, cy + 60);
        rCtx.quadraticCurveTo(cx - 25, cy + 45, cx - 30, cy + 55);
        rCtx.quadraticCurveTo(cx - 20, cy + 52, cx - 1, cy + 60);
        rCtx.fillStyle = '#3a7a2a';
        rCtx.fill();
        rCtx.beginPath();
        rCtx.moveTo(cx + 1, cy + 45);
        rCtx.quadraticCurveTo(cx + 25, cy + 30, cx + 28, cy + 40);
        rCtx.quadraticCurveTo(cx + 20, cy + 38, cx + 1, cy + 45);
        rCtx.fillStyle = '#3a7a2a';
        rCtx.fill();
      }
      rCtx.restore();
    }

    const bloomScale = roseBloomed ? 1.1 : 1;
    const bloomSpread = roseBloomed ? 6 : 0;

    // Outer petals
    const outerP = Math.max(0, (progress - 0.15) / 0.25);
    const outerColors = ['#7a1525', '#8b1a2b', '#7a1525', '#8b1a2b', '#7a1525'];
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 / 5) * i - Math.PI / 2 + (roseBloomed ? i * 0.06 : 0);
      drawRosePetal(cx, cy, a, (40 + bloomSpread) * bloomScale, 20 * bloomScale, outerColors[i], outerP - i * 0.1);
    }

    // Mid petals
    const midP = Math.max(0, (progress - 0.4) / 0.25);
    const midColors = ['#b22840', '#c03050', '#a82238', '#b22840', '#c03050'];
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 / 5) * i - Math.PI / 2 + 0.3 + (roseBloomed ? i * -0.04 : 0);
      drawRosePetal(cx, cy, a, (30 + bloomSpread * 0.5) * bloomScale, 14 * bloomScale, midColors[i], midP - i * 0.1);
    }

    // Inner petals
    const innerP = Math.max(0, (progress - 0.65) / 0.2);
    const innerColors = ['#d44060', '#e05575', '#d44060', '#e05575'];
    for (let i = 0; i < 4; i++) {
      const a = (Math.PI * 2 / 4) * i - Math.PI / 2 + 0.5;
      drawRosePetal(cx, cy, a, (20 + bloomSpread * 0.3) * bloomScale, 9 * bloomScale, innerColors[i], innerP - i * 0.1);
    }

    // Center
    const centerP = Math.max(0, (progress - 0.85) / 0.15);
    if (centerP > 0) {
      rCtx.save();
      rCtx.globalAlpha = centerP * 0.85;
      rCtx.beginPath();
      rCtx.ellipse(cx, cy - 2, 7 * centerP, 5 * centerP, 0, 0, Math.PI * 2);
      rCtx.fillStyle = '#e86080';
      rCtx.fill();
      rCtx.beginPath();
      rCtx.ellipse(cx, cy - 2, 3.5 * centerP, 2.5 * centerP, 0, 0, Math.PI * 2);
      rCtx.fillStyle = '#f0809a';
      rCtx.fill();
      rCtx.restore();
    }
  }

  function animateRoseDrawing() {
    if (roseProgress < 1) {
      roseProgress += 0.005; // slower drawing
      if (roseProgress >= 1) {
        roseProgress = 1;
        roseDrawn = true;
      }
    }
    drawFullRose(roseProgress);
    requestAnimationFrame(animateRoseDrawing);
  }

  roseCanvas.addEventListener('click', () => {
    if (!roseDrawn) return;
    roseBloomed = !roseBloomed;
  });

  // ── Heart Click ───────────────────────────────────────────
  const heartSvg = document.querySelector('.heart-svg');
  const loveCounter = document.querySelector('.love-counter');
  let loveCount = 0;

  heartSvg.addEventListener('click', (e) => {
    loveCount++;
    loveCounter.classList.add('show');
    loveCounter.textContent = loveCount === 1
      ? '1 prayer sent'
      : `${loveCount} prayers sent`;

    // Gentle floating heart
    const floater = document.createElement('div');
    floater.textContent = '\u2764';
    floater.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      font-size: 1.2rem;
      pointer-events: none;
      z-index: 9999;
      color: #c06070;
      transition: all 2s ease-out;
      opacity: 0.7;
    `;
    document.body.appendChild(floater);
    requestAnimationFrame(() => {
      floater.style.top = (e.clientY - 80) + 'px';
      floater.style.opacity = '0';
    });
    setTimeout(() => floater.remove(), 2200);
  });

  // ── Letter Typewriter ─────────────────────────────────────
  let letterTyped = false;

  function typewriterLetter() {
    if (letterTyped) return;
    letterTyped = true;
    const letterPs = document.querySelectorAll('.letter p');
    let totalDelay = 0;
    letterPs.forEach(p => {
      const text = p.textContent;
      p.textContent = '';
      const chars = text.split('');
      chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char;
        p.appendChild(span);
        setTimeout(() => span.classList.add('typed'), totalDelay + i * 30);
      });
      totalDelay += chars.length * 30 + 200;
    });
  }

  // ── Scroll Reveal ─────────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        const lines = entry.target.querySelectorAll('.poem-lines li');
        lines.forEach((line, i) => {
          setTimeout(() => line.classList.add('visible'), i * 300);
        });

        if (entry.target.id === 'letter') {
          setTimeout(typewriterLetter, 600);
        }
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section').forEach(s => observer.observe(s));

  // ── Ambient Music (Web Audio) ─────────────────────────────
  const musicBtn = document.querySelector('.music-toggle');
  let audioCtx = null;
  let isPlaying = false;
  let gainNode = null;

  function createAmbientMusic() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(audioCtx.destination);

    const freqs = [220, 261.63, 329.63];
    freqs.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      oscGain.gain.value = 0.025;
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
    });

    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.008;
    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);
    lfo.start();
  }

  musicBtn.addEventListener('click', () => {
    if (!audioCtx) createAmbientMusic();

    if (isPlaying) {
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
      isPlaying = false;
      musicBtn.classList.remove('playing');
    } else {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 1.5);
      isPlaying = true;
      musicBtn.classList.add('playing');
    }
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

    // Seed a few petals
    for (let i = 0; i < 4; i++) {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
