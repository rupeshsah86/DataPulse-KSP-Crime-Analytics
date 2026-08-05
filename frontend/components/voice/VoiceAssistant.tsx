'use client';

import React, { useState } from 'react';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { Mic, MicOff, Volume2, Sparkles, X, Compass, Box, Globe, Bot } from 'lucide-react';

export const VoiceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isListening,
    transcript,
    processing,
    responseMessage,
    startListening,
    stopListening,
  } = useVoiceCommands();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isListening
            ? 'bg-rose-600 text-white animate-bounce ring-4 ring-rose-300'
            : 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white hover:scale-105 shadow-indigo-500/30'
        }`}
        title="Open AI Voice Assistant"
      >
        {isListening ? <Mic className="w-6 h-6 animate-pulse" /> : <Mic className="w-6 h-6" />}
      </button>

      {/* Interactive Modal Drawer */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 space-y-4 text-slate-900 animate-fadeIn z-50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Voice Copilot</h3>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block -mt-0.5">
                  Web Speech & Groq Intelligence
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Voice Input State Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
            <div className="flex items-center justify-center">
              {isListening ? (
                <div className="relative">
                  <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 animate-ping absolute inset-0 opacity-75" />
                  <button
                    onClick={stopListening}
                    className="w-14 h-14 bg-rose-600 text-white rounded-full flex items-center justify-center relative z-10 shadow-lg"
                  >
                    <Mic className="w-6 h-6 animate-pulse" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={startListening}
                  className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                >
                  <Mic className="w-6 h-6" />
                </button>
              )}
            </div>

            <p className="text-xs font-extrabold text-slate-700">
              {isListening
                ? '🎙️ Listening... Speak your navigation command or crime query'
                : 'Tap microphone to speak voice commands'}
            </p>

            {transcript ? (
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Transcribed Speech:</span>
                "{transcript}"
              </div>
            ) : null}

            {responseMessage ? (
              <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900 text-left flex items-start gap-2">
                <Volume2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>{responseMessage}</span>
              </div>
            ) : null}
          </div>

          {/* Quick Voice Command Chips */}
          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Try Spoken Commands:</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold">
                "Go to Patrol Routes"
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold">
                "Open 3D Crime Map"
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold">
                "Show Multi State Analytics"
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
