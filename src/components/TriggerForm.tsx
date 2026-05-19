'use client';

import { useState, useRef } from 'react';
import type { Trigger, TriggerMode } from '@/types';
import { TRIGGER_MODE_LABELS } from '@/types';

interface Props {
  onAdd: (trigger: Omit<Trigger, 'id'>) => void;
}

const MODE_DESCRIPTIONS: Record<TriggerMode, string> = {
  interim: 'Dispara imediatamente enquanto você fala',
  final:   'Dispara só ao pausar a fala',
  always:  'Dispara toda vez que a palavra aparecer',
};

export function TriggerForm({ onAdd }: Props) {
  const [keyword, setKeyword] = useState('');
  const [volume, setVolume] = useState(1);
  const [mode, setMode] = useState<TriggerMode>('interim');
  const [soundDataUrl, setSoundDataUrl] = useState<string | null>(null);
  const [soundName, setSoundName] = useState('Nenhum arquivo selecionado');
  const fileRef = useRef<HTMLInputElement>(null);

  const canAdd = keyword.trim().length > 0 && soundDataUrl !== null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSoundDataUrl(ev.target?.result as string);
      setSoundName(file.name);
    };
    reader.readAsDataURL(file);
  }

  function handleAdd() {
    if (!canAdd || !soundDataUrl) return;
    onAdd({ keyword: keyword.trim(), soundDataUrl, soundName, volume, mode });
    setKeyword('');
    setVolume(1);
    setMode('interim');
    setSoundDataUrl(null);
    setSoundName('Nenhum arquivo selecionado');
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Palavra-chave (ex: dragão)"
          className="flex-1 min-w-40 bg-[#1e1e24] border border-[#2e2e3a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#7a7880] outline-none focus:border-[#c9962a] transition-colors"
        />
        <label className="cursor-pointer bg-[#1e1e24] border border-[#2e2e3a] rounded-lg px-4 py-2.5 text-sm hover:border-[#c9962a] transition-colors whitespace-nowrap">
          🎵 Carregar Som
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(TRIGGER_MODE_LABELS) as TriggerMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            title={MODE_DESCRIPTIONS[m]}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              mode === m
                ? 'bg-[#c9962a] text-black border-[#c9962a]'
                : 'bg-[#1e1e24] text-[#7a7880] border-[#2e2e3a] hover:border-[#c9962a]'
            }`}
          >
            {TRIGGER_MODE_LABELS[m]}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#7a7880] -mt-1">{MODE_DESCRIPTIONS[mode]}</p>

      <div className="flex items-center gap-4 flex-wrap text-xs text-[#7a7880]">
        <span className="flex-1 truncate" title={soundName}>{soundName}</span>
        <label className="flex items-center gap-2 whitespace-nowrap">
          🔊 Volume
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-[#c9962a]"
          />
          <span className="w-9 text-right">{Math.round(volume * 100)}%</span>
        </label>
      </div>

      <button
        onClick={handleAdd}
        disabled={!canAdd}
        className="self-start bg-[#c9962a] text-black font-bold rounded-lg px-6 py-2.5 text-sm transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Adicionar Gatilho
      </button>
    </div>
  );
}
