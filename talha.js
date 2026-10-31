/**
 * THE UNLOCK GATEWAY // TALHA.JS
 * Dedicated TALHA Induction Stage, Cosmic Ambient Tune, and Dynamic Voice Narration
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. WEB AUDIO API SYNTHESIZER & COSMIC TUNE
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

  // Ambient Cosmic Tune Player Controller (Downloaded Cosmic Audio)
  class CosmicTunePlayer {
    constructor() {
      this.audio = document.getElementById('cosmic-tune-audio');
      if (!this.audio) {
        this.audio = new Audio('assets/cosmic-tune.mp3');
        this.audio.loop = true;
      }
      this.baseVolume = 0.28;
      this.audio.volume = this.baseVolume;
      this.isMuted = localStorage.getItem('cosmic_tune_muted') === 'true';
    }

    get isPlaying() {
      return this.audio && !this.audio.paused;
    }

    start() {
      if (this.isMuted || !this.audio) return;
      this.audio.volume = this.baseVolume;
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }

    stop() {
      if (this.audio) {
        this.audio.pause();
      }
    }

    duck() {
      // Settle background tune under voice narration
      if (!this.audio || this.isMuted) return;
      this.fadeTo(0.12, 800);
    }

    swell() {
      // Swell background tune during narration gaps
      if (!this.audio || this.isMuted) return;
      this.fadeTo(0.35, 1500);
    }

    fadeTo(targetVol, durationMs) {
      if (!this.audio) return;
      const startVol = this.audio.volume;
      const startTime = performance.now();
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        this.audio.volume = startVol + (targetVol - startVol) * progress;
        if (progress < 1 && !this.audio.paused) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }

    setMuted(muted) {
      this.isMuted = muted;
      localStorage.setItem('cosmic_tune_muted', muted ? 'true' : 'false');
      if (muted) {
        this.stop();
      } else {
        this.start();
      }
    }

    toggle() {
      this.setMuted(!this.isMuted);
      return this.isMuted;
    }
  }

  const cosmicTune = new CosmicTunePlayer();

  // ==========================================
  // 2. NARRATION AUDIO CONTROLLER (WITH DYNAMIC LOOP & GAP)
  // Plays custom audio file: assets/talha-narration.mp3
  // ==========================================
  const narrationAudio = document.getElementById('induction-voice-audio');
  let loopTimer = null;
  const LOOP_GAP_MS = 8000; // 8-second cinematic pause between narration loops

  function stopNarration() {
    clearTimeout(loopTimer);
    loopTimer = null;
    if (narrationAudio) {
      try {
        narrationAudio.pause();
        narrationAudio.currentTime = 0;
      } catch (e) {}
    }
  }

  function playNarration() {
    if (cosmicTune.isMuted || !narrationAudio) return;
    clearTimeout(loopTimer);
    loopTimer = null;

    // Settle background tune to accompaniment level under voice
    if (!cosmicTune.isPlaying) {
      cosmicTune.start();
    } else {
      cosmicTune.duck();
    }

    if (narrationAudio) {
      try { narrationAudio.currentTime = 0; } catch (e) {}
      narrationAudio.volume = 1.0;
      const playPromise = narrationAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }

  // ==========================================
  // 3. AUDIO TOGGLE BUTTON (MUTE/UNMUTE)
  // ==========================================
  const audioToggle = document.getElementById('audio-toggle');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');

  function updateToggleUI() {
    if (!audioToggle) return;
    if (cosmicTune.isMuted) {
      soundIconOn.classList.add('hidden');
      soundIconOff.classList.remove('hidden');
      audioToggle.setAttribute('title', 'Unmute Sound & Narration');
      audioToggle.setAttribute('aria-label', 'Unmute Sound & Narration');
    } else {
      soundIconOn.classList.remove('hidden');
      soundIconOff.classList.add('hidden');
      audioToggle.setAttribute('title', 'Mute Sound & Narration');
      audioToggle.setAttribute('aria-label', 'Mute Sound & Narration');
    }
  }

  // Unmute by default on arrival so user immediately gets the full audio experience
  if (sessionStorage.getItem('talha_user_muted') !== 'true') {
    cosmicTune.isMuted = false;
    localStorage.setItem('cosmic_tune_muted', 'false');
  }

  if (audioToggle) {
    updateToggleUI();
    audioToggle.addEventListener('click', () => {
      initAudio();
      const isMuted = cosmicTune.toggle();
      sessionStorage.setItem('talha_user_muted', isMuted ? 'true' : 'false');
      updateToggleUI();
      if (isMuted) {
        stopNarration();
      } else {
        cosmicTune.start();
        playNarration();
      }
    });
  }

  // Auto-start BOTH ambient tune & voice together on page arrival (desktop/laptop only)
  if (window.innerWidth > 1024) {
    playChime(659.25, 0.3); // E5 arrival tone
    cosmicTune.start();
    setTimeout(() => {
      playNarration();
    }, 400);
  }

  // When voice narration finishes: swell ambient music and schedule next loop
  if (narrationAudio) {
    narrationAudio.addEventListener('ended', () => {
      // Swell ambient background tune during the quiet gap
      cosmicTune.swell();

      // Schedule next loop after an 8-second interval
      clearTimeout(loopTimer);
      if (!cosmicTune.isMuted) {
        loopTimer = setTimeout(() => {
          if (!cosmicTune.isMuted) {
            playNarration();
          }
        }, LOOP_GAP_MS);
      }
    });
  }

  // Resume on user gesture if browser blocked initial autoplay (desktop only)
  const startOnInteraction = () => {
    if (window.innerWidth <= 1024) return;
    initAudio();
    if (!cosmicTune.isMuted) {
      if (!cosmicTune.isPlaying) {
        cosmicTune.start();
      }
      if (narrationAudio && narrationAudio.paused && !loopTimer) {
        narrationAudio.play().catch(() => {});
      }
    }
  };
  ['click', 'pointerdown', 'touchstart', 'keydown'].forEach(evt => {
    document.addEventListener(evt, startOnInteraction, { once: true, passive: true });
  });

  // Stop narration when clicking links to navigate away
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      stopNarration();
    });
  });

  window.addEventListener('beforeunload', () => {
    stopNarration();
  });

  // ==========================================
  // 4. COSMIC CANVAS (STARS & DUST PARTICLES)
  // ==========================================
  const canvas = document.getElementById('cosmic-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let currentX = 0, currentY = 0;
  let targetX = 0, targetY = 0;

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
      p.x += p.vx + (currentX * 0.015);
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
  // 5. CINEMATIC BACKGROUND MOVEMENT & 3D PARALLAX
  // ==========================================
  const backdrop = document.querySelector('.event-horizon-backdrop');
  const inductionContent = document.querySelector('.induction-content');

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;
    targetX = normX * 36;
    targetY = normY * 26;
  });

  window.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      const normX = (touch.clientX / window.innerWidth) * 2 - 1;
      const normY = (touch.clientY / window.innerHeight) * 2 - 1;
      targetX = normX * 24;
      targetY = normY * 18;
    }
  }, { passive: true });

  let driftTime = 0;
  function animateCosmicMotion() {
    driftTime += 0.01;
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    const driftX = Math.sin(driftTime * 0.6) * 16 + Math.cos(driftTime * 0.25) * 8;
    const driftY = Math.cos(driftTime * 0.45) * 12 + Math.sin(driftTime * 0.2) * 6;
    const driftScale = 1.08 + Math.sin(driftTime * 0.35) * 0.035;
    const driftRotate = Math.sin(driftTime * 0.3) * 1.5;

    if (backdrop) {
      const finalX = -(currentX + driftX);
      const finalY = -(currentY + driftY);
      backdrop.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0) scale(${driftScale.toFixed(3)}) rotate(${driftRotate.toFixed(2)}deg)`;
    }

    if (inductionContent) {
      const textX = currentX * 0.16;
      const textY = currentY * 0.16;
      inductionContent.style.transform = `translate3d(${textX.toFixed(2)}px, ${textY.toFixed(2)}px, 0)`;
    }

    requestAnimationFrame(animateCosmicMotion);
  }

  animateCosmicMotion();

  // ==========================================
  // 6. PER-LETTER INDEPENDENT FLOATING HARMONICS
  // ==========================================
  function initFloatingLetters() {
    const paragraphs = document.querySelectorAll('.induction-card p');
    let globalCharIndex = 0;

    paragraphs.forEach((p) => {
      const text = p.innerText.trim();
      p.dataset.rawText = text;
      if (!text) return;

      const words = text.split(/\s+/);
      p.innerHTML = '';

      words.forEach((word, wIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'float-word';

        for (let i = 0; i < word.length; i++) {
          const char = word[i];
          const letterSpan = document.createElement('span');
          letterSpan.className = 'float-letter';
          letterSpan.textContent = char;

          const delay = (Math.sin(globalCharIndex * 0.38) * 1.6 + (globalCharIndex * 0.05)).toFixed(2);
          const duration = (3.4 + (globalCharIndex % 6) * 0.38).toFixed(2);
          const floatDist = (2.2 + (globalCharIndex % 4) * 0.7).toFixed(1);

          letterSpan.style.setProperty('--delay', `${delay}s`);
          letterSpan.style.setProperty('--duration', `${duration}s`);
          letterSpan.style.setProperty('--float-dist', `${floatDist}px`);

          wordSpan.appendChild(letterSpan);
          globalCharIndex++;
        }

        p.appendChild(wordSpan);

        if (wIdx < words.length - 1) {
          p.appendChild(document.createTextNode(' '));
        }
      });
    });
  }

  initFloatingLetters();

});