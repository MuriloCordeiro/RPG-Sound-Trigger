'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Trigger } from '@/types';

const STORAGE_KEY = 'rpg_triggers_v1';

export function useTriggers() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Trigger[] = JSON.parse(raw);
        // migrate triggers saved before mode field existed
        setTriggers(parsed.map((t) => ({ ...t, mode: t.mode ?? 'interim' })));
      }
    } catch {
      setTriggers([]);
    }
  }, []);

  const persist = useCallback((next: Trigger[]) => {
    setTriggers(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addTrigger = useCallback(
    (trigger: Omit<Trigger, 'id'>) => {
      const next = [...triggers, { ...trigger, id: crypto.randomUUID() }];
      persist(next);
    },
    [triggers, persist]
  );

  const removeTrigger = useCallback(
    (id: string) => {
      persist(triggers.filter((t) => t.id !== id));
    },
    [triggers, persist]
  );

  const updateVolume = useCallback(
    (id: string, volume: number) => {
      persist(triggers.map((t) => (t.id === id ? { ...t, volume } : t)));
    },
    [triggers, persist]
  );

  return { triggers, addTrigger, removeTrigger, updateVolume };
}
