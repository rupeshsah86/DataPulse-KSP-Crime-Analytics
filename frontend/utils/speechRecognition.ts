'use client';

// Web Speech API interface declarations for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const createSpeechRecognizer = (
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void
) => {
  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition is not supported in this browser.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();

  recognizer.continuous = false;
  recognizer.interimResults = true;
  recognizer.lang = 'en-US';

  recognizer.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const currentText = finalTranscript || interimTranscript;
    onResult(currentText, !!finalTranscript);
  };

  recognizer.onerror = (event: any) => {
    console.warn('Speech recognition error:', event.error);
    onError(event.error || 'Speech recognition error occurred.');
  };

  recognizer.onend = () => {
    onEnd();
  };

  return recognizer;
};

export const speakText = (text: string, rate: number = 1.0, pitch: number = 1.0) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Text-to-Speech synthesis not supported in this environment.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.lang = 'en-US';

  window.speechSynthesis.speak(utterance);
};
