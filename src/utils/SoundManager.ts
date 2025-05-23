import { Howl } from 'howler';

class SoundManager {
  private static instance: SoundManager;
  private currentAmbience: Howl | null = null;
  private nextAmbience: Howl | null = null;
  private crossfadeDuration: number = 2000; // 2 seconds crossfade
  private rainVolume = 0.05; // 5% volume for rain and thunder
  private birdsChirpVolume = 2.0; // 200% volume for birds chirping

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public playAmbience(soundPath: string): void {
    // Stop current ambience if playing
    if (this.currentAmbience) {
      this.currentAmbience.stop();
    }

    // Create new sound
    this.currentAmbience = new Howl({
      src: [soundPath],
      volume: soundPath.includes('Birds Chirp') ? this.birdsChirpVolume : this.rainVolume,
      loop: soundPath.includes('Rain and thunder'), // Loop only rain and thunder
      fade: true
    });

    // Fade in the new sound
    this.currentAmbience.fade(0, soundPath.includes('Birds Chirp') ? this.birdsChirpVolume : this.rainVolume, 2000);
    this.currentAmbience.play();
  }

  private crossfade(): void {
    if (!this.currentAmbience || !this.nextAmbience) return;

    const startTime = Date.now();
    const fadeOutInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / this.crossfadeDuration, 1);

      if (this.currentAmbience) {
        const currentVolume = this.currentAmbience._src.includes('Birds Chirp') ? this.birdsChirpVolume : this.rainVolume;
        this.currentAmbience.volume(currentVolume * (1 - progress));
      }
      if (this.nextAmbience) {
        const nextVolume = this.nextAmbience._src.includes('Birds Chirp') ? this.birdsChirpVolume : this.rainVolume;
        this.nextAmbience.volume(nextVolume * progress);
      }

      if (progress >= 1) {
        clearInterval(fadeOutInterval);
        if (this.currentAmbience) {
          this.currentAmbience.stop();
        }
        this.currentAmbience = this.nextAmbience;
        this.nextAmbience = null;
      }
    }, 16); // ~60fps
  }

  private fadeIn(sound: Howl, targetVolume: number): void {
    const startTime = Date.now();
    const fadeInInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / this.crossfadeDuration, 1);

      sound.volume(targetVolume * progress);

      if (progress >= 1) {
        clearInterval(fadeInInterval);
      }
    }, 16);
  }

  public stop(): void {
    if (this.currentAmbience) {
      this.currentAmbience.stop();
      this.currentAmbience = null;
    }
    if (this.nextAmbience) {
      this.nextAmbience.stop();
      this.nextAmbience = null;
    }
  }
}

export default SoundManager; 