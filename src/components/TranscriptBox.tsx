'use client';

interface Props {
  final: string;
  interim: string;
}

export function TranscriptBox({ final: finalText, interim }: Props) {
  return (
    <section className="bg-[#16161a] border border-[#2e2e3a] rounded-xl p-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[#7a7880] mb-3">
        Transcrição
      </h2>
      <div className="bg-[#1e1e24] border border-[#2e2e3a] rounded-lg p-4 min-h-16 text-sm leading-relaxed break-words">
        <span>{finalText}</span>
        {interim && (
          <span className="text-[#7a7880] italic">{interim}</span>
        )}
        {!finalText && !interim && (
          <span className="text-[#7a7880] italic">Aguardando fala...</span>
        )}
      </div>
    </section>
  );
}
