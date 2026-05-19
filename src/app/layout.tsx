import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RPG Sound Trigger',
  description: 'Monitora a voz do mestre e dispara sons por palavra-chave',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
