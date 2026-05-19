import { SoundBoard } from '@/components/SoundBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0d0f] px-4 py-8 pb-16">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <header className="text-center py-4">
          <h1 className="text-3xl font-black tracking-wide text-[#c9962a] drop-shadow-[0_0_20px_#c9962a55]">
            ⚔ RPG Sound Trigger
          </h1>
          <p className="text-[#7a7880] text-sm mt-1">Fale e a magia acontece</p>
        </header>

        <SoundBoard />

        <footer className="text-center text-[#7a7880] text-xs">
          Funciona no Chrome / Edge &bull; Sons salvos no navegador
        </footer>
      </div>
    </main>
  );
}
