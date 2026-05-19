# RPG Sound Trigger

Dispara efeitos sonoros automaticamente ao detectar palavras-chave na sua fala — ideal para mestres de RPG, streamers e narradores que querem adicionar imersão sonora sem tirar as mãos do teclado.

## O que é

RPG Sound Trigger usa o microfone do navegador para ouvir continuamente o que você fala. Quando uma palavra ou frase configurada é detectada, o som associado toca automaticamente. Tudo roda no próprio navegador — sem servidor, sem instalação.

## Funcionalidades

- **Reconhecimento de voz em tempo real** via Web Speech API, em português (pt-BR)
- **Três modos de disparo** por gatilho:
  - **Durante a fala** — dispara assim que a palavra é reconhecida, antes de você terminar a frase
  - **Ao pausar** — dispara somente quando você faz uma pausa ou termina de falar
  - **Sempre** — dispara toda vez que a palavra aparece no transcrito
- **Upload de áudio personalizado** — associe qualquer arquivo MP3/áudio a uma palavra-chave
- **Volume individual** por gatilho
- **Persistência automática** — gatilhos e sons ficam salvos no navegador (localStorage)
- **Feedback visual** — banner com o gatilho ativado e destaque em tempo real na lista

## Como usar

1. Abra o app no Chrome ou Edge (necessário para Web Speech API)
2. Clique em **Iniciar** para começar a escuta
3. Adicione um gatilho: informe a palavra-chave, faça upload do som e escolha o modo de disparo
4. Fale normalmente — quando a palavra for detectada, o som toca automaticamente

## Tecnologias

- [Next.js](https://nextjs.org/) + React
- TypeScript
- Tailwind CSS
- Web Speech API (nativa do navegador)

## Requisitos

- Chrome ou Edge (a Web Speech API não é suportada em Firefox ou Safari)
- Permissão de microfone concedida ao navegador

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Limitações conhecidas

- A Web Speech API requer conexão com internet (envia áudio para os servidores do Google/Microsoft para transcrição)
- Sons são armazenados como base64 no localStorage — arquivos muito grandes podem atingir o limite de armazenamento do navegador
- Reconhecimento otimizado para português do Brasil
