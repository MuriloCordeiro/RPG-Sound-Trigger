'use client';

import { useState, useCallback } from 'react';
import { useTriggers } from '@/hooks/useTriggers';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { TranscriptBox } from './TranscriptBox';
import { TriggeredBanner } from './TriggeredBanner';
import { TriggerForm } from './TriggerForm';
import { TriggerList } from './TriggerList';
import type { FiredEvent } from '@/types';

export function SoundBoard() {
  const { triggers, addTrigger, removeTrigger, updateVolume } = useTriggers();
  const [lastFired, setLastFired] = useState<FiredEvent | null>(null);

  const handleFired = useCallback((event: FiredEvent) => {
    setLastFired(event);
  }, []);

  const { listening, finalTranscript, interimTranscript, toggle } =
    useSpeechRecognition({ triggers, onFired: handleFired });

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <section className="bg-[#16161a] border border-[#2e2e3a] rounded-xl p-5 flex items-center gap-4">
        <button
          onClick={toggle}
          className={`flex items-center gap-2 font-bold rounded-lg px-6 py-3 text-sm transition-all ${
            listening
              ? 'bg-[#cf4f4f] text-white hover:shadow-[0_0_16px_#cf4f4f55]'
              : 'bg-[#c9962a] text-black hover:shadow-[0_0_16px_#c9962a55]'
          }`}
        >
          <span>{listening ? '⏹' : '🎤'}</span>
          <span>{listening ? 'Parar Escuta' : 'Iniciar Escuta'}</span>
        </button>

        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
            listening
              ? 'bg-[#1a3d26] text-[#4fcf82] border-[#4fcf82] animate-pulse'
              : 'bg-[#1e1e24] text-[#7a7880] border-[#2e2e3a]'
          }`}
        >
          {listening ? 'Escutando...' : 'Parado'}
        </span>
      </section>

      {/* Triggered banner */}
      <TriggeredBanner event={lastFired} />

      {/* Transcript */}
      <TranscriptBox final={finalTranscript} interim={interimTranscript} />

      {/* Config */}
      <section className="bg-[#16161a] border border-[#2e2e3a] rounded-xl p-5 flex flex-col gap-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#7a7880]">
          Configurar Gatilhos
        </h2>

        <TriggerForm onAdd={addTrigger} />

        <div className="border-t border-[#2e2e3a] pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#7a7880] mb-3 flex items-center gap-2">
            Gatilhos Ativos
            <span className="bg-[#1e1e24] text-[#c9962a] border border-[#2e2e3a] text-xs px-2 py-0.5 rounded-full">
              {triggers.length}
            </span>
          </h3>
          <TriggerList
            triggers={triggers}
            lastFired={lastFired}
            onRemove={removeTrigger}
            onVolumeChange={updateVolume}
          />
        </div>
      </section>
    </div>
  );
}
