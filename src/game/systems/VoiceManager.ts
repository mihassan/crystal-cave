
export class VoiceManager {
    private static instance: VoiceManager;
    private synth: SpeechSynthesis;
    private voices: SpeechSynthesisVoice[];
    private preferredVoice: SpeechSynthesisVoice | null;

    private constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.preferredVoice = null;

        // Initialize voices
        this.loadVoices();

        // Handle async voice loading (needed for Chrome/others)
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
    }

    public static getInstance(): VoiceManager {
        if (!VoiceManager.instance) {
            VoiceManager.instance = new VoiceManager();
        }
        return VoiceManager.instance;
    }

    private loadVoices() {
        this.voices = this.synth.getVoices();
        // Try to find a "quirky" or interesting voice
        // prioritizing English voices
        const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));

        // Heuristic for a male voice
        if (englishVoices.length > 0) {
            // Priority list for male-sounding voices
            this.preferredVoice = englishVoices.find(v =>
                v.name.includes('Male') ||
                v.name.includes('Daniel') ||
                v.name.includes('David') ||
                v.name.includes('Google US English')
            ) || englishVoices[0];
        } else {
            this.preferredVoice = this.voices[0] || null;
        }
    }

    public speak(text: string) {
        if (!this.synth || !this.preferredVoice) return;

        // Only cancel if something is already speaking
        // This prevents interference with Web Audio API initialization
        if (this.synth.speaking) {
            this.synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.preferredVoice;

        // Make it sound a bit quirky but slower and deeper
        // Add some random variation to make it less monotonous
        const pitchVar = (Math.random() * 0.2) - 0.1; // +/- 0.1
        const rateVar = (Math.random() * 0.1) - 0.1; // +/- 0.1

        utterance.pitch = 0.9 + pitchVar; // Base 0.9
        utterance.rate = 0.9 + rateVar;   // Base 0.9
        utterance.volume = 0.9;

        this.synth.speak(utterance);
    }
}
