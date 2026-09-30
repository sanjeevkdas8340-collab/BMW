let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  try {
    localStorage.setItem('bmw_sound_enabled', String(enabled));
  } catch {}
}

export function isSoundEnabled(): boolean {
  try {
    const stored = localStorage.getItem('bmw_sound_enabled');
    if (stored !== null) return stored === 'true';
  } catch {}
  return soundEnabled;
}

export function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.25, delay = 0) {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    const startTime = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  } catch {}
}

export function playArpeggio(notes: number[], noteDuration = 0.12, type: OscillatorType = 'sine', volume = 0.25) {
  if (!isSoundEnabled()) return;
  notes.forEach((freq, idx) => {
    playTone(freq, noteDuration * 1.5, type, volume * (1 - idx * 0.05), idx * noteDuration);
  });
}

export function playWinSound() {
  if (!isSoundEnabled()) return;
  // Victorious ascending fanfare with harmonics
  playArpeggio([523.25, 659.25, 783.99, 1046.5], 0.12, 'sine', 0.28);
  setTimeout(() => {
    playArpeggio([659.25, 880, 1174.66, 1318.51], 0.14, 'triangle', 0.22);
  }, 240);
}

export function playLossSound() {
  if (!isSoundEnabled()) return;
  // Soft descending alert tone
  playTone(392, 0.25, 'sawtooth', 0.12, 0);
  playTone(329.63, 0.35, 'sawtooth', 0.14, 0.2);
  playTone(261.63, 0.5, 'sine', 0.18, 0.45);
}

export function playJackpotSound() {
  if (!isSoundEnabled()) return;
  // Grand casino payout celebratory melody
  playArpeggio([523.25, 659.25, 783.99, 1046.5, 1318.51], 0.09, 'sine', 0.3);
  setTimeout(() => {
    playArpeggio([783.99, 1046.5, 1318.51, 1567.98], 0.1, 'triangle', 0.25);
  }, 450);
  setTimeout(() => {
    playArpeggio([1046.5, 1318.51, 1567.98, 2093.0], 0.16, 'sine', 0.32);
  }, 850);
}

export function playClickSound() {
  if (!isSoundEnabled()) return;
  playTone(800, 0.05, 'sine', 0.1);
}

export function playLockSound() {
  if (!isSoundEnabled()) return;
  playTone(600, 0.08, 'triangle', 0.18);
  setTimeout(() => playTone(950, 0.12, 'sine', 0.22), 80);
}
