import { Giroscopio } from "./giroscopio.js";
import { Pontuacao } from "./pontuacao.js";
import * as THREE from "three";
import { Cena_1 } from "./cena_1.js";
const giroscopio = new Giroscopio();
const pontuacao = new Pontuacao({
  elementoMensagem: document.getElementById("mensagem-combo"),
  elementoPontuacao: document.getElementById("pontuacao"),
  elementoCombo: document.getElementById("combo"),
});

let alpha = 0,
  beta = 0,
  gamma = 0;
let tempo = 0;
let ultimoFrame = performance.now();
let tempoInterno = 0;
let multiplicadorForca = 1;
let betaInicial = 0;
let acertouNesteCiclo = false;

const minimoForcaAcerto = 10;
const div = document.querySelector("#efeito-acerto");

function resetarClasseVisual() {
  div.className = "efeito-default";
}

function aplicarClasseVisual(classe) {
  resetarClasseVisual();
  div.classList.add(classe);
}
// Setup do renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#ffffff", 1); // Cor branca, opacidade 100%
document.body.appendChild(renderer.domElement);

// Instanciar a cena
const cenaAtual = new Cena_1(renderer);
cenaAtual.montarCenario();
function loop() {
  const agora = performance.now();
  const delta = (agora - ultimoFrame) / 1000;
  tempo += delta;
  cenaAtual.update(beta)

  document.getElementById(
    "contador-ritmo"
  ).textContent = `${tempoInterno.toFixed(2)}s`;
  document.getElementById("mensagem").textContent = "ACERTE NO TEMPO!";
  if (betaInicial > beta) {
    betaInicial = beta;
  }
  if (tempoInterno > 0) {
    tempoInterno -= delta;

    const movimentoVertical = giroscopio.movimentoVerticalComBeta(
      betaInicial,
      beta,
      minimoForcaAcerto
    );
    if (movimentoVertical) {
      if (tempoInterno < 0.3) {
        aplicarClasseVisual("efeito-acerto-perfeito");
        pontuacao.registrarAcerto('perfeito')
        tempoInterno = movimentoVertical.tempoTotal;
      } else if (tempoInterno < 0.5) {
        aplicarClasseVisual("efeito-acerto-medio");
        pontuacao.registrarAcerto('medio')
        tempoInterno = movimentoVertical.tempoTotal;
      } else if (tempoInterno < 0.8) {
        aplicarClasseVisual("efeito-acerto-fraco");
        pontuacao.registrarAcerto('fraco')
        tempoInterno = movimentoVertical.tempoTotal;
      }

      betaInicial = beta;
    }
  } else {
    document.getElementById("mensagem").textContent = `TENTE NOVAMENTE!`;
    pontuacao.registrarAcerto("miss");
    if (betaInicial < 0) {
      const movimentoVertical = giroscopio.movimentoVerticalComBeta(
        betaInicial,
        beta,
        minimoForcaAcerto
      );
      if (movimentoVertical) {
        tempoInterno = movimentoVertical.tempoTotal;
        betaInicial = beta;
      }
    }
  }
  ultimoFrame = agora;
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

if (window.DeviceOrientationEvent) {
  window.addEventListener(
    "deviceorientation",
    function (event) {
      alpha = parseFloat(event.alpha.toFixed(2));
      beta = parseFloat(event.beta.toFixed(2));
      gamma = parseFloat(event.gamma.toFixed(2));

      document.getElementById("alpha").textContent = alpha;
      document.getElementById("beta").textContent = beta;
      document.getElementById("gamma").textContent = gamma;
    },
    true
  );
} else {
  document.body.innerHTML +=
    "<p>Seu navegador não suporta o evento DeviceOrientation.</p>";
}
