/** Read text aloud with the device voice. Returns false if speech isn't available. */
export function speak(text: string, rate = 0.85): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.lang = 'en-GB';
  const voice = synth.getVoices().find((v) => v.lang === 'en-GB');
  if (voice) utterance.voice = voice;
  synth.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}

let ctx: AudioContext | undefined;

/** A soft two-note chime. Never a buzzer: there are no "wrong" sounds in the hub. */
export function chime(kind: 'soft' | 'success' = 'soft') {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    const notes = kind === 'success' ? [523.25, 659.25, 783.99] : [659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx!.currentTime + i * 0.14;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc.connect(gain).connect(ctx!.destination);
      osc.start(t);
      osc.stop(t + 0.65);
    });
  } catch {
    // Audio is a nice-to-have.
  }
}
