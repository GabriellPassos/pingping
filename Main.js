import { GameFlipEngine } from "./GameFlipEngine.js";
import { Pontuacao } from "./Pontuacao.js";
import { CookVisualizer } from "./cookVisualizer.js";
import { Cena1 } from "./Cena1.js";
import { AnimationManager } from "./AnimationManager.js";
import { mostrarMensagemFlutuante } from "./UI.js";
import * as THREE from "three";
import { buscarModelos } from "./ModelosManager.js";

document.addEventListener("DOMContentLoaded", async () => {
  const pontuacaoEl = document.getElementById("pontuacao");
  const statusEl = document.getElementById("status");
  const simularBtn = document.getElementById("simular");
  const contadorEl = document.getElementById("contador");
  const mensagemPontuacao = document.getElementById("mensagem-acerto");
  let visualizador = null;
  const pontuacao = new Pontuacao({ elementoMensagem: mensagemPontuacao });
  let manager;
  GameFlipEngine.onFlip((data) => {
    pontuacao.registrarAcerto(data.resultado);
    mostrarMensagemFlutuante(mensagemPontuacao, data.resultado);
    manager?.stop("idle")
    manager?.play("flip");
  });
  GameFlipEngine.onScoreChange((score) => {
    pontuacaoEl.innerText = `Pontuação: ${score}`;
  });

  GameFlipEngine.onFlip((data) => {
    statusEl.innerText = data.resultado;
    console.log("Flip:", data);
  });

  GameFlipEngine.onBeat(() => {
    statusEl.innerText = "🎵 Batida! Flip agora!";
    visualizador?.reset();
  });

  // Atualiza contador a cada 100ms
  setInterval(() => {
    const now = Date.now();
    const proxima = GameFlipEngine.getNextBeatTime();
    const diff = Math.max(proxima - now, 0);
    const segundos = (diff / 1000).toFixed(1);
    contadorEl.innerText = `Próximo flip em: ${segundos}s`;
  }, 100);

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
  manager = new AnimationManager({
    animacoes: { ...cena1.modelos["carne"].animacoes },
  });
  console.log(cena1.modelos["carne"].animacoes);
  manager.play("idle");
  const modeloComida = buscarModelos(cena1.modelos["carne"].modelo, [
    "food_ingredient_steak",
  ]);
  visualizador = new CookVisualizer({
    modelo: modeloComida.modelosEncontrados[0],
    getTempoRestante: () => GameFlipEngine.getTempoRestante(),
    getTempoTotal: () => GameFlipEngine.getTempoIntervalo(),
    corFinal: new THREE.Color(0x3e1f0d), // marrom escuro
  });
  GameFlipEngine.start();

  // Loop de animação
  function loop() {
    requestAnimationFrame(loop);
    cena1.update(); // Atualiza animações e renderiza
    visualizador.update();
  }

  loop();

  // Redimensionamento da janela
  window.addEventListener("resize", () => {
    cena1.onWindowResize();
  });
});
