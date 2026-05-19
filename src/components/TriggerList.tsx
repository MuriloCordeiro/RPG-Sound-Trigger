'use client';

import type { Trigger, FiredEvent, TriggerMode } from '@/types';
import { TRIGGER_MODE_LABELS } from '@/types';

const MODE_COLORS: Record<TriggerMode, string> = {
  interim: 'text-[#4fcf82] border-[#4fcf8255]',
  final:   'text-[#c9962a] border-[#c9962a55]',
  always:  'text-[#cf4f4f] border-[#cf4f4f55]',
};

interface Props {
  triggers: Trigger[];
  lastFired: FiredEvent | null;
  onRemove: (id: string) => void;
  onVolumeChange: (id: string, volume: number) => void;
}

export function TriggerList({ triggers, lastFired, onRemove, onVolumeChange }: Props) {
  function previewSound(trigger: Trigger) {
    const audio = new Audio(trigger.soundDataUrl);
    audio.volume = trigger.volume;
    audio.play().catch(console.error);
  }

  if (triggers.length === 0) {
    return (
      <p className="text-[#7a7880] text-sm italic py-2">
        Nenhum gatilho configurado ainda.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {triggers.map((trigger) => {
        const firing = lastFired?.keyword.toLowerCase() === trigger.keyword.toLowerCase();
        return (
          <li
            key={trigger.id}
            className={`flex items-center gap-3 bg-[#1e1e24] border rounded-lg px-4 py-3 transition-all ${
              firing
                ? 'border-[#7b4fcf] shadow-[0_0_12px_#7b4fcf44]'
                : 'border-[#2e2e3a]'
            }`}
          >
            <span className="font-bold text-[#c9962a] min-w-24 truncate">
              {trigger.keyword}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${MODE_COLORS[trigger.mode]}`}
              title={`Modo: ${TRIGGER_MODE_LABELS[trigger.mode]}`}
            >
              {TRIGGER_MODE_LABELS[trigger.mode]}
            </span>
            <span
              className="flex-1 text-[#7a7880] text-xs truncate"
              title={trigger.soundName}
            >
              {trigger.soundName}
            </span>
            <label className="flex items-center gap-2 text-xs text-[#7a7880] whitespace-nowrap">
              🔊
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={trigger.volume}
                onChange={(e) => onVolumeChange(trigger.id, Number(e.target.value))}
                className="w-16 accent-[#c9962a]"
              />
              <span className="w-8 text-right">{Math.round(trigger.volume * 100)}%</span>
            </label>
            <button
              onClick={() => previewSound(trigger)}
              title="Testar som"
              className="border border-[#2e2e3a] rounded-md px-2 py-1 text-xs text-[#7a7880] hover:border-[#c9962a] hover:text-[#c9962a] transition-colors"
            >
              ▶
            </button>
            <button
              onClick={() => onRemove(trigger.id)}
              title="Remover"
              className="border border-[#2e2e3a] rounded-md px-2 py-1 text-xs text-[#7a7880] hover:border-[#cf4f4f] hover:text-[#cf4f4f] transition-colors"
            >
              ✕
            </button>
          </li>
        );
      })}
    </ul>
  );
}
