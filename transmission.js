/**
 * THE UNLOCK GATEWAY // TRANSMISSION.JS
 * Dedicated Video Transmission Stage
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. WEB AUDIO API (COMPLETION CHIME)
  // ==========================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playChime(freq = 440, duration = 0.25) {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + duration);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  // ==========================================
  // 2. COSMIC CANVAS (STARS & DUST PARTICLES)
  // ==========================================
  const canvas = document.getElementById('cosmic-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.min(90, Math.floor((width * height) / 14000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() * 0.15 + 0.05) * -1,
        vx: (Math.random() - 0.5) * 0.12
      });
    }
  }

  function drawCosmicSky() {
    ctx.clearRect(0, 0, width, height);

    const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.8);
    grad.addColorStop(0, '#0c1024');
    grad.addColorStop(1, '#030509');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    for (let p of particles) {
      p.alpha += p.twinkleSpeed;
      if (p.alpha > 0.95 || p.alpha < 0.15) {
        p.twinkleSpeed = -p.twinkleSpeed;
      }
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha})`;
      ctx.shadowBlur = p.radius * 4;
      ctx.shadowColor = '#f59e0b';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(drawCosmicSky);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawCosmicSky();

  // ==========================================
  // 3. VIDEO TRANSMISSION LOGIC
  // ==========================================
  const introVideo = document.getElementById('intro-video');
  const videoFallback = document.getElementById('video-fallback');
  const videoNextWrapper = document.getElementById('video-next-wrapper');
  const btnSimulateVideo = document.getElementById('btn-simulate-video');

  function revealMoveForward() {
    if (videoNextWrapper) {
      videoNextWrapper.classList.remove('hidden');
      videoNextWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    playChime(587.33, 0.4);
  }

  if (introVideo) {
    introVideo.addEventListener('loadeddata', () => {
      if (videoFallback) videoFallback.classList.add('hidden');
    });

    introVideo.addEventListener('error', () => {
      if (videoFallback) videoFallback.classList.remove('hidden');
    });

    introVideo.addEventListener('ended', () => {
      revealMoveForward();
    });

    introVideo.addEventListener('click', () => {
      initAudio();
      if (introVideo.paused) {
        introVideo.play().catch(() => {});
      } else {
        introVideo.pause();
      }
    });

    // Attempt video playback immediately with unmuted sound
    introVideo.muted = false;
    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If unmuted autoplay blocked by browser, fallback to muted autoplay
        introVideo.muted = true;
        introVideo.play().catch(() => {});
      });
    }

    // Unmute on first user interaction anywhere on the screen
    const unlockAudio = () => {
      if (introVideo && introVideo.muted) {
        introVideo.muted = false;
      }
    };
    ['click', 'pointerdown', 'touchstart', 'keydown'].forEach(evt => {
      document.addEventListener(evt, unlockAudio, { passive: true });
    });
  }

  if (btnSimulateVideo) {
    btnSimulateVideo.addEventListener('click', () => {
      btnSimulateVideo.disabled = true;
      btnSimulateVideo.textContent = 'Simulating Stream...';
      setTimeout(() => {
        btnSimulateVideo.textContent = 'Stream Completed';
        revealMoveForward();
      }, 1200);
    });
  }

});