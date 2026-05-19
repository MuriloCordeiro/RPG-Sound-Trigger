export type TriggerMode =
  | 'interim'  // dispara imediatamente no texto parcial (enquanto fala)
  | 'final'    // dispara apenas após a pausa (texto finalizado)
  | 'always';  // dispara toda vez que a palavra aparecer, sem controle de repetição

export const TRIGGER_MODE_LABELS: Record<TriggerMode, string> = {
  interim: 'Durante a fala',
  final:   'Ao pausar',
  always:  'Sempre',
};

export interface Trigger {
  id: string;
  keyword: string;
  soundDataUrl: string;
  soundName: string;
  volume: number;
  mode: TriggerMode;
}

export interface FiredEvent {
  id: string;
  keyword: string;
  soundName: string;
  firedAt: Date;
}
