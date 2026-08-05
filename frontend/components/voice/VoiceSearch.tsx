'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { createSpeechRecognizer } from '@/utils/speechRecognition';
import toast from 'react-hot-toast';

interface VoiceSearchProps {
  onSearch: (text: string) => void;
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({ onSearch }) => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const instance = createSpeechRecognizer(
      (text, isFinal) => {
        onSearch(text);
        if (isFinal) {
          setIsListening(false);
          toast.success(`Voice Search: "${text}"`);
        }
      },
      (error) => {
        toast.error(`Voice error: ${error}`);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (instance) {
      try {
        instance.start();
        setIsListening(true);
        toast('Listening... Speak search query now 🎙️');
      } catch (e) {
        console.error('Mic start error', e);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-2 rounded-xl transition-all flex items-center justify-center ${
        isListening
          ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-300'
          : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
      }`}
      title={isListening ? 'Stop Voice Recording' : 'Voice Search'}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
};
