'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createSpeechRecognizer, speakText } from '@/utils/speechRecognition';
import toast from 'react-hot-toast';

export const useVoiceCommands = () => {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const recognizerRef = useRef<any>(null);

  const processTranscript = async (text: string) => {
    if (!text || !text.trim()) return;

    setProcessing(true);
    try {
      const res = await fetch('http://localhost:8000/api/voice/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text }),
      });

      if (!res.ok) {
        throw new Error(`Voice service status ${res.status}`);
      }

      const payload = await res.json();
      const voiceData = payload.data || {};
      const responseText = voiceData.spoken_response || `Processed command: ${text}`;
      setResponseMessage(responseText);

      // Play Text-to-Speech spoken response
      speakText(responseText);
      toast.success(`🎙️ "${text}"`);

      // Trigger automatic SPA route navigation if requested by intent
      if (voiceData.intent === 'NAVIGATE' && voiceData.target_route) {
        setTimeout(() => {
          router.push(voiceData.target_route);
        }, 800);
      }
    } catch (err) {
      console.error('Voice processing error:', err);
      const fallbackMsg = `Searching for: ${text}`;
      setResponseMessage(fallbackMsg);
      speakText(fallbackMsg);
    } finally {
      setProcessing(false);
    }
  };

  const startListening = useCallback(() => {
    setTranscript('');
    setResponseMessage(null);

    const instance = createSpeechRecognizer(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          processTranscript(text);
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
      recognizerRef.current = instance;
      try {
        instance.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start speech recognizer', e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    processing,
    responseMessage,
    startListening,
    stopListening,
  };
};
