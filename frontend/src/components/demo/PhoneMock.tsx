'use client';

import React, { useState } from 'react';
import { useDemoStore } from '@/store/demoStore';
import { SCRIPTED_COMPLAINTS } from '@/lib/demoData';
import { Send, Mic, Sparkles, Check, X, Star, Bot, User, RotateCcw } from 'lucide-react';

export default function PhoneMock() {
  const {
    chatMessages,
    state,
    selectedScriptId,
    sendComplaint,
    submitVerification,
    resetDemo,
  } = useDemoStore();

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendComplaint(inputText);
    setInputText('');
  };

  const handleRecordSim = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setInputText('ನಮ್ಮ ರಸ್ತೆಯಲ್ಲಿ ಕಾವೇರಿ ನೀರಿನ ಪೈಪ್ ಒಡೆದಿದೆ');
    }, 1800);
  };

  return (
    <div className="w-full max-w-md mx-auto h-[640px] rounded-[36px] bg-[#0A101D] border-4 border-[#1E2A44] shadow-2xl flex flex-col overflow-hidden relative">
      {/* Phone Notch / Header */}
      <div className="bg-[#121C33] px-5 py-3 border-b border-[#1E2A44] flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-bg font-bold text-xs">
            IQ
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-semibold text-xs text-text flex items-center gap-1.5">
              ResolveIQ Citizen Bot
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
            </span>
            <span className="text-[10px] text-muted font-mono">Telegram Official Channel</span>
          </div>
        </div>
        <button
          onClick={resetDemo}
          className="p-1.5 rounded-lg bg-surface hover:bg-surface-2 text-muted hover:text-text transition-colors"
          title="Reset Demo"
          aria-label="Reset simulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick-Pick Scenario Chips */}
      <div className="p-3 bg-[#0D1526]/80 border-b border-[#1E2A44] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono text-muted uppercase shrink-0">Try:</span>
        {SCRIPTED_COMPLAINTS.map((item) => (
          <button
            key={item.id}
            onClick={() => sendComplaint(item.text, item.id)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
              selectedScriptId === item.id
                ? 'bg-primary text-bg font-bold shadow-sm'
                : 'bg-surface-2 text-text hover:bg-border/80 border border-border'
            }`}
          >
            {item.chipLabel}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {chatMessages.map((msg) => {
          const isCitizen = msg.sender === 'citizen';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCitizen ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isCitizen
                    ? 'bg-primary text-bg font-medium rounded-br-sm'
                    : 'bg-[#16223D] text-[#E6EDF7] border border-[#233355] rounded-bl-sm'
                }`}
              >
                {msg.text}

                {/* Verification Yes / No Prompt Bubble */}
                {msg.isVerificationPrompt && state === 'pending_verification' && (
                  <div className="mt-3 pt-2.5 border-t border-border/40 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => submitVerification(true, selectedRating || 5)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-success hover:bg-success/90 text-bg font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>ಹೌದು (Yes)</span>
                      </button>
                      <button
                        onClick={() => submitVerification(false)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-danger hover:bg-danger/90 text-bg font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>ಇಲ್ಲ (No)</span>
                      </button>
                    </div>

                    {/* 5-Star Rating Selector */}
                    <div className="flex items-center justify-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setSelectedRating(star)}
                          className="p-1 text-warn hover:scale-110 transition-transform"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              (selectedRating || 5) >= star ? 'fill-warn text-warn' : 'text-muted'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] font-mono text-muted mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {/* Audio Recording Waveform Sim */}
        {isRecording && (
          <div className="p-3 rounded-2xl bg-surface-2 border border-primary/50 flex items-center gap-3 animate-pulse">
            <Mic className="w-4 h-4 text-primary animate-ping" />
            <div className="flex-1 flex items-center gap-1">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-bounce"
                  style={{
                    height: `${Math.sin(i * 0.8) * 12 + 16}px`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-primary">16kHz Whisper</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#121C33] border-t border-[#1E2A44] flex items-center gap-2">
        <button
          onClick={handleRecordSim}
          className={`p-2.5 rounded-full border transition-all ${
            isRecording
              ? 'bg-danger text-bg border-danger animate-pulse'
              : 'bg-surface-2 text-muted hover:text-text border-border'
          }`}
          title="Voice Intake Simulation"
          aria-label="Record voice note"
        >
          <Mic className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="ಕನ್ನಡ or Kanglish complaint..."
          className="flex-1 bg-surface-2 border border-border rounded-full px-4 py-2 text-xs text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={handleSend}
          className="p-2.5 rounded-full bg-brand-gradient text-bg hover:opacity-90 shadow-md shadow-primary/20 transition-transform active:scale-95"
          aria-label="Send complaint"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

