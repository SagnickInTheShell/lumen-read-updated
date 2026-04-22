'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useReading } from '@/context/ReadingContext';

/**
 * Hook: useTextToSpeech
 * 
 * Wraps Web Speech API with sentence-level highlighting.
 * Cancels previous audio before new speak. No word-level sync.
 */
export function useTextToSpeech() {
  const { state, setAudioState } = useReading();
  const utteranceRef = useRef(null);
  const sentencesRef = useRef([]);
  const currentIndexRef = useRef(0);
  const isPlayingRef = useRef(false);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakSentenceRef = useRef(null);

  const speakSentence = useCallback((index) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (index >= sentencesRef.current.length) {
      // Done
      isPlayingRef.current = false;
      setAudioState({ isPlaying: false, sentenceIndex: -1 });
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const sentence = sentencesRef.current[index];
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = state.audioRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    currentIndexRef.current = index;
    setAudioState({ isPlaying: true, sentenceIndex: index });

    utterance.onend = () => {
      if (isPlayingRef.current && speakSentenceRef.current) {
        speakSentenceRef.current(index + 1);
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled') {
        isPlayingRef.current = false;
        setAudioState({ isPlaying: false, sentenceIndex: -1 });
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [state.audioRate, setAudioState]);

  // Update the ref
  useEffect(() => {
    speakSentenceRef.current = speakSentence;
  }, [speakSentence]);

  const speak = useCallback((sentences) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel previous
    window.speechSynthesis.cancel();

    sentencesRef.current = sentences;
    currentIndexRef.current = 0;
    isPlayingRef.current = true;

    speakSentence(0);
  }, [speakSentence]);

  const pause = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    isPlayingRef.current = false;
    setAudioState({ isPlaying: false });
  }, [setAudioState]);

  const resume = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    isPlayingRef.current = true;
    window.speechSynthesis.resume();
    setAudioState({ isPlaying: true });
  }, [setAudioState]);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    isPlayingRef.current = false;
    currentIndexRef.current = 0;
    setAudioState({ isPlaying: false, sentenceIndex: -1 });
  }, [setAudioState]);

  const setRate = useCallback((rate) => {
    setAudioState({ rate });
    // If currently playing, restart from current sentence with new rate
    if (isPlayingRef.current) {
      window.speechSynthesis.cancel();
      setTimeout(() => speakSentence(currentIndexRef.current), 50);
    }
  }, [setAudioState, speakSentence]);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return {
    speak,
    pause,
    resume,
    stop,
    setRate,
    isSupported,
  };
}
