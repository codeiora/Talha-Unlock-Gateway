/**
 * THE UNLOCK GATEWAY // INDEX.JS
 * Handles Video Transmission & TALHA Induction View on index.html
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. WEB AUDIO API SYNTHESIZER
  // ==========================================
  let audioCtx = null;
  let audioEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  const audioToggle = document.getElementById('audio-toggle');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');

  audioToggle.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    if (audioEnabled) {
      initAudio();
      soundIconOn.classList.remove('hidden');
      soundIconOff.classList.add('hidden');
      playChime(587.33, 0.15);
    } else {
      soundIconOn.classList.add('hidden');
      soundIconOff.classList.remove('hidden');
    }
  });

  function playChime(freq = 440, duration = 0.25) {
    if (!audioEnabled) return;
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
  // 3. VIEW SWITCHER (VIDEO <-> INDUCTION)
  // ==========================================
  const viewVideo = document.getElementById('view-video');
  const viewInduction = document.getElementById('view-induction');
  const btnMoveForward = document.getElementById('btn-move-forward');
  const btnBackToVideo = document.getElementById('btn-back-to-video');

  function showView(viewName, pushHistory = true) {
    initAudio();
    if (viewName === 'induction') {
      viewVideo.classList.remove('active');
      viewInduction.classList.add('active');
      if (pushHistory) history.pushState({ view: 'induction' }, '', '#induction');
      playChime(659.25, 0.3); // E5
    } else {
      viewInduction.classList.remove('active');
      viewVideo.classList.add('active');
      if (pushHistory) history.pushState({ view: 'video' }, '', window.location.pathname);
      playChime(440, 0.2); // A4
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (window.location.hash === '#induction') {
      showView('induction', false);
    } else {
      showView('video', false);
    }
  });

  // Check initial hash
  if (window.location.hash === '#induction') {
    showView('induction', false);
  }

  btnMoveForward.addEventListener('click', () => {
    showView('induction');
  });

  btnBackToVideo.addEventListener('click', () => {
    showView('video');
  });

  // ==========================================
  // 4. VIDEO TRANSMISSION LOGIC
  // ==========================================
  const introVideo = document.getElementById('intro-video');
  const videoFallback = document.getElementById('video-fallback');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const videoProgress = document.getElementById('video-progress');
  const btnSkipVideo = document.getElementById('btn-skip-video');
  const videoNextWrapper = document.getElementById('video-next-wrapper');
  const btnSimulateVideo = document.getElementById('btn-simulate-video');

  introVideo.addEventListener('loadeddata', () => {
    videoFallback.classList.add('hidden');
  });

  introVideo.addEventListener('error', () => {
    videoFallback.classList.remove('hidden');
  });

  btnPlayPause.addEventListener('click', () => {
    initAudio();
    if (introVideo.paused) {
      introVideo.play().catch(() => {});
      btnPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
    } else {
      introVideo.pause();
      btnPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    }
  });

  introVideo.addEventListener('timeupdate', () => {
    if (introVideo.duration) {
      const pct = (introVideo.currentTime / introVideo.duration) * 100;
      videoProgress.style.width = `${pct}%`;
    }
  });

  introVideo.addEventListener('ended', () => {
    revealMoveForward();
  });

  function revealMoveForward() {
    videoNextWrapper.classList.remove('hidden');
    videoNextWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    playChime(587.33, 0.4);
  }

  btnSimulateVideo.addEventListener('click', () => {
    let p = 0;
    btnSimulateVideo.disabled = true;
    btnSimulateVideo.textContent = 'Simulating Stream...';
    const interval = setInterval(() => {
      p += 12;
      videoProgress.style.width = `${p}%`;
      if (p >= 100) {
        clearInterval(interval);
        btnSimulateVideo.textContent = 'Stream Completed';
        revealMoveForward();
      }
    }, 180);
  });

  introVideo.addEventListener('click', () => {
    if (btnPlayPause) btnPlayPause.click();
  });

  if (btnSkipVideo) {
    btnSkipVideo.addEventListener('click', () => {
      introVideo.pause();
      showView('induction');
    });
  }

  // Attempt autoplay immediately
  const playPromise = introVideo.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      if (btnPlayPause) {
        btnPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
      }
    }).catch(() => {
      // Browser blocked unmuted autoplay; fallback to muted autoplay
      introVideo.muted = true;
      introVideo.play().then(() => {
        if (btnPlayPause) {
          btnPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
        }
      }).catch(() => {});
    });
  }

  // Unmute on first interaction
  document.addEventListener('click', () => {
    if (introVideo.muted) {
      introVideo.muted = false;
    }
  }, { once: true });

  // ==========================================
  // 5. CINEMATIC BACKGROUND MOVEMENT & 3D PARALLAX
  // ==========================================
  const backdrop = document.querySelector('.event-horizon-backdrop');
  const inductionContent = document.querySelector('.induction-content');

  window.addEventListener('mousemove', (e) => {
    // Normalized between -1 and 1 from center
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;
    targetX = normX * 36; // Parallax amplitude in pixels
    targetY = normY * 26;
  });

  window.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  // Touch device tilt/pan support
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

    // Fluid damping (smooth lerp)
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    // Continuous majestic floating space drift & orbital pulse
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
      // Subtle opposing 3D parallax for text floating in foreground
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

          // Unique undulating rhythm for each individual letter
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
