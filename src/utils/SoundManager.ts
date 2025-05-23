class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext;
  private gainNode1: GainNode;
  private gainNode2: GainNode;
  private source1: AudioBufferSourceNode | null = null;
  private source2: AudioBufferSourceNode | null = null;
  private currentSound: string | null = null;
  private rainVolume = 0.05; // 5% volume for rain and thunder
  private birdsChirpVolume = 2.0; // 200% volume for birds chirping

  private constructor() {
    this.audioContext = new AudioContext();
    this.gainNode1 = this.audioContext.createGain();
    this.gainNode2 = this.audioContext.createGain();

    // Initialize gain nodes
    this.gainNode1.gain.value = 0;
    this.gainNode2.gain.value = 0;

    // Connect gain nodes to destination
    this.gainNode1.connect(this.audioContext.destination);
    this.gainNode2.connect(this.audioContext.destination);
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async loadSound(url: string): Promise<AudioBuffer> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Error loading sound:', error);
      throw error;
    }
  }

  public async playAmbience(soundPath: string): Promise<void> {
    try {
      // ALWAYS stop any playing sounds first
      this.stop();

      const buffer = await this.loadSound(soundPath);
      this.source1 = this.audioContext.createBufferSource();
      this.source1.buffer = buffer;
      this.source1.connect(this.gainNode1);
      // Always loop ambient sounds
      this.source1.loop = true;
      
      const targetVolume = soundPath.includes('Birds Chirp') ? this.birdsChirpVolume : this.rainVolume;
      this.gainNode1.gain.setValueAtTime(targetVolume, this.audioContext.currentTime);
      
      this.source1.start();
      this.currentSound = soundPath;
    } catch (error) {
      console.error('Error playing ambience:', error);
    }
  }

  public stop(): void {
    if (this.source1) {
      this.source1.stop();
      this.source1 = null;
    }
    if (this.source2) {
      this.source2.stop();
      this.source2 = null;
    }
    this.gainNode1.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.gainNode2.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.currentSound = null;
  }
}

export default SoundManager; 