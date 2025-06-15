import { GameFlipEngine } from './GameFlipEngine.js';

document.addEventListener('DOMContentLoaded', () => {
  const pontuacaoEl = document.getElementById("pontuacao");
  const statusEl = document.getElementById("status");
  const simularBtn = document.getElementById("simular");
  const contadorEl = document.getElementById("contador");

  GameFlipEngine.onScoreChange((score) => {
    pontuacaoEl.innerText = `Pontuação: ${score}`;
  });

  GameFlipEngine.onFlip((data) => {
    statusEl.innerText = data.resultado;
    console.log("Flip:", data);
  });

  GameFlipEngine.onBeat(() => {
    statusEl.innerText = "🎵 Batida! Flip agora!";
  });

  // Atualiza contador a cada 100ms
  setInterval(() => {
    const now = Date.now();
    const proxima = GameFlipEngine.getNextBeatTime();
    const diff = Math.max(proxima - now, 0);
    const segundos = (diff / 1000).toFixed(1);
    contadorEl.innerText = `Próximo flip em: ${segundos}s`;
  }, 100);

  GameFlipEngine.start();
  simularBtn.addEventListener("click", () => {
    GameFlipEngine.simulateFlip(20);
  });
});
