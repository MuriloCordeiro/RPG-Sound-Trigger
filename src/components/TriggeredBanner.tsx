'use client';

import { useEffect, useState } from 'react';
import type { FiredEvent } from '@/types';

interface Props {
  event: FiredEvent | null;
}

export function TriggeredBanner({ event }: Props) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<FiredEvent | null>(null);

  useEffect(() => {
    if (!event) return;
    setCurrent(event);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, [event]);

  if (!visible || !current) return null;

  return (
    <div className="animate-fade-in bg-[#1a1025] border border-[#7b4fcf] rounded-xl p-5 text-center">
      <p className="text-xs uppercase tracking-widest text-[#7b4fcf] mb-1">Gatilho ativado</p>
      <p className="text-3xl font-black text-[#7b4fcf] drop-shadow-[0_0_20px_#7b4fcf88] tracking-wide">
        ⚡ {current.keyword}
      </p>
      <p className="text-xs text-[#7a7880] mt-2">{current.soundName}</p>
    </div>
  );
}
