export const playAlertSound = () => {
  try {
    // Use Web Audio API synthesizer for zero-dependency, crash-proof alert sound
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (AudioCtx) {
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // High pitch alert (A5)
      osc2.frequency.setValueAtTime(440, ctx.currentTime); // Low pitch support (A4)

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    }
  } catch (error) {
    console.log('Audio playback not permitted or supported:', error);
  }
};
