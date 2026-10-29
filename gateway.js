/**
 * THE UNLOCK GATEWAY // GATEWAY.JS
 * Interactive Logic, Stargate SVG Animation, Web Audio SFX, and Codex Verification
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

  // Sound: Harmonic Chime / Lock Engaged
  function playMechanicalLock(level = 1) {
    if (!audioEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;

    const baseFreqs = [220, 277.18, 329.63, 440, 554.37];
    const freq = baseFreqs[level] || 440;

    // Metallic click
    const oscClick = audioCtx.createOscillator();
    const gainClick = audioCtx.createGain();
    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(800, now);
    oscClick.frequency.exponentialRampToValueAtTime(120, now + 0.08);
    gainClick.gain.setValueAtTime(0.4, now);
    gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    oscClick.connect(gainClick);
    gainClick.connect(audioCtx.destination);
    oscClick.start(now);
    oscClick.stop(now + 0.08);

    // Warm resonant chime
    const oscChime = audioCtx.createOscillator();
    const gainChime = audioCtx.createGain();
    oscChime.type = 'sine';
    oscChime.frequency.setValueAtTime(freq, now + 0.04);
    oscChime.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.5);
    gainChime.gain.setValueAtTime(0.3, now + 0.04);
    gainChime.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    oscChime.connect(gainChime);
    gainChime.connect(audioCtx.destination);
    oscChime.start(now + 0.04);
    oscChime.stop(now + 0.8);
  }

  function playChime(freq = 440, duration = 0.2) {
    if (!audioEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  function playErrorSound() {
    if (!audioEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.setValueAtTime(110, now + 0.1);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  function playCosmicRecalibrationSound() {
    if (!audioEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;

    // Warm deep gong / resonant harmonic tone (mysterious, cozy, celestial)
    const baseFreq = 216; // Harmonic cosmic frequency
    [baseFreq, baseFreq * 1.5, baseFreq * 2].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 1.6);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + 1.6);
    });
  }

  function playPortalBreachSound() {
    if (!audioEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;

    // Deep sub-bass sweep
    const oscBass = audioCtx.createOscillator();
    const gainBass = audioCtx.createGain();
    oscBass.type = 'sine';
    oscBass.frequency.setValueAtTime(60, now);
    oscBass.frequency.exponentialRampToValueAtTime(180, now + 1.2);
    gainBass.gain.setValueAtTime(0.5, now);
    gainBass.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    oscBass.connect(gainBass);
    gainBass.connect(audioCtx.destination);
    oscBass.start(now);
    oscBass.stop(now + 1.8);

    // Radiant celestial shimmer
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + 0.2 * idx);
      gain.gain.setValueAtTime(0.2, now + 0.2 * idx);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6 + 0.2 * idx);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + 0.2 * idx);
      osc.stop(now + 1.6 + 0.2 * idx);
    });
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
    const count = Math.min(100, Math.floor((width * height) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() * 0.15 + 0.05) * -1
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
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }

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
  // 3. PUZZLE VERIFICATION & STARGATE LOGIC (28 CHAMBERS // 4 SECTORS // 10 MARKS)
  // ==========================================
  const sectorRings = {
    1: { ringId: 'ring-1', circumference: 1445, puzzles: [1, 2, 3, 4, 5, 6, 7] },
    2: { ringId: 'ring-2', circumference: 1131, puzzles: [8, 9, 10, 11, 12, 13, 14] },
    3: { ringId: 'ring-3', circumference: 816, puzzles: [15, 16, 17, 18, 19, 20, 21] },
    4: { ringId: 'ring-4', circumference: 502, puzzles: [22, 23, 24, 25, 26, 27, 28] }
  };

  const puzzleConfigs = {
    // SECTOR 1: ORBITAL MECHANICS & PLANETARY DYNAMICS (1 - 7)
    1: { sector: 1, expected: ['2810', '2810.0', '2810 KM/H', '2810KM/H'] },
    2: { sector: 1, expected: ['28.10', '28.1', '28.10 N', '28.10N', '28.1 N'] },
    3: { sector: 1, expected: ['28.10', '28.1', '28.10 M/S2', '28.10 M/S²', '28.10M/S2', '28.10M/S²'] },
    4: { sector: 1, expected: ['2810', '2810.0', '2810 S', '2810 SECONDS', '2810S'] },
    5: { sector: 1, expected: ['2.810', '2.81', '2.810 KM/S', '2.810KM/S', '2.81 KM/S'] },
    6: { sector: 1, expected: ['0.2810', '0.281', '.2810', '.281'] },
    7: { sector: 1, expected: ['2810', '2810.0', '2810 N', '2810N'] },

    // SECTOR 2: STELLAR ASTROPHYSICS & BLACK HOLES (8 - 14)
    8: { sector: 2, expected: ['2810', '2810.0', '2810 KM', '2810KM'] },
    9: { sector: 2, expected: ['28.10', '28.1', '28.10X', '28.1X'] },
    10: { sector: 2, expected: ['281.0', '281', '281.0 NM', '281 NM', '281.0NM', '281NM'] },
    11: { sector: 2, expected: ['28.10', '28.1', '28.10 J', '28.10J', '28.1 J'] },
    12: { sector: 2, expected: ['2.810', '2.81', '2.810 NM', '2.810NM', '2.81 NM'] },
    13: { sector: 2, expected: ['2810', '2810.0', '2810 W/M2', '2810 W/M²', '2810W/M2', '2810W/M²'] },
    14: { sector: 2, expected: ['2.810', '2.81', '2.810 S', '2.810 SECONDS', '2.810S'] },

    // SECTOR 3: DEEP SPACE & COSMIC EXPANSION (15 - 21)
    15: { sector: 3, expected: ['2810', '2810.0', '2810 KM/S', '2810KM/S'] },
    16: { sector: 3, expected: ['2.810', '2.81', '2.810Z', '2.81Z'] },
    17: { sector: 3, expected: ['28.10', '28.1', '28.10 MPC', '28.10MPC', '28.1 MPC'] },
    18: { sector: 3, expected: ['2810', '2810.0', '2810 M/S', '2810M/S'] },
    19: { sector: 3, expected: ['28.10', '28.1', '28.10 KPC', '28.10KPC', '28.1 KPC'] },
    20: { sector: 3, expected: ['2.810', '2.81', '2.810X', '2.81X'] },
    21: { sector: 3, expected: ['28.10', '28.1', '28.10X', '28.1X'] },

    // SECTOR 4: RELATIVISTIC SPACE-TIME & QUANTUM COSMOS (22 - 28)
    22: { sector: 4, expected: ['28.10', '28.1', '28.10 YEARS', '28.10YEARS', '28.1 YEARS'] },
    23: { sector: 4, expected: ['2810', '2810.0', '2810 KG*M/S', '2810KG*M/S', '2810 KG·M/S'] },
    24: { sector: 4, expected: ['2.810', '2.81', '2.810 NM', '2.810NM', '2.81 NM'] },
    25: { sector: 4, expected: ['281.0', '281', '281.0 S', '281.0 SECONDS', '281 S'] },
    26: { sector: 4, expected: ['2.810', '2.81', '2.810 NM', '2.810NM', '2.81 NM'] },
    27: { sector: 4, expected: ['28.10', '28.1', '28.10 GEV', '28.10GEV', '28.1 GEV'] },
    28: { sector: 4, expected: ['2810.0182', '2810.0182 HZ', '2810.0182HZ'] }
  };

  const solvedPuzzles = new Set();
  const completedSectors = new Set();
  const systemStatus = document.getElementById('system-status');
  const badgeMarks = document.getElementById('badge-marks');
  const badgeSeals = document.getElementById('badge-seals');
  const readoutPercent = document.getElementById('readout-percent');
  const readoutText = document.getElementById('readout-text');

  // Verify Buttons Event Listeners
  document.querySelectorAll('.btn-verify').forEach(btn => {
    btn.addEventListener('click', () => {
      const puzzleId = parseInt(btn.getAttribute('data-puzzle'), 10);
      verifyPuzzle(puzzleId);
    });
  });

  // Enter Key Listener on all puzzle inputs
  document.querySelectorAll('.input-wrap input').forEach(inp => {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const card = inp.closest('.puzzle-card');
        const btn = card.querySelector('.btn-verify');
        if (btn && !btn.disabled) {
          btn.click();
        }
      }
    });
  });

  function verifyPuzzle(id) {
    const input = document.getElementById(`input-${id}`);
    const feedback = document.getElementById(`feedback-${id}`);
    const card = document.getElementById(`card-${id}`);
    const badge = document.getElementById(`badge-${id}`);
    const btn = card.querySelector('.btn-verify');

    const rawVal = input.value.trim().toUpperCase();
    const config = puzzleConfigs[id];

    if (!rawVal) {
      feedback.textContent = 'Please enter a numerical value.';
      feedback.className = 'card-feedback error';
      playErrorSound();
      return;
    }

    const isCorrect = config.expected.some(exp => exp.toUpperCase() === rawVal);

    if (isCorrect) {
      solvedPuzzles.add(id);
      feedback.textContent = `✓ Coordinate Authenticated [${rawVal}]`;
      feedback.className = 'card-feedback success';
      card.classList.add('solved');
      badge.textContent = 'SEAL ALIGNED';
      input.disabled = true;
      btn.disabled = true;
      btn.textContent = 'ALIGNED ✓';

      updateSectorProgress(config.sector);
      updateOverallProgress();

      playChime(440 + (solvedPuzzles.size % 7) * 45, 0.2);
    } else {
      feedback.textContent = '✗ Equation mismatch. Notice the 28-10 frequency and re-check.';
      feedback.className = 'card-feedback error';
      playErrorSound();
      card.style.transform = 'translateX(-4px)';
      setTimeout(() => { card.style.transform = 'translateX(4px)'; }, 100);
      setTimeout(() => { card.style.transform = 'translateX(0)'; }, 200);
    }
  }

  function updateSectorProgress(sectorNum) {
    const sRing = sectorRings[sectorNum];
    if (!sRing) return;

    const solvedInSector = sRing.puzzles.filter(id => solvedPuzzles.has(id)).length;
    const badge = document.getElementById(`sector-badge-${sectorNum}`);
    
    if (badge) {
      if (solvedInSector === 7) {
        badge.textContent = '✓ 7 / 7 (SEALED)';
        badge.classList.add('badge-completed');
      } else {
        badge.textContent = `${solvedInSector} / 7`;
      }
    }

    // Dynamic Ring Stroke Dashoffset animation
    const ringGroup = document.getElementById(sRing.ringId);
    if (ringGroup) {
      const progressCircle = ringGroup.querySelector('.ring-progress');
      if (progressCircle) {
        const offset = sRing.circumference * (1 - (solvedInSector / 7));
        progressCircle.style.strokeDashoffset = offset;
      }

      if (solvedInSector === 7 && !completedSectors.has(sectorNum)) {
        completedSectors.add(sectorNum);
        ringGroup.classList.remove('ring-dormant');
        ringGroup.classList.add('ring-unlocked');
        playMechanicalLock(sectorNum);
      }
    }
  }

  function updateOverallProgress() {
    const totalSolved = solvedPuzzles.size;
    const marks = ((totalSolved / 28) * 10).toFixed(2);
    const marksDisplay = totalSolved === 28 ? '10.00' : marks;
    const pct = Math.round((totalSolved / 28) * 100);

    readoutPercent.textContent = `${pct}%`;
    
    if (badgeMarks) {
      badgeMarks.textContent = `MARKS: ${marksDisplay} / 10.00`;
    }
    
    if (badgeSeals) {
      badgeSeals.textContent = `SEALS ENGAGED: ${completedSectors.size} / 4`;
    }

    if (systemStatus) {
      if (totalSolved === 28) {
        systemStatus.textContent = `STATUS: ALL 28 CHAMBERS CONVERGED (10.00 MARKS)`;
      } else {
        systemStatus.textContent = `STATUS: SYNCHRONIZING (${totalSolved}/28 • ${marksDisplay} MARKS)`;
      }
    }

    // Dynamic Awakening of the Painted Cosmic Vortex Art
    const vortexArt = document.getElementById('vortex-art');
    if (vortexArt) {
      const step = totalSolved / 28;
      const opacity = 0.90 + (0.10 * step);
      const saturation = 1.20 + (0.70 * step);
      const brightness = 1.20 + (0.40 * step);
      vortexArt.style.opacity = opacity;
      vortexArt.style.filter = `saturate(${saturation}) brightness(${brightness}) contrast(1.12)`;
      if (totalSolved === 28) {
        vortexArt.style.filter += ` drop-shadow(0 0 50px rgba(251, 191, 36, 0.9))`;
      }
    }

    if (totalSolved === 7) {
      readoutText.textContent = 'Sector 01 aligned: Ring 1 locked. (+2.50 Marks)';
    } else if (totalSolved === 14) {
      readoutText.textContent = 'Sector 02 aligned: Ring 2 locked. (+5.00 Marks)';
    } else if (totalSolved === 21) {
      readoutText.textContent = 'Sector 03 aligned: Ring 3 locked. (+7.50 Marks)';
    } else if (totalSolved === 28) {
      readoutText.textContent = 'All 28 chambers solved! Perfect 10.00 Marks. Input Master Key below.';
      const masterCard = document.getElementById('master-vault-card');
      if (masterCard) {
        masterCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const passInp = document.getElementById('master-passcode');
        if (passInp) passInp.focus();
      }
    } else {
      readoutText.textContent = `Harmonic calibration active: ${totalSolved} of 28 coordinates aligned.`;
    }
  }

  // ==========================================
  // SECTOR TABS & NAVIGATION SWITCHER
  // ==========================================
  const sectorTabs = document.querySelectorAll('.sector-tab');
  const sectorPanels = document.querySelectorAll('.sector-panel');

  function switchSector(sectorIndex) {
    sectorTabs.forEach(tab => {
      const tabSec = parseInt(tab.getAttribute('data-sector'), 10);
      tab.classList.toggle('active', tabSec === sectorIndex);
    });

    sectorPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `sector-panel-${sectorIndex}`);
    });

    // Scroll gently to top of notebook panel
    const notebookCard = document.querySelector('.notebook-header-card');
    if (notebookCard) {
      notebookCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  sectorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const sec = parseInt(tab.getAttribute('data-sector'), 10);
      switchSector(sec);
      playChime(523.25, 0.12);
    });
  });

  document.querySelectorAll('.btn-nav-sector').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextSec = btn.getAttribute('data-next-sector');
      const prevSec = btn.getAttribute('data-prev-sector');
      const targetSec = parseInt(nextSec || prevSec, 10);
      if (targetSec) {
        switchSector(targetSec);
        playChime(587.33, 0.15);
      }
    });
  });

  // ==========================================
  // 4. MASTER VAULT DECRYPTION (THE 2810 KEY) & PRANK LOCKOUT
  // ==========================================
  const masterPasscode = document.getElementById('master-passcode');
  const btnUnlockMaster = document.getElementById('btn-unlock-master');
  const masterFeedback = document.getElementById('master-feedback');
  const coreLight = document.getElementById('core-light');
  const breachModal = document.getElementById('breach-modal');
  const prankLockoutContent = document.getElementById('prank-lockout-content');
  const realBreachContent = document.getElementById('real-breach-content');
  const btnRestrictedLocked = document.getElementById('btn-restricted-locked');
  const lockoutClickWarning = document.getElementById('lockout-click-warning');
  const btnSecretToggle = document.getElementById('btn-secret-toggle');
  const btnRevisitCodex = document.getElementById('btn-revisit-codex');
  const timerHours = document.getElementById('timer-hours');
  const timerMinutes = document.getElementById('timer-minutes');
  const timerSeconds = document.getElementById('timer-seconds');
  const timerProgressFill = document.getElementById('timer-progress-fill');

  const LOCKOUT_KEY = 'talha_gateway_lockout_active';
  // Clear old testing timestamp so lockout countdown starts completely fresh at 48:00:00
  localStorage.removeItem('talha_lockout_timestamp');
  const LOCKOUT_HOURS = 48;
  const LOCKOUT_DURATION_MS = LOCKOUT_HOURS * 60 * 60 * 1000;
  let countdownInterval = null;
  let isPrankActive = true;

  function getRemainingLockoutMs() {
    const startTime = localStorage.getItem(LOCKOUT_KEY);
    if (!startTime) return LOCKOUT_DURATION_MS;
    const targetEnd = parseInt(startTime, 10) + LOCKOUT_DURATION_MS;
    return targetEnd - Date.now();
  }

  function isLockoutCompleted() {
    const startTime = localStorage.getItem(LOCKOUT_KEY);
    if (!startTime) return false;
    return getRemainingLockoutMs() <= 0;
  }

  function initCountdownTimer() {
    // Only set startTime if it hasn't been set before (first unlock preserved permanently)
    let startTime = localStorage.getItem(LOCKOUT_KEY);
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem(LOCKOUT_KEY, startTime);
    }

    const endTime = parseInt(startTime, 10) + LOCKOUT_DURATION_MS;

    function tick() {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        if (timerHours) timerHours.textContent = '00';
        if (timerMinutes) timerMinutes.textContent = '00';
        if (timerSeconds) timerSeconds.textContent = '00';
        if (timerProgressFill) timerProgressFill.style.width = '0%';
        if (countdownInterval) clearInterval(countdownInterval);

        // 48 hours have finished! Grant access to the Real Sanctuary!
        isPrankActive = false;
        showRealSanctuaryView();
        return;
      }

      const totalSec = Math.floor(diff / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      if (timerHours) timerHours.textContent = String(h).padStart(2, '0');
      if (timerMinutes) timerMinutes.textContent = String(m).padStart(2, '0');
      if (timerSeconds) timerSeconds.textContent = String(s).padStart(2, '0');

      const pct = Math.max(0, Math.min(100, (diff / LOCKOUT_DURATION_MS) * 100));
      if (timerProgressFill) timerProgressFill.style.width = pct + '%';
    }

    tick();
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(tick, 1000);
  }

  function showPrankView() {
    if (breachModal) {
      breachModal.classList.add('lockout-mode');
    }
    if (prankLockoutContent) prankLockoutContent.style.display = 'flex';
    if (realBreachContent) realBreachContent.style.display = 'none';
    initCountdownTimer();
  }

  function showRealSanctuaryView() {
    if (breachModal) {
      breachModal.classList.remove('lockout-mode');
    }
    if (prankLockoutContent) prankLockoutContent.style.display = 'none';
    if (realBreachContent) realBreachContent.style.display = 'flex';
    playPortalBreachSound();
  }

  function toggleSanctuaryView() {
    isPrankActive = !isPrankActive;
    if (isPrankActive) {
      showPrankView();
      playCosmicRecalibrationSound();
    } else {
      showRealSanctuaryView();
    }
  }

  function triggerBreachReveal() {
    if (!breachModal) return;
    breachModal.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Check if the 48 hours have passed
    if (isLockoutCompleted()) {
      // Cooldown complete! Direct access granted to Sanctuary!
      isPrankActive = false;
      showRealSanctuaryView();
    } else {
      // Still under restriction: show prank with elapsed time remaining
      isPrankActive = true;
      showPrankView();
      playCosmicRecalibrationSound();
    }
  }

  function closeBreachModal() {
    if (!breachModal) return;
    breachModal.classList.add('hidden');
    // Re-enable master passcode so observer can re-solve or re-test
    if (masterPasscode) masterPasscode.disabled = false;
    if (btnUnlockMaster) btnUnlockMaster.disabled = false;
  }

  if (btnSecretToggle) {
    btnSecretToggle.addEventListener('click', toggleSanctuaryView);
  }

  if (btnRestrictedLocked) {
    btnRestrictedLocked.addEventListener('click', () => {
      playChime(329.63, 0.28);
      btnRestrictedLocked.classList.remove('btn-shake');
      void btnRestrictedLocked.offsetWidth;
      btnRestrictedLocked.classList.add('btn-shake');

      if (lockoutClickWarning) {
        lockoutClickWarning.classList.remove('hidden');
        setTimeout(() => {
          lockoutClickWarning.classList.add('hidden');
        }, 3400);
      }
    });
  }

  if (btnRevisitCodex) {
    btnRevisitCodex.addEventListener('click', () => {
      closeBreachModal();
      const codexSection = document.querySelector('.notebook-wrapper') || document.querySelector('.gateway-main');
      if (codexSection) {
        codexSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Global console helpers for testing and controls
  window.revealRealSanctuary = showRealSanctuaryView;
  window.showPrankGateway = showPrankView;
  window.togglePrankMode = toggleSanctuaryView;

  // Simulate passing time (e.g. simulateHoursPassed(1) or simulateHoursPassed(48))
  window.simulateHoursPassed = function(hours) {
    let startTime = localStorage.getItem(LOCKOUT_KEY);
    if (!startTime) {
      startTime = Date.now().toString();
    }
    const newStart = parseInt(startTime, 10) - (hours * 60 * 60 * 1000);
    localStorage.setItem(LOCKOUT_KEY, newStart.toString());
    initCountdownTimer();
    console.log(`✦ Simulated ${hours} hours passed. Time remaining updated!`);
    if (getRemainingLockoutMs() <= 0) {
      console.log('✦ 48 hours completed! System automatically reveals Sanctuary.');
      showRealSanctuaryView();
    }
  };

  window.resetLockoutTimer = function() {
    localStorage.removeItem(LOCKOUT_KEY);
    initCountdownTimer();
    console.log('✦ 48-Hour Timer reset to fresh 48:00:00.');
  };

  masterPasscode.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnUnlockMaster.click();
    }
  });

  btnUnlockMaster.addEventListener('click', () => {
    const val = masterPasscode.value.trim();

    if (val === '2810') {
      if (isLockoutCompleted()) {
        masterFeedback.textContent = '✦ 48-HR RESTRICTION EXPIRED. FREQUENCY 2810 ACCEPTED! COLLAPSING THE VEIL...';
        masterFeedback.style.color = '#34d399';
      } else {
        masterFeedback.textContent = '✦ MASTER FREQUENCY ACCEPTED: 2810. SCANNING OBSERVATION RECORD...';
        masterFeedback.style.color = '#34d399';
      }
      masterPasscode.disabled = true;
      btnUnlockMaster.disabled = true;

      // Glow the central core
      coreLight.classList.remove('core-locked');
      coreLight.classList.add('core-unlocked');

      playPortalBreachSound();

      // Trigger Grand Breach Modal / Overlay
      setTimeout(() => {
        triggerBreachReveal();
      }, 1500);

    } else {
      masterFeedback.textContent = '✗ Invalid Master Frequency. Observe the 28 coordinates across the chambers: 2810, 28.10, 2.810...';
      masterFeedback.style.color = '#f43f5e';
      playErrorSound();
      masterPasscode.style.borderColor = '#f43f5e';
      setTimeout(() => {
        masterPasscode.style.borderColor = '#fbbf24';
      }, 1200);
    }
  });

  const btnCloseBreach = document.getElementById('btn-close-breach');
  if (btnCloseBreach) {
    btnCloseBreach.addEventListener('click', closeBreachModal);
  }

  // ==========================================
  // 6. OBSERVER'S STUDY LIGHTBOX MODAL
  // ==========================================
  const btnInspectDesk = document.getElementById('btn-inspect-desk');
  const deskModal = document.getElementById('desk-modal');
  const btnCloseDeskModal = document.getElementById('btn-close-desk-modal');
  const deskModalBackdrop = document.getElementById('desk-modal-backdrop');

  function openDeskModal() {
    if (!deskModal) return;
    deskModal.classList.remove('hidden');
    deskModal.setAttribute('aria-hidden', 'false');
    playChime(659.25, 0.25);
  }

  function closeDeskModal() {
    if (!deskModal) return;
    deskModal.classList.add('hidden');
    deskModal.setAttribute('aria-hidden', 'true');
  }

  if (btnInspectDesk) {
    btnInspectDesk.addEventListener('click', openDeskModal);
  }

  if (btnCloseDeskModal) {
    btnCloseDeskModal.addEventListener('click', closeDeskModal);
  }

  if (deskModalBackdrop) {
    deskModalBackdrop.addEventListener('click', closeDeskModal);
  }

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && deskModal && !deskModal.classList.contains('hidden')) {
      closeDeskModal();
    }
  });

});
