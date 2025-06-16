import { GameFlipEngine } from './GameFlipEngine.js';
import {Cena1} from "./Cena1.js";
import * as THREE from 'three';
document.addEventListener('DOMContentLoaded',async () => {
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

  //CARREGAR CENA
    // Cria o renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Instancia a cena
  const cena1 = new Cena1(renderer);

  // Aguarda os modelos serem carregados e adicionados
  await cena1.montarCenario();

  // Loop de animação
  function loop() {
    requestAnimationFrame(loop);
    cena1.update(); // Atualiza animações e renderiza
  }

  loop();

  // Redimensionamento da janela
  window.addEventListener('resize', () => {
    cena1.onWindowResize();
  });
});
