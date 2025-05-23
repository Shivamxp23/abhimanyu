import { Howl } from 'howler';

class SoundManager {
  private static instance: SoundManager;
  private currentAmbience: Howl | null = null;
  private nextAmbience: Howl | null = null;
  private crossfadeDuration: number = 2000; // 2 seconds crossfade
  private targetVolume: number = 0.05; // 5% volume for rain and thunder
  private birdsChirpVolume: number = 0.55; // 55% volume for birds chirping

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public playAmbience(soundPath: string): void {
    // Create new ambience sound
    const newAmbience = new Howl({
      src: [soundPath],
      loop: true,
      volume: 0,
      autoplay: true
    });

    // If there's a current ambience, crossfade
    if (this.currentAmbience) {
      this.nextAmbience = newAmbience;
      this.crossfade();
    } else {
      // If no current ambience, just fade in
      this.currentAmbience = newAmbience;
      // Use different volume based on the sound
      const targetVolume = soundPath.includes('Birds Chirp') ? this.birdsChirpVolume : this.targetVolume;
      this.fadeIn(newAmbience, targetVolume);
    }
  }

  private crossfade(): void {
    if (!this.currentAmbience || !this.nextAmbience) return;

    const startTime = Date.now();
    const fadeOutInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / this.crossfadeDuration, 1);

      if (this.currentAmbience) {
        const currentVolume = this.currentAmbience._src.includes('Birds Chirp') ? this.birdsChirpVolume : this.targetVolume;
        this.currentAmbience.volume(currentVolume * (1 - progress));
      }
      if (this.nextAmbience) {
        const nextVolume = this.nextAmbience._src.includes('Birds Chirp') ? this.birdsChirpVolume : this.targetVolume;
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