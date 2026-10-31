/**
 * THE UNLOCK GATEWAY // INDEX.JS
 * Handles Video Transmission & TALHA Induction View on index.html
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

  // Interactive Sound Effects (SFX) - ALWAYS ACTIVE (Not affected by tune mute)
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

  // Procedural Cosmic Ambient Tune Generator (Web Audio API)
  class CosmicAmbientEngine {
    constructor(getAudioCtx) {
      this.getAudioCtx = getAudioCtx;
      this.isPlaying = false;
      this.masterGain = null;
      this.nodes = [];
      this.sparkleTimer = null;
      this.isMuted = localStorage.getItem('cosmic_tune_muted') === 'true';
    }

    start() {
      if (this.isPlaying || this.isMuted) return;
      const ctx = this.getAudioCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      this.isPlaying = true;
      const now = ctx.currentTime;

      // Master gain for the ambient tune (Smooth fade-in)
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.linearRampToValueAtTime(0.09, now + 2.5);
      this.masterGain.connect(ctx.destination);

      // Lowpass resonant filter for celestial warmth
      const padFilter = ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.setValueAtTime(420, now);
      padFilter.Q.setValueAtTime(1.4, now);
      padFilter.connect(this.masterGain);

      // 1. Deep Sub-Space Resonant Drone (55Hz / A1 & 110Hz / A2)
      const droneFreqs = [55.0, 55.4, 110.0, 110.3];
      droneFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = idx < 2 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        g.gain.setValueAtTime(idx < 2 ? 0.32 : 0.16, now);
        osc.connect(g);
        g.connect(padFilter);
        osc.start(now);
        this.nodes.push(osc, g);
      });

      // 2. Celestial Harmonic Chord (A3, E4, B4, C#5 - open cosmic ether chord)
      const celestialChord = [220.0, 329.63, 493.88, 554.37];
      celestialChord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        const detune = (idx % 2 === 0 ? 1 : -1) * 3;
        osc.detune.setValueAtTime(detune, now);
        g.gain.setValueAtTime(0.11, now);
        osc.connect(g);
        g.connect(padFilter);
        osc.start(now);
        this.nodes.push(osc, g);
      });

      // 3. Slow Cosmic LFO (Breathing Nebulae Filter Sweeps ~18s cycle)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.055, now);
      lfoGain.gain.setValueAtTime(180, now);
      lfo.connect(padFilter.frequency);
      lfo.start(now);
      this.nodes.push(lfo, lfoGain, padFilter);

      // 4. Starlight Shimmer / Pulsar Harmonics (Twinkling celestial dust)
      const sparkleNotes = [880.0, 987.77, 1108.73, 1318.51, 1479.98, 1661.22];
      const triggerSparkle = () => {
        if (!this.isPlaying) return;
        const t = ctx.currentTime;
        const note = sparkleNotes[Math.floor(Math.random() * sparkleNotes.length)];

        const spkOsc = ctx.createOscillator();
        const spkGain = ctx.createGain();
        spkOsc.type = 'sine';
        spkOsc.frequency.setValueAtTime(note, t);

        spkGain.gain.setValueAtTime(0.0001, t);
        spkGain.gain.linearRampToValueAtTime(0.035, t + 0.9);
        spkGain.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);

        spkOsc.connect(spkGain);
        spkGain.connect(this.masterGain);

        spkOsc.start(t);
        spkOsc.stop(t + 4.8);

        const nextDelay = 6000 + Math.random() * 4000;
        this.sparkleTimer = setTimeout(triggerSparkle, nextDelay);
      };

      this.sparkleTimer = setTimeout(triggerSparkle, 3500);
    }

    stop() {
      if (!this.isPlaying) return;
      this.isPlaying = false;
      clearTimeout(this.sparkleTimer);

      if (this.masterGain && this.getAudioCtx()) {
        const ctx = this.getAudioCtx();
        const now = ctx.currentTime;
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

        setTimeout(() => {
          this.nodes.forEach(n => {
            try {
              if (n.stop) n.stop();
              if (n.disconnect) n.disconnect();
            } catch (e) {}
          });
          this.nodes = [];
          if (this.masterGain) {
            try { this.masterGain.disconnect(); } catch (e) {}
            this.masterGain = null;
          }
        }, 1300);
      }
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

  const cosmicTune = new CosmicAmbientEngine(initAudio);

  const audioToggle = document.getElementById('audio-toggle');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');

  // ==========================================
  // 1.5. NARRATION CONTROLLER (DEEP MALE AI VOICE / DYNAMIC TTS)
  // ==========================================
  const narrationAudio = document.getElementById('induction-voice-audio');

  // Dynamically read title name (TALHA) + induction message in index.html
  function getInductionText() {
    const titleEl = document.querySelector('.talha-title');
    let titleText = titleEl ? titleEl.textContent.trim() : 'Talha';

    // Convert all-caps like "TALHA" to "Talha" so TTS pronounces it as a natural name rather than spelling out letters
    if (titleText && titleText === titleText.toUpperCase() && titleText.length > 1) {
      titleText = titleText.charAt(0).toUpperCase() + titleText.slice(1).toLowerCase();
    }

    const card = document.querySelector('.induction-card');
    if (!card) return titleText ? `${titleText}.` : '';

    const paragraphs = card.querySelectorAll('p');
    let bodyText = '';
    if (paragraphs.length > 0) {
      bodyText = Array.from(paragraphs)
        .map(p => (p.dataset.rawText || p.textContent).replace(/\s+/g, ' ').trim())
        .filter(t => t.length > 0)
        .join(' ');
    } else {
      bodyText = card.textContent.replace(/\s+/g, ' ').trim();
    }

    return titleText ? `${titleText}. ${bodyText}` : bodyText;
  }

  let cachedVoices = [];
  function populateVoices() {
    if ('speechSynthesis' in window) {
      cachedVoices = window.speechSynthesis.getVoices();
    }
  }
  populateVoices();
  if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }

  function stopNarration() {
    if (narrationAudio) {
      try {
        narrationAudio.pause();
        narrationAudio.currentTime = 0;
      } catch (e) {}
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  function playNarration() {
    if (cosmicTune.isMuted) return;
    stopNarration();

    // 1. Try playing custom AI audio file if placed in assets/talha-narration.mp3
    if (narrationAudio && narrationAudio.src) {
      const playPromise = narrationAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Successfully playing custom AI audio file
        }).catch(() => {
          // File absent or blocked, seamless fallback to browser TTS
          speakWithBrowserTTS();
        });
        return;
      }
    }

    // 2. Fallback to Browser Web Speech API
    speakWithBrowserTTS();
  }

  function speakWithBrowserTTS() {
    if (!('speechSynthesis' in window) || cosmicTune.isMuted) return;

    const dynamicText = getInductionText();
    if (!dynamicText) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(dynamicText);

    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    let selectedVoice = null;

    // 1. Prefer South Asian / Indian English voice (closest to Bengali English accent in browser TTS)
    selectedVoice = voices.find(v => (v.lang === 'en-IN' || v.lang.startsWith('en-IN')) && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('prabhat')));

    // 2. Deep male English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('james')));
    }

    // 3. Any en-IN voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en-IN'));
    }

    // 4. Any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Deep, grave, slow cosmic narration tone
    utterance.pitch = 0.74; // Lower pitch = deep/grave tone
    utterance.rate = 0.84;  // Measured, atmospheric cosmic pace
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  }

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

  if (audioToggle) {
    updateToggleUI();
    audioToggle.addEventListener('click', () => {
      initAudio();
      const isMuted = cosmicTune.toggle();
      updateToggleUI();
      if (isMuted) {
        stopNarration();
      } else {
        if (viewInduction && viewInduction.classList.contains('active')) {
          playNarration();
        }
      }
    });
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
  // 3. VIDEO TRANSMISSION & STAGE CONTROL
  // ==========================================
  const viewVideo = document.getElementById('view-video');
  const viewInduction = document.getElementById('view-induction');
  const btnMoveForward = document.getElementById('btn-move-forward');
  const btnBackToVideo = document.getElementById('btn-back-to-video');

  const introVideo = document.getElementById('intro-video');
  const videoFallback = document.getElementById('video-fallback');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const videoProgress = document.getElementById('video-progress');
  const btnSkipVideo = document.getElementById('btn-skip-video');
  const videoNextWrapper = document.getElementById('video-next-wrapper');
  const btnSimulateVideo = document.getElementById('btn-simulate-video');

  function stopTransmissionVideo() {
    if (!introVideo) return;
    try {
      introVideo.pause();
      introVideo.muted = true;
      introVideo.currentTime = 0;
    } catch(e) {}
    if (btnPlayPause) {
      btnPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    }
  }

  function playTransmissionVideo() {
    if (!introVideo) return;
    if (!viewVideo || !viewVideo.classList.contains('active')) {
      stopTransmissionVideo();
      return;
    }

    introVideo.muted = false;
    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (btnPlayPause) {
          btnPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
        }
      }).catch(() => {
        // If unmuted autoplay is blocked by browser, fallback to muted autoplay on video screen
        if (viewVideo && viewVideo.classList.contains('active')) {
          introVideo.muted = true;
          introVideo.play().then(() => {
            if (btnPlayPause) {
              btnPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
            }
          }).catch(() => {});
        }
      });
    }
  }

  if (introVideo) {
    introVideo.addEventListener('loadeddata', () => {
      if (videoFallback) videoFallback.classList.add('hidden');
    });

    introVideo.addEventListener('error', () => {
      if (videoFallback) videoFallback.classList.remove('hidden');
    });

    introVideo.addEventListener('timeupdate', () => {
      if (introVideo.duration && videoProgress) {
        const pct = (introVideo.currentTime / introVideo.duration) * 100;
        videoProgress.style.width = `${pct}%`;
      }
    });

    introVideo.addEventListener('ended', () => {
      revealMoveForward();
    });

    introVideo.addEventListener('click', () => {
      initAudio();
      if (introVideo.paused) {
        playTransmissionVideo();
      } else {
        introVideo.pause();
        if (btnPlayPause) {
          btnPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
        }
      }
    });
  }

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      initAudio();
      if (introVideo.paused) {
        playTransmissionVideo();
      } else {
        introVideo.pause();
        btnPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
      }
    });
  }

  function revealMoveForward() {
    if (videoNextWrapper) {
      videoNextWrapper.classList.remove('hidden');
      videoNextWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    playChime(587.33, 0.4);
  }

  if (btnSimulateVideo) {
    btnSimulateVideo.addEventListener('click', () => {
      let p = 0;
      btnSimulateVideo.disabled = true;
      btnSimulateVideo.textContent = 'Simulating Stream...';
      const interval = setInterval(() => {
        p += 12;
        if (videoProgress) videoProgress.style.width = `${p}%`;
        if (p >= 100) {
          clearInterval(interval);
          btnSimulateVideo.textContent = 'Stream Completed';
          revealMoveForward();
        }
      }, 180);
    });
  }

  if (btnSkipVideo) {
    btnSkipVideo.addEventListener('click', () => {
      stopTransmissionVideo();
      showView('induction');
    });
  }

  // Unmute video ONLY when user interacts WHILE ON THE VIDEO SCREEN
  const unlockVideoAudio = () => {
    if (introVideo && viewVideo && viewVideo.classList.contains('active')) {
      if (introVideo.muted) {
        introVideo.muted = false;
      }
    }
  };
  ['click', 'pointerdown', 'touchstart', 'keydown'].forEach(evt => {
    document.addEventListener(evt, unlockVideoAudio, { passive: true });
  });

  // ==========================================
  // 4. VIEW SWITCHER (VIDEO <-> INDUCTION)
  // ==========================================
  let narrationTimeout = null;

  function showView(viewName, pushHistory = true) {
    initAudio();
    clearTimeout(narrationTimeout);

    if (viewName === 'induction') {
      stopTransmissionVideo();
      viewVideo.classList.remove('active');
      viewInduction.classList.add('active');
      if (pushHistory) history.pushState({ view: 'induction' }, '', '#induction');
      playChime(659.25, 0.3); // E5
      cosmicTune.start();

      // Begin deep cosmic AI voice narration after smooth view settle
      narrationTimeout = setTimeout(() => {
        playNarration();
      }, 700);
    } else {
      stopNarration();
      cosmicTune.stop();
      viewInduction.classList.remove('active');
      viewVideo.classList.add('active');
      if (pushHistory) history.pushState({ view: 'video' }, '', window.location.pathname);
      playTransmissionVideo();
      playChime(440, 0.2); // A4
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    stopNarration();
    if (window.location.hash === '#induction') {
      showView('induction', false);
    } else {
      showView('video', false);
    }
  });

  // Stop narration when navigating away to Decryption Protocol
  const linkGateway = document.querySelector('a[href="gateway.html"]');
  if (linkGateway) {
    linkGateway.addEventListener('click', () => {
      stopNarration();
    });
  }

  window.addEventListener('beforeunload', () => {
    stopNarration();
    stopTransmissionVideo();
  });

  btnMoveForward.addEventListener('click', () => {
    showView('induction');
  });

  btnBackToVideo.addEventListener('click', () => {
    showView('video');
  });

  // Check initial hash on load
  if (window.location.hash === '#induction') {
    showView('induction', false);
  } else {
    showView('video', false);
  }

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
