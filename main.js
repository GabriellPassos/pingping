// main.js
import { GameFlipEngine } from './GameFlipEngine.js';

document.addEventListener('DOMContentLoaded', () => {
  const pontuacaoEl = document.getElementById("pontuacao");
  const statusEl = document.getElementById("status");
  const simularBtn = document.getElementById("simular");

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

  GameFlipEngine.start();

  simularBtn.addEventListener("click", () => {
    GameFlipEngine.simulateFlip(20); // Simula um movimento z=20
  });
});
