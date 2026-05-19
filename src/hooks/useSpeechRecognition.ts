'use client';

import { useState, useRef, useCallback } from 'react';
import type { Trigger, FiredEvent } from '@/types';

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findMatchingTrigger(text: string, triggers: Trigger[]): Trigger | null {
  const normalized = normalizeText(text);
  for (const trigger of triggers) {
    const kw = normalizeText(trigger.keyword);
    const regex = new RegExp(`(^|[^a-z])${escapeRegex(kw)}([^a-z]|$)`, 'i');
    if (regex.test(normalized)) return trigger;
  }
  return null;
}

interface UseSpeechRecognitionOptions {
  triggers: Trigger[];
  onFired: (event: FiredEvent) => void;
}

export function useSpeechRecognition({ triggers, onFired }: UseSpeechRecognitionOptions) {
  const [listening, setListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  // eslint-disable-next-line no-undef
  const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(null);
  const listeningRef = useRef(false);
  const triggersRef = useRef(triggers);
  triggersRef.current = triggers;
  // tracks keywords already fired in the current interim phrase (resets on final)
  const firedInPhraseRef = useRef<Set<string>>(new Set());

  function fireTrigger(trigger: Trigger) {
    const audio = new Audio(trigger.soundDataUrl);
    audio.volume = trigger.volume;
    audio.play().catch(console.error);
    onFired({
      id: crypto.randomUUID(),
      keyword: trigger.keyword,
      soundName: trigger.soundName,
      firedAt: new Date(),
    });
  }

  const initRecognition = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return false;

    const rec = new SpeechRecognitionAPI();
    rec.lang = 'pt-BR';
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += text;
        } else {
          interim += text;
        }
      }

      if (interim) {
        for (const trigger of triggersRef.current) {
          if (trigger.mode === 'final') continue;

          const kw = normalizeText(trigger.keyword);
          const regex = new RegExp(`(^|[^a-z])${escapeRegex(kw)}([^a-z]|$)`, 'i');
          if (!regex.test(normalizeText(interim))) continue;

          if (trigger.mode === 'interim' && firedInPhraseRef.current.has(trigger.id)) continue;

          if (trigger.mode === 'interim') firedInPhraseRef.current.add(trigger.id);
          fireTrigger(trigger);
          break;
        }
      }

      if (final) {
        firedInPhraseRef.current.clear();
        setFinalTranscript((prev) => {
          const next = prev + final + ' ';
          return next.length > 2000 ? next.slice(-1000) : next;
        });

        for (const trigger of triggersRef.current) {
          if (trigger.mode === 'interim') continue;

          const kw = normalizeText(trigger.keyword);
          const regex = new RegExp(`(^|[^a-z])${escapeRegex(kw)}([^a-z]|$)`, 'i');
          if (!regex.test(normalizeText(final))) continue;

          fireTrigger(trigger);
          break;
        }
      }

      setInterimTranscript(interim);
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.warn('Speech error:', event.error);
    };

    rec.onend = () => {
      if (listeningRef.current) {
        try { rec.start(); } catch {}
      }
    };

    recognitionRef.current = rec;
    return true;
  }, [onFired]);

  const start = useCallback(() => {
    if (!recognitionRef.current && !initRecognition()) {
      alert('Seu navegador não suporta Web Speech API.\nUse o Google Chrome ou Microsoft Edge.');
      return;
    }
    try {
      recognitionRef.current!.start();
      listeningRef.current = true;
      setListening(true);
    } catch {}
  }, [initRecognition]);

  const stop = useCallback(() => {
    listeningRef.current = false;
    setListening(false);
    setInterimTranscript('');
    try { recognitionRef.current?.stop(); } catch {}
  }, []);

  const toggle = useCallback(() => {
    if (listeningRef.current) stop();
    else start();
  }, [start, stop]);

  return { listening, finalTranscript, interimTranscript, toggle };
}
